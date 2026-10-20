#!/usr/bin/env node
// Fusiona una exportacion de usuarios de FullStory (CSV) en un archivo MAESTRO que solo crece.
// FullStory conserva ~12 meses de historial; el maestro guarda todos los usuarios que alguna vez aparecieron.
//
// El maestro contiene datos personales (email / uid). NO debe vivir en este repo (es publico):
// el script se niega a escribir dentro del repo salvo que se pase --allow-in-repo.
//
// Uso:
//   node scripts/merge-users.mjs EXPORT.csv --master /ruta/interna/kp_users_master.csv
//   node scripts/merge-users.mjs EXPORT.csv --master M.csv --pseudonymize     # guarda un hash, sin email/uid/nombre
//   node scripts/merge-users.mjs EXPORT.csv --master M.csv --dry-run          # muestra que cambiaria, no escribe
//
// Con --pseudonymize hace falta la variable de entorno KP_USER_SALT (guardala aparte; si la pierdes no podras
// reconocer a los mismos usuarios en futuras fusiones, asi que usa siempre la misma).
//
// Clave de cada usuario: Uid, si no hay, Email, si no hay, "anon:<Name>|<Created>" (usuarios anonimos de FullStory:
// no tienen identificador estable, el nombre "User N" lo asigna FullStory). Los anonimos se cuentan aparte.
//
// Nunca borra filas: un usuario que ya estaba en el maestro y no viene en la exportacion se conserva.

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const die = (m) => { console.error(m); process.exit(1); };

const argv = process.argv.slice(2);
const opt = { master: null, pseudonymize: false, dryRun: false, allowInRepo: false };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--master') opt.master = argv[++i];
  else if (a === '--pseudonymize') opt.pseudonymize = true;
  else if (a === '--dry-run') opt.dryRun = true;
  else if (a === '--allow-in-repo') opt.allowInRepo = true;
  else pos.push(a);
}
if (pos.length !== 1 || !opt.master) die('Uso: node scripts/merge-users.mjs EXPORT.csv --master /ruta/kp_users_master.csv [--pseudonymize] [--dry-run]');

const masterPath = resolve(opt.master);
const inRepo = !isAbsolute(relative(ROOT, masterPath)) && !relative(ROOT, masterPath).startsWith('..');
if (inRepo && !opt.allowInRepo) die(`El maestro (${masterPath}) esta dentro del repo, que es publico. Usa una carpeta interna del Banco.`);
if (opt.pseudonymize && !process.env.KP_USER_SALT) die('--pseudonymize necesita la variable de entorno KP_USER_SALT.');

// --- CSV (con comillas) ---
function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); f = ''; if (row.length > 1 || row[0] !== '') rows.push(row); row = []; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const esc = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const toCsv = (rows) => rows.map((r) => r.map(esc).join(',')).join('\r\n') + '\r\n';
const sha = (s) => createHash('sha256').update(`${process.env.KP_USER_SALT}|${s}`).digest('hex').slice(0, 32);

// --- exportacion de FullStory ---
const exp = parseCsv(readFileSync(resolve(pos[0]), 'utf8').replace(/^﻿/, ''));
const H = exp[0]; const ix = Object.fromEntries(H.map((c, i) => [c, i]));
for (const need of ['Created', 'Uid', 'Email', 'Name']) if (!(need in ix)) die(`Falta la columna ${need} en la exportacion.`);
const get = (r, n) => (n in ix && r[ix[n]] !== undefined ? r[ix[n]].trim() : '');

const COLS = ['key', 'id_type', 'uid', 'email', 'name', 'first_seen', 'last_session', 'num_sessions', 'first_export', 'last_export'];
const today = new Date().toISOString().slice(0, 10);

const master = new Map();
if (existsSync(masterPath)) {
  const m = parseCsv(readFileSync(masterPath, 'utf8').replace(/^﻿/, ''));
  const mh = m[0]; if (COLS.some((c, i) => mh[i] !== c)) die('El maestro existente no tiene el formato esperado; no lo toco.');
  for (const r of m.slice(1)) master.set(r[0], Object.fromEntries(COLS.map((c, i) => [c, r[i] ?? ''])));
}
const before = master.size;

let added = 0, updated = 0, rowsRead = 0, anon = 0;
for (const r of exp.slice(1)) {
  if (r.length < 2) continue; rowsRead++;
  const uid = get(r, 'Uid').toLowerCase(), email = get(r, 'Email').toLowerCase(), name = get(r, 'Name'), created = get(r, 'Created');
  let key, type;
  if (uid) { key = `uid:${uid}`; type = 'uid'; }
  else if (email) { key = `email:${email}`; type = 'email'; }
  else { key = `anon:${name}|${created.slice(0, 10)}`; type = 'anon'; anon++; }
  const stored = opt.pseudonymize ? `h:${sha(key)}` : key;
  const rec = { key: stored, id_type: type, uid: opt.pseudonymize ? '' : uid, email: opt.pseudonymize ? '' : email, name: opt.pseudonymize ? '' : (type === 'anon' ? name : ''),
    first_seen: created.slice(0, 10), last_session: get(r, 'LastSessionTime').slice(0, 10), num_sessions: get(r, 'NumSessions') || '0', first_export: today, last_export: today };
  const cur = master.get(stored);
  if (!cur) { master.set(stored, rec); added++; continue; }
  // existente: se conserva el first_seen mas antiguo; last_session y num_sessions solo suben
  const next = { ...cur, last_export: today };
  if (rec.first_seen && (!cur.first_seen || rec.first_seen < cur.first_seen)) next.first_seen = rec.first_seen;
  if (rec.last_session > cur.last_session) next.last_session = rec.last_session;
  if (Number(rec.num_sessions) > Number(cur.num_sessions || 0)) next.num_sessions = rec.num_sessions;
  if (JSON.stringify(next) !== JSON.stringify(cur)) updated++;
  master.set(stored, next);
}

const out = [COLS, ...[...master.values()].sort((a, b) => (a.first_seen || '').localeCompare(b.first_seen || '') || a.key.localeCompare(b.key)).map((o) => COLS.map((c) => o[c]))];
const identified = [...master.values()].filter((o) => o.id_type !== 'anon').length;
console.log(`Exportacion: ${rowsRead} filas (${anon} anonimas).`);
console.log(`Maestro: ${before} -> ${master.size} usuarios (+${added} nuevos, ${updated} actualizados). Identificados: ${identified}, anonimos: ${master.size - identified}.`);
if (opt.dryRun) { console.log('--dry-run: no se escribio nada.'); process.exit(0); }
if (existsSync(masterPath)) copyFileSync(masterPath, `${masterPath}.bak-${today}`);
writeFileSync(masterPath, toCsv(out));
console.log(`Escrito: ${masterPath}${existsSync(masterPath) ? '' : ''} (copia previa: ${masterPath}.bak-${today} si existia).`);

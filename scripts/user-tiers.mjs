#!/usr/bin/env node
// Cuenta usuarios frecuentes y power users a partir de una exportacion de usuarios de FullStory (CSV).
// Solo imprime CONTEOS: no escribe ni copia datos personales. La exportacion sigue viviendo fuera del repo.
//
// Definiciones (acordadas con la PM):
//   frecuente  = NumSessions / max(1, semanas desde Created) >= 1        (semanas = (asof - Created) / 7)
//   power user = frecuente Y (asof - LastSessionTime) <= 30 dias
//
// Uso:
//   node scripts/user-tiers.mjs EXPORT.csv --asof 2026-10-31
//   node scripts/user-tiers.mjs EXPORT.csv --asof 2026-10-31 --min-weeks 4   # variante: exige >= 4 semanas de antiguedad
//
// Importante: NumSessions y LastSessionTime son los valores de la fecha en que se hizo la exportacion, no los de --asof.
// Para que el corte sea valido, exportar lo mas cerca posible del cierre del mes y usar la misma fecha en --asof.
// Es una FOTO (snapshot): no se suma entre meses ni se puede reconstruir hacia atras desde una exportacion nueva.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const die = (m) => { console.error(m); process.exit(1); };
const argv = process.argv.slice(2);
const opt = { asof: null, minWeeks: 1 };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--asof') opt.asof = argv[++i];
  else if (argv[i] === '--min-weeks') opt.minWeeks = Number(argv[++i]);
  else pos.push(argv[i]);
}
if (pos.length !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(opt.asof || '')) die('Uso: node scripts/user-tiers.mjs EXPORT.csv --asof YYYY-MM-DD [--min-weeks N]');
if (!(opt.minWeeks >= 1)) die('--min-weeks debe ser un numero >= 1');

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

const rows = parseCsv(readFileSync(resolve(pos[0]), 'utf8').replace(/^﻿/, ''));
const H = rows[0]; const ix = Object.fromEntries(H.map((c, i) => [c, i]));
for (const need of ['Created', 'NumSessions', 'LastSessionTime']) if (!(need in ix)) die(`Falta la columna ${need} en la exportacion.`);

const DAY = 86400000;
const asof = Date.parse(`${opt.asof}T23:59:59Z`);
let total = 0, usable = 0, frequent = 0, power = 0, skipped = 0, tooNew = 0;
for (const r of rows.slice(1)) {
  if (r.length < 2) continue; total++;
  const created = Date.parse((r[ix.Created] || '').trim());
  const last = Date.parse((r[ix.LastSessionTime] || '').trim());
  const n = Number((r[ix.NumSessions] || '').trim());
  if (!Number.isFinite(created) || !Number.isFinite(last) || !Number.isFinite(n) || created > asof) { skipped++; continue; }
  const weeks = Math.max(1, (asof - created) / DAY / 7);
  if (weeks < opt.minWeeks) { tooNew++; continue; }
  usable++;
  const isFrequent = n / weeks >= 1;
  if (isFrequent) frequent++;
  if (isFrequent && (asof - last) / DAY <= 30) power++;
}
const pct = (a, b) => (b ? (a / b * 100).toFixed(1) + '%' : '-');
console.log(`Exportacion: ${total} usuarios. Corte: ${opt.asof}. Antiguedad minima: ${opt.minWeeks} semana(s).`);
console.log(`Evaluables: ${usable}  (sin fechas o cantidad validas: ${skipped}; mas nuevos que la antiguedad minima: ${tooNew})`);
console.log(`Frecuentes: ${frequent} (${pct(frequent, usable)})   Power users: ${power} (${pct(power, usable)})`);
console.log(`\nPara cargarlo en el ledger:\n  node scripts/add-month.mjs ${opt.asof.slice(0, 7)} frequent_users=${frequent} power_users=${power} --new-metric --type snapshot --source "fullstory user export (Sin DEV copy)" --note "NumSessions/Created/LastSessionTime a la fecha de la exportacion; corte ${opt.asof}; foto, no se suma"`);

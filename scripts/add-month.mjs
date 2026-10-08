#!/usr/bin/env node
// Agrega (o reemplaza) las filas de un mes en data/kp_ledger.csv y regenera src/data/kpLedger.json.
//
// Uso:
//   node scripts/add-month.mjs 2026-10 os_highlight=412 os_copy=130 os_source_panel=25 \
//        cs_queries=90 cs_copy=2 cs_source_link=4 cs_highlight_detail=1 cs_highlight_cards=3 cs_chips=30 cs_search_bar=50
//   node scripts/add-month.mjs 2026-10 unique_users=2201 sessions=17900 prompters=990 \
//        --note "cierre de octubre"                     # el tipo (snapshot) se toma de las filas existentes
//   node scripts/add-month.mjs 2026-10 os_copy=131 --replace    # sobrescribe un mes parcial (p. ej. dias 1-7)
//
// Opciones:
//   --replace        permite sobrescribir una metrica que ya existe en ese mes (por defecto es un error)
//   --type T         additive|snapshot para una metrica NUEVA (las ya conocidas heredan su tipo)
//   --new-metric     permite crear una metrica que no existe en el ledger (evita typos)
//   --source "..."   por defecto: fullstory, segment 'Sin DEV (copy)' sjHJR3590z6j (eventos) / see note (snapshots)
//   --note "..."     por defecto: single-month window; standard basis: Sin DEV (copy) (eventos)
//   --dry-run        muestra que cambiaria y no escribe nada
//   --csv F --out F  rutas alternativas (para pruebas)
//
// Valida con las mismas reglas que `npm run ledger:build`: si algo falla, no se escribe ni el CSV ni el JSON.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readLedger, toCsv, detectEol, buildLedger, jsonSource, coverageNotes } from './lib/ledger.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEGMENT = "fullstory, segment 'Sin DEV (copy)' sjHJR3590z6j";
const die = (msg) => { console.error(msg); process.exit(1); };

const argv = process.argv.slice(2);
const flags = { replace: false, newMetric: false, dryRun: false }, opt = {}, pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--replace') flags.replace = true;
  else if (a === '--new-metric') flags.newMetric = true;
  else if (a === '--dry-run') flags.dryRun = true;
  else if (['--type', '--source', '--note', '--csv', '--out'].includes(a)) {
    if (argv[i + 1] === undefined) die(`${a} necesita un valor`);
    opt[a.slice(2)] = argv[++i];
  } else if (a.startsWith('--')) die(`Opcion desconocida: ${a}`);
  else pos.push(a);
}

const [month, ...pairs] = pos;
if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) die('Uso: node scripts/add-month.mjs YYYY-MM metrica=valor [metrica=valor ...] [--replace] [--dry-run]');
if (!pairs.length) die('Faltan pares metrica=valor.');
if (opt.type && !['additive', 'snapshot'].includes(opt.type)) die(`--type "${opt.type}" no es additive ni snapshot`);

const CSV = resolve(opt.csv ?? `${ROOT}/data/kp_ledger.csv`);
const OUT = resolve(opt.out ?? `${ROOT}/src/data/kpLedger.json`);

let text;
try { text = readFileSync(CSV, 'utf8'); } catch { die(`No pude leer ${CSV}`); }
const EOL = detectEol(text);
const current = readLedger(text);
if (current.errors.length) die(`El CSV actual ya tiene problemas; arreglalos primero:\n` + current.errors.map((e) => `  - ${e}`).join('\n'));

const known = new Map(current.rows.filter((r) => r.month !== 'baseline').map((r) => [r.metric, r.type]));
const incoming = [], problems = [];
for (const p of pairs) {
  const m = /^([a-z0-9_]+)=(-?\d+(?:\.\d+)?)$/i.exec(p);
  if (!m) { problems.push(`"${p}" no es metrica=valor (numerico)`); continue; }
  const [, metric, value] = m;
  const type = known.get(metric) ?? opt.type;
  if (!known.has(metric)) {
    if (!flags.newMetric) { problems.push(`${metric}: no existe en el ledger (¿typo?). Si es una metrica nueva, agrega --new-metric --type additive|snapshot`); continue; }
    if (!opt.type) { problems.push(`${metric}: metrica nueva, falta --type`); continue; }
  } else if (opt.type && opt.type !== known.get(metric)) { problems.push(`${metric}: es ${known.get(metric)} en el ledger, no ${opt.type}`); continue; }
  const snap = type === 'snapshot';
  incoming.push({
    month, metric, value: Number(value), type,
    source: opt.source ?? (snap ? 'see note' : SEGMENT),
    note: opt.note ?? (snap ? 'month-close snapshot' : 'single-month window; standard basis: Sin DEV (copy)'),
  });
}
if (problems.length) die(`No se escribio nada:\n` + problems.map((e) => `  - ${e}`).join('\n'));

const existing = new Map(current.rows.map((r) => [`${r.month}|${r.metric}`, r]));
const replaced = [], added = [];
for (const r of incoming) (existing.has(`${r.month}|${r.metric}`) ? replaced : added).push(r);
if (replaced.length && !flags.replace) {
  die(`Ya existen en ${month}: ${replaced.map((r) => `${r.metric} (${existing.get(`${r.month}|${r.metric}`).value})`).join(', ')}.\nUsa --replace para sobrescribirlas (p. ej. al cerrar un mes que estaba parcial).`);
}

// Las filas reemplazadas quedan en su lugar (el diff muestra solo el cambio); las nuevas van al final.
const byKey = new Map(incoming.map((r) => [`${r.month}|${r.metric}`, r]));
const merged = [...current.rows.map((r) => byKey.get(`${r.month}|${r.metric}`) ?? r), ...added];
const check = readLedger(toCsv(merged, EOL));   // revalida el resultado completo antes de tocar disco
if (check.errors.length) die(`El resultado seria invalido; no se escribio nada:\n` + check.errors.map((e) => `  - ${e}`).join('\n'));

for (const r of replaced) console.log(`  reemplaza ${r.metric} ${month}: ${existing.get(`${r.month}|${r.metric}`).value} → ${r.value}`);
for (const r of added) console.log(`  agrega    ${r.metric} ${month}: ${r.value} (${r.type})`);
if (flags.dryRun) { console.log('\n--dry-run: no se escribio nada.'); process.exit(0); }

writeFileSync(CSV, toCsv(merged, EOL));
const ledger = buildLedger(merged, relative(ROOT, CSV).split('\\').join('/'));
writeFileSync(OUT, jsonSource(ledger));
console.log(`\nOK  ${added.length} agregadas, ${replaced.length} reemplazadas → ${relative(ROOT, CSV)} y ${relative(ROOT, OUT)}`);
for (const n of coverageNotes(ledger)) console.log(`    aviso: ${n}`);
console.log('Siguiente: npm run build, revisar el diff y commit del CSV y del JSON juntos.');

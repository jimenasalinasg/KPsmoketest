#!/usr/bin/env node
// Convierte data/kp_ledger.csv -> src/data/kpLedger.json
//
// Solo transforma y valida. No hay logica de negocio aca ni en el CSV: las sumas
// (OS + CS, highlights totales, etc.) viven en src/data/ledgerView.js y src/App.jsx.
//
// Uso:  npm run ledger:build
//       node scripts/ledger-to-json.mjs [entrada.csv] [salida.js]
//
// Columnas: month (YYYY-MM | baseline), metric, value, type (additive|snapshot), source, note
//   additive  -> un valor por mes, se pueden sumar entre meses
//   snapshot  -> acumulado a esa fecha, NO se suma; se lee el ultimo mes de cada metrica
//   baseline  -> month=baseline: linea base sin corte mensual
// Se corre solo antes de cada `npm run build` (prebuild): un CSV invalido rompe el build.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readLedger, buildLedger, jsonSource, coverageNotes } from './lib/ledger.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [, , inArg, outArg] = process.argv;
const IN = resolve(inArg ?? `${ROOT}/data/kp_ledger.csv`);
const OUT = resolve(outArg ?? `${ROOT}/src/data/kpLedger.json`);

let raw;
try { raw = readFileSync(IN, 'utf8'); }
catch { console.error(`No pude leer ${IN}`); process.exit(1); }

const { rows, errors } = readLedger(raw);
if (errors.length) {
  console.error(`El CSV tiene ${errors.length} problema(s); no se escribio nada:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const ledger = buildLedger(rows, relative(ROOT, IN).split('\\').join('/'));
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, jsonSource(ledger));

console.log(`OK  ${rows.length} filas · ${ledger.months.length} meses (${ledger.months[0]} → ${ledger.months.at(-1)}) → ${relative(ROOT, OUT)}`);
console.log(`    aditivas ${Object.keys(ledger.additive).length} · snapshots ${Object.keys(ledger.snapshot).length} · baseline ${Object.keys(ledger.baseline).length}`);
for (const n of coverageNotes(ledger)) console.log(`    aviso: ${n}`);

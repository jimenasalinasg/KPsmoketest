// Libreria compartida del ledger: parseo/validacion del CSV, serializacion y generacion
// del modulo. La usan scripts/ledger-to-json.mjs y scripts/add-month.mjs, asi ambos
// aplican exactamente las mismas reglas. Sin logica de negocio.

export const HEADER = ['month', 'metric', 'value', 'type', 'source', 'note'];
const REQUIRED = ['month', 'metric', 'value', 'type'];
const TYPES = new Set(['additive', 'snapshot']);

// CSV minimo (RFC 4180): comillas dobles, "" como comilla escapada, CRLF o LF, BOM.
export function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let row = [], field = '', quoted = false, line = 1, rowLine = 1;
  const endRow = () => { row.push(field); field = ''; rows.push({ line: rowLine, cells: row }); row = []; rowLine = line + 1; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else { if (c === '\n') line++; field += c; }
    } else if (c === '"' && field === '') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      endRow(); line++; rowLine = line;
    } else field += c;
  }
  if (quoted) throw new Error(`comillas sin cerrar (fila que empieza en la linea ${rowLine})`);
  if (field !== '' || row.length) endRow();
  return rows.filter((r) => r.cells.some((f) => f.trim() !== ''));
}

// Devuelve { rows, errors }. Si hay errores, nadie debe escribir nada.
export function readLedger(text) {
  const errors = [], rows = [];
  let parsed;
  try { parsed = parseCsv(text); } catch (e) { return { rows, errors: [`CSV mal formado: ${e.message}`] }; }
  if (!parsed.length) return { rows, errors: ['El CSV esta vacio.'] };

  const header = parsed[0].cells.map((h) => h.trim().toLowerCase());
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const missing = REQUIRED.filter((h) => !(h in col));
  if (missing.length) return { rows, errors: [`Faltan columnas: ${missing.join(', ')}. Encabezado leido: ${header.join(', ')}`] };
  const cell = (r, name) => (name in col ? (r.cells[col[name]] ?? '').trim() : '');

  const seen = new Map(), typeOf = new Map(), monthly = new Set(), baselineSet = new Set();
  for (const r of parsed.slice(1)) {
    const at = `linea ${r.line}`;
    const month = cell(r, 'month'), metric = cell(r, 'metric'), valueStr = cell(r, 'value'), type = cell(r, 'type').toLowerCase();
    if (r.cells.length > header.length) errors.push(`${at}: ${r.cells.length} celdas para ${header.length} columnas (¿coma sin comillas en note?)`);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) && month !== 'baseline') errors.push(`${at}: month "${month}" no es YYYY-MM ni baseline`);
    if (!metric) errors.push(`${at}: metric vacio`);
    if (!TYPES.has(type)) errors.push(`${at}: type "${type}" no es additive ni snapshot`);
    if (!/^-?\d+(\.\d+)?$/.test(valueStr)) errors.push(`${at}: value "${valueStr}" no es numerico`);
    if (!metric || !TYPES.has(type)) continue;

    const key = `${month}|${metric}`;
    if (seen.has(key)) errors.push(`${at}: duplicado de ${metric} en ${month} (ya estaba en la linea ${seen.get(key)})`);
    else seen.set(key, r.line);

    if (month !== 'baseline') {
      if (typeOf.has(metric) && typeOf.get(metric) !== type) errors.push(`${at}: ${metric} aparece como ${type} y como ${typeOf.get(metric)}`);
      typeOf.set(metric, type);
      monthly.add(metric);
    } else baselineSet.add(metric);

    rows.push({ month, metric, value: Number(valueStr), type, source: cell(r, 'source'), note: cell(r, 'note') });
  }
  for (const m of baselineSet) if (monthly.has(m)) errors.push(`${m}: esta en baseline y tambien con meses; una metrica es una cosa o la otra`);
  return { rows, errors };
}

// Serializa conservando el orden de las filas. Solo cita lo que lo necesita, igual que el CSV de origen.
const q = (v) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
// `eol` conserva el salto de linea del archivo original (el CSV del ledger usa CRLF): asi agregar un mes
// solo agrega lineas al diff en vez de reescribirlas todas.
export const detectEol = (text) => (text.includes('\r\n') ? '\r\n' : '\n');
export function toCsv(rows, eol = '\n') {
  const lines = [HEADER.join(',')];
  for (const r of rows) lines.push([r.month, r.metric, String(r.value), r.type, r.source, r.note].map(q).join(','));
  return lines.join(eol) + eol;
}

const sortKeys = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));

// Estructura que consume el dashboard. Determinista: sin fecha y con claves ordenadas.
export function buildLedger(rows, generatedFrom) {
  const additive = {}, snapshot = {}, baseline = {};
  for (const r of rows) {
    if (r.month === 'baseline') baseline[r.metric] = r.value;
    else if (r.type === 'additive') (additive[r.metric] ??= {})[r.month] = r.value;
    else (snapshot[r.metric] ??= {})[r.month] = r.value;
  }
  for (const o of [additive, snapshot]) for (const k of Object.keys(o)) o[k] = sortKeys(o[k]);
  const months = [...new Set(rows.filter((r) => r.month !== 'baseline').map((r) => r.month))].sort();
  return {
    generatedFrom,
    months,
    additive: sortKeys(additive),
    baseline: sortKeys(baseline),
    snapshot: sortKeys(snapshot),
    rows: [...rows].sort((a, b) => a.metric.localeCompare(b.metric) || a.month.localeCompare(b.month)),
  };
}

// El dashboard importa este JSON. Determinista (sin fecha, claves ordenadas): el diff de cada cierre muestra solo lo nuevo.
export const jsonSource = (ledger) => JSON.stringify(ledger, null, 2) + '\n';

// Aviso informativo: metricas aditivas que no cubren todos los meses.
export function coverageNotes(ledger) {
  const notes = [];
  for (const [m, byMonth] of Object.entries(ledger.additive)) {
    const gaps = ledger.months.filter((mo) => !(mo in byMonth));
    if (gaps.length) notes.push(`${m} no tiene ${gaps.join(', ')}`);
  }
  return notes;
}

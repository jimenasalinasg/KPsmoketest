// Lecturas del ledger (src/data/kpLedger.json, generado de data/kp_ledger.csv por scripts/ledger-to-json.mjs).
// Aca vive la unica logica de negocio sobre el ledger; el CSV solo guarda valores.
//
// Base de TODAS las metricas de evento del ledger: segmento "Sin DEV (copy)" (sjHJR3590z6j),
// que excluye al equipo interno (DEV). Ver data/kp_ledger.csv, columna source.
import ledger from "./kpLedger.json";

export { ledger };
export const SEGMENT_NAME = "Sin DEV (copy)";

// Valor aditivo de un mes. Falla fuerte si falta: un cero silencioso escondería una fila sin cargar.
export function L(month, metric) {
  const v = ledger.additive[metric]?.[month];
  if (v === undefined) throw new Error(`kp_ledger.csv: falta ${metric} en ${month}`);
  return v;
}

// Suma de todos los meses de una metrica aditiva (acumulado de eventos).
export const ledgerSum = (metric) => Object.values(ledger.additive[metric] ?? {}).reduce((a, b) => a + b, 0);

// Linea base sin corte mensual (month=baseline). Falla fuerte si falta: un cero silencioso escondería una fila sin cargar.
export function baseline(metric) {
  const v = ledger.baseline[metric];
  if (v === undefined) throw new Error(`kp_ledger.csv: falta la linea base ${metric}`);
  return v;
}

// Snapshots acumulados: no se suman. El vigente de cada metrica es el del ultimo mes cargado.
export function latestSnapshot(metric) {
  const byMonth = ledger.snapshot[metric];
  if (!byMonth) throw new Error(`kp_ledger.csv: falta el snapshot ${metric}`);
  const month = Object.keys(byMonth).sort().at(-1);
  return { month, value: byMonth[month] };
}

// Filas de la tarjeta Content Engagement: [etiqueta, Open Search, Contextual].
// Contextual = highlights (detalle + tarjetas del sidebar) + copias + links a fuente + Global Search (chips + barra de busqueda).
// Las descargas no estan en el ledger por mes (solo la linea base acumulada), por eso entran como parametro.
export function engagementRows(month, downloads = 0) {
  const globalSearch = L(month, "cs_chips") + L(month, "cs_search_bar");
  const rows = [
    ["Highlights", L(month, "os_highlight"), L(month, "cs_highlight_detail") + L(month, "cs_highlight_cards")],
    ["Copies", L(month, "os_copy"), L(month, "cs_copy")],
    ["Source clicks", L(month, "os_source_panel"), L(month, "cs_source_link")],
  ];
  if (globalSearch > 0) rows.push(["Global Search", 0, globalSearch]);
  if (downloads > 0) rows.push(["Downloads", downloads, 0]);
  return rows;
}

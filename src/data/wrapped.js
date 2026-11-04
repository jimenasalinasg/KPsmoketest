// KP Wrapped 2026 — datos y calculos (sin JSX). Todo numero sale de:
//  - los bloques mensuales de src/App.jsx (usuarios, sesiones, prompters, nuevos, prompts), que App pasa como `months`;
//  - el ledger (data/kp_ledger.csv → kpLedger.json), segmento Sin DEV (copy);
//  - las constantes de abajo, leidas de FullStory MCP el 4-nov-2026 y documentadas en cada una.
// Nada se estima: si un mes no tiene el dato, el calculo lo reporta como cobertura parcial.
import { ledger } from "./ledgerView.js";

export const YEAR = 2026;
export const ALL_MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => `${YEAR}-${m}`);
export const MONTH_LABEL = (ym) => new Date(`${ym}-01T00:00:00Z`).toLocaleString("es", { month: "short", timeZone: "UTC" }).replace(".", "");
export const GO_LIVE = "2026-03-31";

// Sesiones con al menos una vista de cada pill, por mes. FullStory, metricas guardadas
// PJyiZSAt3EXH (Lessons Learned), rhTcgj1srgne (Similar Projects), w0ktk3sF3v3I (Literature), eCemfOCLh5qU (Data)
// y pagina 70 (Institutional Documents, misma definicion), segmento sjHJR3590z6j. Leido el 4-nov-2026; noviembre = 1-3.
// Son VISTAS (sesiones que abrieron la pill), no clics dentro de la pill.
export const PILL_SESSIONS = {
  "Similar Projects":        { "2026-01": 9, "2026-02": 23, "2026-03": 37, "2026-04": 49, "2026-05": 21, "2026-06": 51, "2026-07": 13, "2026-08": 23, "2026-09": 19, "2026-10": 12, "2026-11": 1 },
  "Lessons Learned":         { "2026-01": 5, "2026-02": 16, "2026-03": 26, "2026-04": 46, "2026-05": 17, "2026-06": 39, "2026-07": 26, "2026-08": 17, "2026-09": 19, "2026-10": 26, "2026-11": 1 },
  "Literature":              { "2026-01": 4, "2026-02": 10, "2026-03": 18, "2026-04": 25, "2026-05": 10, "2026-06": 29, "2026-07": 10, "2026-08": 13, "2026-09": 8, "2026-10": 14, "2026-11": 1 },
  "Institutional Documents": { "2026-01": 1, "2026-02": 9, "2026-03": 11, "2026-04": 16, "2026-05": 10, "2026-06": 27, "2026-07": 9, "2026-08": 11, "2026-09": 10, "2026-10": 16, "2026-11": 3 },
  "Data":                    { "2026-01": 0, "2026-02": 0, "2026-03": 0, "2026-04": 0, "2026-05": 4, "2026-06": 22, "2026-07": 12, "2026-08": 15, "2026-09": 7, "2026-10": 20, "2026-11": 0 },
};

// Usuarios unicos Sin DEV de los meses organicos (antes del go-live), misma receta que los bloques mensuales.
// FullStory 4-nov-2026; marzo = 1-30 (sin el dia del go-live). Enero y febrero completos.
export const ORGANIC_USERS = { "2026-01": 116, "2026-02": 150, "2026-03": 248 };

// Segmentos de fidelidad. Los umbrales se aplican en FullStory (ventana movil de 28 dias, visitas a /home):
// cambiarlos aca no recalcula nada, hay que rehacer la receta del checklist con el umbral nuevo.
// Mutuamente excluyentes: power ⊂ frecuentes en el ledger, por eso "frequent" aqui = frecuentes − power.
export const SEGMENT_RULES = {
  window: "28 days",
  power: { min: 8, label: "Power users", desc: "8 o más visitas al home de KP en 28 días: unas dos por semana" },
  frequent: { min: 4, label: "Frequent users", desc: "4 a 7 visitas en 28 días: más o menos una por semana" },
  casual: { label: "Casual users", desc: "Menos de 4 visitas en 28 días" },
};

// Hitos con evidencia en el repo o en los datos. Nada que no este documentado.
export const MILESTONES = [
  { date: "2026-03-31", title: "Knowledge Platform sale en vivo", body: "Tras un lanzamiento orgánico y cerrado desde septiembre de 2025, KP se abrió a todo el Banco. Las vistas Smoke Test y Week 1 de este dashboard empiezan aquí.", evidence: "vistas de lanzamiento de este dashboard" },
  { date: "2026-05", title: "Llega la pill de Data", body: "Una quinta pill de conocimiento. Sus primeras visitas registradas son de mayo; en octubre sumó 20 sesiones en el mes.", evidence: "primeras sesiones en la página Data: mayo 2026" },
  { date: "2026-05", title: "Lanzamos Global Search", body: "Ampliamos la búsqueda contextual para que todos los usuarios pudieran explorar conocimiento sin depender de un proyecto específico. La barra de búsqueda de proyectos registra actividad desde mayo; los chips de agrupación (por país, sector, división…), desde septiembre.", evidence: "ledger: cs_search_bar desde mayo, cs_chips desde septiembre", highlight: true },
];

const add = (metric, ym) => ledger.additive?.[metric]?.[ym];

export const monthsInRange = (from, to) => ALL_MONTHS.filter((m) => m >= from && m <= to);

// Suma un campo sobre los meses del rango. `byMonth` es { "YYYY-MM": number|null }.
// Devuelve el total y la cobertura: cuantos meses del rango tienen el dato.
export function sumCovered(byMonth, months) {
  let value = 0, covered = 0;
  for (const m of months) {
    const v = byMonth[m];
    if (typeof v === "number") { value += v; covered++; }
  }
  return { value, covered, total: months.length, complete: covered === months.length };
}

export const fieldByMonth = (rows, key) => Object.fromEntries(rows.map((r) => [r.month, r[key] ?? null]));
export const ledgerByMonth = (...metrics) => Object.fromEntries(ALL_MONTHS.map((m) => {
  const vals = metrics.map((k) => add(k, m));
  return [m, vals.every((v) => typeof v === "number") ? vals.reduce((a, b) => a + b, 0) : null];
}));

// Ranking de pills por sesiones con vista. Porcentaje sobre la suma de las cinco (comparables entre si).
export function pillRanking(months) {
  const rows = Object.entries(PILL_SESSIONS).map(([name, byMonth]) => ({ name, value: sumCovered(byMonth, months).value }));
  const total = rows.reduce((a, r) => a + r.value, 0);
  return { total, rows: rows.map((r) => ({ ...r, share: total ? r.value / total : 0 })).sort((a, b) => b.value - a.value) };
}

// Familias de eventos del ledger (misma unidad: eventos, Sin DEV). Prompts va aparte: es otra fuente (consola).
export const FEATURES = [
  { key: "pills", name: "Pills contextuales", sub: "Vistas de pills", metrics: ["cs_queries"] },
  { key: "os", name: "Open Search", sub: "Resaltados, copias y clics a fuentes en las respuestas", metrics: ["os_highlight", "os_copy", "os_source_panel"] },
  { key: "gs", name: "Global Search", sub: "Barra de búsqueda de proyectos y chips de agrupación", metrics: ["cs_chips", "cs_search_bar"] },
  { key: "ctx", name: "Extracción contextual", sub: "Resaltados, copias y links a fuentes dentro de las pills", metrics: ["cs_highlight_detail", "cs_highlight_cards", "cs_copy", "cs_source_link"] },
];

export function featureRanking(months) {
  const half = Math.ceil(months.length / 2);
  const first = months.slice(0, half), second = months.slice(half);
  const rows = FEATURES.map((f) => {
    const by = ledgerByMonth(...f.metrics);
    const all = sumCovered(by, months), a = sumCovered(by, first), b = sumCovered(by, second);
    return { ...f, value: all.value, covered: all.covered, firstHalf: a.value, secondHalf: b.value };
  });
  const total = rows.reduce((s, r) => s + r.value, 0);
  const totA = rows.reduce((s, r) => s + r.firstHalf, 0), totB = rows.reduce((s, r) => s + r.secondHalf, 0);
  const withShare = rows.map((r) => ({
    ...r,
    share: total ? r.value / total : 0,
    shift: totA && totB ? r.secondHalf / totB - r.firstHalf / totA : null, // cambio de participacion, en puntos (0-1)
  })).sort((a, b) => b.value - a.value);
  const riser = withShare.filter((r) => r.shift != null && r.shift > 0.05).sort((a, b) => b.shift - a.shift)[0] ?? null;
  return { rows: withShare, total, riser, halves: [first, second] };
}

// Segmentos de fidelidad para un mes con frecuentes, power y usuarios cargados.
export function loyalty(month, users) {
  const freq = ledger.snapshot?.frequent_users?.[month], power = ledger.snapshot?.power_users?.[month];
  if (![freq, power, users].every((v) => typeof v === "number")) return null;
  const frequentOnly = freq - power, casual = Math.max(users - freq, 0);
  const base = casual + frequentOnly + power;
  return {
    month, users: base,
    segments: [
      { key: "casual", ...SEGMENT_RULES.casual, value: casual, share: casual / base },
      { key: "frequent", ...SEGMENT_RULES.frequent, value: frequentOnly, share: frequentOnly / base },
      { key: "power", ...SEGMENT_RULES.power, value: power, share: power / base },
    ],
  };
}

export const pct = (x, d = 0) => `${(x * 100).toFixed(d)}%`;
export const fmt = (n) => Math.round(n).toLocaleString("en-US");

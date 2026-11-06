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

// ── Historias extra (4-nov-2026). Lecturas de FullStory, segmento Sin DEV, host knowledgeplatform.iadb.org, 1-ene → 3-nov.
// Estas sesiones usan el segmento Sin DEV (sesiones que pasan por el home, sin el equipo): otra base que las sesiones
// del bloque mensual (todos los entornos). Sirven para comparar dias entre si, no para sumarlas a las del bloque.

// Sesiones por dia, desde el 1-ene-2026 (indice 0) hasta el 3-nov-2026.
const D = {
  "01": [2,2,1,3,6,14,14,19,7,1,0,14,14,16,15,14,2,2,9,10,21,13,24,1,0,19,21,13,11,16,2],
  "02": [0,30,15,26,23,24,4,7,25,24,30,25,21,2,2,3,23,20,20,15,3,1,25,25,24,12,13,1],
  "03": [0,15,10,19,22,16,3,0,11,20,19,21,12,1,7,14,16,24,29,19,3,6,22,26,37,56,84,7,10,51,81],
  "04": [62,40,7,2,4,141,95,72,69,57,7,8,52,48,58,67,50,8,10,69,52,50,45,23,2,2,88,60,50,36],
  "05": [29,4,3,35,37,39,54,40,10,6,37,32,31,39,51,6,1,31,34,42,43,29,5,6,17,76,26,28,23,5,1],
  "06": [132,47,48,51,35,5,9,79,34,4,0,6,1,0,20,24,28,29,8,3,2,28,18,18,26,23,5,2,20,21],
  "07": [25,19,6,1,5,16,21,28,21,8,0,1,16,15,12,15,22,1,2,13,16,12,16,7,0,1,11,14,17,16,13],
  "08": [2,1,21,18,17,7,8,3,2,17,14,11,13,15,1,1,16,27,21,41,16,1,3,73,28,18,14,8,1,2,8],
  "09": [21,22,65,13,3,3,7,21,52,11,4,3,2,19,23,16,17,12,3,3,14,17,11,11,12,5,1,19,18,18],
  "10": [12,9,2,2,9,12,34,20,10,1,2,7,9,36,12,4,0,1,15,16,12,9,10,2,4,13,10,25,17,25,3],
  "11": [2,10,22],
};
export const DAILY_SESSIONS = Object.entries(D).flatMap(([m, arr]) => arr.map((v, i) => ({ date: `${YEAR}-${m}-${String(i + 1).padStart(2, "0")}`, value: v })));
export const DAILY_THROUGH = "2026-11-03";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export function weekdayProfile(months) {
  const days = DAILY_SESSIONS.filter((d) => months.includes(d.date.slice(0, 7)));
  const tot = Array(7).fill(0);
  for (const d of days) tot[new Date(`${d.date}T00:00:00Z`).getUTCDay()] += d.value;
  const sum = tot.reduce((a, b) => a + b, 0);
  const order = [1, 2, 3, 4, 5, 6, 0]; // lunes primero
  const rows = order.map((i) => ({ day: WEEKDAYS[i], value: tot[i], share: sum ? tot[i] / sum : 0 }));
  const best = [...rows].sort((a, b) => b.value - a.value)[0];
  const record = days.reduce((a, d) => (d.value > (a?.value ?? -1) ? d : a), null);
  const weekend = sum ? (tot[0] + tot[6]) / sum : 0;
  return { rows, best, record, weekend, sum, days: days.length };
}

// Usuarios unicos por pais, 1-ene → 3-nov (no cambia con el rango). Total 1,655 personas.
export const COUNTRIES = { through: "2026-11-03", total: 1655, rows: [
  ["United States", 884], ["Brazil", 131], ["Colombia", 98], ["Argentina", 88], ["Panama", 57], ["Uruguay", 52], ["Costa Rica", 50],
  ["Peru", 45], ["Mexico", 32], ["Paraguay", 31], ["El Salvador", 27], ["Ecuador", 24], ["Spain", 22], ["Barbados", 20], ["Bolivia", 20],
  ["Chile", 20], ["Dominican Republic", 20], ["Cayman Islands", 18], ["Trinidad and Tobago", 18], ["Honduras", 17], ["Guatemala", 15],
  ["Bahamas", 13], ["Jamaica", 13], ["Suriname", 13], ["Belize", 11], ["Nicaragua", 9], ["Guyana", 7], ["France", 5], ["Haiti", 5],
  ["Canada", 4], ["United Kingdom", 3], ["Germany", 2], ["Australia", 1], ["Austria", 1], ["Belgium", 1], ["Italy", 1], ["Korea", 1],
  ["Portugal", 1], ["Puerto Rico", 1], ["Saint Martin", 1], ["Switzerland", 1], ["Venezuela", 1],
].map(([name, users]) => ({ name, users })) };
// Paises miembros prestatarios del BID (26), para el conteo de cobertura regional.
export const BORROWERS = ["Argentina", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Suriname", "Trinidad and Tobago", "Uruguay", "Venezuela"];

// Operaciones mas consultadas: sesiones que abrieron /knowledge/<codigo>, 1-ene → 3-nov. Los codigos son numeros de operacion publicos del BID.
export const TOP_OPERATIONS = { through: "2026-11-03", rows: [
  ["CO-L1325", 14], ["BR-L1664", 11], ["UR-L1225", 11], ["BR-L1688", 10], ["ME-L1350", 10], ["BL-J0011", 9], ["BR-J0003", 9], ["PN-L1195", 9],
].map(([code, sessions]) => ({ code, sessions })) };

// Tipos de explorador: personas unicas que hicieron cada cosa al menos una vez, 1-ene → 3-nov. NO son excluyentes.
export const EXPLORERS = { through: "2026-11-03", base: 1655, rows: [
  { key: "ask", name: "El Curioso", verb: "hizo al menos una pregunta al Knowledge Assistant", value: 750 },
  { key: "pill", name: "El Explorador", verb: "abrió al menos una pill de conocimiento", value: 284 },
  { key: "copy", name: "El Redactor", verb: "copió contenido para llevárselo a su trabajo", value: 230 },
  { key: "src", name: "El Investigador", verb: "abrió las fuentes para verificar una respuesta", value: 137 },
] };

// Calidad de respuesta (consola de administracion): share de preguntas respondidas. Solo meses con dato.
export const ANSWER_RATE = { "2026-09": 0.54, "2026-10": 0.24 };
// Meses que no sirven de referencia para la tasa de respuesta. Octubre: un solo usuario concentro una gran parte
// de las preguntas y muchas de las suyas quedaron sin respuesta, asi que el 24% no representa al resto.
export const ANSWER_RATE_OUTLIERS = { "2026-10": "un solo usuario hizo una gran parte de las preguntas del mes" };
export const answerRef = (months) => months.filter((m) => ANSWER_RATE[m] != null && !ANSWER_RATE_OUTLIERS[m]).at(-1) ?? null;

// Temas mas preguntados: requieren la exportacion de preguntas de la consola. Mientras sea null, la historia no se muestra.
export const TOP_TOPICS = null; // [{ topic: "…", count: n }, …]

// ── Cierre: lo que aprendimos y lo que viene (4-nov-2026) ──
// Aprendizajes de los barridos cualitativos publicados en cada mes (QUALITATIVE en App.jsx):
// agosto 10 sesiones, septiembre 10, octubre 13. Son patrones a verificar, no mediciones.
export const SWEEPS = { sessions: 33, months: "ago–oct" };
export const LEARNINGS = [
  { title: "No vienen a buscar: vienen a escribir.", body: "Pegan su propio borrador o matriz de riesgos y piden a KP que complete secciones. En septiembre, 4 de 10 sesiones trabajaron sobre un documento propio.", src: "Barridos de agosto y septiembre" },
  { title: "Llegan con un código, no con una pregunta.", body: "Escriben el número de operación y siguen con lo mismo: ¿está aprobada?, ¿hay versión en portugués?, ¿quién la lidera? Pasó en 3 de 13 sesiones en octubre.", src: "Barrido de octubre" },
  { title: "Reescriben su pregunta a mano.", body: "Copian lo que preguntaron, lo pegan y cambian el final para afinar la búsqueda. Es la forma que encontraron de editar y volver a preguntar.", src: "Barridos de agosto y octubre" },
];
// Retos para 2027, cada uno con su dato. M+1 = cohortes de agosto (16 de 125) y septiembre (13 de 110), tabla COHORTS de octubre.
export const RETURN_M1 = { cohorts: [["agosto", 16, 125], ["septiembre", 13, 110]] };

// Sesiones por hora del dia, hora de Washington (EDT, UTC-4), 2 → 31 de octubre de 2026 (segmento Sin DEV, produccion).
// FullStory entrega las horas en UTC (verificado: 7-oct 15:00-15:59 UTC = 15 sesiones en la serie y en una consulta directa);
// se corrieron 4 horas. Indice 0 = medianoche. Una sesion que cruza una hora cuenta en ambas.
export const HOURS_ET = { from: "2026-10-02", to: "2026-10-31", values: [2, 0, 1, 1, 0, 0, 1, 3, 8, 28, 35, 46, 32, 20, 38, 37, 39, 23, 10, 6, 7, 3, 3, 5] };
export function shiftProfile(values = HOURS_ET.values) {
  const sum = (a, b) => values.slice(a, b).reduce((s, v) => s + v, 0);
  const total = sum(0, 24);
  const shifts = [
    { key: "am", name: "Turno mañana", range: "6 a. m. – 12 m.", value: sum(6, 12) },
    { key: "pm", name: "Turno tarde", range: "12 m. – 6 p. m.", value: sum(12, 18) },
    { key: "night", name: "Turno noche", range: "6 p. m. – 6 a. m.", value: sum(18, 24) + sum(0, 6) },
  ].map((s) => ({ ...s, share: total ? s.value / total : 0 }));
  const winner = [...shifts].sort((a, b) => b.value - a.value)[0];
  const peak = values.indexOf(Math.max(...values));
  return { total, shifts, winner, peak };
}

// Evidencia para "¿Destino o capa?": el Lessons Writing Assistant ya vive dentro del ciclo operativo, en Client Portal.
// Dato del equipo de producto (no FullStory), al 31-oct-2026. Ojo: el ledger tiene lessons_created = 1,559 (consola, oct-2026),
// que mide otra cosa (lecciones creadas, no lecciones aprendidas registradas); no se mezclan.
export const LWA_EVIDENCE = { lessons: 777, asOf: "2026-10-31", countries: 24 };

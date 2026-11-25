// CSAT mensual (manual, de la lista de encuestas de FullStory; NO esta en el ledger). Top-2 box = respuestas >= 4 / total.
// Copia de lo publicado en las vistas mensuales de App.jsx. sat = respuestas satisfechas; null si no se puede reconstruir.
// Abril: publicado "75% de 5 respuestas", que no cuadra (4/5 = 80%); se muestra tal cual y queda fuera del agregado.
export const CSAT = [
  { m: "2026-04", pct: 75, n: 5, sat: null, flag: "As published: 75% on 5 responses does not divide evenly; left out of the total" },
  { m: "2026-05", pct: 76.5, n: 17, sat: 13 },
  { m: "2026-06", pct: 58.3, n: 12, sat: 7, flag: "Technical incident (API / 400 errors)" },
  { m: "2026-07", pct: 100, n: 4, sat: 4, avg: 4.75 },
  { m: "2026-08", pct: 40, n: 5, sat: 2, avg: 2.8 },
  { m: "2026-09", pct: 67, n: 3, sat: 2, avg: 4.33 },
  { m: "2026-10", pct: 100, n: 2, sat: 2, avg: 5.0 },
  // Proxy FullStory (Sin DEV, 1-19 nov): 4 sesiones abren la encuesta, 2 la completan; 1 marca los 4 motivos positivos (>=4), la otra no deja leer la estrella.
  { m: "2026-11", pct: null, label: "50–100%", n: 2, sat: null, satLabel: "≥1/2", flag: "Proxy through Nov 19 (FullStory sessions): 2 completed, 1 confirmed 4–5★, 1 unreadable · replaced at the close" },
];

// Agregado: satisfechas / respuestas de los meses que se pueden reconstruir (no promedio de porcentajes).
export const csatPooled = () => {
  const rows = CSAT.filter((r) => r.sat != null);
  const sat = rows.reduce((a, r) => a + r.sat, 0), n = rows.reduce((a, r) => a + r.n, 0);
  return { sat, n, share: n ? sat / n : null, from: rows[0]?.m, to: rows.at(-1)?.m };
};

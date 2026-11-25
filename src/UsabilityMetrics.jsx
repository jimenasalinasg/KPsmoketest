// Vista "Usability metrics". Replica el diseño de reference/kp_usability_metrics.html con componentes de React
// y los tokens de smoketest (src/theme.js). TODOS los numeros salen del ledger (data/kp_ledger.csv, via
// src/data/kpLedger.json). Unicas constantes propias: TOTAL_STAFF (el divisor de penetracion) y MOST_USED_PILL (texto).
import { useState, useRef, useEffect } from "react";
import ledgerCsv from "../data/kp_ledger.csv?raw";
import { ledger, SEGMENT_NAME, ledgerSum, baseline, latestSnapshot } from "./data/ledgerView.js";
import { buildDocs } from "./data/metricDocs.js";
import { PURPLE, RED, BLUE, BLUE_D, BLUE_L, BLUE_M, GREEN, AMBER, SURF, BDR, INK, INK2, INK3, AMBER_PALE, ON_ACCENT, ON_DARK, ON_DARK_2, FONT, T, R, PAGE_W, SHADOW } from "./theme.js";

const TOTAL_STAFF = 7287;                 // IDB staff + consultores: divisor de la penetracion (no esta en el ledger)
const MOST_USED_PILL = "Similar Projects"; // Sin DEV (sjHJR3590z6j), sesiones que abren cada pill (paginas 67/68/69/70/257), 2025-10-01 a 2026-11-19: SP 276 > LL 264 > Lit 156 > Inst. Docs 137 > Data 92. Las metricas guardadas (rhTcgj1srgne, PJyiZSAt3EXH...) NO excluyen al equipo y daban LL primero: no usarlas. Recomputar en cada cierre

import { CSAT } from "./data/csat.js";

function CsatBlock() {
  const pooled = CSAT.filter((r) => r.sat != null);
  const sat = pooled.reduce((a, r) => a + r.sat, 0), n = pooled.reduce((a, r) => a + r.n, 0);
  const maxN = Math.max(...CSAT.map((r) => r.n ?? 0));
  const th = { padding: "6px 8px", textAlign: "right", fontWeight: 500, color: INK3, fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" };
  const td = { padding: "6px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", borderTop: `1px solid ${BDR}`, verticalAlign: "middle" };
  return (
    <>
      <Cells>
        <Kpi first label="CSAT · aggregate" sub={`Top-2 box · ${monthLabel(pooled[0].m)} – ${monthLabel(pooled.at(-1).m)}`} value={`${(sat / n * 100).toFixed(1)}%`} note={`${sat} satisfied of ${n} responses, pooled (not an average of monthly %)`} />
        <Kpi label="Responses" sub="All months with data" value={fmt(CSAT.reduce((a, r) => a + (r.n ?? 0), 0))} note="Under 20 a month: each response moves a month by 5 to 50 points" warn />
      </Cells>
      <div style={{ overflowX: "auto", padding: "4px 10px 8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: T.xs, color: INK2, minWidth: 520 }}>
          <thead><tr><th style={{ ...th, textAlign: "left" }}>Month</th><th style={th}>CSAT</th><th style={th}>Satisfied</th><th style={{ ...th, textAlign: "left" }}>Responses</th><th style={th}>Avg ★</th><th style={{ ...th, textAlign: "left" }}>Note</th></tr></thead>
          <tbody>
            {CSAT.map((r) => (
              <tr key={r.m}>
                <td style={{ ...td, textAlign: "left", whiteSpace: "nowrap" }}>{monthLabel(r.m)}</td>
                <td style={{ ...td, color: BLUE_D, fontWeight: 600 }}>{r.pct == null ? (r.label ?? "–") : `${r.pct}%`}</td>
                <td style={td}>{r.sat == null ? (r.satLabel ?? "–") : `${r.sat}/${r.n}`}</td>
                <td style={{ ...td, textAlign: "left" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", height: 8, width: r.n ? Math.max(4, (r.n / maxN) * 120) : 0, background: BLUE_M, borderRadius: 2 }} />
                    {r.n ?? "–"}
                  </span>
                </td>
                <td style={td}>{r.avg == null ? "–" : r.avg.toFixed(2)}</td>
                <td style={{ ...td, textAlign: "left", color: INK3 }}>{r.flag ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// CSAT (abr-nov 2026, ~52 encuestas de la lista "Surveys by month" de FullStory): lectura APROXIMADA de los resúmenes
// mensuales ya publicados en las pestañas de cada mes, no un conteo por respuesta. Se muestra como rango.
const CSAT_VALUED = [
  { reason: "I quickly found what I was looking for", lo: 80, hi: 90 },
  { reason: "The platform was useful for my work", lo: 65, hi: 75 },
  { reason: "The content was clear", lo: 60, hi: 70 },
  { reason: "The experience was simple and smooth", lo: 50, hi: 60 },
];
const CSAT_LOW = [
  { reason: "Didn't find what they needed (May)", share: 40 },
  { reason: "Technical failures: crashes, API, access, blank page (Jun, Aug)", share: 40 },
  { reason: "Other: slowness, one-off comments", share: 20 },
];
// Lecciones aprendidas registradas en Client Portal, por ciclo de reporte (dato del equipo de producto, 19-nov-2026).
// El ciclo de mitad de año abre en julio, cierra en septiembre y cubre ene-jun del año corriente.
// El ciclo de inicio de año abre en enero, cierra en marzo y cubre ene-dic del año anterior.
// 785 y 777 cuadran lección por lección con Lessons.xlsx / Lessons_Generated.xlsx; 545 viene del equipo de producto.
const LWA_CYCLES = [
  { name: "Mid-year 2025", window: "Jul–Sep 2025", covers: "Jan–Jun 2025", lessons: 545 },
  { name: "Start of year 2026", window: "Jan–Mar 2026", covers: "Jan–Dec 2025", lessons: 785 },
  { name: "Mid-year 2026", window: "Jul–Sep 2026", covers: "Jan–Jun 2026", lessons: 777 },
];
// Lessons generated inside the KP (platform), not through Client Portal. Export of the KP lessons table shared by the product team on Nov 20, 2026:
// 80 rows, Aug 4, 2025 → Nov 19, 2026 (11 in 2025, 69 in 2026). 28 distinct operations; 22 rows have no operation.
// Quality read (by content): 2 empty drafts (status PRO), 20 generated from placeholder or test input ("aaa", "prueba", "Test1"), 58 with substantive content.
const LWA_KP_LESSONS = 80; // all rows, kept for reference; the dashboard shows only substantive lessons
const LWA_KP_SUBSTANTIVE = 58;
const LWA_TOTAL = LWA_CYCLES.reduce((a, c) => a + c.lessons, 0);
const fmt = (n) => n.toLocaleString("en-US");
const monthLabel = (m) => new Date(`${m}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const BODY = FONT;

// Columnas de la tabla de historia: [metrica del ledger, encabezado]
const COLS = [
  ["os_highlight", "OS highlight"], ["os_copy", "OS copy"], ["os_source_panel", "OS source"],
  ["cs_queries", "CS queries"], ["cs_copy", "CS copy"], ["cs_source_link", "CS source"],
  ["cs_highlight_detail", "CS hl detail"], ["cs_highlight_cards", "CS hl cards"], ["cs_chips", "GS chips"], ["cs_search_bar", "GS search bar"],
];

function downloadCsv() {
  const url = URL.createObjectURL(new Blob([ledgerCsv], { type: "text/csv" })); // el archivo tal cual, sin reserializar
  const a = document.createElement("a");
  a.href = url; a.download = "kp_ledger.csv"; a.click();
  URL.revokeObjectURL(url);
}

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: T.xs, textTransform: "uppercase", letterSpacing: "0.04em", color: INK2, fontWeight: 500, marginBottom: -8 }}>{children}</div>
);

const rowNote = (metric) => ledger.rows.find((r) => r.metric === metric)?.note ?? "";
const KIND_COLOR = { Ledger: GREEN, Snapshot: BLUE, Derived: BLUE, Console: AMBER, Manual: AMBER };
const POP_W = 300;

// Hover (i): como se mide la cifra. Posicion fija para no quedar recortado por la tabla con scroll.
// Abre con hover, foco o toque; se queda abierto al pasar el mouse por encima (para copiar un ID); Esc o clic fuera lo cierra.
function Info({ doc }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btn = useRef(null);
  const timer = useRef(null);
  const show = () => {
    clearTimeout(timer.current);
    const r = btn.current.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.left + r.width / 2 - POP_W / 2), window.innerWidth - POP_W - 8);
    const below = window.innerHeight - r.bottom, above = r.top;
    setPos(below >= above ? { left, top: r.bottom + 6, maxHeight: below - 14 } : { left, bottom: window.innerHeight - r.top + 6, maxHeight: above - 14 });
    setOpen(true);
  };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 150); };
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const onAway = (e) => { if (!btn.current?.parentElement?.contains(e.target)) close(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onAway);
    window.addEventListener("scroll", close, true);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onAway); window.removeEventListener("scroll", close, true); };
  }, [open]);
  if (!doc) return null;
  const Label = ({ children }) => <span style={{ display: "block", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: ON_DARK_2, margin: "8px 0 2px" }}>{children}</span>;
  const Text = ({ children, color }) => <span style={{ display: "block", fontSize: T.xs, lineHeight: 1.5, color: color || ON_DARK }}>{children}</span>;
  const IdList = ({ items }) => items.map(([id, label]) => (
    <span key={id} style={{ display: "block", fontSize: T.micro, lineHeight: 1.45, color: ON_DARK_2, marginBottom: 3 }}>
      <code style={{ color: ON_ACCENT, background: "rgba(255,255,255,.12)", borderRadius: R.sm, padding: "0 4px", marginRight: 5 }}>{id}</code>{label}
    </span>
  ));
  return (
    <span style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }} onPointerEnter={(e) => { if (e.pointerType !== "touch") show(); }} onPointerLeave={(e) => { if (e.pointerType !== "touch") hide(); }}>
      <button ref={btn} type="button" aria-label={`How "${doc.title}" is measured`} aria-expanded={open}
        onClick={show} onFocus={show} onBlur={hide}
        style={{ width: 12, height: 12, borderRadius: R.pill, border: `1px solid ${BDR}`, background: SURF, color: INK3, fontSize: T.micro, lineHeight: 1, padding: 0, cursor: "help", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textTransform: "none" }}>i</button>
      {open && pos && (
        <span role="tooltip" style={{ position: "fixed", ...pos, width: POP_W, boxSizing: "border-box", overflowY: "auto", zIndex: 100, background: INK, color: ON_ACCENT, borderRadius: R.md, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.25)", textAlign: "left", textTransform: "none", letterSpacing: "normal", fontWeight: 400, whiteSpace: "normal", fontFamily: BODY, userSelect: "text", cursor: "text" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: R.pill, background: KIND_COLOR[doc.kind] || INK3 }} />
            <span style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: ON_DARK_2 }}>{doc.kind}</span>
          </span>
          <span style={{ display: "block", fontSize: T.sm, fontWeight: 600, marginBottom: 4 }}>{doc.title}</span>
          <Text>{doc.what}</Text>
          <Label>How it is measured</Label>
          <Text>{doc.formula}</Text>
          {doc.ids && <><Label>FullStory metric IDs</Label><IdList items={doc.ids} /></>}
          {doc.events && <><Label>Events / elements</Label><Text>{doc.events}</Text></>}
          {doc.idsNote && <>{!doc.ids && <Label>FullStory</Label>}<Text color={AMBER_PALE}>{doc.idsNote}</Text></>}
          {doc.related && <><Label>{doc.relatedLabel || "Related saved metrics (unique users, not this count)"}</Label><IdList items={doc.related} /></>}
          {doc.note && <span style={{ display: "block", marginTop: 8, paddingTop: 7, borderTop: "1px solid rgba(255,255,255,.15)", fontSize: T.micro, lineHeight: 1.5, color: ON_DARK_2 }}>{doc.note}</span>}
        </span>
      )}
    </span>
  );
}

function Kpi({ label, sub, value, note, warn, small, first, doc }) {
  return (
    <div style={{ padding: "4px 16px 12px", borderLeft: first ? "none" : `1px solid ${BDR}`, minWidth: 0 }}>
      <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: INK3, display: "flex", alignItems: "center", gap: 5 }}><span>{label}</span><Info doc={doc} /></div>
      {sub && <div style={{ fontSize: T.micro, color: INK3, marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: small ? 22 : 30, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 6 }}>{value}</div>
      {note && <div style={{ fontSize: T.micro, color: warn ? AMBER : INK3, marginTop: 6, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// Banda lateral + contenido, como los bloques "access" y "engagement" de la referencia.
function Block({ band, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: 10 }}>
      <div style={{ background: BLUE_D, borderRadius: R.md, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: ON_ACCENT, fontSize: T.micro, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>{band}</span>
      </div>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "14px 6px 6px", minWidth: 0 }}>{children}</div>
    </div>
  );
}

const Cells = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", rowGap: 4 }}>{children}</div>
);

function EngRow({ title, children, last }) {
  return (
    <div style={{ borderBottom: last ? "none" : `1px solid ${BDR}`, padding: "8px 0 4px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", alignItems: "start" }}>
      <div style={{ padding: "10px 16px", fontSize: T.base, fontWeight: 500, color: INK, lineHeight: 1.3 }}>{title}</div>
      {children}
    </div>
  );
}

function HistoryTable({ docs }) {
  const th = { padding: "6px 8px", textAlign: "right", fontWeight: 500, color: INK3, fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" };
  const td = { padding: "6px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", borderTop: `1px solid ${BDR}` };
  const first = { textAlign: "left", whiteSpace: "nowrap" };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: T.xs, color: INK2, minWidth: 720 }}>
        <thead><tr><th style={{ ...th, ...first }}>Month</th>{COLS.map(([k, l]) => <th key={l} style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{l}<Info doc={docs[k]} /></span></th>)}<th style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Avg. active time (s)<Info doc={docs.avg_active_time_s} /></span></th><th style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Median prompts<Info doc={docs.medianPrompt} /></span></th><th style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Users in a category (cum.)<Info doc={docs.csCategoryUsers} /></span></th><th style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Frequent users<Info doc={docs.frequentUsers} /></span></th><th style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>Power users<Info doc={docs.powerUsers} /></span></th></tr></thead>
        <tbody>
          {ledger.months.map((m) => (
            <tr key={m}><td style={{ ...td, ...first }}>{m}</td>{COLS.map(([k]) => <td key={k} style={td}>{ledger.additive[k]?.[m] ?? "–"}</td>)}<td style={td}>{ledger.snapshot.avg_active_time_s?.[m]?.toFixed(1) ?? "–"}</td><td style={td}>{ledger.snapshot.median_prompts?.[m] ?? "–"}</td><td style={td}>{ledger.snapshot.cs_category_users_cum?.[m] ?? "–"}</td><td style={td}>{ledger.snapshot.frequent_users?.[m] ?? "–"}</td><td style={td}>{ledger.snapshot.power_users?.[m] ?? "–"}</td></tr>
          ))}
          {Object.entries(ledger.baseline).map(([k, v]) => {
            const note = ledger.rows.find((r) => r.metric === k && r.month === "baseline")?.note;
            return <tr key={k}><td style={{ ...td, ...first }}>baseline · {k}</td><td colSpan={COLS.length + 5} style={{ ...td, textAlign: "left" }}>{fmt(v)}{note ? ` (${note})` : ""}</td></tr>;
          })}
          <tr style={{ fontWeight: 600, color: BLUE_D }}>
            <td style={{ ...td, ...first, borderTop: `2px solid ${BLUE_M}` }}>Total</td>
            {COLS.map(([k]) => <td key={k} style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>{fmt(ledgerSum(k))}</td>)}<td style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>–</td><td style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>–</td><td style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>–</td><td style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>–</td><td style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>–</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function UsabilityMetrics() {
  const first = ledger.months[0], last = ledger.months.at(-1);
  const users = latestSnapshot("unique_users").value;
  // Último día completo del acumulado, leído de la nota del ledger ("Nov 1-10 completo").
  const usersNote = [...ledger.rows].reverse().find((r) => r.metric === "unique_users")?.note ?? "";
  const thruMatch = usersNote.match(/\b([A-Z][a-z]{2}) 1-(\d{1,2}) complet/);
  const usersThrough = thruMatch ? `${thruMatch[1]} ${thruMatch[2]}` : null;
  const returning = latestSnapshot("returning_rate_pct").value;
  const prompts = latestSnapshot("prompts_sent").value;
  const medianPrompt = latestSnapshot("median_prompts").value;
  const lessons = latestSnapshot("lessons_created").value;
  const penetration = Math.round((users / TOTAL_STAFF) * 1000) / 10;
  const tenths = Math.round(returning / 10);

  const osEngagement = ledgerSum("os_highlight") + ledgerSum("os_copy") + ledgerSum("os_source_panel") + baseline("os_downloads");
  const csHighlight = ledgerSum("cs_highlight_detail") + ledgerSum("cs_highlight_cards");
  const globalSearch = ledgerSum("cs_chips") + ledgerSum("cs_search_bar");
  const csEngagement = ledgerSum("cs_copy") + ledgerSum("cs_source_link") + csHighlight + globalSearch;

  const docs = buildDocs({ fmt, sum: ledgerSum, baseline, snap: latestSnapshot, noteOf: rowNote, totalStaff: TOTAL_STAFF });
  const small = { fontSize: T.micro, color: INK3, lineHeight: 1.6, fontFamily: BODY };
  return (
    <div style={{ maxWidth: PAGE_W, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: T.xs, textTransform: "uppercase", letterSpacing: "0.04em", color: INK3, marginBottom: 4 }}>Usability metrics</div>
          <div style={{ fontSize: T.h2, fontWeight: 600, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{tenths} in 10 users return within two weeks</div>
          <div style={{ fontSize: T.sm, color: INK3 }}>Insight into how users are accessing and engaging with Knowledge Platform · {monthLabel(first)} – {monthLabel(last)} · excl. internal team (DEV)</div>
        </div>
        <button onClick={downloadCsv}
          style={{ fontFamily: "inherit", fontSize: T.xs, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: R.md, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}>
          ↓ Download ledger CSV
        </button>
      </div>

      <SectionLabel>Access</SectionLabel>
      <Block band="access">
        <Cells>
          <Kpi first label="Unique users" doc={docs.users} value={fmt(users)} note={usersThrough ? `Cumulative through ${usersThrough} · last month-close + the month's delta` : "Snapshot: last month-close + the month's delta"} />
          <Kpi label="Penetration" doc={docs.penetration} sub={`Out of ${fmt(TOTAL_STAFF)} IDB staff & consultants`} value={`${penetration}%`} />
          <Kpi label="Avg. active time" doc={docs.avg_active_time_s} sub="Per page view · current month" value={`${latestSnapshot("avg_active_time_s").value.toFixed(1)} s`} note={`${latestSnapshot("avg_active_time_s").month}${latestSnapshot("avg_active_time_s").month === last ? " · month so far" : ""}`} />
          <Kpi label="Returning user rate" doc={docs.returning} sub="Within 14 days" value={`${tenths}/10`} note={`${returning}% · a rate, so it is robust to FullStory's retention window`} />
        </Cells>
      </Block>

      <SectionLabel>Habit</SectionLabel>
      <Block band="access">
        <Cells>
          <Kpi first label="Frequent users" doc={docs.frequentUsers} sub="≥4 visits in 28 days" value={fmt(latestSnapshot("frequent_users").value)} note={`${latestSnapshot("frequent_users").month} · ${(latestSnapshot("frequent_users").value / latestSnapshot("unique_users").value * 100).toFixed(1)}% of unique users`} />
          <Kpi label="Power users" doc={docs.powerUsers} sub="≥8 visits in 28 days" value={fmt(latestSnapshot("power_users").value)} note={`${latestSnapshot("power_users").month} · ${(latestSnapshot("power_users").value / latestSnapshot("unique_users").value * 100).toFixed(1)}% of unique users`} />
        </Cells>
      </Block>

      <SectionLabel>Engagement</SectionLabel>
      <Block band="engagement">
        <EngRow title="Open Search">
          <Kpi label="Prompts sent" doc={docs.prompts} value={fmt(prompts)} small note="Console · cumulative (not in FullStory)" warn />
          <Kpi label="Median prompts" doc={docs.medianPrompt} sub="Per user · month so far" value={medianPrompt} small note="Median of prompts per user" />
          <Kpi label="Content engagement" doc={docs.osEngagement} value={fmt(osEngagement)} small note="Sum of the ledger: highlight + copy + source panel + downloads" />
        </EngRow>
        <EngRow title="Contextual Search">
          <Kpi label="Queries" doc={docs.queries} value={fmt(ledgerSum("cs_queries"))} small note="Sum of the ledger" />
          <Kpi label="Users in a category" doc={docs.csCategoryUsers} sub="Opened ≥1 knowledge category · cumulative" value={fmt(latestSnapshot("cs_category_users_cum").value)} small note={`Unique people since Oct 21, 2025 · ${latestSnapshot("cs_category_users_cum").month}${latestSnapshot("cs_category_users_cum").month === last ? " · to date" : ""}`} />
          <Kpi label="Most used pill" doc={docs.mostUsedPill} value={MOST_USED_PILL} small note="276 sessions, Lessons Learned 264 · Oct 2025 – Nov 19, 2026 · Sin DEV · from Fullstory, not in the ledger" warn />
          <Kpi label="Content engagement" doc={docs.csEngagement} value={fmt(csEngagement)} small
            note={`copy ${fmt(ledgerSum("cs_copy"))} + source/link ${fmt(ledgerSum("cs_source_link"))} + highlight ${fmt(csHighlight)} (detail ${fmt(ledgerSum("cs_highlight_detail"))} + sidebar cards ${fmt(ledgerSum("cs_highlight_cards"))}) + Global Search ${fmt(globalSearch)} (chips ${fmt(ledgerSum("cs_chips"))} + search bar ${fmt(ledgerSum("cs_search_bar"))})`} />
        </EngRow>
        <EngRow title="Lessons Writing Assistant" last>
          <Kpi label="Lessons created · Client Portal (integration)" value={fmt(LWA_TOTAL)} small note="3 reporting cycles, Jul 2025 – Sep 2026 · detail below" />
          <Kpi label="Lessons created · KP (platform)" value={fmt(LWA_KP_SUBSTANTIVE)} small note="Generated in the KP · Aug 2025 – Nov 19, 2026 · tests and empty drafts excluded" />
        </EngRow>
      </Block>

      <SectionLabel>Lessons Writing Assistant · where lessons are created</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 12 }}>
        {[
          { tag: "Integration", name: "Client Portal", desc: "The assistant runs inside the reporting flow. Teams write lessons during the reporting cycle.", value: fmt(LWA_TOTAL), sub: "Jul 2025 – Sep 2026 · 3 cycles", color: PURPLE },
          { tag: "Platform", name: "Knowledge Platform", desc: "People open the assistant on their own from the KP, outside the reporting cycle.", value: fmt(LWA_KP_SUBSTANTIVE), sub: "Aug 2025 – Nov 19, 2026 · tests and drafts excluded", color: BLUE_D },
        ].map((x) => (
          <div key={x.tag} style={{ minWidth: 0, background: SURF, border: `1px solid ${BDR}`, borderLeft: `4px solid ${x.color}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "14px 16px" }}>
            <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: x.color, fontWeight: 600 }}>{x.tag}</div>
            <div style={{ fontSize: T.md, fontWeight: 600, color: INK, marginTop: 2 }}>{x.name}</div>
            <div style={{ fontSize: T.kpi, fontWeight: 700, color: x.value === "Pending" ? INK3 : INK, lineHeight: 1.1, marginTop: 8 }}>{x.value}</div>
            <div style={{ fontSize: T.xs, color: INK2 }}>{x.sub}</div>
            <div style={{ fontSize: T.sm, color: INK2, lineHeight: 1.5, marginTop: 8 }}>{x.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: T.sm, fontWeight: 600, color: INK, margin: "0 0 8px" }}>Integration · Client Portal by reporting cycle</div>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderTop: `4px solid ${PURPLE}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, alignItems: "stretch" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: PURPLE, fontWeight: 600 }}>Client Portal · total</div>
          <div style={{ fontSize: T.display, fontWeight: 700, color: INK, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 6 }}>{fmt(LWA_TOTAL)}</div>
          <div style={{ fontSize: T.sm, color: INK2, lineHeight: 1.5, marginTop: 6 }}>Lessons learned registered by project teams across the last three reporting cycles.</div>
        </div>
        {LWA_CYCLES.map((c) => (
          <div key={c.name} style={{ minWidth: 0, background: BLUE_L, borderRadius: R.md, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: T.sm, fontWeight: 600, color: INK }}>{c.name} cycle</div>
            <div style={{ fontSize: T.kpi, fontWeight: 700, color: PURPLE, lineHeight: 1 }}>{fmt(c.lessons)}</div>
            <div style={{ height: 6, background: SURF, borderRadius: R.pill }}>
              <div style={{ width: `${Math.round(c.lessons / Math.max(...LWA_CYCLES.map((x) => x.lessons)) * 100)}%`, height: "100%", background: PURPLE, borderRadius: R.pill }} />
            </div>
            <div style={{ fontSize: T.xs, color: INK2, lineHeight: 1.45 }}>Open {c.window}<br />Covers {c.covers}</div>
          </div>
        ))}
        <p style={{ ...small, gridColumn: "1 / -1", margin: 0 }}>
          The mid-year cycle opens in July, closes in September and covers January–June of the same year. The start-of-year cycle opens in January, closes in March and covers the whole previous year. Source: Client Portal, product team (Nov 19, 2026).
        </p>
      </div>

      <SectionLabel>Satisfaction</SectionLabel>
      <Block band="csat">
        <CsatBlock />
      </Block>

      <SectionLabel>What users value (CSAT, Apr–Nov · approximate)</SectionLabel>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: T.sm, fontWeight: 600, color: INK, marginBottom: 4 }}>Reasons picked in 4–5★ responses</div>
          <div style={{ ...small, marginBottom: 10 }}>About 3 in 4 of the ~52 responses are positive. Share of positive responses that pick each reason.</div>
          {CSAT_VALUED.map((r) => (
            <div key={r.reason} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: T.sm, color: INK2, marginBottom: 4 }}>
                <span style={{ minWidth: 0 }}>{r.reason}</span><span style={{ color: INK3, flexShrink: 0 }}>~{r.lo}–{r.hi}%</span>
              </div>
              <div style={{ position: "relative", height: 8, background: BLUE_L, borderRadius: R.pill }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${r.lo}%`, background: BLUE, borderRadius: R.pill }} />
                <div style={{ position: "absolute", left: `${r.lo}%`, top: 0, bottom: 0, width: `${r.hi - r.lo}%`, background: BLUE_M }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: T.sm, fontWeight: 600, color: INK, marginBottom: 4 }}>Why the 1–3★ responses were low</div>
          <div style={{ ...small, marginBottom: 10 }}>About 1 in 4 responses. None complain about the content itself.</div>
          {CSAT_LOW.map((r) => (
            <div key={r.reason} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: T.sm, color: INK2, marginBottom: 4 }}>
                <span style={{ minWidth: 0 }}>{r.reason}</span><span style={{ color: INK3, flexShrink: 0 }}>~{r.share}%</span>
              </div>
              <div style={{ height: 8, background: BLUE_L, borderRadius: R.pill }}>
                <div style={{ width: `${r.share}%`, height: "100%", background: RED, borderRadius: R.pill }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...small, gridColumn: "1 / -1", margin: 0 }}>
          <strong>Read:</strong> people value finding something useful for their work, fast. When the score is low, search or the platform failed — not the content. Approximate: read from the monthly CSAT summaries in each month's tab, not a count per response. Survey volume fell from 12–17 a month (May–Jun) to 2–5 since August, so each recent response weighs a lot.
        </p>
      </div>

      <SectionLabel>Monthly history</SectionLabel>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "16px 20px" }}>
        <p style={{ ...small, fontSize: T.sm, color: INK2, margin: "0 0 12px" }}>
          One row per month, summed for the totals. Single-month windows are not affected by FullStory's ~12-month retention. Every event metric uses the {SEGMENT_NAME} segment.
        </p>
        <HistoryTable docs={docs} />
      </div>

      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: R.md, padding: "10px 14px", fontSize: T.xs, color: INK2, lineHeight: 1.6, fontFamily: BODY }}>
        <strong>Basis.</strong> Segment {SEGMENT_NAME}: the internal team (DEV) is excluded from every event metric. Unique users, sessions and prompters are month-close snapshots; users and sessions add the month's delta between closes. Snapshots are cumulative, so they are never summed across months. Prompts sent, ave. prompt and lessons created come from the product console. Latest snapshot: {last}, a partial month until its close replaces it.
      </div>
    </div>
  );
}

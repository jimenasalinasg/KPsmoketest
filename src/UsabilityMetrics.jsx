// Vista "Usability metrics". Replica el diseño de reference/kp_usability_metrics.html con componentes de React
// y los tokens de smoketest (src/theme.js). TODOS los numeros salen del ledger (data/kp_ledger.csv, via
// src/data/kpLedger.json). Unicas constantes propias: TOTAL_STAFF (el divisor de penetracion) y MOST_USED_PILL (texto).
import { useState, useRef, useEffect } from "react";
import ledgerCsv from "../data/kp_ledger.csv?raw";
import { ledger, SEGMENT_NAME, ledgerSum, baseline, latestSnapshot } from "./data/ledgerView.js";
import { buildDocs } from "./data/metricDocs.js";
import { BLUE, BLUE_D, BLUE_L, BLUE_M, GREEN, AMBER, SURF, BDR, INK, INK2, INK3 } from "./theme.js";

const TOTAL_STAFF = 3600;                 // IDB staff y consultores: divisor de la penetracion (no esta en el ledger)
const MOST_USED_PILL = "Similar project"; // MANUAL: no esta en el ledger; actualizar a mano si cambia

const fmt = (n) => n.toLocaleString("en-US");
const monthLabel = (m) => new Date(`${m}-01T00:00:00Z`).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const BODY = "system-ui, -apple-system, sans-serif";

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
  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>{children}</div>
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
  const Label = ({ children }) => <span style={{ display: "block", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8fa9c4", margin: "8px 0 2px" }}>{children}</span>;
  const Text = ({ children, color }) => <span style={{ display: "block", fontSize: 10, lineHeight: 1.5, color: color || "#e8edf5" }}>{children}</span>;
  const IdList = ({ items }) => items.map(([id, label]) => (
    <span key={id} style={{ display: "block", fontSize: 9, lineHeight: 1.45, color: "#c8d8ea", marginBottom: 3 }}>
      <code style={{ color: "#fff", background: "rgba(255,255,255,.12)", borderRadius: 3, padding: "0 4px", marginRight: 5 }}>{id}</code>{label}
    </span>
  ));
  return (
    <span style={{ position: "relative", display: "inline-flex", verticalAlign: "middle" }} onPointerEnter={(e) => { if (e.pointerType !== "touch") show(); }} onPointerLeave={(e) => { if (e.pointerType !== "touch") hide(); }}>
      <button ref={btn} type="button" aria-label={`How "${doc.title}" is measured`} aria-expanded={open}
        onClick={show} onFocus={show} onBlur={hide}
        style={{ width: 12, height: 12, borderRadius: 99, border: `1px solid ${BDR}`, background: SURF, color: INK3, fontSize: 8, lineHeight: 1, padding: 0, cursor: "help", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, textTransform: "none" }}>i</button>
      {open && pos && (
        <span role="tooltip" style={{ position: "fixed", ...pos, width: POP_W, boxSizing: "border-box", overflowY: "auto", zIndex: 100, background: INK, color: "#fff", borderRadius: 8, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,.25)", textAlign: "left", textTransform: "none", letterSpacing: "normal", fontWeight: 400, whiteSpace: "normal", fontFamily: BODY, userSelect: "text", cursor: "text" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: KIND_COLOR[doc.kind] || INK3 }} />
            <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: "#a8c4e0" }}>{doc.kind}</span>
          </span>
          <span style={{ display: "block", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{doc.title}</span>
          <Text>{doc.what}</Text>
          <Label>How it is measured</Label>
          <Text>{doc.formula}</Text>
          {doc.ids && <><Label>FullStory metric IDs</Label><IdList items={doc.ids} /></>}
          {doc.events && <><Label>Events / elements</Label><Text>{doc.events}</Text></>}
          {doc.idsNote && <>{!doc.ids && <Label>FullStory</Label>}<Text color="#f5c58a">{doc.idsNote}</Text></>}
          {doc.related && <><Label>{doc.relatedLabel || "Related saved metrics (unique users, not this count)"}</Label><IdList items={doc.related} /></>}
          {doc.note && <span style={{ display: "block", marginTop: 8, paddingTop: 7, borderTop: "1px solid rgba(255,255,255,.15)", fontSize: 9, lineHeight: 1.5, color: "#8fa9c4" }}>{doc.note}</span>}
        </span>
      )}
    </span>
  );
}

function Kpi({ label, sub, value, note, warn, small, first, doc }) {
  return (
    <div style={{ padding: "4px 16px 12px", borderLeft: first ? "none" : `1px solid ${BDR}`, minWidth: 0 }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, display: "flex", alignItems: "center", gap: 5 }}><span>{label}</span><Info doc={doc} /></div>
      {sub && <div style={{ fontSize: 9, color: INK3, marginTop: 2 }}>{sub}</div>}
      <div style={{ fontSize: small ? 22 : 30, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 6 }}>{value}</div>
      {note && <div style={{ fontSize: 9, color: warn ? AMBER : INK3, marginTop: 6, lineHeight: 1.4 }}>{note}</div>}
    </div>
  );
}

// Banda lateral + contenido, como los bloques "access" y "engagement" de la referencia.
function Block({ band, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px minmax(0, 1fr)", gap: 10 }}>
      <div style={{ background: BLUE_D, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "#fff", fontSize: 9, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>{band}</span>
      </div>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "14px 6px 6px", minWidth: 0 }}>{children}</div>
    </div>
  );
}

const Cells = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", rowGap: 4 }}>{children}</div>
);

function EngRow({ title, children, last }) {
  return (
    <div style={{ borderBottom: last ? "none" : `1px solid ${BDR}`, padding: "8px 0 4px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", alignItems: "start" }}>
      <div style={{ padding: "10px 16px", fontSize: 13, fontWeight: 500, color: INK, lineHeight: 1.3 }}>{title}</div>
      {children}
    </div>
  );
}

function HistoryTable({ docs }) {
  const th = { padding: "6px 8px", textAlign: "right", fontWeight: 500, color: INK3, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" };
  const td = { padding: "6px 8px", textAlign: "right", fontVariantNumeric: "tabular-nums", borderTop: `1px solid ${BDR}` };
  const first = { textAlign: "left", whiteSpace: "nowrap" };
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, color: INK2, minWidth: 720 }}>
        <thead><tr><th style={{ ...th, ...first }}>Month</th>{COLS.map(([k, l]) => <th key={l} style={th}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>{l}<Info doc={docs[k]} /></span></th>)}</tr></thead>
        <tbody>
          {ledger.months.map((m) => (
            <tr key={m}><td style={{ ...td, ...first }}>{m}</td>{COLS.map(([k]) => <td key={k} style={td}>{ledger.additive[k]?.[m] ?? "–"}</td>)}</tr>
          ))}
          {Object.entries(ledger.baseline).map(([k, v]) => {
            const note = ledger.rows.find((r) => r.metric === k && r.month === "baseline")?.note;
            return <tr key={k}><td style={{ ...td, ...first }}>baseline · {k}</td><td colSpan={COLS.length} style={{ ...td, textAlign: "left" }}>{fmt(v)}{note ? ` (${note})` : ""}</td></tr>;
          })}
          <tr style={{ fontWeight: 600, color: BLUE_D }}>
            <td style={{ ...td, ...first, borderTop: `2px solid ${BLUE_M}` }}>Total</td>
            {COLS.map(([k]) => <td key={k} style={{ ...td, borderTop: `2px solid ${BLUE_M}` }}>{fmt(ledgerSum(k))}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function UsabilityMetrics() {
  const first = ledger.months[0], last = ledger.months.at(-1);
  const users = latestSnapshot("unique_users").value;
  const returning = latestSnapshot("returning_rate_pct").value;
  const prompts = latestSnapshot("prompts_sent").value;
  const avePrompt = Math.round((prompts / latestSnapshot("prompters").value) * 10) / 10;
  const lessons = latestSnapshot("lessons_created").value;
  const penetration = Math.round((users / TOTAL_STAFF) * 1000) / 10;
  const tenths = Math.round(returning / 10);

  const osEngagement = ledgerSum("os_highlight") + ledgerSum("os_copy") + ledgerSum("os_source_panel") + baseline("os_downloads");
  const csHighlight = ledgerSum("cs_highlight_detail") + ledgerSum("cs_highlight_cards");
  const globalSearch = ledgerSum("cs_chips") + ledgerSum("cs_search_bar");
  const csEngagement = ledgerSum("cs_copy") + ledgerSum("cs_source_link") + csHighlight + globalSearch;

  const docs = buildDocs({ fmt, sum: ledgerSum, baseline, snap: latestSnapshot, noteOf: rowNote, totalStaff: TOTAL_STAFF });
  const small = { fontSize: 9, color: INK3, lineHeight: 1.6, fontFamily: BODY };
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Usability metrics</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{tenths} in 10 users return within two weeks</div>
          <div style={{ fontSize: 11, color: INK3 }}>Insight into how users are accessing and engaging with Knowledge Platform · {monthLabel(first)} – {monthLabel(last)} · excl. internal team (DEV)</div>
        </div>
        <button onClick={downloadCsv}
          style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: 6, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}>
          ↓ Download ledger CSV
        </button>
      </div>

      <SectionLabel>Access</SectionLabel>
      <Block band="access">
        <Cells>
          <Kpi first label="Unique users" doc={docs.users} value={fmt(users)} note="Snapshot: last month-close + the month's delta" />
          <Kpi label="Penetration" doc={docs.penetration} sub={`Out of ${fmt(TOTAL_STAFF)} IDB staff`} value={`${penetration}%`} />
          <Kpi label="Returning user rate" doc={docs.returning} sub="Within 14 days" value={`${tenths}/10`} note={`${returning}% · a rate, so it is robust to FullStory's retention window`} />
        </Cells>
      </Block>

      <SectionLabel>Engagement</SectionLabel>
      <Block band="engagement">
        <EngRow title="Open Search">
          <Kpi label="Prompts sent" doc={docs.prompts} value={fmt(prompts)} small note="Console · cumulative (not in FullStory)" warn />
          <Kpi label="Ave. prompt" doc={docs.avePrompt} sub="Since Bank-wide" value={avePrompt} small note="Prompts ÷ prompters" />
          <Kpi label="Content engagement" doc={docs.osEngagement} value={fmt(osEngagement)} small note="Sum of the ledger: highlight + copy + source panel + downloads" />
        </EngRow>
        <EngRow title="Contextual Search">
          <Kpi label="Queries" doc={docs.queries} value={fmt(ledgerSum("cs_queries"))} small note="Sum of the ledger" />
          <Kpi label="Most used pill" doc={docs.mostUsedPill} value={MOST_USED_PILL} small note="Manual · not in the ledger" warn />
          <Kpi label="Content engagement" doc={docs.csEngagement} value={fmt(csEngagement)} small
            note={`copy ${fmt(ledgerSum("cs_copy"))} + source/link ${fmt(ledgerSum("cs_source_link"))} + highlight ${fmt(csHighlight)} (detail ${fmt(ledgerSum("cs_highlight_detail"))} + sidebar cards ${fmt(ledgerSum("cs_highlight_cards"))}) + Global Search ${fmt(globalSearch)} (chips ${fmt(ledgerSum("cs_chips"))} + search bar ${fmt(ledgerSum("cs_search_bar"))})`} />
        </EngRow>
        <EngRow title="Writing Lesson Assistant" last>
          <Kpi label="Lessons learned created" doc={docs.lessons} value={fmt(lessons)} small note="Console · Client Portal + KP (not in FullStory)" warn />
        </EngRow>
      </Block>

      <SectionLabel>Monthly history</SectionLabel>
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px" }}>
        <p style={{ ...small, fontSize: 11, color: INK2, margin: "0 0 12px" }}>
          One row per month, summed for the totals. Single-month windows are not affected by FullStory's ~12-month retention. Every event metric uses the {SEGMENT_NAME} segment.
        </p>
        <HistoryTable docs={docs} />
      </div>

      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 8, padding: "10px 14px", fontSize: 10, color: INK2, lineHeight: 1.6, fontFamily: BODY }}>
        <strong>Basis.</strong> Segment {SEGMENT_NAME}: the internal team (DEV) is excluded from every event metric. Unique users, sessions and prompters are month-close snapshots; users and sessions add the month's delta between closes. Snapshots are cumulative, so they are never summed across months. Prompts sent, ave. prompt and lessons created come from the product console. Latest snapshot: {last}, a partial month until its close replaces it.
      </div>
    </div>
  );
}

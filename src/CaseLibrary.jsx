// Tab "Librería de casos": lo que los usuarios intentan hacer en la KP. Datos en src/data/caseLibrary.js.
import { useMemo, useState } from "react";
import { CASES, MODES, MODE_ORDER, RECOS, RECOS_FOOT, SNAPSHOT } from "./data/caseLibrary.js";
import { BG, SURF, BDR, BDR_2, INK, INK2, INK3, BLUE, BLUE_D, BLUE_L, GREEN, GREEN_L, AMBER, AMBER_L, PURPLE, RED, ON_ACCENT, FONT, T, R, PAGE_W, SHADOW } from "./theme.js";

// Color de cada modo (texto sobre SURF, todos >= 4.5:1).
const MODE_COLOR = { consulta: BLUE_D, analisis: AMBER, integracion: PURPLE, extraccion: RED, transversal: INK2 };
const STATUS = {
  confirmado: { label: "Confirmado", color: GREEN, bg: GREEN_L },
  hipotesis: { label: "Hipótesis", color: AMBER, bg: AMBER_L },
};

const fmtDate = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function Pill({ active, onClick, children, count, color = BLUE, icon, ...rest }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} {...rest} style={{
      fontFamily: "inherit", fontSize: T.sm, padding: "6px 12px", borderRadius: R.pill,
      border: `1px solid ${active ? color : BDR_2}`, background: active ? color : SURF, color: active ? ON_ACCENT : INK2,
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      {icon && <span aria-hidden="true">{icon}</span>}{children}{count != null && <span style={{ fontVariantNumeric: "tabular-nums", opacity: active ? 1 : 0.85 }}>{count}</span>}
    </button>
  );
}

function CaseCard({ c, hero }) {
  const [open, setOpen] = useState(false);
  const st = STATUS[c.status] ?? STATUS.hipotesis;
  const evId = `ev-${c.id}`;
  return (
    <article style={{ breakInside: "avoid", background: hero ? BLUE_L : SURF, border: `1px solid ${BDR}`, borderTop: `3px solid ${MODE_COLOR[c.tag] ?? BDR}`, borderRadius: R.lg, padding: hero ? "20px 20px" : "16px 18px", marginBottom: 12 }}>
      <p style={{ margin: 0, fontSize: hero ? T.lg : T.md, lineHeight: 1.6, color: INK }}>{c.title}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <span style={{ fontSize: T.micro, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: MODE_COLOR[c.tag] ?? INK2 }}><span aria-hidden="true" style={{ marginRight: 4 }}>{MODES[c.tag]?.icon}</span>{MODES[c.tag]?.label ?? c.tag}</span>
        <span style={{ fontSize: T.micro, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: st.color, background: st.bg, borderRadius: R.pill, padding: "2px 8px" }}>{st.label}</span>
      </div>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={evId} style={{
        fontFamily: "inherit", fontSize: T.xs, color: BLUE_D, background: "none", border: "none", padding: 0, marginTop: 10,
        textDecoration: "underline", textUnderlineOffset: 2,
      }}>{open ? "Ocultar evidencia ▴" : "Ver evidencia ▾"}</button>
      <div id={evId} hidden={!open} style={{ fontSize: T.base, lineHeight: 1.6, color: INK2, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${BDR}` }}>{c.evidence}</div>
      <div style={{ fontSize: T.micro, color: INK3, marginTop: 8 }}>{c.id} · {fmtDate(c.date)}</div>
    </article>
  );
}

export default function CaseLibrary() {
  const [groupBy, setGroupBy] = useState("modo");
  const [filter, setFilter] = useState(null);
  const [q, setQ] = useState("");
  const [recosOpen, setRecosOpen] = useState(false);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const items = needle ? CASES.filter((c) => `${c.title} ${c.evidence}`.toLowerCase().includes(needle)) : CASES;
    const keys = groupBy === "modo" ? MODE_ORDER : ["confirmado", "hipotesis"];
    const field = groupBy === "modo" ? "tag" : "status";
    return keys.map((k) => ({
      key: k,
      label: groupBy === "modo" ? MODES[k].long : STATUS[k].label,
      short: groupBy === "modo" ? MODES[k].label : STATUS[k].label,
      icon: groupBy === "modo" ? MODES[k].icon : null,
      color: groupBy === "modo" ? MODE_COLOR[k] : STATUS[k].color,
      items: items.filter((c) => c[field] === k).sort((a, b) => (a.status === b.status ? b.date.localeCompare(a.date) : a.status === "confirmado" ? -1 : 1)),
    })).filter((g) => g.items.length);
  }, [groupBy, q]);

  const shown = filter ? groups.filter((g) => g.key === filter) : groups;
  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const confirmed = CASES.filter((c) => c.status === "confirmado").length;

  return (
    <div style={{ letterSpacing: "0.005em", maxWidth: PAGE_W, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <style>{`.kpl-grid{column-count:3;column-gap:12px}@media (max-width:900px){.kpl-grid{column-count:2}}@media (max-width:600px){.kpl-grid{column-count:1}}`}</style>

      <header>
        <div style={{ fontSize: T.xs, textTransform: "uppercase", letterSpacing: "0.04em", color: INK3, marginBottom: 4 }}>Librería de casos · research</div>
        <h1 style={{ fontSize: T.h1, fontWeight: 700, color: INK, letterSpacing: "-0.02em", margin: "0 0 6px" }}>Lo que los usuarios intentan hacer cuando usan la KP</h1>
        <p style={{ fontSize: T.base, color: INK2, lineHeight: 1.6, margin: 0, maxWidth: 680 }}>
          {CASES.length} casos de uso documentados desde FullStory y research cualitativo · {confirmed} confirmados en sesión real o métrica, {CASES.length - confirmed} hipótesis. Cada tarjeta es una necesidad real que un usuario del Banco intenta resolver con la plataforma.
        </p>
      </header>

      <section aria-label="Filtros de la librería" style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div role="group" aria-label="Agrupar por" style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: T.xs, textTransform: "uppercase", letterSpacing: "0.04em", color: INK3 }}>Agrupar</span>
            <Pill active={groupBy === "modo"} onClick={() => { setGroupBy("modo"); setFilter(null); }}>Modo</Pill>
            <Pill active={groupBy === "estado"} onClick={() => { setGroupBy("estado"); setFilter(null); }}>Estado</Pill>
          </div>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar casos…" aria-label="Buscar casos"
            style={{ flex: "1 1 200px", maxWidth: 320, fontFamily: "inherit", fontSize: T.md, padding: "7px 12px", border: `1px solid ${BDR_2}`, borderRadius: R.pill, background: BG, color: INK }} />
          <span aria-live="polite" style={{ fontSize: T.sm, color: INK3 }}>{total} {total === 1 ? "caso" : "casos"}</span>
        </div>
        <div role="group" aria-label="Filtrar" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Pill active={!filter} onClick={() => setFilter(null)} count={total}>Todos</Pill>
          {groups.map((g) => <Pill key={g.key} active={filter === g.key} onClick={() => setFilter(g.key)} count={g.items.length} icon={g.icon} color={g.color}>{g.short}</Pill>)}
        </div>
      </section>

      <section style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "14px 16px" }}>
        <button type="button" onClick={() => setRecosOpen((o) => !o)} aria-expanded={recosOpen} aria-controls="kpl-recos" style={{
          fontFamily: "inherit", fontSize: T.sm, fontWeight: 600, letterSpacing: "0.04em", color: INK, background: "none", border: "none", padding: 0,
        }}>{recosOpen ? "▾" : "▸"} Recomendaciones para el roadmap</button>
        <div id="kpl-recos" hidden={!recosOpen} style={{ marginTop: 10 }}>
          <div style={{ fontSize: T.xs, color: INK3, marginBottom: 6 }}>Basadas en los patrones más fuertes de la librería</div>
          {RECOS.map((r) => (
            <div key={r.name} style={{ display: "flex", gap: 10, alignItems: "baseline", padding: "10px 0", borderTop: `1px solid ${BDR}` }}>
              <span style={{ fontSize: T.micro, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap", padding: "2px 8px", borderRadius: R.sm, background: r.kind === "Quick win" ? GREEN : INK, color: ON_ACCENT }}>{r.kind}</span>
              <div>
                <div style={{ fontSize: T.base, fontWeight: 600, color: INK, marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: T.base, color: INK2, lineHeight: 1.6 }}>{r.note} <span style={{ color: INK3 }}>({r.refs.join(", ")})</span></div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: T.xs, color: INK3, lineHeight: 1.6, paddingTop: 10, borderTop: `1px solid ${BDR}` }}>{RECOS_FOOT}</div>
        </div>
      </section>

      {shown.length ? shown.map((g) => (
        <section key={g.key} aria-labelledby={`kpl-${g.key}`}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, borderBottom: `2px solid ${g.color}`, paddingBottom: 8, marginBottom: 12 }}>
            <h2 id={`kpl-${g.key}`} style={{ fontSize: T.lg, fontWeight: 600, color: g.color, margin: 0 }}>{g.icon && <span aria-hidden="true" style={{ marginRight: 6 }}>{g.icon}</span>}{g.label}</h2>
            <span style={{ fontSize: T.xs, color: INK3 }}>{g.items.length} {g.items.length === 1 ? "caso" : "casos"}</span>
          </div>
          <div className="kpl-grid">
            {g.items.map((c, i) => <CaseCard key={c.id} c={c} hero={i === 0 && c.status === "confirmado"} />)}
          </div>
        </section>
      )) : <p style={{ fontSize: T.md, color: INK3, textAlign: "center", padding: "32px 0" }}>Sin casos que coincidan.</p>}

      <footer style={{ background: SURF, border: `1px dashed ${BDR}`, borderRadius: R.lg, padding: "14px 18px", fontSize: T.xs, color: INK3, lineHeight: 1.7 }}>
        <strong style={{ color: INK2 }}>Estado:</strong> «Hipótesis» = patrón plausible sin sesión puntual de FullStory. «Confirmado» = visto en sesión real o métrica.
        <br /><strong style={{ color: INK2 }}>Privacidad:</strong> las sesiones se citan solo por país; no se publican nombres, correos ni ciudades de personas. Los códigos de operación son números públicos del BID.
        <br /><strong style={{ color: INK2 }}>Actualización:</strong> copia de la librería de research al {fmtDate(SNAPSHOT.date)}.
      </footer>
    </div>
  );
}

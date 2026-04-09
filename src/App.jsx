import { useState } from "react";

const BLUE = "#4a90e2";
const GREEN = "#22a05b";
const RED = "#d94f3d";
const AMBER = "#d97706";
const BG = "#f7f8fb";
const SURF = "#ffffff";
const BDR = "#e4e7f2";
const INK = "#1a1e2e";
const INK2 = "#3d4460";
const INK3 = "#8b93b8";
const BLUE_L = "#eaf2fc";
const BLUE_M = "#c2d9f7";
const BLUE_D = "#2c6cb5";

// ── CONFIG — update these when you have data ─────────────
const GO_LIVE_DATE = "March 31, 2026";
const SMOKE_WINDOW = "Mar 31 – Apr 1, 2026";
const WEEK1_WINDOW = "Mar 29 – Apr 4, 2026";
const BID_TOTAL = 3600;

// ── SMOKE TEST DATA ───────────────────────────────────────
// true = confirmed ✓, false = issue ✗, null = pending
const SMOKE = {
  capturedSessions: true,
  uniqueUsers: true,
  internalFiltered: true,
  rageclicks: true,
  sessions: 169,
  users: 112,
  prompters: 34,
  prompts: 99,
  avgTime: "20.69s",
  dropoff: 90,
  highlighted: 239,
  copied: 26,
  rageclicksCount: 0,
  tourCompletion: 66,
  openSearch: 94,
  pillTop: "Similar projects (3)",
  pillBot: "Institutional documents (1)",
  notes: "",
};

// ── WEEK 1 DATA ───────────────────────────────────────────
const WEEK1 = {
  sessions: null,
  users: null,
  prompters: null,
  retention: null,        // %
  dropoff: null,          // % bounce <10s
  highlighted: null,
  copied: null,
  rageclicks: null,
  pillTop: null,          // e.g. "Similar projects (32)"
  pillBot: null,          // e.g. "Inst. Documents (7)"
  observations: [
    // Add up to 3 short observations here, e.g.:
    // "Usuario pico el martes a las 10am — coincide con comunicación por email.",
    // "Similar projects sigue siendo la categoría más accedida.",
  ],
};

// ── HELPERS ───────────────────────────────────────────────
function pct(n) { return n != null ? `${n}%` : null; }
function fmt(n) { return n != null ? n.toLocaleString() : null; }

// ── PLACEHOLDER ───────────────────────────────────────────
function Placeholder({ label }) {
  return (
    <span style={{ color: BDR, fontSize: 11, fontStyle: "italic" }}>
      {label || "pending data"}
    </span>
  );
}

// ── STATUS BADGE ──────────────────────────────────────────
function StatusBadge({ value }) {
  if (value === null) return (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: BG, color: INK3, border: `1px dashed ${BDR}`, fontWeight: 500 }}>
      — pending
    </span>
  );
  return value ? (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#edfaf4", color: GREEN, fontWeight: 500 }}>
      ✓ confirmed
    </span>
  ) : (
    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "#fef0ee", color: RED, fontWeight: 500 }}>
      ✗ issue
    </span>
  );
}

// ── METRIC CARD ───────────────────────────────────────────
function MetricCard({ label, value, desc, invert = false, isGood = null }) {
  const hasValue = value != null;
  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 9 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: hasValue ? INK : BDR, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
        {hasValue ? value : "—"}
      </div>
      {!hasValue && <div style={{ fontSize: 10, color: INK3, fontStyle: "italic" }}>pending data</div>}
      {desc && hasValue && <div style={{ fontSize: 10, color: INK3, marginTop: 5, lineHeight: 1.5 }}>{desc}</div>}
    </div>
  );
}

// ── PENETRATION BAR ───────────────────────────────────────
function PenetrationBar({ users }) {
  const hasData = users != null;
  const pct = hasData ? ((users / BID_TOTAL) * 100).toFixed(1) : 0;
  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3 }}>
          Penetración — Staff & Consultores IDB
        </span>
        <span style={{ fontSize: 9, color: INK3 }}>
          {hasData ? `${users.toLocaleString()} de ${BID_TOTAL.toLocaleString()}` : `— de ${BID_TOTAL.toLocaleString()}`}
        </span>
      </div>
      <div style={{ background: BG, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: BLUE, borderRadius: 99, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: hasData ? BLUE_D : INK3 }}>
          {hasData ? `${pct}% del universo objetivo` : "pending data"}
        </span>
        <span style={{ fontSize: 10, color: AMBER }}>🚀 Go-live: {GO_LIVE_DATE}</span>
      </div>
    </div>
  );
}

// ── SMOKE TEST VIEW ───────────────────────────────────────
function SmokeTest() {
  const checks = [
    { label: "FullStory capturando sesiones correctamente", value: SMOKE.capturedSessions },
    { label: "Usuarios únicos identificados", value: SMOKE.uniqueUsers },
    { label: "Tráfico interno filtrado", value: SMOKE.internalFiltered },
    { label: "Sin rage clicks críticos en primeras 48h", value: SMOKE.rageclicks },
  ];

  const allConfirmed = checks.every(c => c.value === true);
  const hasIssue = checks.some(c => c.value === false);
  const isPending = checks.some(c => c.value === null);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 56px" }}>

      {/* Status banner */}
      <div style={{
        borderRadius: 10, padding: "14px 20px", marginBottom: 24,
        background: allConfirmed ? "#edfaf4" : hasIssue ? "#fef0ee" : "#fffbeb",
        border: `1px solid ${allConfirmed ? "#a7f3d0" : hasIssue ? "#fca5a5" : "#fde68a"}`,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 20 }}>{allConfirmed ? "✅" : hasIssue ? "🚨" : "⏳"}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: allConfirmed ? GREEN : hasIssue ? RED : AMBER }}>
            {allConfirmed ? "Smoke test passed — medición OK" : hasIssue ? "Issues detectados — revisar antes de continuar" : "Smoke test en progreso — datos pendientes"}
          </div>
          <div style={{ fontSize: 10, color: INK3, marginTop: 2 }}>
            Go-live: {GO_LIVE_DATE} · Ventana de validación: {SMOKE_WINDOW}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 16 }}>
          Checklist de validación técnica
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {checks.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", background: BG, borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: INK2 }}>{c.label}</span>
              <StatusBadge value={c.value} />
            </div>
          ))}
        </div>
      </div>

      {/* First numbers */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 16 }}>
          Primeros números (48h)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          {[
            { label: "Sesiones", val: SMOKE.sessions, color: BLUE_D },
            { label: "Usuarios únicos", val: SMOKE.users, color: BLUE_D },
            { label: "Prompters", val: SMOKE.prompters, color: BLUE_D },
            { label: "Prompts enviados", val: SMOKE.prompts, color: BLUE_D },
            { label: "Avg time", val: SMOKE.avgTime, color: INK },
            { label: "Drop-off <10s", val: SMOKE.dropoff != null ? `${SMOKE.dropoff}%` : null, color: SMOKE.dropoff > 85 ? AMBER : GREEN },
            { label: "Highlights", val: SMOKE.highlighted, color: INK },
            { label: "Copies", val: SMOKE.copied, color: INK },
            { label: "Rage clicks", val: SMOKE.rageclicksCount, color: SMOKE.rageclicksCount === 0 ? GREEN : RED },
            { label: "Tour completion", val: SMOKE.tourCompletion != null ? `${SMOKE.tourCompletion}%` : null, color: INK },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: "center", padding: "14px 10px", background: BG, borderRadius: 8 }}>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: INK3, marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: m.val != null ? m.color : BDR }}>
                {m.val != null ? m.val : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge categories */}
      {(SMOKE.pillTop || SMOKE.pillBot) && (
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
            Knowledge Categories (48h)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SMOKE.pillTop && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: BLUE_D, marginBottom: 3 }}>Most accessed</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: BLUE_D }}>{SMOKE.pillTop.replace(/\s*\(\d+\)$/, '')}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: BLUE_D }}>{SMOKE.pillTop.match(/\((\d+)\)/)?.[1]} interactions</span>
              </div>
            )}
            {SMOKE.pillBot && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: BG, border: `1px solid ${BDR}`, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", color: INK3, marginBottom: 3 }}>Least accessed</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: INK2 }}>{SMOKE.pillBot.replace(/\s*\(\d+\)$/, '')}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: INK3 }}>{SMOKE.pillBot.match(/\((\d+)\)/)?.[1]} interactions</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {SMOKE.notes && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: AMBER, marginBottom: 6 }}>Observación</div>
          <div style={{ fontSize: 12, color: INK2, lineHeight: 1.6 }}>{SMOKE.notes}</div>
        </div>
      )}
    </div>
  );
}

// ── WEEK 1 VIEW ───────────────────────────────────────────
function Week1() {
  const engagement = (WEEK1.highlighted != null && WEEK1.copied != null)
    ? WEEK1.highlighted + WEEK1.copied : null;

  const parse = str => { if (!str) return null; const m = str.match(/^(.+?)\s*\((\d+)\)$/); return m ? { name: m[1].trim(), count: parseInt(m[2]) } : { name: str, count: null }; };
  const top = parse(WEEK1.pillTop);
  const bot = parse(WEEK1.pillBot);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 56px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>
          Post Go-live · Week 1
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>
          {WEEK1_WINDOW}
        </div>
        <div style={{ fontSize: 11, color: INK3 }}>
          Primer pulso post lanzamiento bank-wide · Go-live: {GO_LIVE_DATE} · Fuente: FullStory
        </div>
      </div>

      {/* Penetration */}
      <PenetrationBar users={WEEK1.users} />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 16 }}>
        <MetricCard label="Sessions" value={fmt(WEEK1.sessions)} desc={WEEK1.users ? `${WEEK1.users} unique users` : null} />
        <MetricCard label="Prompters" value={fmt(WEEK1.prompters)} desc="Used the AI assistant" />
        <MetricCard label="Returning Users" value={pct(WEEK1.retention)} desc="Visited more than once" />
        <MetricCard label="Drop-off <10s" value={pct(WEEK1.dropoff)} desc="Left within 10 seconds" invert />
        <MetricCard label="Content Engagement" value={fmt(engagement)} desc={engagement ? `${WEEK1.highlighted} highlights · ${WEEK1.copied} copies` : null} />
      </div>

      {/* Knowledge categories */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
          Knowledge Categories
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[{ data: top, isTop: true, label: "Most accessed" }, { data: bot, isTop: false, label: "Least accessed" }].map(({ data, isTop, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: isTop ? BLUE_L : BG, border: `1px solid ${isTop ? BLUE_M : BDR}`, borderRadius: 8, gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: isTop ? BLUE_D : INK3, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: isTop ? BLUE_D : INK2 }}>
                  {data ? data.name : <span style={{ color: BDR, fontStyle: "italic", fontWeight: 400 }}>pending data</span>}
                </div>
              </div>
              {data?.count != null && (
                <span style={{ fontSize: 12, fontWeight: 500, color: isTop ? BLUE_D : INK3 }}>{data.count} interactions</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
          Observaciones
        </div>
        {WEEK1.observations.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {WEEK1.observations.map((obs, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: BG, borderRadius: 8, borderLeft: `3px solid ${BLUE}` }}>
                <span style={{ fontSize: 11, color: INK2, lineHeight: 1.6 }}>{obs}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: INK3, fontStyle: "italic" }}>
            Sin observaciones aún — se agregarán cuando haya datos.
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("smoke");

  const tabBtn = (label, v, sublabel) => (
    <button onClick={() => setView(v)} style={{
      fontFamily: "inherit", fontSize: 11, fontWeight: 500,
      padding: "6px 14px", border: `1px solid ${view === v ? BLUE : BDR}`,
      borderRadius: 6, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase",
      background: view === v ? BLUE : SURF, color: view === v ? "#fff" : INK3,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
    }}>
      {label}
      {sublabel && <span style={{ fontSize: 8, opacity: 0.8, letterSpacing: "0.06em" }}>{sublabel}</span>}
    </button>
  );

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: BG, minHeight: "100vh", color: INK, fontSize: 13 }}>

      {/* Topbar */}
      <div style={{
        background: SURF, borderBottom: `1px solid ${BDR}`,
        padding: "12px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 10, flexWrap: "wrap",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: BLUE, fontWeight: 500, marginBottom: 2 }}>
            IDB Knowledge Platform
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: INK }}>Post Go-live Key Metrics</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {tabBtn("Smoke Test", "smoke", "0–48h")}
          {tabBtn("Week 1 Pulse", "week1", "executive")}
        </div>
      </div>

      {view === "smoke" ? <SmokeTest /> : <Week1 />}

      <div style={{ textAlign: "center", padding: 18, fontSize: 9, color: INK3, letterSpacing: "0.06em", borderTop: `1px solid ${BDR}` }}>
        IDB Knowledge Platform · Post Go-live Key Metrics · Go-live {GO_LIVE_DATE}
      </div>
    </div>
  );
}

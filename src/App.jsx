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
const WEEK1_WINDOW = "Mar 31 – Apr 10, 2026";
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
  prompts: 34,
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
  sessions: 757,
  users: 360,
  prompters: 125,
  prompts: 230,
  retention: 18.6,
  dropoff: 92,
  highlighted: 416,
  highlightedOpenSearch: 340,
  copied: 75,
  copiedOpenSearch: 52,
  rageclicks: 3,
  pillTop: "Similar projects (45)",
  pillBot: "Institutional documents (14)",
  tourCompletion: 55,
  thumbsUp: 2,
  thumbsDown: 1,
  countries: [
    { name: "United States (HQ)", code: "US", users: 340, pct: 58 },
    { name: "Argentina",          code: "AR", users: 24,  pct: 7  },
    { name: "Brazil",             code: "BR", users: 15,  pct: 4  },
    { name: "Uruguay",            code: "UY", users: 14,  pct: 4  },
    { name: "Peru",               code: "PE", users: 18,  pct: 3  },
    { name: "Colombia",           code: "CO", users: 11,  pct: 3  },
    { name: "Panama",             code: "PA", users: 10,  pct: 3  },
    { name: "Barbados",           code: "BB", users: 5,   pct: 1  },
    { name: "Cayman Islands",     code: "KY", users: 5,   pct: 1  },
    { name: "El Salvador",        code: "SV", users: 5,   pct: 1  },
    { name: "Mexico",             code: "MX", users: 5,   pct: 1  },
    { name: "Paraguay",           code: "PY", users: 5,   pct: 1  },
    { name: "Bolivia",            code: "BO", users: 4,   pct: 1  },
    { name: "Chile",              code: "CL", users: 4,   pct: 1  },
    { name: "Spain",              code: "ES", users: 4,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 4,   pct: 1  },
    { name: "Dominican Republic", code: "DO", users: 3,   pct: 1  },
    { name: "Ecuador",            code: "EC", users: 3,   pct: 1  },
    { name: "Honduras",           code: "HN", users: 3,   pct: 1  },
    { name: "Belize",             code: "BZ", users: 4,   pct: 1  },
    { name: "Nicaragua",          code: "NI", users: 2,   pct: 1  },
    { name: "Bahamas",            code: "BS", users: 1,   pct: 0  },
    { name: "Canada",             code: "CA", users: 1,   pct: 0  },
    { name: "Jamaica",            code: "JM", users: 1,   pct: 0  },
    { name: "Suriname",           code: "SR", users: 1,   pct: 0  },
  ],
  prompts_sample: [
    { text: "can you please summarize the general bank wide benefits?", rating: "down" },
    { text: "dime las lecciones aprendidas que apuntan a problemas de efectividad en el desarrollo en operaciones de la división HNP", rating: "up" },
    { text: "necesito dos proyectos de SCL/MIG", rating: "up" },
  ],
  observations: [
    "Double down on Similar Projects — it is the most accessed category across all periods, organic and post-launch.",
    "The AI assistant is working — 2.7 prompts per user signals real engagement beyond a one-time trial.",
    "Week 1 beat all organic records with 757 sessions and 360 unique users. This establishes a strong baseline for Q2 reporting.",
    "Prompters are your power users — 125 out of 360 unique users (35%) used the AI assistant.",
  ],
};

// ── WEEK 1+2 DATA ─────────────────────────────────────────
const WEEK12 = {
  sessions: 1011,
  users: 439,
  prompters: 166,
  prompts: 392,
  retention: 18.6,
  dropoff: 92,
  highlighted: 497,
  highlightedOpenSearch: 408,
  copied: 88,
  copiedOpenSearch: 61,
  rageclicks: 3,
  pillTop: "Similar projects (51)",
  pillBot: "Institutional documents (15)",
  tourCompletion: 54,
  thumbsUp: 2,
  thumbsDown: 1,
  sourcePanelClicks: 26,
  window: "Mar 31 – Apr 17, 2026",
  countries: [
    { name: "United States (HQ)", code: "US", users: 340, pct: 58 },
    { name: "Argentina",          code: "AR", users: 26,  pct: 6  },
    { name: "Brazil",             code: "BR", users: 20,  pct: 5  },
    { name: "Peru",               code: "PE", users: 18,  pct: 3  },
    { name: "Uruguay",            code: "UY", users: 16,  pct: 4  },
    { name: "Colombia",           code: "CO", users: 12,  pct: 3  },
    { name: "Panama",             code: "PA", users: 10,  pct: 2  },
    { name: "Cayman Islands",     code: "KY", users: 9,   pct: 2  },
    { name: "El Salvador",        code: "SV", users: 7,   pct: 2  },
    { name: "Mexico",             code: "MX", users: 7,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 7,   pct: 1  },
    { name: "Barbados",           code: "BB", users: 5,   pct: 1  },
    { name: "Chile",              code: "CL", users: 5,   pct: 1  },
    { name: "Paraguay",           code: "PY", users: 5,   pct: 1  },
    { name: "Spain",              code: "ES", users: 5,   pct: 1  },
    { name: "Bolivia",            code: "BO", users: 4,   pct: 0  },
    { name: "Honduras",           code: "HN", users: 4,   pct: 0  },
    { name: "Dominican Republic", code: "DO", users: 3,   pct: 0  },
    { name: "Ecuador",            code: "EC", users: 3,   pct: 0  },
    { name: "Jamaica",            code: "JM", users: 3,   pct: 0  },
    { name: "Belize",             code: "BZ", users: 4,   pct: 1  },
    { name: "Canada",             code: "CA", users: 2,   pct: 0  },
    { name: "Guatemala",          code: "GT", users: 2,   pct: 0  },
    { name: "Nicaragua",          code: "NI", users: 2,   pct: 0  },
    { name: "Suriname",           code: "SR", users: 2,   pct: 0  },
    { name: "Bahamas",            code: "BS", users: 1,   pct: 0  },
  ],
  prompts_sample: WEEK1.prompts_sample,
  observations: [
    "1,011 sessions across 2 weeks — platform sustaining strong engagement post bank-wide launch.",
    "439 unique users reached — 12.2% of 3,600 Staff & Consultants in just two weeks.",
    "166 prompters (38% of unique users) — growing share of users going deeper with the AI assistant.",
    "Retention at 18.6% — baseline established for Q2 tracking.",
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

// ── ORGANIC BENCHMARKS (Sep 2025 – Mar 28, 2026 · 15 periods avg) ──
const BENCH = {
  sessions: 280,
  users: 102,
  dropoff: 88,
  highlighted: 204,
  prompters: 48,
  retention: 33,
  tourCompletion: 58,
  pillTop: 25,
  pillBot: 5,
  // Monthly benchmarks (avg of organic biweekly periods Sep 2025–Mar 2026)
  monthly: {
    sessions: 502,
    users: 192,
    prompts: 264,
    prompters: 96,
    highlights: 380,
    copies: 158,
    sourceClicks: 142,
    pillPageviews: 87,
    tourCompletion: 58,
    retention: 32,
    pillTop: 25,
    pillBot: 5,
  },
};

// ── METRIC CARD ───────────────────────────────────────────
function MetricCard({ label, value, desc, invert = false, bench }) {
  const hasValue = value != null;

  // Calculate badge: compare numeric value to bench
  let badge = null;
  if (hasValue && bench != null) {
    const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    if (!isNaN(numVal) && bench > 0) {
      const ratio = numVal / bench;
      const higher = ratio >= 1;
      // For invert metrics (drop-off), higher is worse
      const isGood = invert ? !higher : higher;
      const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
      const label2 = ratio >= 1 ? `↑ ${pctDiff}%` : `↓ ${pctDiff}%`;
      badge = { label: label2, isGood, bench };
    }
  }

  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 9 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: hasValue ? INK : BDR, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>
        {hasValue ? value : "—"}
      </div>
      {!hasValue && <div style={{ fontSize: 10, color: INK3, fontStyle: "italic" }}>pending data</div>}
      {desc && hasValue && <div style={{ fontSize: 10, color: INK3, marginTop: 5, lineHeight: 1.5 }}>{desc}</div>}
      {badge && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99,
            background: badge.isGood ? "#edfaf4" : "#fef0ee",
            color: badge.isGood ? GREEN : RED,
          }}>{badge.label} vs organic avg</span>
          <span style={{ fontSize: 9, color: INK3 }}>({badge.bench})</span>
        </div>
      )}
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


// ── GEOGRAPHIC REACH ─────────────────────────────────────
function GeoMap({ data }) {
  const countries = data.countries;
  const maxUsers = Math.max(...countries.filter(c => c.code !== "US").map(c => c.users));

  const flag = (code) => {
    if (!code) return "🌐";
    return [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");
  };

  const usData = countries.find(c => c.code === "US");
  const regional = countries.filter(c => c.code !== "US");
  const totalUsers = data.users;
  const outsideHQ = totalUsers - (usData?.users || 0);
  const outsidePct = Math.round((outsideHQ / totalUsers) * 100);

  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>
        Geographic Reach — Users by Country
      </div>
      <div style={{ fontSize: 10, color: INK3, marginBottom: 16 }}>
        {totalUsers} users · {countries.length} countries · {data.window}
      </div>

      {/* HQ callout */}
      <div style={{ background: "#1464A0", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{flag("US")}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>United States (HQ)</div>
            <div style={{ fontSize: 10, color: "#a8c4e0" }}>{usData?.users} users</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{usData?.pct}%</div>
          <div style={{ fontSize: 9, color: "#a8c4e0" }}>of total</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 99, height: 8, width: 120, overflow: "hidden" }}>
          <div style={{ width: `${usData?.pct}%`, height: "100%", background: "#fff", borderRadius: 99 }} />
        </div>
      </div>

      {/* Regional bar chart */}
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: INK3, marginBottom: 12 }}>
        Regional breakdown (excl. HQ)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {regional.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0, width: 26, textAlign: "center" }}>{flag(c.code)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                <span style={{ fontSize: 11, color: INK3, flexShrink: 0, marginLeft: 8, fontVariantNumeric: "tabular-nums" }}>{c.users}</span>
              </div>
              <div style={{ background: BG, borderRadius: 99, height: 5, overflow: "hidden" }}>
                <div style={{
                  width: `${(c.users / maxUsers) * 100}%`,
                  height: "100%",
                  background: c.users >= 20 ? "#1464A0" : c.users >= 10 ? "#2c6cb5" : c.users >= 5 ? BLUE : "#7ab3e0",
                  borderRadius: 99,
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginTop: 16, padding: "10px 14px", background: BLUE_L, borderRadius: 8, border: `1px solid ${BLUE_M}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE_D, marginBottom: 2 }}>Total reach</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: BLUE_D }}>{countries.length} countries</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: BLUE_D, marginBottom: 2 }}>Users outside HQ</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: BLUE_D }}>{outsideHQ} users · {outsidePct}%</div>
        </div>
      </div>
    </div>
  );
}

// ── WEEK 1 VIEW ───────────────────────────────────────────
function Week1({ data = WEEK1 }) {
  const engagement = (data.highlighted != null && data.copied != null)
    ? data.highlighted + data.copied : null;

  const parse = str => { if (!str) return null; const m = str.match(/^(.+?)\s*\((\d+)\)$/); return m ? { name: m[1].trim(), count: parseInt(m[2]) } : { name: str, count: null }; };
  const top = parse(data.pillTop);
  const bot = parse(data.pillBot);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 16px 56px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>
          Post Go-live · {data === WEEK1 ? "Week 1" : "Week 1 + 2"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>
          {data.window || WEEK1_WINDOW}
        </div>
        <div style={{ fontSize: 11, color: INK3 }}>
          Primer pulso post lanzamiento bank-wide · Go-live: {GO_LIVE_DATE} · Fuente: FullStory
        </div>
      </div>

      {/* Penetration */}
      <PenetrationBar users={data.users} />

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 16 }}>
        <MetricCard label="Sessions" value={fmt(data.sessions)} desc={data.users ? `${data.users} unique users · one user can have multiple sessions` : null} bench={BENCH.sessions} />
        <MetricCard label="Prompters" value={fmt(data.prompters)} desc={data.prompts ? `${data.prompts} prompts sent · users who engaged with the AI assistant` : null} bench={BENCH.prompters} />
        <MetricCard label="Drop-off <10s" value={pct(data.dropoff)} desc="Sessions ending under 10s · lower is better" invert bench={BENCH.dropoff} />
        {/* Content Engagement custom card */}
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 9 }}>Content Engagement</div>
          <div style={{ fontSize: 30, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>{fmt(engagement)}</div>
          {engagement != null && (
            <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "#edfaf4", color: GREEN }}>
                ↑ {Math.round(((engagement / (BENCH.highlighted)) - 1) * 100)}% vs organic avg
              </span>
              <span style={{ fontSize: 9, color: INK3 }}>({BENCH.highlighted} avg highlights)</span>
            </div>
          )}

          {/* Highlights bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: INK2, fontWeight: 500 }}>Highlights</span>
              <span style={{ fontSize: 10, color: INK3 }}>{data.highlighted} total</span>
            </div>
            <div style={{ background: BG, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 3 }}>
              <div style={{ width: "100%", height: "100%", background: "#c2d9f7", borderRadius: 99, position: "relative" }}>
                <div style={{ width: `${(data.highlightedOpenSearch / data.highlighted) * 100}%`, height: "100%", background: BLUE, borderRadius: 99 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 9, color: INK3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: BLUE }} />
                Open Search: {data.highlightedOpenSearch}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#c2d9f7" }} />
                Contextual Search: {data.highlighted - data.highlightedOpenSearch}
              </span>
            </div>
          </div>

          {/* Copies bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: INK2, fontWeight: 500 }}>Copies</span>
              <span style={{ fontSize: 10, color: INK3 }}>{data.copied} total</span>
            </div>
            <div style={{ background: BG, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 3 }}>
              <div style={{ width: "100%", height: "100%", background: "#fde68a", borderRadius: 99, position: "relative" }}>
                <div style={{ width: `${(data.copiedOpenSearch / data.copied) * 100}%`, height: "100%", background: "#d97706", borderRadius: 99 }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 9, color: INK3 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#d97706" }} />
                Open Search: {data.copiedOpenSearch}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#fde68a" }} />
                Contextual Search: {data.copied - data.copiedOpenSearch}
              </span>
            </div>
          </div>
        </div>
        <MetricCard label="Tour Completion" value={pct(data.tourCompletion)} desc="Users who finished the onboarding tour" bench={BENCH.tourCompletion} />
        <MetricCard label="Retention Rate" value={data.retention != null ? `${data.retention}%` : null} desc="Users who returned after their first visit · biweekly" bench={BENCH.retention} />
        {data.sourcePanelClicks != null && (
          <MetricCard label="Source panel clicks" value={fmt(data.sourcePanelClicks)} desc="Clicks on source panel in Knowledge Assistant" />
        )}
        {(data.thumbsUp != null || data.thumbsDown != null) && (
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 9 }}>Response Feedback</div>
            <div style={{ display: "flex", gap: 20, marginBottom: 7 }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, lineHeight: 1 }}>👍 {data.thumbsUp ?? "—"}</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: RED, lineHeight: 1 }}>👎 {data.thumbsDown ?? "—"}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: INK3, marginBottom: 8 }}>AI assistant responses rated</div>
            <div style={{ padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, fontSize: 9, color: "#92400e", lineHeight: 1.5 }}>
              ⚠ Volume is still low to derive conclusions. This indicator will become meaningful from the second period onward.
            </div>
          </div>
        )}
      </div>

      {/* Sample Prompts */}
      {data.prompts_sample?.length > 0 && (
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
            Sample Prompts — Response Feedback
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.prompts_sample.map((p, i) => {
              const icon = p.rating === "up" ? "👍" : p.rating === "down" ? "👎" : "👍👎";
              const bg = p.rating === "up" ? "#edfaf4" : p.rating === "down" ? "#fef0ee" : "#fffbeb";
              const border = p.rating === "up" ? "#a7f3d0" : p.rating === "down" ? "#fca5a5" : "#fde68a";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 11, color: INK2, lineHeight: 1.5, fontStyle: "italic" }}>"{p.text}"</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geographic map */}
      <GeoMap data={data} />

      {/* Knowledge categories */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
          Knowledge Categories
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[{ item: top, isTop: true, label: "Most accessed", bench: BENCH.pillTop }, { item: bot, isTop: false, label: "Least accessed", bench: BENCH.pillBot }].map(({ item, isTop, label, bench }) => {
            const benchBadge = item?.count != null ? (() => {
              const ratio = item.count / bench;
              const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
              const higher = ratio >= 1;
              return { label: higher ? `↑ ${pctDiff}%` : `↓ ${pctDiff}%`, isGood: higher };
            })() : null;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: isTop ? BLUE_L : BG, border: `1px solid ${isTop ? BLUE_M : BDR}`, borderRadius: 8, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: isTop ? BLUE_D : INK3, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isTop ? BLUE_D : INK2 }}>
                    {item ? item.name : <span style={{ color: BDR, fontStyle: "italic", fontWeight: 400 }}>pending data</span>}
                  </div>
                  {benchBadge && (
                    <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: benchBadge.isGood ? "#edfaf4" : "#fef0ee", color: benchBadge.isGood ? GREEN : RED }}>
                        {benchBadge.label} vs organic avg
                      </span>
                      <span style={{ fontSize: 9, color: INK3 }}>({bench} avg)</span>
                    </div>
                  )}
                </div>
                {item?.count != null && (
                  <span style={{ fontSize: 12, fontWeight: 500, color: isTop ? BLUE_D : INK3 }}>{item.count} interactions</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function EngagementCard({ highlighted, highlightedOpenSearch, copied, copiedOpenSearch, benchHighlights, benchCopies }) {
  const total = highlighted + copied;
  const hlContextual = highlighted - highlightedOpenSearch;
  const cpContextual = copied - copiedOpenSearch;

  const BadgeComp = ({ val, bench, label }) => {
    if (!val || !bench) return null;
    const ratio = val / bench;
    const pct = Math.round(Math.abs(ratio - 1) * 100);
    const up = ratio >= 1;
    return (
      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: up ? "#edfaf4" : "#fef0ee", color: up ? GREEN : RED }}>
        {up ? "↑" : "↓"} {pct}% vs avg
      </span>
    );
  };

  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 9 }}>Content Engagement</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 14 }}>{total}</div>

      {/* Highlights bar */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: INK2, fontWeight: 500 }}>Highlights</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BadgeComp val={highlighted} bench={benchHighlights} />
            <span style={{ fontSize: 10, color: INK3 }}>{highlighted} total</span>
          </div>
        </div>
        <div style={{ background: BG, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 3 }}>
          <div style={{ width: "100%", height: "100%", background: "#c2d9f7", borderRadius: 99, position: "relative" }}>
            <div style={{ width: `${(highlightedOpenSearch / highlighted) * 100}%`, height: "100%", background: BLUE, borderRadius: 99 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 9, color: INK3 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: BLUE }} />
            Open Search: {highlightedOpenSearch}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#c2d9f7" }} />
            Contextual Search: {hlContextual}
          </span>
        </div>
      </div>

      {/* Copies bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: INK2, fontWeight: 500 }}>Copies</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <BadgeComp val={copied} bench={benchCopies} />
            <span style={{ fontSize: 10, color: INK3 }}>{copied} total</span>
          </div>
        </div>
        <div style={{ background: BG, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 3 }}>
          <div style={{ width: "100%", height: "100%", background: "#fde68a", borderRadius: 99, position: "relative" }}>
            <div style={{ width: `${(copiedOpenSearch / copied) * 100}%`, height: "100%", background: "#d97706", borderRadius: 99 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 9, color: INK3 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#d97706" }} />
            Open Search: {copiedOpenSearch}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "#fde68a" }} />
            Contextual Search: {cpContextual}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── MONTHLY REPORT ────────────────────────────────────────
// April 2026 data (partial — through Apr 21)
const APRIL = {
  sessions: 1632,
  users: 588,
  prompters: 226,
  prompts: 429,
  avgTime: "16.31s",
  dropoff: 92,
  retention: 10.9,
  returningUsers: 228,
  highlighted: 579,
  highlightedOpenSearch: 393,
  copied: 167,
  copiedOpenSearch: 101,
  sourceClicks: 52,
  pillPageviews: 255,
  pillTop: "Similar projects (78)",
  pillBot: "Institutional documents (20)",
  openSearchVisits: 663,
  tourCompletion: 55,
  newUsers: 531,
  thumbsUp: 1,
  thumbsDown: 3,
  topCountry: "Argentina",
  topCountryCode: "AR",
  totalCountries: 34,
  countries: [
    { name: "United States (HQ)", code: "US", users: 341, pct: 58 },
    { name: "Brazil",             code: "BR", users: 37,  pct: 6  },
    { name: "Argentina",          code: "AR", users: 28,  pct: 5  },
    { name: "Colombia",           code: "CO", users: 24,  pct: 4  },
    { name: "Panama",             code: "PA", users: 19,  pct: 3  },
    { name: "Peru",               code: "PE", users: 18,  pct: 3  },
    { name: "Uruguay",            code: "UY", users: 18,  pct: 3  },
    { name: "Paraguay",           code: "PY", users: 15,  pct: 3  },
    { name: "El Salvador",        code: "SV", users: 11,  pct: 2  },
    { name: "Cayman Islands",     code: "KY", users: 10,  pct: 2  },
    { name: "Ecuador",            code: "EC", users: 8,   pct: 1  },
    { name: "Honduras",           code: "HN", users: 8,   pct: 1  },
    { name: "Chile",              code: "CL", users: 7,   pct: 1  },
    { name: "Guatemala",          code: "GT", users: 7,   pct: 1  },
    { name: "Mexico",             code: "MX", users: 7,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 7,   pct: 1  },
    { name: "Barbados",           code: "BB", users: 6,   pct: 1  },
    { name: "Bolivia",            code: "BO", users: 6,   pct: 1  },
    { name: "Spain",              code: "ES", users: 6,   pct: 1  },
    { name: "Costa Rica",         code: "CR", users: 5,   pct: 1  },
    { name: "Jamaica",            code: "JM", users: 5,   pct: 1  },
    { name: "Belize",             code: "BZ", users: 4,   pct: 1  },
    { name: "Bahamas",            code: "BS", users: 3,   pct: 1  },
    { name: "Canada",             code: "CA", users: 3,   pct: 1  },
    { name: "Dominican Republic", code: "DO", users: 3,   pct: 1  },
    { name: "Nicaragua",          code: "NI", users: 3,   pct: 1  },
    { name: "Suriname",           code: "SR", users: 3,   pct: 1  },
    { name: "Guyana",             code: "GY", users: 1,   pct: 0  },
    { name: "Haiti",              code: "HT", users: 1,   pct: 0  },
    { name: "Switzerland",        code: "CH", users: 1,   pct: 0  },
  ],
  promptGalleryClicks: 42,
  recentSearchClicks: 21,
  newSearchClicks: 4,
  lwa: {
    visits: 154,
    uniqueUsers: 60,
    usersCreated: 5,
    lessonsStartedTotal: 56,
    lessonsStartedExecution: 40,
    lessonsStartedPCR: 16,
    edited: 11,
    completed: 11,
    avgTime: "23m 40s",
    copiesButton: 4,
    copiesCursor: 9,
    copiesCombined: 13,
    pctReviewed: 100,
  },
};

function Monthly() {
  const MONTH = "April 2026";

  const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";

  // ── reusable card ──
  const MCard = ({ label, value, desc, accent, small, flagCode, bench }) => {
    let badge = null;
    if (value && value !== "—" && bench != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && bench > 0) {
        const ratio = numVal / bench;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        const higher = ratio >= 1;
        badge = { label: higher ? `↑ ${pctDiff}%` : `↓ ${pctDiff}%`, isGood: higher };
      }
    }
    return (
    <div style={{ background: accent ? BLUE_L : SURF, border: `1px solid ${accent ? BLUE_M : BDR}`, borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: accent ? BLUE_D : INK3, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, overflow: "hidden" }}>
        {flagCode && <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{flag(flagCode)}</span>}
        <div style={{
          fontSize: flagCode ? 14 : small ? 16 : 28,
          fontWeight: 500,
          letterSpacing: flagCode || small ? "-0.01em" : "-0.03em",
          lineHeight: 1.2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: value && value !== "—" ? (accent ? BLUE_D : INK) : BDR
        }}>{value || "—"}</div>
      </div>
      {desc && <div style={{ fontSize: 9, color: accent ? BLUE : INK3, lineHeight: 1.4, marginBottom: badge ? 6 : 0 }}>{desc}</div>}
      {badge && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: badge.isGood ? "#edfaf4" : "#fef0ee", color: badge.isGood ? GREEN : RED }}>
            {badge.label} vs monthly avg
          </span>
          <span style={{ fontSize: 9, color: INK3 }}>({bench})</span>
        </div>
      )}
    </div>
  );
  };

  // ── section wrapper ──
  const Section = ({ title, emoji, children }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
        {emoji} {title}
      </div>
      {children}
    </div>
  );

  const Grid = ({ cols = "repeat(auto-fit, minmax(160px, 1fr))", children }) => (
    <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10 }}>{children}</div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px 56px" }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Monthly Report</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{MONTH}</div>
          <div style={{ fontSize: 11, color: INK3 }}>IDB Knowledge Platform · Source: FullStory</div>
        </div>
        <button
          onClick={() => {
            const rows = [
              ["Metric", "Value"],
              ["Month", MONTH],
              ["Sessions", APRIL.sessions],
              ["Users reached", APRIL.users],
              ["New users", APRIL.newUsers],
              ["Prompters", APRIL.prompters],
              ["Prompts sent", APRIL.prompts],
              ["Highlights total", APRIL.highlighted],
              ["Highlights Open Search", APRIL.highlightedOpenSearch],
              ["Highlights Contextual Search", APRIL.highlighted - APRIL.highlightedOpenSearch],
              ["Copies total", APRIL.copied],
              ["Copies Open Search", APRIL.copiedOpenSearch],
              ["Copies Contextual Search", APRIL.copied - APRIL.copiedOpenSearch],
              ["Source panel clicks", APRIL.sourceClicks],
              ["Pill pageviews", APRIL.pillPageviews],
              ["Most used pill", APRIL.pillTop],
              ["Least used pill", APRIL.pillBot],
              ["Open Search visits", APRIL.openSearchVisits],
              ["Tour completion %", APRIL.tourCompletion + "%"],
              ["Retention %", APRIL.retention != null ? APRIL.retention + "%" : ""],
              ["CSAT", "75%"],
              ["Thumbs up", APRIL.thumbsUp],
              ["Thumbs down", APRIL.thumbsDown],
              ["Prompt Gallery clicks", APRIL.promptGalleryClicks],
              ["Recent Search clicks", APRIL.recentSearchClicks],
              ["New Search clicks", APRIL.newSearchClicks],
              ["LWA visits", APRIL.lwa.visits],
              ["LWA unique users", APRIL.lwa.uniqueUsers],
              ["LWA users who created lessons", APRIL.lwa.usersCreated],
              ["LWA lessons started total", APRIL.lwa.lessonsStartedTotal],
              ["LWA lessons started Execution", APRIL.lwa.lessonsStartedExecution],
              ["LWA lessons started PCR", APRIL.lwa.lessonsStartedPCR],
              ["LWA lessons completed", APRIL.lwa.completed],
              ["LWA lessons edited", APRIL.lwa.edited],
              ["LWA avg time to save", APRIL.lwa.avgTime],
              ["LWA copies combined", APRIL.lwa.copiesCombined],
              ["LWA copies via button", APRIL.lwa.copiesButton],
              ["LWA copies via cursor", APRIL.lwa.copiesCursor],
              ["LWA % reviewed before completing", APRIL.lwa.pctReviewed + "%"],
            ];
            const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `KP_Monthly_${MONTH.replace(/ /g, "_")}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: 6, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Cumulative metrics since Sep 2025 */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 14 }}>
          Cumulative totals — Sep 1, 2025 to Apr 30, 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { label: "Sessions", value: "5,999" },
            { label: "Users reached", value: "1,357" },
            { label: "Prompters", value: "587" },
            { label: "Prompts sent", value: "2,555" },
            { label: "Penetration", value: "37.7%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Section emoji="📊" title="General Usability">
        <Grid>
          {/* Penetration — custom card with bar */}
          <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: BLUE_D, marginBottom: 10 }}>12.5%</div>
            <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: "12.5%", height: "100%", background: BLUE_D, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between" }}>
              <span>{APRIL.users} users</span><span>3,600 total</span>
            </div>
          </div>
          <MCard label="Users reached" value={String(APRIL.users)} desc="Total for the period" accent bench={BENCH.monthly.users} />
          <MCard label="New users" value={String(APRIL.newUsers)} desc="First-time visitors" />
          <MCard label="Sessions" value={APRIL.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} />
          <MCard label="% Onboarding completed" value={`${APRIL.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{APRIL.returningUsers}</div>
            <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Users with more than one session within the month</div>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(APRIL.returningUsers/APRIL.users*100)}% of users reached</span>
          </div>
          <MCard label="CSAT — Customer Satisfaction Score" value="75%" desc="out of 5 responses" />
        </Grid>

      </Section>

      {/* Compact geo */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px", marginTop: 10 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
          🌎 Geographic Reach — {APRIL.users.toLocaleString()} users · {APRIL.totalCountries} countries
        </div>
        {/* HQ bar — full width */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: BLUE_L, borderRadius: 8 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🇺🇸</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: BLUE_D }}>United States (HQ)</span>
              <span style={{ fontSize: 11, color: BLUE_D, fontWeight: 500 }}>340 · 58%</span>
            </div>
            <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ width: "58%", height: "100%", background: "#1464A0", borderRadius: 99 }} />
            </div>
          </div>
        </div>
        {/* All regional countries — 3 columns */}
        {(() => {
          const regional = APRIL.countries.filter(c => c.code !== "US");
          const maxUsers = regional[0].users;
          const flag = (code) => [...code.toUpperCase()].map(ch => String.fromCodePoint(ch.charCodeAt(0) + 127397)).join("");
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
              {regional.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{flag(c.code)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 9, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                      <span style={{ fontSize: 9, color: INK3, flexShrink: 0, marginLeft: 4, fontVariantNumeric: "tabular-nums" }}>{c.users}</span>
                    </div>
                    <div style={{ background: BG, borderRadius: 99, height: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(c.users / maxUsers) * 100}%`, height: "100%",
                        background: c.users >= 100 ? "#1464A0" : c.users >= 40 ? "#2c6cb5" : c.users >= 15 ? BLUE : "#7ab3e0",
                        borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country.
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      <Section emoji="🔍" title="Contextual Search">
        <Grid cols="repeat(auto-fit, minmax(200px, 1fr))">
          <MCard label="Queries (pill views)" value={String(APRIL.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
          <MCard label="Most used pill — Similar projects" value="56" desc="interactions" small bench={BENCH.monthly.pillTop} />
          <MCard label={<>Least used pill —<br/>Institutional docs</>} value="20" desc="interactions" small bench={BENCH.monthly.pillBot} />
        </Grid>
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      <Section emoji="🤖" title="Knowledge Assistant (Open Search)">
        <Grid>
          <MCard label="Sessions (Open Search)" value={String(APRIL.openSearchVisits)} desc="Visits to the Knowledge Assistant" bench={BENCH.monthly.sessions} />
          <MCard label="Prompters (≥1 prompt)" value={String(APRIL.prompters)} desc={`${Math.round(APRIL.prompters/APRIL.users*100)}% of users reached`} accent bench={BENCH.monthly.prompters} />
          <MCard label="Prompts sent" value={String(APRIL.prompts)} desc="Median: 1 per prompter" accent bench={BENCH.monthly.prompts} />
          <MCard label="Source panel clicks" value={String(APRIL.sourceClicks)} desc="Clicks on source panel" />
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Response Feedback</div>
            <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}>👍 {APRIL.thumbsUp}</div>
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 500, color: RED, letterSpacing: "-0.03em", lineHeight: 1 }}>👎 {APRIL.thumbsDown}</div>
              </div>
            </div>
            <div style={{ fontSize: 9, color: INK3, marginTop: 8 }}>AI responses rated by users</div>
          </div>
          <MCard label="Prompt Gallery clicks" value={String(APRIL.promptGalleryClicks)} />
          <MCard label="Recent Search clicks" value={String(APRIL.recentSearchClicks)} />
          <MCard label="New Search clicks" value={String(APRIL.newSearchClicks)} />
        </Grid>
        <div style={{ marginTop: 10 }}>
          <EngagementCard
            highlighted={APRIL.highlighted}
            highlightedOpenSearch={APRIL.highlightedOpenSearch}
            copied={APRIL.copied}
            copiedOpenSearch={APRIL.copiedOpenSearch}
            benchHighlights={BENCH.monthly.highlights}
            benchCopies={BENCH.monthly.copies}
          />
        </div>
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      {/* ── LWA ── */}
      <Section emoji="📝" title="Lessons Writing Assistant (LWA)">

        {/* Context block */}
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 8, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 6 }}>Context — Q1 2026 Institutional baseline</div>
          <p style={{ fontSize: 11, color: BLUE_D, lineHeight: 1.6, margin: 0 }}>
            During Q1 2026, <strong>784 lessons</strong> were created across <strong>452 operations</strong> registered in the Client Portal — independent of the KP platform. This provides important context: LWA usage within KP represents an emerging channel alongside existing institutional lesson-creation practices.
          </p>
        </div>
        <Grid cols="repeat(auto-fit, minmax(150px, 1fr))">
          <MCard label="LWA visits" value={String(APRIL.lwa.visits)} accent />
          <MCard label="Unique users" value={String(APRIL.lwa.uniqueUsers)} accent />
        </Grid>

        <div style={{ fontSize: 9, color: INK3, marginBottom: 10, marginTop: 16, fontStyle: "italic" }}>Usage & Completion</div>
        <Grid cols="repeat(auto-fit, minmax(150px, 1fr))">
          <MCard label="Users who created lessons" value={String(APRIL.lwa.usersCreated)} />
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Lessons started</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{APRIL.lwa.lessonsStartedTotal}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{APRIL.lwa.lessonsStartedExecution} Execution</span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{APRIL.lwa.lessonsStartedPCR} PCR</span>
            </div>
          </div>
          <MCard label="Lessons completed" value={String(APRIL.lwa.completed)} desc="Clicked 'Complete lesson'" accent />
          <MCard label="% Reviewed before completing" value={`${APRIL.lwa.pctReviewed}%`} desc="Quality: with prior edits" />
        </Grid>

        <div style={{ fontSize: 9, color: INK3, marginBottom: 10, marginTop: 16, fontStyle: "italic" }}>Effort & Perceived value</div>
        <Grid cols="repeat(auto-fit, minmax(160px, 1fr))">
          <MCard label="Avg. time to save" value={APRIL.lwa.avgTime} small desc="From first click to final save" />
          <MCard label="Lessons edited" value={String(APRIL.lwa.edited)} desc="In unique sessions" />
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Combined copies</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{APRIL.lwa.copiesCombined}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{APRIL.lwa.copiesButton} via button</span>
              <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{APRIL.lwa.copiesCursor} via cursor</span>
            </div>
          </div>
        </Grid>
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      {/* Signal */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Prompt engagement
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Most prompters sent a single prompt in April (median: 1). A smaller group is developing recurring use. Watch the share of repeat prompters as the key stickiness indicator in coming months.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — LWA quality
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          100% of lessons were reviewed before completion in April — up from 3% in March. Average time to save dropped to 23m 40s, suggesting users are getting more efficient with the tool while maintaining quality.
        </p>
      </div>

    </div>
  );
}

// ── MAY 2026 DATA ─────────────────────────────────────────
// Partial — May 31, 2026
const MAY = {
  sessions: 1052,
  users: 363,
  first_time: 268,
  prompters: 160,
  prompts: 625,
  avgTime: "20.2s",
  dropoff: 87,
  retention: 16,
  returningUsers: 131,
  highlighted: 463,
  highlightedOpenSearch: 217,
  copied: 191,
  copiedOpenSearch: 99,
  sourceClicks: 50,
  pillPageviews: 130,
  pillTop: "Similar Projects (40)",
  pillBot: "Literature (10)",
  openSearchVisits: 144,
  tourCompletion: 52,
  csat: "82.4%",
  thumbsUp: 1,
  thumbsDown: 2,
  promptGalleryClicks: 17,
  recentSearchClicks: 10,
  newSearchClicks: 17,
  totalCountries: 27,
  lwa: {
    visits: 98,
    uniqueUsers: 37,
    usersCreated: 8,
    lessonsStartedTotal: 44,
    lessonsStartedExecution: 36,
    lessonsStartedPCR: 8,
    edited: 4,
    completed: 17,
    avgTime: "4m 55s",
    copiesButton: 1,
    copiesCursor: 11,
    copiesCombined: 12,
    pctReviewed: 24,
  },
  countries: [
    { name: "United States (HQ)", code: "US", users: 194, pct: 53 },
    { name: "Colombia",           code: "CO", users: 35,  pct: 10 },
    { name: "Brazil",             code: "BR", users: 20,  pct: 6  },
    { name: "Argentina",          code: "AR", users: 15,  pct: 4  },
    { name: "Panama",             code: "PA", users: 12,  pct: 3  },
    { name: "Peru",               code: "PE", users: 11,  pct: 3  },
    { name: "Costa Rica",         code: "CR", users: 9,   pct: 2  },
    { name: "El Salvador",        code: "SV", users: 9,   pct: 2  },
    { name: "Paraguay",           code: "PY", users: 9,   pct: 2  },
    { name: "Nicaragua",          code: "NI", users: 7,   pct: 2  },
    { name: "Barbados",           code: "BB", users: 6,   pct: 2  },
    { name: "Uruguay",            code: "UY", users: 6,   pct: 2  },
    { name: "Bolivia",            code: "BO", users: 4,   pct: 1  },
    { name: "Cayman Islands",     code: "KY", users: 4,   pct: 1  },
    { name: "Ecuador",            code: "EC", users: 4,   pct: 1  },
    { name: "Mexico",             code: "MX", users: 4,   pct: 1  },
    { name: "Belize",             code: "BZ", users: 3,   pct: 1  },
    { name: "Chile",              code: "CL", users: 3,   pct: 1  },
    { name: "Guatemala",          code: "GT", users: 3,   pct: 1  },
    { name: "Spain",              code: "ES", users: 3,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 3,   pct: 1  },
    { name: "Bahamas",            code: "BS", users: 2,   pct: 1  },
    { name: "Dominican Republic", code: "DO", users: 2,   pct: 1  },
    { name: "Honduras",           code: "HN", users: 2,   pct: 1  },
    { name: "Guyana",             code: "GY", users: 1,   pct: 0  },
    { name: "Haiti",              code: "HT", users: 1,   pct: 0  },
    { name: "Jamaica",            code: "JM", users: 1,   pct: 0  },
  ],
};

// ── MAY MONTHLY VIEW ──────────────────────────────────────
function MayMonthly() {
  const MONTH = "May 2026";

  const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";

  const MCard = ({ label, value, desc, accent, small, bench, momentum }) => {
    let badge = null;
    if (value && value !== "—" && bench != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && bench > 0) {
        const ratio = numVal / bench;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        const higher = ratio >= 1;
        badge = { label: higher ? `↑ ${pctDiff}%` : `↓ ${pctDiff}%`, isGood: higher };
      }
    }
    let momentumBadge = null;
    if (value && value !== "—" && momentum != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && momentum > 0) {
        const ratio = numVal / momentum;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        const higher = ratio >= 1;
        momentumBadge = { label: higher ? `↑${pctDiff}%` : `↓${pctDiff}%` };
      }
    }
    return (
      <div style={{ background: accent ? BLUE_L : SURF, border: `1px solid ${accent ? BLUE_M : BDR}`, borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: accent ? BLUE_D : INK3, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: small ? 16 : 28, fontWeight: 500, letterSpacing: small ? "-0.01em" : "-0.03em", lineHeight: 1.2, color: value && value !== "—" ? (accent ? BLUE_D : INK) : BDR }}>{value || "—"}</div>
        {desc && <div style={{ fontSize: 9, color: accent ? BLUE : INK3, lineHeight: 1.4, marginTop: 6, marginBottom: (badge || momentumBadge) ? 6 : 0 }}>{desc}</div>}
        {badge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: badge.isGood ? "#edfaf4" : "#fef0ee", color: badge.isGood ? GREEN : RED }}>
              {badge.label} vs monthly avg
            </span>
            <span style={{ fontSize: 9, color: INK3 }}>({bench})</span>
            {momentumBadge && <span style={{ fontSize: 9, color: INK3 }}>· {momentumBadge.label} vs last month</span>}
          </div>
        )}
        {!badge && momentumBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs last month
            </span>
          </div>
        )}
      </div>
    );
  };

  const regional = MAY.countries.filter(c => c.code !== "US");
  const usData = MAY.countries.find(c => c.code === "US");
  const maxUsers = regional[0].users;
  const outsideHQ = MAY.users - usData.users;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Monthly Report</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{MONTH}</div>
          <div style={{ fontSize: 11, color: INK3 }}>IDB Knowledge Platform · Source: FullStory</div>
        </div>
        <button
          onClick={() => {
            const rows = [
              ["Metric", "Value"],
              ["Month", MONTH],
              ["Sessions", MAY.sessions],
              ["Users reached", MAY.users],
              ["New users", MAY.first_time],
              ["Prompters", MAY.prompters],
              ["Prompts sent", MAY.prompts ?? ""],
              ["Highlights total", MAY.highlighted],
              ["Highlights Open Search", MAY.highlightedOpenSearch],
              ["Highlights Contextual Search", MAY.highlighted - MAY.highlightedOpenSearch],
              ["Copies total", MAY.copied],
              ["Copies Open Search", MAY.copiedOpenSearch],
              ["Copies Contextual Search", MAY.copied - MAY.copiedOpenSearch],
              ["Source panel clicks", MAY.sourceClicks],
              ["Pill pageviews", MAY.pillPageviews],
              ["Most used pill", MAY.pillTop],
              ["Least used pill", MAY.pillBot],
              ["Open Search visits", MAY.openSearchVisits],
              ["Tour completion %", MAY.tourCompletion + "%"],
              ["Retention %", MAY.retention != null ? MAY.retention + "%" : ""],
              ["Thumbs up", MAY.thumbsUp],
              ["Thumbs down", MAY.thumbsDown],
              ["Prompt Gallery clicks", MAY.promptGalleryClicks],
              ["Recent Search clicks", MAY.recentSearchClicks],
              ["New Search clicks", MAY.newSearchClicks],
              ["LWA visits", MAY.lwa.visits],
              ["LWA unique users", MAY.lwa.uniqueUsers],
              ["LWA users who created lessons", MAY.lwa.usersCreated],
              ["LWA lessons started total", MAY.lwa.lessonsStartedTotal],
              ["LWA lessons started Execution", MAY.lwa.lessonsStartedExecution],
              ["LWA lessons started PCR", MAY.lwa.lessonsStartedPCR],
              ["LWA lessons completed", MAY.lwa.completed],
              ["LWA lessons edited", MAY.lwa.edited],
              ["LWA avg time to save", MAY.lwa.avgTime],
              ["LWA copies combined", MAY.lwa.copiesCombined],
              ["LWA copies via button", MAY.lwa.copiesButton],
              ["LWA copies via cursor", MAY.lwa.copiesCursor],
              ["LWA % reviewed before completing", MAY.lwa.pctReviewed + "%"],
            ];
            const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `KP_Monthly_May_2026.csv`; a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: 6, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}
        >↓ Export CSV</button>
      </div>

      {/* Cumulative totals */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 14 }}>
          Cumulative totals — Sep 1, 2025 to Jun 1, 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { label: "Sessions", value: "7,202" },
            { label: "Users reached", value: "1,574" },
            { label: "Prompters", value: "673" },
            { label: "Prompts sent", value: "3,199" },
            { label: "Penetration", value: "43.7%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(MAY.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(MAY.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between" }}>
            <span>{MAY.users} users</span><span>3,600 total</span>
          </div>
        </div>
        <MCard label="Users reached" value={String(MAY.users)} desc="Total for the period" accent bench={BENCH.monthly.users} momentum={APRIL.users} />
        <MCard label="New users" value={String(MAY.first_time)} desc="First-time visitors" />
        <MCard label="Sessions" value={MAY.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} momentum={APRIL.sessions} />
        <MCard label="% Onboarding completed" value={`${MAY.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{MAY.returningUsers}</div>
          <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Users with more than one session within the month</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(MAY.returningUsers/MAY.users*100)}% of users reached</span>
        </div>
      </div>

      {/* CSAT block */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 6 }}>CSAT — Customer Satisfaction Score</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>76.5%</div>
            <div style={{ fontSize: 10, color: INK3, marginTop: 4 }}>17 responses · May 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "8px 12px", background: "#edfaf4", border: "1px solid #a7f3d0", borderRadius: 7, fontSize: 10, color: "#065f46" }}>
            👍 <strong>Most valued:</strong> "Found quickly · Content clear · Simple and smooth · Useful for work" — most repeated combo on 5★ responses
          </div>
          <div style={{ padding: "8px 12px", background: "#fef0ee", border: "1px solid #fca5a5", borderRadius: 7, fontSize: 10, color: "#7f1d1d" }}>
            👎 <strong>Least valued:</strong> "Didn't find what I needed" · "Experience felt slow" · "I cannot search" — points to <strong>search relevance/discoverability</strong>, not technical errors
          </div>
        </div>
      </div>

      {/* Geo */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
          🌎 Geographic Reach — {MAY.users.toLocaleString()} users · {MAY.totalCountries} countries
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: BLUE_L, borderRadius: 8 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🇺🇸</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: BLUE_D }}>United States (HQ)</span>
              <span style={{ fontSize: 11, color: BLUE_D, fontWeight: 500 }}>{usData.users} · {usData.pct}%</span>
            </div>
            <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${usData.pct}%`, height: "100%", background: "#1464A0", borderRadius: 99 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
          {regional.map((c, i) => {
            const aprUsers = { CO: 24 }[c.code];
            const diff = aprUsers != null ? c.users - aprUsers : null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{flag(c.code)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {diff != null && (
                        <span style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 99, background: diff >= 0 ? "#edfaf4" : "#fef0ee", color: diff >= 0 ? GREEN : RED }}>
                          {diff >= 0 ? "+" : ""}{diff}
                        </span>
                      )}
                      <span style={{ fontSize: 9, color: INK3, marginLeft: 4 }}>{c.users}</span>
                    </span>
                  </div>
                  <div style={{ background: BG, borderRadius: 99, height: 3, overflow: "hidden" }}>
                    <div style={{ width: `${(c.users / maxUsers) * 100}%`, height: "100%", background: c.users >= 15 ? "#1464A0" : c.users >= 8 ? BLUE : "#7ab3e0", borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country. Green badge shows change vs April for Colombia — country roadshow held in May.
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(MAY.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
        <MCard label="Most used pill — Similar Projects" value="40" desc="interactions" small bench={BENCH.monthly.pillTop} />
        <MCard label={<>Least used pill —<br/>Literature</>} value="10" desc="interactions" small bench={BENCH.monthly.pillBot} />
      </div>
      <EngagementCard
        highlighted={MAY.highlighted}
        highlightedOpenSearch={MAY.highlightedOpenSearch}
        copied={MAY.copied}
        copiedOpenSearch={MAY.copiedOpenSearch}
        benchHighlights={BENCH.monthly.highlights}
        benchCopies={BENCH.monthly.copies}
      />

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant (Open Search)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Sessions (Open Search)" value={String(MAY.openSearchVisits)} desc="Visits to the Knowledge Assistant" momentum={APRIL.openSearchVisits} />
        <MCard label="Prompters (≥1 prompt)" value={String(MAY.prompters)} desc={`${Math.round(MAY.prompters/MAY.users*100)}% of users reached`} accent momentum={APRIL.prompters} />
        <MCard label="Prompts sent" value={MAY.prompts != null ? String(MAY.prompts) : null} desc="Median: 1 per prompter" accent momentum={MAY.prompts ? APRIL.prompts : null} />
        <MCard label="Source panel clicks" value={String(MAY.sourceClicks)} desc="Clicks on source panel" momentum={APRIL.sourceClicks} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Response Feedback</div>
          <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}>👍 {MAY.thumbsUp}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: RED, letterSpacing: "-0.03em", lineHeight: 1 }}>👎 {MAY.thumbsDown}</div>
          </div>
          <div style={{ fontSize: 9, color: INK3, marginTop: 8 }}>AI responses rated by users</div>
        </div>
        <MCard label="Prompt Gallery clicks" value={String(MAY.promptGalleryClicks)} momentum={APRIL.promptGalleryClicks} />
        <MCard label="Recent Search clicks" value={String(MAY.recentSearchClicks)} momentum={APRIL.recentSearchClicks} />
        <MCard label="New Search clicks" value={String(MAY.newSearchClicks)} momentum={APRIL.newSearchClicks} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── LWA ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📝 Lessons Writing Assistant (LWA)</div>

      {/* Context block */}
      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 8, padding: "12px 16px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 6 }}>Context — Q1 2026 Institutional baseline</div>
        <p style={{ fontSize: 11, color: BLUE_D, lineHeight: 1.6, margin: 0 }}>
          During Q1 2026, <strong>784 lessons</strong> were created across <strong>452 operations</strong> registered in the Client Portal — independent of the KP platform. This provides important context: LWA usage within KP represents an emerging channel alongside existing institutional lesson-creation practices.
        </p>
      </div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Adoption</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="LWA visits" value={String(MAY.lwa.visits)} accent />
        <MCard label="Unique users" value={String(MAY.lwa.uniqueUsers)} accent />
      </div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Usage & Completion</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="Users who created lessons" value={String(MAY.lwa.usersCreated)} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Lessons started</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{MAY.lwa.lessonsStartedTotal}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{MAY.lwa.lessonsStartedExecution} Execution</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{MAY.lwa.lessonsStartedPCR} PCR</span>
          </div>
        </div>
        <MCard label="Lessons completed" value={String(MAY.lwa.completed)} desc="Clicked 'Complete lesson'" accent />
        <MCard label="% Reviewed before completing" value={`${MAY.lwa.pctReviewed}%`} desc="Quality: with prior edits" />
      </div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Effort & Perceived value</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Avg. time to save" value={MAY.lwa.avgTime} small desc="From first click to final save" />
        <MCard label="Lessons edited" value={String(MAY.lwa.edited)} desc="In unique sessions" />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Combined copies</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{MAY.lwa.copiesCombined}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{MAY.lwa.copiesButton} via button</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{MAY.lwa.copiesCursor} via cursor</span>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* Signal */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Pill engagement
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Similar Projects returned as the most accessed pill in May with 40 interactions, after Lessons Learned briefly led in an earlier period. Literature appeared as the least used pill for the first time — a broader distribution of content categories signals growing platform exploration.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — LWA efficiency
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Average time to save a lesson dropped sharply to 4m 55s in May (from 23m 40s in April), while completions rose to 17. Users are getting faster with the tool.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginTop: 16, marginBottom: 8 }}>
          Signal — Country roadshow effect
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Colombia held a country roadshow in May, and its user count rose to 35 (+11 vs April's 24) — the clearest country-level lift of the month. This pattern will be worth tracking as other countries hold their own roadshows in subsequent months.
        </p>
      </div>

    </div>
  );
}

// ── JUNE 2026 DATA ────────────────────────────────────────
// Final — June 2026
const JUNE = {
  sessions: 1019,
  users: 379,
  first_time: 309,
  prompters: 133,
  prompts: 522,
  avgTime: "20.37s",
  dropoff: 86,
  returningUsers: 141,
  highlighted: 570,
  highlightedOpenSearch: 406,
  copied: 243,
  copiedOpenSearch: 203,
  sourceClicks: 50,
  pillPageviews: 304,
  pillTop: "Similar Projects (85)",
  pillBot: "Data (27)",
  openSearchVisits: 342,
  tourCompletion: 48,
  thumbsUp: 0,
  thumbsDown: 1,
  promptGalleryClicks: 30,
  recentSearchClicks: 13,
  newSearchClicks: 1,
  totalCountries: 29,
  lwa: {
    visits: 22,
    uniqueUsers: 14,
    usersCreated: 0,
    lessonsStartedTotal: 6,
    lessonsStartedExecution: 5,
    lessonsStartedPCR: 1,
    edited: 0,
    completed: 0,
    avgTime: "—",
    copiesButton: 0,
    copiesCursor: 0,
    copiesCombined: 0,
    pctReviewed: 0,
  },
  countries: [
    { name: "United States (HQ)", code: "US", users: 174, pct: 46 },
    { name: "Brazil",             code: "BR", users: 74,  pct: 20 },
    { name: "Costa Rica",         code: "CR", users: 23,  pct: 6  },
    { name: "Colombia",           code: "CO", users: 17,  pct: 4  },
    { name: "Uruguay",            code: "UY", users: 16,  pct: 4  },
    { name: "Argentina",          code: "AR", users: 15,  pct: 4  },
    { name: "Panama",             code: "PA", users: 10,  pct: 3  },
    { name: "Barbados",           code: "BB", users: 7,   pct: 2  },
    { name: "Dominican Republic", code: "DO", users: 6,   pct: 2  },
    { name: "Ecuador",            code: "EC", users: 5,   pct: 1  },
    { name: "Spain",              code: "ES", users: 4,   pct: 1  },
    { name: "Honduras",           code: "HN", users: 4,   pct: 1  },
    { name: "Mexico",             code: "MX", users: 4,   pct: 1  },
    { name: "Bolivia",            code: "BO", users: 3,   pct: 1  },
    { name: "Paraguay",           code: "PY", users: 3,   pct: 1  },
    { name: "Peru",               code: "PE", users: 3,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 3,   pct: 1  },
    { name: "Bahamas",            code: "BS", users: 2,   pct: 1  },
    { name: "Belize",             code: "BZ", users: 2,   pct: 1  },
    { name: "Cayman Islands",     code: "KY", users: 2,   pct: 1  },
    { name: "Chile",              code: "CL", users: 2,   pct: 1  },
    { name: "El Salvador",        code: "SV", users: 2,   pct: 1  },
    { name: "France",             code: "FR", users: 2,   pct: 1  },
    { name: "Guatemala",          code: "GT", users: 2,   pct: 1  },
    { name: "Jamaica",            code: "JM", users: 2,   pct: 1  },
    { name: "United Kingdom",     code: "GB", users: 2,   pct: 1  },
    { name: "Haiti",              code: "HT", users: 1,   pct: 0  },
    { name: "Saint Martin",       code: "MF", users: 1,   pct: 0  },
    { name: "Suriname",           code: "SR", users: 1,   pct: 0  },
  ],
};

// ── JUNE MONTHLY VIEW ─────────────────────────────────────
function JuneMonthly() {
  const MONTH = "June 2026";
  const SIGNAL_STYLE = { fontSize: 12, color: "#3d4460", lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" };
  const SIGNAL_STYLE_MB = { fontSize: 12, color: "#3d4460", lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" };

  const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";

  const MCard = ({ label, value, desc, accent, small, bench, momentum }) => {
    let badge = null;
    if (value && value !== "—" && bench != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && bench > 0) {
        const ratio = numVal / bench;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        const higher = ratio >= 1;
        badge = { label: higher ? `↑ ${pctDiff}%` : `↓ ${pctDiff}%`, isGood: higher };
      }
    }
    let momentumBadge = null;
    if (value && value !== "—" && momentum != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && momentum > 0) {
        const ratio = numVal / momentum;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        const higher = ratio >= 1;
        momentumBadge = { label: higher ? `↑${pctDiff}%` : `↓${pctDiff}%` };
      }
    }
    return (
      <div style={{ background: accent ? BLUE_L : SURF, border: `1px solid ${accent ? BLUE_M : BDR}`, borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: accent ? BLUE_D : INK3, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: small ? 16 : 28, fontWeight: 500, letterSpacing: small ? "-0.01em" : "-0.03em", lineHeight: 1.2, color: value && value !== "—" ? (accent ? BLUE_D : INK) : BDR }}>{value || "—"}</div>
        {desc && <div style={{ fontSize: 9, color: accent ? BLUE : INK3, lineHeight: 1.4, marginTop: 6, marginBottom: (badge || momentumBadge) ? 6 : 0 }}>{desc}</div>}
        {badge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: badge.isGood ? "#edfaf4" : "#fef0ee", color: badge.isGood ? GREEN : RED }}>
              {badge.label} vs monthly avg
            </span>
            <span style={{ fontSize: 9, color: INK3 }}>({bench})</span>
            {momentumBadge && <span style={{ fontSize: 9, color: INK3 }}>· {momentumBadge.label} vs last month</span>}
          </div>
        )}
        {!badge && momentumBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs last month
            </span>
          </div>
        )}
      </div>
    );
  };

  const regional = JUNE.countries.filter(c => c.code !== "US");
  const usData = JUNE.countries.find(c => c.code === "US");
  const maxUsers = regional[0].users;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Monthly Report</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{MONTH}</div>
          <div style={{ fontSize: 11, color: INK3 }}>IDB Knowledge Platform · Source: FullStory</div>
        </div>
        <button
          onClick={() => {
            const rows = [
              ["Metric", "Value"],
              ["Month", MONTH],
              ["Sessions", JUNE.sessions],
              ["Users reached", JUNE.users],
              ["New users", JUNE.first_time],
              ["Prompters", JUNE.prompters],
              ["Prompts sent", JUNE.prompts ?? ""],
              ["Highlights total", JUNE.highlighted],
              ["Highlights Open Search", JUNE.highlightedOpenSearch],
              ["Highlights Contextual Search", JUNE.highlighted - JUNE.highlightedOpenSearch],
              ["Copies total", JUNE.copied],
              ["Copies Open Search", JUNE.copiedOpenSearch],
              ["Copies Contextual Search", JUNE.copied - JUNE.copiedOpenSearch],
              ["Source panel clicks", JUNE.sourceClicks],
              ["Pill pageviews", JUNE.pillPageviews],
              ["Most used pill", JUNE.pillTop],
              ["Least used pill", JUNE.pillBot],
              ["Open Search visits", JUNE.openSearchVisits],
              ["Tour completion %", JUNE.tourCompletion + "%"],
              ["Returning users", JUNE.returningUsers],
              ["Thumbs up", JUNE.thumbsUp],
              ["Thumbs down", JUNE.thumbsDown],
              ["Prompt Gallery clicks", JUNE.promptGalleryClicks],
              ["Recent Search clicks", JUNE.recentSearchClicks],
              ["New Search clicks", JUNE.newSearchClicks],
              ["LWA visits", JUNE.lwa.visits],
              ["LWA unique users", JUNE.lwa.uniqueUsers],
              ["LWA users who created lessons", JUNE.lwa.usersCreated],
              ["LWA lessons started total", JUNE.lwa.lessonsStartedTotal],
              ["LWA lessons started Execution", JUNE.lwa.lessonsStartedExecution],
              ["LWA lessons started PCR", JUNE.lwa.lessonsStartedPCR],
              ["LWA lessons completed", JUNE.lwa.completed],
              ["LWA lessons edited", JUNE.lwa.edited],
              ["LWA avg time to save", JUNE.lwa.avgTime],
              ["LWA copies combined", JUNE.lwa.copiesCombined],
              ["LWA % reviewed before completing", JUNE.lwa.pctReviewed + "%"],
            ];
            const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `KP_Monthly_June_2026.csv`; a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: 6, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}
        >↓ Export CSV</button>
      </div>

      {/* Cumulative totals */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 14 }}>
          Cumulative totals — Sep 1, 2025 to Jun 30, 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { label: "Sessions", value: "8,064" },
            { label: "Users reached", value: "1,734" },
            { label: "Prompters", value: "746" },
            { label: "Prompts sent", value: "3,721" },
            { label: "Penetration", value: "48.2%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(JUNE.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(JUNE.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between" }}>
            <span>{JUNE.users} users</span><span>3,600 total</span>
          </div>
        </div>
        <MCard label="Users reached" value={String(JUNE.users)} desc="Total for the period" accent bench={BENCH.monthly.users} momentum={MAY.users} />
        <MCard label="New users" value={String(JUNE.first_time)} desc="First-time visitors" />
        <MCard label="Sessions" value={JUNE.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} momentum={MAY.sessions} />
        <MCard label="% Onboarding completed" value={`${JUNE.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{JUNE.returningUsers}</div>
          <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Users with more than one session within the month</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(JUNE.returningUsers/JUNE.users*100)}% of users reached</span>
        </div>
      </div>

      {/* CSAT block */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 6 }}>CSAT — Customer Satisfaction Score</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>58.3%</div>
          <div style={{ fontSize: 10, color: INK3, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <span>12 responses · June 2026</span>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "#fef0ee", color: RED }}>↓ 18.2pp vs May</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "8px 12px", background: "#edfaf4", border: "1px solid #a7f3d0", borderRadius: 7, fontSize: 10, color: "#065f46" }}>
            👍 <strong>Most valued:</strong> same pattern as May — "Found quickly · Content clear · Simple and smooth · Useful for work" on 5★ responses
          </div>
          <div style={{ padding: "8px 12px", background: "#fef0ee", border: "1px solid #fca5a5", borderRadius: 7, fontSize: 10, color: "#7f1d1d" }}>
            👎 <strong>Least valued — technical failures, not UX:</strong> frequent crashes requiring restart, API connection issue, authorization failure, and a specific <strong>400 error on TC RG-T4150</strong>. Two additional comments on content clarity and not finding what was needed.
          </div>
          <div style={{ padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, fontSize: 10, color: "#92400e" }}>
            ⚠ <strong>Recommendation:</strong> log the 400 error / TC RG-T4150 as a separate technical ticket — it is not general product feedback and should not be treated as a UX signal.
          </div>
        </div>
      </div>

      {/* Geo */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
          🌎 Geographic Reach — {JUNE.users.toLocaleString()} users · {JUNE.totalCountries} countries
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: BLUE_L, borderRadius: 8 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🇺🇸</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: BLUE_D }}>United States (HQ)</span>
              <span style={{ fontSize: 11, color: BLUE_D, fontWeight: 500 }}>{usData.users} · {usData.pct}%</span>
            </div>
            <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${usData.pct}%`, height: "100%", background: "#1464A0", borderRadius: 99 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
          {regional.map((c, i) => {
            const mayUsers = { BR: 20, CR: 9, PA: 12, CO: 35 }[c.code];
            const diff = mayUsers != null ? c.users - mayUsers : null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{flag(c.code)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {diff != null && (
                        <span style={{ fontSize: 8, fontWeight: 600, padding: "1px 5px", borderRadius: 99, background: diff >= 0 ? "#edfaf4" : "#fef0ee", color: diff >= 0 ? GREEN : RED }}>
                          {diff >= 0 ? "+" : ""}{diff}
                        </span>
                      )}
                      <span style={{ fontSize: 9, color: INK3, marginLeft: 4 }}>{c.users}</span>
                    </span>
                  </div>
                  <div style={{ background: BG, borderRadius: 99, height: 3, overflow: "hidden" }}>
                    <div style={{ width: `${(c.users / maxUsers) * 100}%`, height: "100%", background: c.users >= 30 ? "#1464A0" : c.users >= 10 ? BLUE : "#7ab3e0", borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country. Green/red badges show change vs May for Brazil, Costa Rica, and Panama (June roadshows) and Colombia (May roadshow, now normalizing).
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(JUNE.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
        <MCard label="Most used pill — Similar Projects" value="82" desc="interactions" small bench={BENCH.monthly.pillTop} />
        <MCard label={<>Least used pill —<br/>Data</>} value="27" desc="interactions" small bench={BENCH.monthly.pillBot} />
      </div>
      <EngagementCard
        highlighted={JUNE.highlighted}
        highlightedOpenSearch={JUNE.highlightedOpenSearch}
        copied={JUNE.copied}
        copiedOpenSearch={JUNE.copiedOpenSearch}
        benchHighlights={BENCH.monthly.highlights}
        benchCopies={BENCH.monthly.copies}
      />

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant (Open Search)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Sessions (Open Search)" value={String(JUNE.openSearchVisits)} desc="Visits to the Knowledge Assistant" momentum={MAY.openSearchVisits} />
        <MCard label="Prompters (≥1 prompt)" value={String(JUNE.prompters)} desc={`${Math.round(JUNE.prompters/JUNE.users*100)}% of users reached`} accent momentum={MAY.prompters} />
        <MCard label="Prompts sent" value={JUNE.prompts != null ? String(JUNE.prompts) : null} desc="Median: 1 per prompter" accent momentum={JUNE.prompts ? MAY.prompts : null} />
        <MCard label="Source panel clicks" value={String(JUNE.sourceClicks)} desc="Clicks on source panel" momentum={MAY.sourceClicks} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Response Feedback</div>
          <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}>👍 {JUNE.thumbsUp}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: RED, letterSpacing: "-0.03em", lineHeight: 1 }}>👎 {JUNE.thumbsDown}</div>
          </div>
          <div style={{ fontSize: 9, color: INK3, marginTop: 8 }}>AI responses rated by users</div>
        </div>
        <MCard label="Prompt Gallery clicks" value={String(JUNE.promptGalleryClicks)} momentum={MAY.promptGalleryClicks} />
        <MCard label="Recent Search clicks" value={String(JUNE.recentSearchClicks)} momentum={MAY.recentSearchClicks} />
        <MCard label="New Search clicks" value={String(JUNE.newSearchClicks)} momentum={MAY.newSearchClicks} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── LWA ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📝 Lessons Writing Assistant (LWA)</div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Adoption</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="LWA visits" value={String(JUNE.lwa.visits)} accent />
        <MCard label="Unique users" value={String(JUNE.lwa.uniqueUsers)} accent />
      </div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Usage & Completion</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="Users who created lessons" value={String(JUNE.lwa.usersCreated)} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Lessons started</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{JUNE.lwa.lessonsStartedTotal}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{JUNE.lwa.lessonsStartedExecution} Execution</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{JUNE.lwa.lessonsStartedPCR} PCR</span>
          </div>
        </div>
        <MCard label="Lessons completed" value={String(JUNE.lwa.completed)} desc="Clicked 'Complete lesson'" accent />
        <MCard label="% Reviewed before completing" value={`${JUNE.lwa.pctReviewed}%`} desc="Quality: with prior edits" />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* Signal */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Geographic shift
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Brazil, Costa Rica, and Panama held country roadshows in June. Brazil surged to 74 users (+54 vs May) and Costa Rica jumped to 23 (+14) — a clear roadshow effect. Panama, however, dipped slightly (10, −2 vs May), suggesting attendance didn't translate to platform usage the same way. Colombia's earlier roadshow in May explains its high baseline (35 users) and the apparent normalization to 16 this month.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — LWA slowdown
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          LWA activity dropped sharply in June — 22 visits, 0 completions, and 0 lessons created, compared to 98 visits and 17 completions in May. This is a confirmed final figure. The drop likely reflects the summer period and the absence of a structured country session driving LWA usage, as was the case in April and May.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — CSAT shift: relevance → technical
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          CSAT dropped 18.2pp from May (76.5%) to June (58.3%), but the <em>nature</em> of the complaints changed. May's negative feedback pointed to search relevance and discoverability ("didn't find what I needed," "cannot search") — a product/UX issue. June's negative feedback names concrete technical failures: crashes, an API connection issue, an authorization failure, and a specific 400 error on TC RG-T4150. This reframes part of the CSAT drop as a technical incident rather than a product gap, and should be tracked separately from general satisfaction trends.
        </p>
      </div>

    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("june");

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
          {tabBtn("June 2026", "june", "preliminary")}
          {tabBtn("May 2026", "may", "May 2026")}
          {tabBtn("Apr 2026", "monthly", "Apr 2026")}
          {tabBtn("Week 1+2", "week12", "Mar 31–Apr 17")}
          {tabBtn("Week 1 Pulse", "week1", "Mar 31–Apr 10")}
          {tabBtn("Smoke Test", "smoke", "0–48h")}
        </div>
      </div>

      {view === "smoke" ? <SmokeTest /> : view === "week1" ? <Week1 data={WEEK1} /> : view === "week12" ? <Week1 data={WEEK12} /> : view === "may" ? <MayMonthly /> : view === "june" ? <JuneMonthly /> : <Monthly />}

      <div style={{ textAlign: "center", padding: 18, fontSize: 9, color: INK3, letterSpacing: "0.06em", borderTop: `1px solid ${BDR}` }}>
        IDB Knowledge Platform · Post Go-live Key Metrics · Go-live {GO_LIVE_DATE}
      </div>
    </div>
  );
}

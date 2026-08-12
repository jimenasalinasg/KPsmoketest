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
  thumbsUp: 3,
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
  thumbsUp: 3,
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
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>Breakdown — Highlights & Copies · Open Search vs Contextual</div>

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

// ── LAUNCH TIMELINE ───────────────────────────────────────
function LaunchTimeline({ defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const milestones = [
    {
      date: "Sep 2025",
      tag: "Release MVP",
      color: "#2c6cb5",
      stats: ["~192 users/month (organic baseline)", "~502 sessions/month (organic baseline)", "~538 content engagement events/month"],
      note: "Closed release — organic discovery, no bank-wide communication. The Sep–Mar organic period sets the baseline all post-launch metrics are compared against.",
    },
    {
      date: "Mar 31, 2026",
      tag: "Bank-wide Go-live",
      color: "#0C447C",
      stats: ["360 users in week 1", "757 sessions in week 1", "491 content engagement events in week 1"],
      note: "Highest single-week adoption to date.",
      impact: [
        { label: "Sessions ×3.3 in April (1,632 vs 502 avg)", dir: "up" },
        { label: "Users ×3 (588 vs 192 avg)", dir: "up" },
        { label: "Retention — the share of users who come back within 2 weeks — averaged ~32% during the organic period. After go-live it fell to 10.9%: an influx of one-time explorers diluted the loyal base", dir: "down" },
      ],
    },
    {
      date: "Mar 30 – May 6, 2026",
      tag: "New Learner Campaign (LWA)",
      color: "#3d8f6e",
      stats: ["60 LWA users in April", "56 lessons started", "100% reviewed before completing"],
      note: "Launched Mar 30, activity peaks Apr 8–9, closed May 6.",
      impact: [
        { label: "LWA users ×2.6 in April (60 vs 23 in March)", dir: "up" },
        { label: "Execution-phase lessons jumped 8 → 40", dir: "up" },
        { label: "Quality peak: 100% of lessons reviewed before completion", dir: "up" },
        { label: "Post-campaign decline: 37 users in May → 14 in June, 0 completions", dir: "down" },
        { label: "Pattern suggests LWA usage is campaign-driven, not yet self-sustaining", dir: "down" },
      ],
    },
    {
      date: "May–Jun 2026",
      tag: "Country Roadshows 🇨🇴🇧🇷🇨🇷🇵🇦",
      color: "#1464A0",
      stats: ["379 users in June", "1,052 sessions in May · 1,019 in June", "871 content engagement events in June", "1,025 prompts in June (↑64% vs May)"],
      note: "Country-level activation sessions. User change measured in the weeks following each event:",
      impact: [
        { label: "Colombia (May 26–27): +11 users in the following weeks (24→35)", dir: "up" },
        { label: "Brazil (Jun 1): +54 users (20→74)", dir: "up" },
        { label: "Costa Rica (Jun 8): +14 users (9→23)", dir: "up" },
        { label: "Panama (Jun 10): −2 users (12→10) — attendance didn't convert to usage", dir: "down" },
        { label: "CSAT fell 76.5% → 58.3% in June — technical incident (API/400 errors)", dir: "down" },
      ],
    },
    {
      date: "Jul 17, 2026",
      tag: "Awareness Session (online)",
      color: "#7c5cbf",
      stats: ["40 users connected live", "Online activation session"],
      note: "First virtual awareness session — 40 people connected on Friday, July 17.",
      impact: [
        { label: "CSAT recovered to 100% in July (4 responses, avg 4.75/5)", dir: "up" },
        { label: "Latency improved to 26s median (↓30% vs June)", dir: "up" },
        { label: "Approaching a 5,000-prompt cumulative milestone (4,344 by end of July)", dir: "up" },
      ],
    },
  ];

  return (
    <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: open ? "20px 24px" : "14px 24px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: open ? 20 : 0 }}
      >
        <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3 }}>
          🗓 Launch Timeline — {milestones.length} key milestones
        </span>
        <span style={{ fontSize: 10, color: BLUE_D, fontWeight: 500 }}>{open ? "▴ Hide" : "▾ Show"}</span>
      </button>
      {open && (
      <div style={{ position: "relative" }}>
        {/* Vertical line */}
        <div style={{ position: "absolute", left: 68, top: 0, bottom: 0, width: 2, background: BDR }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {/* Date label */}
              <div style={{ width: 60, flexShrink: 0, textAlign: "right" }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: INK3, lineHeight: 1.3 }}>{m.date}</span>
              </div>
              {/* Dot */}
              <div style={{ flexShrink: 0, width: 16, height: 16, borderRadius: "50%", background: m.color, border: `3px solid ${SURF}`, boxShadow: `0 0 0 2px ${m.color}`, marginTop: 1, zIndex: 1 }} />
              {/* Content */}
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: INK, marginBottom: 6 }}>{m.tag}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {m.stats.map((s, j) => (
                    <span key={j} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: INK3, lineHeight: 1.5, margin: "0 0 8px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>{m.note}</p>
                {m.impact && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {m.impact.map((imp, k) => (
                      <div key={k} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                        <span style={{ fontSize: 9, flexShrink: 0, marginTop: 1 }}>
                          {imp.dir === "up" ? "📈" : imp.dir === "down" ? "📉" : "▪️"}
                        </span>
                        <span style={{ fontSize: 9, color: imp.dir === "up" ? GREEN : imp.dir === "down" ? RED : INK3, lineHeight: 1.4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                          {imp.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
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
            { label: "Users reached", value: "1,357" },
            { label: "Prompters", value: "587" },
            { label: "Prompts sent", value: "2,279" },
            { label: "Avg prompts · Apr", value: "1.9" },
            { label: "Penetration of 3,600", value: "37.7%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Section emoji="📊" title="General Usability (April)">
        <Grid>
          <MCard label="Users reached" value={String(APRIL.users)} desc="Unique people who used KP at least once in April" accent bench={BENCH.monthly.users} />
          <MCard label="Prompters (≥1 prompt)" value={String(APRIL.prompters)} desc={`${Math.round(APRIL.prompters/APRIL.users*100)}% of users reached`} accent bench={BENCH.monthly.prompters} />
          <MCard label="New users" value={String(APRIL.newUsers)} desc={`First-time visitors · other ${APRIL.users - APRIL.newUsers} are returning from the organic period`} />
          <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{APRIL.returningUsers}</div>
            <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Came back for 2+ sessions within April — a signal of habit, not just curiosity</div>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(APRIL.returningUsers/APRIL.users*100)}% of users reached</span>
          </div>
          {/* Penetration — custom card with bar */}
          <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: BLUE_D, marginBottom: 10 }}>16.3%</div>
            <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: "16.3%", height: "100%", background: BLUE_D, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{APRIL.users} users</span><span>3,600 total</span>
            </div>
            <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.4 }}>Share of all IDB staff & consultants who used KP this month</div>
          </div>
          <MCard label="% Onboarding completed" value={`${APRIL.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
          <MCard label="Sessions" value={APRIL.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} />
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

      <Section emoji="🔍" title="Contextual Search (April)">
        <Grid cols="repeat(auto-fit, minmax(200px, 1fr))">
          <MCard label="Queries (pill views)" value={String(APRIL.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
          <MCard label="Most used pill — Similar projects" value="56" desc="interactions" small bench={BENCH.monthly.pillTop} />
          <MCard label={<>Least used pill —<br/>Institutional docs</>} value="20" desc="interactions" small bench={BENCH.monthly.pillBot} />
        </Grid>
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      <Section emoji="🤖" title="Knowledge Assistant — Open Search (April)">
        <Grid>
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
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      {/* ── CONTENT ENGAGEMENT ── */}
      <Section emoji="📄" title="Content Engagement (April)">
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "18px 20px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Total content engagement</div>
              <div style={{ fontSize: 34, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>799</div>
              <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.5 }}>
                Highlights (579) + Copies (167) + Source panel clicks (53) · Downloads tracking began in June
              </div>
            </div>
            <div style={{ minWidth: 220, flex: 1, maxWidth: 340 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: BLUE_D }}>Open Search · 546 (68%)</span>
                <span style={{ fontSize: 9, color: INK3 }}>Contextual · 253 (32%)</span>
              </div>
              <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, marginBottom: 8 }}>
                <div style={{ width: "68%", background: BLUE_D }} />
                <div style={{ width: "32%", background: "#9ec4e8" }} />
              </div>
              <div style={{ fontSize: 8, color: INK3, lineHeight: 1.5 }}>
                <strong>Open Search (546):</strong> 393 highlights · 101 copies · 52 source clicks<br/>
                <strong>Contextual (253):</strong> 186 highlights · 66 copies · 1 source click
              </div>
            </div>
          </div>
        </div>
        <EngagementCard
          highlighted={APRIL.highlighted}
          highlightedOpenSearch={APRIL.highlightedOpenSearch}
          copied={APRIL.copied}
          copiedOpenSearch={APRIL.copiedOpenSearch}
          benchHighlights={BENCH.monthly.highlights}
          benchCopies={BENCH.monthly.copies}
        />
      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      {/* ── LWA ── */}
      <Section emoji="📝" title="Lessons Writing Assistant — LWA (April)">

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
  prompters: 133,
  prompts: 625,
  avgTime: "20.2s",
  dropoff: 87,
  retention: 16,
  returningUsers: 131,
  highlighted: 463,
  highlightedOpenSearch: 217,
  copied: 191,
  copiedOpenSearch: 411,
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
  const [showAllCountries, setShowAllCountries] = useState(false);

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
            {momentumBadge && <span style={{ fontSize: 9, color: INK3 }}>· {momentumBadge.label} vs last month ({momentum})</span>}
          </div>
        )}
        {!badge && momentumBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs last month ({momentum})
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
            { label: "Users reached", value: "1,574" },
            { label: "Prompters", value: "673" },
            { label: "Prompts sent", value: "2,904" },
            { label: "Avg prompts · May", value: "4.7" },
            { label: "Penetration of 3,600", value: "43.7%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <LaunchTimeline />

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability (May)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Users reached" value={String(MAY.users)} desc="Unique people who used KP at least once in May" accent bench={BENCH.monthly.users} momentum={APRIL.users} />
        <MCard label="Prompters (≥1 prompt)" value={String(MAY.prompters)} desc={`${Math.round(MAY.prompters/MAY.users*100)}% of users reached`} accent momentum={APRIL.prompters} />
        <MCard label="New users" value={String(MAY.first_time)} desc={`First-time visitors · other ${MAY.users - MAY.first_time} are returning from prior months`} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{MAY.returningUsers}</div>
          <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Came back for 2+ sessions within May — a signal of habit, not just curiosity</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(MAY.returningUsers/MAY.users*100)}% of users reached</span>
        </div>
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(MAY.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(MAY.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{MAY.users} users</span><span>3,600 total</span>
          </div>
          <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.4 }}>Share of all IDB staff & consultants who used KP this month</div>
        </div>
        <MCard label="% Onboarding completed" value={`${MAY.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
        <MCard label="Sessions" value={MAY.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} momentum={APRIL.sessions} />
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
          {(showAllCountries ? regional : regional.slice(0, 12)).map((c, i) => {
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
        {regional.length > 12 && (
          <button onClick={() => setShowAllCountries(!showAllCountries)} style={{ fontFamily: "inherit", fontSize: 9, fontWeight: 500, marginTop: 8, padding: "5px 12px", border: `1px solid ${BDR}`, borderRadius: 99, cursor: "pointer", background: SURF, color: BLUE_D }}>
            {showAllCountries ? "▴ Show less" : `▾ Show all ${regional.length} countries`}
          </button>
        )}
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country. Green badge shows change vs April for Colombia — country roadshow held in May.
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search (May)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(MAY.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
        <MCard label="Most used pill — Similar Projects" value="40" desc="interactions" small bench={BENCH.monthly.pillTop} />
        <MCard label={<>Least used pill —<br/>Literature</>} value="10" desc="interactions" small bench={BENCH.monthly.pillBot} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant — Open Search (May)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Prompters (≥1 prompt)" value={String(MAY.prompters)} desc={`${Math.round(MAY.prompters/MAY.users*100)}% of users reached`} accent momentum={APRIL.prompters} />
        <MCard label="Prompts sent" value={MAY.prompts != null ? String(MAY.prompts) : null} desc="Median: 1 per prompter" accent momentum={MAY.prompts ? APRIL.prompts : null} />
        <MCard label="Latency" value="1m 02s" desc="Avg response time in Open Search" small />
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

      {/* ── CONTENT ENGAGEMENT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📄 Content Engagement (May)</div>
      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Total content engagement</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>705</div>
            <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.5 }}>
              Highlights (463) + Copies (191) + Source panel clicks (51) · Downloads tracking began in June
            </div>
          </div>
          <div style={{ minWidth: 220, flex: 1, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: BLUE_D }}>Open Search · 366 (52%)</span>
              <span style={{ fontSize: 9, color: INK3 }}>Contextual · 339 (48%)</span>
            </div>
            <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, marginBottom: 8 }}>
              <div style={{ width: "52%", background: BLUE_D }} />
              <div style={{ width: "48%", background: "#9ec4e8" }} />
            </div>
            <div style={{ fontSize: 8, color: INK3, lineHeight: 1.5 }}>
              <strong>Open Search (366):</strong> 217 highlights · 99 copies · 50 source clicks<br/>
              <strong>Contextual (339):</strong> 246 highlights · 92 copies · 1 source click
            </div>
          </div>
        </div>
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

      {/* ── LWA ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📝 Lessons Writing Assistant — LWA (May)</div>

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
  prompters: 160,
  prompts: 1025,
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
  tourCompletion: 44,
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
  const [showAllCountries, setShowAllCountries] = useState(false);
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
            {momentumBadge && <span style={{ fontSize: 9, color: INK3 }}>· {momentumBadge.label} vs last month ({momentum})</span>}
          </div>
        )}
        {!badge && momentumBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs last month ({momentum})
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
            { label: "Users reached", value: "1,734" },
            { label: "Prompters", value: "746" },
            { label: "Prompts sent", value: "3,929" },
            { label: "Avg prompts · Jun", value: "6.4" },
            { label: "Penetration of 3,600", value: "48.2%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <LaunchTimeline />

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability (June)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Users reached" value={String(JUNE.users)} desc="Unique people who used KP at least once in June" accent bench={BENCH.monthly.users} momentum={MAY.users} />
        <MCard label="Prompters (≥1 prompt)" value={String(JUNE.prompters)} desc={`${Math.round(JUNE.prompters/JUNE.users*100)}% of users reached`} accent momentum={MAY.prompters} />
        <MCard label="New users" value={String(JUNE.first_time)} desc={`First-time visitors · other ${JUNE.users - JUNE.first_time} are returning from prior months`} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{JUNE.returningUsers}</div>
          <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Came back for 2+ sessions within June — a signal of habit, not just curiosity</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(JUNE.returningUsers/JUNE.users*100)}% of users reached</span>
        </div>
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(JUNE.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(JUNE.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{JUNE.users} users</span><span>3,600 total</span>
          </div>
          <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.4 }}>Share of all IDB staff & consultants who used KP this month</div>
        </div>
        <MCard label="% Onboarding completed" value={`${JUNE.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
        <MCard label="Sessions" value={JUNE.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} momentum={MAY.sessions} />
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
          {(showAllCountries ? regional : regional.slice(0, 12)).map((c, i) => {
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
        {regional.length > 12 && (
          <button onClick={() => setShowAllCountries(!showAllCountries)} style={{ fontFamily: "inherit", fontSize: 9, fontWeight: 500, marginTop: 8, padding: "5px 12px", border: `1px solid ${BDR}`, borderRadius: 99, cursor: "pointer", background: SURF, color: BLUE_D }}>
            {showAllCountries ? "▴ Show less" : `▾ Show all ${regional.length} countries`}
          </button>
        )}
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country. Green/red badges show change vs May for Brazil, Costa Rica, and Panama (June roadshows) and Colombia (May roadshow, now normalizing).
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search (June)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(JUNE.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
        <MCard label="Most used pill — Similar Projects" value="82" desc="interactions" small bench={BENCH.monthly.pillTop} />
        <MCard label={<>Least used pill —<br/>Data</>} value="27" desc="interactions" small bench={BENCH.monthly.pillBot} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant — Open Search (June)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Prompters (≥1 prompt)" value={String(JUNE.prompters)} desc={`${Math.round(JUNE.prompters/JUNE.users*100)}% of users reached`} accent momentum={MAY.prompters} />
        <MCard label="Prompts sent" value={JUNE.prompts != null ? String(JUNE.prompts) : null} desc="Median: 1 per prompter" accent momentum={JUNE.prompts ? MAY.prompts : null} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Latency</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>37s</div>
          <div style={{ fontSize: 9, color: INK3, lineHeight: 1.4, marginBottom: 6 }}>Avg response time in Open Search</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "#edfaf4", color: GREEN }}>
            ↓40% vs last month (1m 02s)
          </span>
        </div>
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

      {/* ── CONTENT ENGAGEMENT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📄 Content Engagement (June)</div>
      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Total content engagement</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>871</div>
            <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.5 }}>
              Highlights (570) + Copies (243) + Source panel clicks (51) + Downloads (7: 5 Word · 2 Excel)
            </div>
          </div>
          <div style={{ minWidth: 220, flex: 1, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: BLUE_D }}>Open Search · 666 (76%)</span>
              <span style={{ fontSize: 9, color: INK3 }}>Contextual · 205 (24%)</span>
            </div>
            <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, marginBottom: 8 }}>
              <div style={{ width: "76%", background: BLUE_D }} />
              <div style={{ width: "24%", background: "#9ec4e8" }} />
            </div>
            <div style={{ fontSize: 8, color: INK3, lineHeight: 1.5 }}>
              <strong>Open Search (666):</strong> 406 highlights · 203 copies · 50 source clicks · 7 downloads<br/>
              <strong>Contextual (205):</strong> 164 highlights · 40 copies · 1 source click
            </div>
          </div>
        </div>
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

      {/* ── LWA ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📝 Lessons Writing Assistant — LWA (June)</div>

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

// ── JULY 2026 DATA ────────────────────────────────────────
// Preliminary — through Jul 17, 2026
const JULY = {
  sessions: 717,
  users: 251,
  first_time: 156,
  prompters: 109,
  prompts: 415,
  avgTime: "20.43s",
  dropoff: 85,
  returningUsers: 91,
  highlighted: 452,
  highlightedOpenSearch: 411,
  copied: 157,
  copiedOpenSearch: 135,
  sourceClicks: 30,
  sourceClicksBC: 0,
  pillPageviews: 137,
  pillTop: "Lessons Learned (37)",
  pillBot: "Institutional Documents (10)",
  openSearchVisits: 258,
  tourCompletion: 44,
  thumbsUp: 3,
  thumbsDown: 1,
  promptGalleryClicks: 11,
  recentSearchClicks: 26,
  newSearchClicks: 0,
  wordDownloads: 6,
  excelDownloads: 3,
  totalCountries: 29,
  countries: [
    { name: "United States (HQ)", code: "US", users: 124, pct: 49 },
    { name: "Colombia",           code: "CO", users: 19, pct: 8  },
    { name: "Brazil",             code: "BR", users: 14, pct: 6  },
    { name: "Uruguay",            code: "UY", users: 11, pct: 4  },
    { name: "Argentina",          code: "AR", users: 10, pct: 4  },
    { name: "Mexico",             code: "MX", users: 9,  pct: 4  },
    { name: "Panama",             code: "PA", users: 8,  pct: 3  },
    { name: "Barbados",           code: "BB", users: 7,  pct: 3  },
    { name: "Bolivia",            code: "BO", users: 6,  pct: 2  },
    { name: "Costa Rica",         code: "CR", users: 6,  pct: 2  },
    { name: "El Salvador",        code: "SV", users: 6,  pct: 2  },
    { name: "Ecuador",            code: "EC", users: 5,  pct: 2  },
    { name: "Dominican Republic", code: "DO", users: 4,  pct: 2  },
    { name: "Peru",               code: "PE", users: 4,  pct: 2  },
    { name: "Suriname",           code: "SR", users: 4,  pct: 2  },
    { name: "Cayman Islands",     code: "KY", users: 3,  pct: 1  },
    { name: "Guyana",             code: "GY", users: 3,  pct: 1  },
    { name: "Paraguay",           code: "PY", users: 3,  pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 3,  pct: 1  },
    { name: "Chile",              code: "CL", users: 2,  pct: 1  },
    { name: "France",             code: "FR", users: 2,  pct: 1  },
    { name: "Haiti",              code: "HT", users: 2,  pct: 1  },
    { name: "Spain",              code: "ES", users: 2,  pct: 1  },
    { name: "Bahamas",            code: "BS", users: 1,  pct: 0  },
    { name: "Belize",             code: "BZ", users: 1,  pct: 0  },
    { name: "Guatemala",          code: "GT", users: 1,  pct: 0  },
    { name: "Honduras",           code: "HN", users: 1,  pct: 0  },
    { name: "Italy",              code: "IT", users: 1,  pct: 0  },
    { name: "Jamaica",            code: "JM", users: 1,  pct: 0  },
  ],
  lwa: {
    visits: 25,
    uniqueUsers: 6,
    usersCreated: 1,
    lessonsStartedTotal: 15,
    lessonsStartedExecution: 8,
    lessonsStartedPCR: 7,
    edited: 0,
    completed: 2,
    avgTime: "14m 24s",
    copiesButton: 0,
    copiesCursor: 1,
    copiesCombined: 1,
    pctReviewed: 0,
  },
};

// ── JULY MONTHLY VIEW ─────────────────────────────────────
function JulyMonthly() {
  const MONTH = "July 2026";
  const [showAllCountries, setShowAllCountries] = useState(false);
  const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";
  const regional = JULY.countries.filter(c => c.code !== "US");
  const usData = JULY.countries.find(c => c.code === "US");
  const maxUsers = regional[0].users;

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
            {momentumBadge && <span style={{ fontSize: 9, color: INK3 }}>· {momentumBadge.label} vs last month ({momentum})</span>}
          </div>
        )}
        {!badge && momentumBadge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs last month ({momentum})
            </span>
          </div>
        )}
      </div>
    );
  };

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
              ["Sessions", JULY.sessions],
              ["Users reached", JULY.users],
              ["Prompters", JULY.prompters],
              ["Prompts sent", JULY.prompts ?? "pending"],
              ["Highlights total", JULY.highlighted],
              ["Highlights Open Search", JULY.highlightedOpenSearch],
              ["Copies total", JULY.copied],
              ["Copies Open Search", JULY.copiedOpenSearch],
              ["Source panel clicks (OS)", JULY.sourceClicks],
              ["Word downloads", JULY.wordDownloads],
              ["Excel downloads", JULY.excelDownloads],
              ["Pill pageviews", JULY.pillPageviews],
              ["Most used pill", JULY.pillTop],
              ["Least used pill", JULY.pillBot],
              ["Open Search visits", JULY.openSearchVisits],
              ["Tour completion %", JULY.tourCompletion + "%"],
              ["Thumbs up", JULY.thumbsUp],
              ["Thumbs down", JULY.thumbsDown],
              ["Prompt Gallery clicks", JULY.promptGalleryClicks],
              ["Recent Search clicks", JULY.recentSearchClicks],
              ["New Search clicks", JULY.newSearchClicks],
              ["LWA visits", JULY.lwa.visits],
              ["LWA unique users", JULY.lwa.uniqueUsers],
              ["LWA users who created lessons", JULY.lwa.usersCreated],
              ["LWA lessons started total", JULY.lwa.lessonsStartedTotal],
              ["LWA lessons started Execution", JULY.lwa.lessonsStartedExecution],
              ["LWA lessons started PCR", JULY.lwa.lessonsStartedPCR],
              ["LWA lessons completed", JULY.lwa.completed],
              ["LWA avg time to save", JULY.lwa.avgTime],
              ["LWA copies combined", JULY.lwa.copiesCombined],
              ["LWA % reviewed before completing", JULY.lwa.pctReviewed + "%"],
            ];
            const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `KP_Monthly_July_2026.csv`; a.click();
            URL.revokeObjectURL(url);
          }}
          style={{ fontFamily: "inherit", fontSize: 10, fontWeight: 500, padding: "7px 14px", border: `1px solid ${BDR}`, borderRadius: 6, cursor: "pointer", background: SURF, color: INK2, display: "flex", alignItems: "center", gap: 6 }}
        >↓ Export CSV</button>
      </div>

      {/* Cumulative totals (through June — July pending) */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 14 }}>
          Cumulative totals — Sep 1, 2025 to Jul 31, 2026
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { label: "Users reached", value: "1,818" },
            { label: "Prompters", value: "796" },
            { label: "Prompts sent", value: "4,344" },
            { label: "Avg prompts · Jul", value: "3.8" },
            { label: "Penetration of 3,600", value: "50.5%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <LaunchTimeline />

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability (July)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Users reached" value={String(JULY.users)} desc="Unique people who used KP at least once in July" accent bench={BENCH.monthly.users} momentum={JUNE.users} />
        <MCard label="Prompters (≥1 prompt)" value={String(JULY.prompters)} desc={`${Math.round(JULY.prompters/JULY.users*100)}% of users reached`} accent momentum={JUNE.prompters} />
        <MCard label="New users" value={String(JULY.first_time)} desc={`First-time visitors · other ${JULY.users - JULY.first_time} are returning from prior months`} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Returning users</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>{JULY.returningUsers}</div>
          <div style={{ fontSize: 9, color: INK3, marginBottom: 6, lineHeight: 1.4 }}>Came back for 2+ sessions within July — a signal of habit, not just curiosity</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D }}>{Math.round(JULY.returningUsers/JULY.users*100)}% of users reached</span>
        </div>
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(JULY.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(JULY.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{JULY.users} users</span><span>3,600 total</span>
          </div>
          <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.4 }}>Share of all IDB staff & consultants who used KP this month</div>
        </div>
        <MCard label="% Onboarding completed" value={`${JULY.tourCompletion}%`} desc="Users who finished the tour" bench={BENCH.monthly.tourCompletion} />
        <MCard label="Sessions" value={String(JULY.sessions)} desc="Total for the period" bench={BENCH.monthly.sessions} momentum={JUNE.sessions} />
      </div>

      {/* CSAT block */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 6 }}>CSAT — Customer Satisfaction Score</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1 }}>100%</div>
          <div style={{ fontSize: 10, color: INK3, marginTop: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>4 responses · avg 4.75 / 5 ★ · July 2026</span>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "#edfaf4", color: GREEN }}>↑ 41.7pp vs June</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ padding: "8px 12px", background: "#edfaf4", border: "1px solid #a7f3d0", borderRadius: 7, fontSize: 10, color: "#065f46" }}>
            👍 <strong>All 4 responses positive:</strong> "Encontré rápidamente lo que buscaba" · "A plataforma foi útil para meu trabalho" · "The platform was useful for my work" · "El contenido fue claro"
          </div>
          <div style={{ padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 7, fontSize: 10, color: "#92400e" }}>
            ⚠ <strong>Small sample:</strong> only 4 responses so far — strong recovery from June's technical incident (58.3%), but not yet representative. Expect the figure to settle as more responses arrive.
          </div>
        </div>
      </div>

      {/* Geo */}
      {(() => {
        const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";
        const regional = JULY.countries.filter(c => c.code !== "US");
        const usData = JULY.countries.find(c => c.code === "US");
        const maxUsers = regional[0].users;
        return (
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
          🌎 Geographic Reach — {JULY.users.toLocaleString()} users · {JULY.totalCountries} countries
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
          {(showAllCountries ? regional : regional.slice(0, 12)).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>{flag(c.code)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: INK3, flexShrink: 0, marginLeft: 4 }}>{c.users}</span>
                </div>
                <div style={{ background: BG, borderRadius: 99, height: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(c.users / maxUsers) * 100}%`, height: "100%", background: c.users >= 8 ? "#1464A0" : c.users >= 4 ? BLUE : "#7ab3e0", borderRadius: 99 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {regional.length > 12 && (
          <button onClick={() => setShowAllCountries(!showAllCountries)} style={{ fontFamily: "inherit", fontSize: 9, fontWeight: 500, marginTop: 8, padding: "5px 12px", border: `1px solid ${BDR}`, borderRadius: 99, cursor: "pointer", background: SURF, color: BLUE_D }}>
            {showAllCountries ? "▴ Show less" : `▾ Show all ${regional.length} countries`}
          </button>
        )}
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Country data reflects session location by IP. Users who accessed the platform from multiple countries within the period may appear in more than one country. New this month: Italy 🇮🇹, Belize 🇧🇿 and Honduras 🇭🇳.
        </div>
      </div>
        );
      })()}

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search (July)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(JULY.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
        <MCard label="Most used pill — Lessons Learned" value="37" desc="interactions · leading for the first time in a full month 🆕" small bench={BENCH.monthly.pillTop} />
        <MCard label={<>Least used pill —<br/>Institutional Docs</>} value="10" desc="interactions" small bench={BENCH.monthly.pillBot} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant — Open Search (July)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Prompters (≥1 prompt)" value={String(JULY.prompters)} desc={`${Math.round(JULY.prompters/JULY.users*100)}% of users reached`} accent momentum={JUNE.prompters} />
        <MCard label="Prompts sent" value={String(JULY.prompts)} desc="Median: 1 per prompter" accent momentum={JUNE.prompts} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Latency (median)</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6 }}>27s</div>
          <div style={{ fontSize: 9, color: INK3, lineHeight: 1.4, marginBottom: 6 }}>Median response time in Open Search</div>
          <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "#edfaf4", color: GREEN }}>↓27% vs June (37s)</span>
        </div>
        <MCard label="Source panel clicks" value={String(JULY.sourceClicks)} desc="Clicks on source panel" momentum={JUNE.sourceClicks} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Response Feedback</div>
          <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}>👍 {JULY.thumbsUp}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: RED, letterSpacing: "-0.03em", lineHeight: 1 }}>👎 {JULY.thumbsDown}</div>
          </div>
          <div style={{ fontSize: 9, color: INK3, marginTop: 8 }}>AI responses rated by users</div>
        </div>
        <MCard label="Prompt Gallery clicks" value={String(JULY.promptGalleryClicks)} momentum={JUNE.promptGalleryClicks} />
        <MCard label="Recent Search clicks" value={String(JULY.recentSearchClicks)} momentum={JUNE.recentSearchClicks} />
        <MCard label="New Search clicks" value={String(JULY.newSearchClicks)} momentum={JUNE.newSearchClicks} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTENT ENGAGEMENT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📄 Content Engagement (July)</div>
      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Total content engagement</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>648</div>
            <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.5 }}>
              Highlights (452) + Copies (157) + Source panel clicks (30) + Downloads (9: 6 Word · 3 Excel)
            </div>
          </div>
          <div style={{ minWidth: 220, flex: 1, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: BLUE_D }}>Open Search · 585 (90%)</span>
              <span style={{ fontSize: 9, color: INK3 }}>Contextual · 63 (10%)</span>
            </div>
            <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, marginBottom: 8 }}>
              <div style={{ width: "90%", background: BLUE_D }} />
              <div style={{ width: "10%", background: "#9ec4e8" }} />
            </div>
            <div style={{ fontSize: 8, color: INK3, lineHeight: 1.5 }}>
              <strong>Open Search (585):</strong> 411 highlights · 135 copies · 30 source clicks · 9 downloads<br/>
              <strong>Contextual (63):</strong> 41 highlights · 22 copies · 0 source clicks
            </div>
          </div>
        </div>
      </div>
      <EngagementCard
        highlighted={JULY.highlighted}
        highlightedOpenSearch={JULY.highlightedOpenSearch}
        copied={JULY.copied}
        copiedOpenSearch={JULY.copiedOpenSearch}
        benchHighlights={BENCH.monthly.highlights}
        benchCopies={BENCH.monthly.copies}
      />

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── LWA ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📝 Lessons Writing Assistant — LWA (July)</div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Adoption</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="LWA users" value={String(JULY.lwa.uniqueUsers)} accent momentum={JUNE.lwa.uniqueUsers} />
        <MCard label="LWA visits" value={String(JULY.lwa.visits)} accent momentum={JUNE.lwa.visits} />
      </div>

      <div style={{ fontSize: 9, color: INK3, fontStyle: "italic" }}>Usage & Completion</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <MCard label="Users who created lessons" value={String(JULY.lwa.usersCreated)} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Lessons started</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: INK, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{JULY.lwa.lessonsStartedTotal}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BLUE_L, color: BLUE_D, fontWeight: 500 }}>{JULY.lwa.lessonsStartedExecution} Execution</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: BG, color: INK3, fontWeight: 500 }}>{JULY.lwa.lessonsStartedPCR} PCR</span>
          </div>
        </div>
        <MCard label="Lessons completed" value={String(JULY.lwa.completed)} desc="Clicked 'Complete lesson'" accent />
        <MCard label="Avg. time to save" value={JULY.lwa.avgTime} small desc="From first click to final save" />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* Signal */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px", borderLeft: `3px solid ${BLUE}` }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Adoption holds without a physical event
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          July's only activation was a single online awareness session (40 attendees, Jul 17) — no country roadshow. Yet 251 users and 36% within-month return held steady, and cumulative penetration crossed 50%. Evidence that a lightweight, low-cost online format can sustain engagement is the most strategically useful finding of the month: it points to a more scalable activation model than country-by-country roadshows.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Volume dipped, loyal base held
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          July saw fewer users than prior months (251 vs 379 in June), explained by the northern-hemisphere summer and the absence of a physical roadshow. What matters is where the drop landed: acquisition slowed, but recurrence held — 91 users returned for 2+ sessions (36% of those reached), in line with prior months, and cumulative penetration still crossed 50%. The loyal base did not erode; the real test is whether volume recovers on its own as staff return in August, or needs another activation to lift.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Two channels, not a migration
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: "0 0 16px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Open Search has been the dominant channel since release — that is not new. Contextual search has consolidated alongside it, peaking at 304 pill pageviews in June. July's 90% Open Search share reflects the smaller summer volume compressing deliberate contextual exploration more than conversational queries — a composition effect, not a behavioral shift. The two channels grow together when there is activity; they don't compete.
        </p>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>
          Signal — Technical trust restored
        </div>
        <p style={{ fontSize: 12, color: INK2, lineHeight: 1.6, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Latency dropped to a 27s median (↓27% vs June, its third consecutive improvement) and CSAT recovered to 100% with no technical complaints, reversing June's API-incident dip. The sample is small (4 responses), so the exact figure will move — but the direction, paired with the latency trend, indicates the reliability issues that shaped June's feedback have been addressed.
        </p>
      </div>

    </div>
  );
}

// ── AUGUST 2026 DATA ──────────────────────────────────────
// Preliminary — through Aug 12, 2026 · pulled live via FullStory MCP
const AUGUST = {
  sessions: 209,
  users: 78,
  prompters: 36,          // live via MCP (metric 3GVbGeJsPBCb)
  prompts: null,          // manual — pass at close
  returningUsers: null,   // pending
  first_time: null,       // pending
  tourCompletion: 48,     // live via MCP (iN3brKBr4rlY)
  pillPageviews: 84,      // live via MCP (2EYT9yOW6odB)
  sourceClicks: 9,        // live via MCP (Ge6P9qbIeu3b)
  thumbsUp: 0,            // live via MCP (AtpRWyuThJUq)
  thumbsDown: 0,          // live via MCP (x6Z3q26RMOra)
  promptGalleryClicks: 1, // live via MCP (lkwqkKIJQ25E)
  recentSearchClicks: 2,  // live via MCP (nfcBnYjQSAfT)
  newSearchClicks: 0,     // live via MCP (tU5aopeDHc1k)
  highlighted: 136,       // live via MCP (cMgaz9YMCSJh)
  highlightedOpenSearch: 85, // live via MCP (RQ6IjtoMbeD5)
  copied: 63,             // live via MCP (yowGb1tOMe3X)
  copiedOpenSearch: 35,   // live via MCP (JOTETVLPeJKh)
  latency: null,          // manual
  csat: null,             // manual
  totalCountries: 20,
  countries: [
    { name: "United States (HQ)", code: "US", users: 33, pct: 47 },
    { name: "Colombia",           code: "CO", users: 5,  pct: 7  },
    { name: "Argentina",          code: "AR", users: 4,  pct: 6  },
    { name: "Brazil",             code: "BR", users: 4,  pct: 6  },
    { name: "Uruguay",            code: "UY", users: 4,  pct: 6  },
    { name: "Spain",              code: "ES", users: 3,  pct: 4  },
    { name: "Barbados",           code: "BB", users: 2,  pct: 3  },
    { name: "Mexico",             code: "MX", users: 2,  pct: 3  },
    { name: "Panama",             code: "PA", users: 2,  pct: 3  },
    { name: "Trinidad & Tobago",  code: "TT", users: 2,  pct: 3  },
    { name: "Bolivia",            code: "BO", users: 1,  pct: 1  },
    { name: "Chile",              code: "CL", users: 1,  pct: 1  },
    { name: "Costa Rica",         code: "CR", users: 1,  pct: 1  },
    { name: "Ecuador",            code: "EC", users: 1,  pct: 1  },
    { name: "Germany",            code: "DE", users: 1,  pct: 1  },
    { name: "Guatemala",          code: "GT", users: 1,  pct: 1  },
    { name: "Honduras",           code: "HN", users: 1,  pct: 1  },
    { name: "Paraguay",           code: "PY", users: 1,  pct: 1  },
    { name: "Peru",               code: "PE", users: 1,  pct: 1  },
    { name: "Suriname",           code: "SR", users: 1,  pct: 1  },
  ],
};

// ── AUGUST MONTHLY VIEW ───────────────────────────────────
function AugustMonthly() {
  const MONTH = "August 2026 — through Aug 12";
  const [showAllCountries, setShowAllCountries] = useState(false);

  const MCard = ({ label, value, desc, accent, small, bench, momentum }) => {
    let momentumBadge = null;
    if (value && value !== "—" && momentum != null) {
      const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
      if (!isNaN(numVal) && momentum > 0) {
        const ratio = numVal / momentum;
        const pctDiff = Math.round(Math.abs(ratio - 1) * 100);
        momentumBadge = { label: ratio >= 1 ? `↑${pctDiff}%` : `↓${pctDiff}%` };
      }
    }
    return (
      <div style={{ background: accent ? BLUE_L : SURF, border: `1px solid ${accent ? BLUE_M : BDR}`, borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: accent ? BLUE_D : INK3, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: small ? 16 : 28, fontWeight: 500, letterSpacing: small ? "-0.01em" : "-0.03em", lineHeight: 1.2, color: value && value !== "—" ? (accent ? BLUE_D : INK) : BDR }}>{value || "—"}</div>
        {desc && <div style={{ fontSize: 9, color: accent ? BLUE : INK3, lineHeight: 1.4, marginTop: 6 }}>{desc}</div>}
        {momentumBadge && (
          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: momentumBadge.label.startsWith("↑") ? "#edfaf4" : "#fef0ee", color: momentumBadge.label.startsWith("↑") ? GREEN : RED }}>
              {momentumBadge.label} vs July ({momentum})
            </span>
          </div>
        )}
      </div>
    );
  };

  const flag = (code) => code ? [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("") : "🌐";
  const regional = AUGUST.countries.filter(c => c.code !== "US");
  const usData = AUGUST.countries.find(c => c.code === "US");
  const maxUsers = regional[0].users;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Monthly Report</div>
          <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{MONTH}</div>
          <div style={{ fontSize: 11, color: INK3 }}>IDB Knowledge Platform · Source: FullStory (live via MCP)</div>
        </div>
      </div>

      {/* MCP banner */}
      <div style={{ background: "#f0f4ff", border: "1px solid #c7d7fe", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>🔌</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#3730a3" }}>Live pull — through Aug 12, 2026</div>
          <div style={{ fontSize: 10, color: "#4f46e5", marginTop: 2 }}>Users, sessions and country data pulled directly from FullStory via MCP (segment: sin dev copy). Prompt/highlight/copy/LWA metrics pending — they depend on custom event names not yet mapped. Figures may run ~5% below the official dashboard until filter 833220869 is replicated.</div>
        </div>
      </div>

      {/* Cumulative totals — pulled live via MCP */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 14 }}>
          Cumulative totals — Sep 1, 2025 to Aug 12, 2026 · live via MCP
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Users reached", value: "1,842" },
            { label: "Prompters", value: "813" },
            { label: "Prompts sent", value: "—" },
            { label: "Penetration of 3,600", value: "51.2%" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GENERAL USABILITY ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8, marginTop: 8 }}>📊 General Usability (August · partial)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Users reached" value={String(AUGUST.users)} desc="Unique people who used KP so far in August" accent momentum={JULY.users} />
        <MCard label="Sessions" value={String(AUGUST.sessions)} desc="Total for the period so far" momentum={JULY.sessions} />
        <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Penetration</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{Math.round(AUGUST.users/3600*100*10)/10}%</div>
          <div style={{ background: BLUE_M, borderRadius: 99, height: 6, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ width: `${Math.round(AUGUST.users/3600*100*10)/10}%`, height: "100%", background: BLUE_D, borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 9, color: BLUE, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{AUGUST.users} users</span><span>3,600 total</span>
          </div>
          <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.4 }}>Share of all IDB staff & consultants (partial month)</div>
        </div>
        <MCard label="Prompters (≥1 prompt)" value={String(AUGUST.prompters)} desc={`${Math.round(AUGUST.prompters/AUGUST.users*100)}% of users reached · live via MCP`} accent momentum={JULY.prompters} />
        <MCard label="% Onboarding completed" value={`${AUGUST.tourCompletion}%`} desc="Users who finished the tour · live via MCP" momentum={JULY.tourCompletion} />
        <MCard label="New users" value={null} desc="Pending" />
        <MCard label="Returning users" value={null} desc="Pending" />
      </div>

      {/* Geo */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 12 }}>
          🌎 Geographic Reach — {AUGUST.totalCountries} countries (through Aug 12)
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
          {(showAllCountries ? regional : regional.slice(0, 12)).map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
              <span style={{ fontSize: 13, flexShrink: 0 }}>{flag(c.code)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 9, color: INK2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ fontSize: 9, color: INK3, flexShrink: 0, marginLeft: 4 }}>{c.users}</span>
                </div>
                <div style={{ background: BG, borderRadius: 99, height: 3, overflow: "hidden" }}>
                  <div style={{ width: `${(c.users / maxUsers) * 100}%`, height: "100%", background: c.users >= 4 ? "#1464A0" : c.users >= 2 ? BLUE : "#7ab3e0", borderRadius: 99 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {regional.length > 12 && (
          <button onClick={() => setShowAllCountries(!showAllCountries)} style={{ fontFamily: "inherit", fontSize: 9, fontWeight: 500, marginTop: 8, padding: "5px 12px", border: `1px solid ${BDR}`, borderRadius: 99, cursor: "pointer", background: SURF, color: BLUE_D }}>
            {showAllCountries ? "▴ Show less" : `▾ Show all ${regional.length} countries`}
          </button>
        )}
        <div style={{ marginTop: 10, fontSize: 9, color: INK3, fontStyle: "italic", lineHeight: 1.5 }}>
          Live from FullStory via MCP. Country data reflects session location by IP; multi-country users may appear more than once. New face this month: Germany 🇩🇪.
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🔍 Contextual Search (August · partial)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <MCard label="Queries (pill views)" value={String(AUGUST.pillPageviews)} desc="Total visits across all contextual search pills · live via MCP" accent momentum={JULY.pillPageviews} />
        <MCard label="Most / least used pill" value="—" desc="Manual — pills are heatmaps, not computable metrics" small />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>🤖 Knowledge Assistant — Open Search (August · partial)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        <MCard label="Prompters (≥1 prompt)" value={String(AUGUST.prompters)} desc={`${Math.round(AUGUST.prompters/AUGUST.users*100)}% of users reached`} accent momentum={JULY.prompters} />
        <MCard label="Prompts sent" value={null} desc="Manual — pass at close" accent />
        <MCard label="Latency" value={null} desc="Manual — pass at close" small />
        <MCard label="Source panel clicks" value={String(AUGUST.sourceClicks)} desc="Clicks on source panel · live via MCP" momentum={JULY.sourceClicks} />
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 8 }}>Response Feedback</div>
          <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
            <div style={{ fontSize: 28, fontWeight: 500, color: GREEN, letterSpacing: "-0.03em", lineHeight: 1 }}>👍 {AUGUST.thumbsUp}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: RED, letterSpacing: "-0.03em", lineHeight: 1 }}>👎 {AUGUST.thumbsDown}</div>
          </div>
          <div style={{ fontSize: 9, color: INK3, marginTop: 8 }}>AI responses rated · live via MCP</div>
        </div>
        <MCard label="Prompt Gallery clicks" value={String(AUGUST.promptGalleryClicks)} momentum={JULY.promptGalleryClicks} />
        <MCard label="Recent Search clicks" value={String(AUGUST.recentSearchClicks)} momentum={JULY.recentSearchClicks} />
        <MCard label="New Search clicks" value={String(AUGUST.newSearchClicks)} momentum={JULY.newSearchClicks} />
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* ── CONTENT ENGAGEMENT ── */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: -8 }}>📄 Content Engagement (August · partial)</div>
      <div style={{ background: BLUE_L, border: `1px solid ${BLUE_M}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: BLUE_D, marginBottom: 8 }}>Total content engagement</div>
            <div style={{ fontSize: 34, fontWeight: 500, color: BLUE_D, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 8 }}>208</div>
            <div style={{ fontSize: 9, color: BLUE, lineHeight: 1.5 }}>
              Highlights (136) + Copies (63) + Source panel clicks (9) · downloads pending (manual)
            </div>
          </div>
          <div style={{ minWidth: 220, flex: 1, maxWidth: 340 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: BLUE_D }}>Open Search · 129 (62%)</span>
              <span style={{ fontSize: 9, color: INK3 }}>Contextual · 79 (38%)</span>
            </div>
            <div style={{ display: "flex", borderRadius: 99, overflow: "hidden", height: 10, marginBottom: 8 }}>
              <div style={{ width: "62%", background: BLUE_D }} />
              <div style={{ width: "38%", background: "#9ec4e8" }} />
            </div>
            <div style={{ fontSize: 8, color: INK3, lineHeight: 1.5 }}>
              <strong>Open Search (129):</strong> 85 highlights · 35 copies · 9 source clicks<br/>
              <strong>Contextual (79):</strong> 51 highlights · 28 copies · 0 source clicks
            </div>
          </div>
        </div>
        <div style={{ fontSize: 8, color: BLUE, marginTop: 10, fontStyle: "italic" }}>Live via MCP — most balanced OS/Contextual split since May (62/38 vs July's 90/10).</div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "8px 0" }} />

      {/* Signals — executive */}
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK2, fontWeight: 500, marginBottom: 4 }}>Signals — early read (12 days in)</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${GREEN}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: INK, marginBottom: 6 }}>Penetration crossed 51%</div>
          <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            1,842 cumulative users — +24 net-new in 12 days. Adoption keeps compounding past the halfway mark of the bank with no active campaign.
          </p>
        </div>
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid ${BLUE}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: INK, marginBottom: 6 }}>Summer pace, as expected</div>
          <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            78 users · 209 sessions in the first third of the month — tracking near July's rhythm. The real test is the back-to-work rebound after mid-August.
          </p>
        </div>
        <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "16px 18px", borderLeft: `3px solid #7c5cbf` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: INK, marginBottom: 6 }}>Reach still widening</div>
          <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            20 countries already, with Germany appearing for the first time — geographic spread holds even in a quiet month, not just HQ traffic.
          </p>
        </div>
      </div>

      {/* Pending sections note */}
      <div style={{ background: SURF, border: `1px dashed ${BDR}`, borderRadius: 10, padding: "16px 20px", fontSize: 10, color: INK3, lineHeight: 1.6 }}>
        <strong style={{ color: INK2 }}>Live via MCP:</strong> users, sessions, countries, prompters, onboarding, pill views, source clicks, feedback, gallery/recent/new search — all pulled directly from FullStory metrics by ID. <strong style={{ color: INK2 }}>Still manual/pending:</strong> prompts sent, latency, CSAT (passed by hand), plus new/returning users, most-used pill, content engagement and LWA. These fill in the same way once their metric IDs are computed or values passed. Full month (through Aug 31) replaces this partial pull.
      </div>

    </div>
  );
}

// ── PRODUCT BENCHMARK ─────────────────────────────────────
function Benchmark() {
  const reachProducts = [
    { name: "Fiduciary Interface",        users: 500, kp: false },
    { name: "Client Connectivity (IDB staff)", users: 380, kp: false },
    { name: "Knowledge Platform",         users: 371, kp: true, sub: "median Apr–Jul · 251 in July alone" },
    { name: "Convergence — My Tasks",     users: 270, kp: false },
    { name: "Impact Management",          users: 163, kp: false },
    { name: "Convergence — Control",      users: 100, kp: false },
    { name: "Aurora",                     users: 87,  kp: false },
    { name: "Digital Solution Portal",    users: 10,  kp: false, sub: "internal pilot" },
  ];
  const maxReach = 500;

  const kpSeries = [
    { month: "Apr 2026", value: 588, pct: "16.3% of 3,600" },
    { month: "May 2026", value: 363, pct: "10.1% of 3,600" },
    { month: "Jun 2026", value: 379, pct: "10.5% of 3,600" },
    { month: "Jul 2026", value: 251, pct: "7% of 3,600" },
    { month: "Median",   value: 371, pct: "10.3% of 3,600", highlight: true },
  ];

  const intensity = [
    { name: "Knowledge Platform",        val: 2.9,  sub: "717 sessions · 251 users", kp: true, color: BLUE },
    { name: "Client Connectivity (staff)", val: 5.3, sub: "~1,997 sessions · ~380 users", color: BLUE },
    { name: "Client Connectivity (external)", val: 9.6, sub: "13,418 sessions · ~1,400 users", color: "#9b7cc7" },
    { name: "Digital Solution Portal",   val: 12.4, sub: "124 sessions · ~10 users", color: "#cbd5e1" },
    { name: "Impact Management",         val: 23.5, sub: "3,836 sessions · 163 users", color: GREEN },
  ];
  const maxIntensity = 23.5;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Context</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>IDB Product Benchmark — July 2026</div>
        <div style={{ fontSize: 11, color: INK3 }}>Where KP sits among other IDB digital products · Sources: FullStory (KP) + Datadog RUM (rest)</div>
      </div>

      {/* One-line read */}
      <div style={{ background: "#0A2342", borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a8c4e0", marginBottom: 10 }}>The one-line read</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", lineHeight: 1.5, marginBottom: 18 }}>
          KP's reach is mid-pack among IDB internal tools. Its frequency is the lowest — because it competes for a different moment: the occasional question, not the daily task.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { v: "251", l: "KP MAU · July" },
            { v: "371", l: "KP MAU · median Apr–Jul" },
            { v: "2.9", l: "Sessions per user · July" },
            { v: "36%", l: "Returned 2+ times" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontSize: 26, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{m.v}</div>
              <div style={{ fontSize: 8, color: "#a8c4e0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 1 · REACH */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>1 · Reach</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: INK, marginBottom: 8 }}>Monthly active users across IDB digital products</div>
        <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: "0 0 14px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          No internal IDB tool clears 400 monthly users on staff. Read against that ceiling, KP is not a small product — it is inside the normal band for bank-wide internal software.
        </p>

        {/* Copilot callout */}
        <div style={{ background: BLUE_L, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 12, alignItems: "baseline" }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: BLUE_D, flexShrink: 0 }}>~2,900</span>
          <span style={{ fontSize: 10, color: BLUE_D, lineHeight: 1.5 }}><strong>Microsoft Copilot</strong> — off scale, excluded from the chart below. A general-purpose assistant embedded in Office; not a comparable knowledge product, but it sets the ceiling of what "everyone uses it" looks like at the IDB.</span>
        </div>

        {/* Reach bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {reachProducts.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: p.kp ? BLUE_D : INK2, fontWeight: p.kp ? 600 : 400 }}>{p.name}</div>
                {p.sub && <div style={{ fontSize: 8, color: INK3 }}>{p.sub}</div>}
              </div>
              <div style={{ flex: 1, background: BG, borderRadius: 4, height: 16, overflow: "hidden" }}>
                <div style={{ width: `${(p.users/maxReach)*100}%`, height: "100%", background: p.kp ? "#1464A0" : "#c7ddf0", borderRadius: 4 }} />
              </div>
              <div style={{ width: 40, textAlign: "right", fontSize: 11, color: p.kp ? BLUE_D : INK2, fontWeight: p.kp ? 600 : 400 }}>{p.users}</div>
            </div>
          ))}
        </div>

        {/* KP series */}
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, margin: "20px 0 10px 0" }}>Which KP number to use — post go-live series</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {kpSeries.map((k, i) => (
            <div key={i} style={{ background: k.highlight ? BLUE_L : SURF, border: `1px solid ${k.highlight ? BLUE_M : BDR}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em", color: INK3, marginBottom: 4 }}>{k.month}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: k.highlight ? BLUE_D : INK, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 8, color: k.highlight ? BLUE_D : INK3 }}>{k.pct}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: INK3, lineHeight: 1.5, margin: "12px 0 0 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          April is the launch spike; May–June are the stable plateau; July is the outlier. The median neutralises the spike without dropping July. Every reasonable window — median Apr–Jun 379, mean Apr–Jul 395, mean Apr–Jun 443 — lands between 10% and 11% penetration, which is why 371 / 10.3% is the defensible headline rather than any single month.
        </p>
      </div>

      {/* 2 · INTENSITY */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>2 · Intensity</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: INK, marginBottom: 8 }}>Sessions per user — how often people come back within the month</div>
        <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: "0 0 14px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Only five products report both sessions and users, so this comparison is narrower than the reach chart. Fiduciary Interface, Convergence, Copilot and Aurora are excluded: users available, sessions not.
        </p>

        {/* Intensity legend */}
        <div style={{ display: "flex", gap: 20, marginBottom: 10, fontSize: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <span style={{ color: BLUE }}>Occasional lookup</span>
          <span style={{ color: "#9b7cc7" }}>Recurring</span>
          <span style={{ color: GREEN }}>Daily work tool</span>
        </div>

        {/* Intensity bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {intensity.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: p.kp ? BLUE_D : INK2, fontWeight: p.kp ? 600 : 400 }}>{p.name}</div>
                <div style={{ fontSize: 8, color: INK3 }}>{p.sub}</div>
              </div>
              <div style={{ flex: 1, background: BG, borderRadius: 4, height: 16, overflow: "hidden" }}>
                <div style={{ width: `${(p.val/maxIntensity)*100}%`, height: "100%", background: p.color, borderRadius: 4 }} />
              </div>
              <div style={{ width: 40, textAlign: "right", fontSize: 11, color: p.kp ? BLUE_D : INK2, fontWeight: p.kp ? 600 : 400 }}>{p.val}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: INK3, lineHeight: 1.5, margin: "14px 0 0 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          <strong>Frequency measures product type, not product quality.</strong> Impact Management is used daily because the work happens inside it — it is mandatory and transactional. KP is an optional lookup tool, so comparing raw frequency structurally favours mandatory software. Digital Solution Portal (10 users) is shown for completeness only: one person entering twenty times moves that average on its own.
        </p>
      </div>

      {/* 3 · RETURN */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>3 · Return</div>
        <div style={{ fontSize: 16, fontWeight: 500, color: INK, marginBottom: 8 }}>Behind the 2.9 average there are two very different populations</div>
        <p style={{ fontSize: 11, color: INK2, lineHeight: 1.5, margin: "0 0 14px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          The monthly average blends people who never came back with people who use KP regularly. Split apart, the number stops being a verdict and becomes a lever.
        </p>

        {/* Split bar */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", background: BG, borderRadius: 6, padding: "14px 16px", textAlign: "center", boxSizing: "border-box" }}>
            <span style={{ fontSize: 12, color: INK2 }}>~160 · one single visit</span>
          </div>
          <div style={{ flex: "1 1 120px", background: "#1464A0", borderRadius: 6, padding: "14px 16px", textAlign: "center", boxSizing: "border-box" }}>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>91 · came back</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: INK3, marginBottom: 16 }}>
          <span>64% did not return within July</span>
          <span>36% recorded 2+ sessions</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ border: `1px solid ${BDR}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: INK3, marginBottom: 6 }}>The real asset</div>
            <p style={{ fontSize: 10, color: INK2, lineHeight: 1.5, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>91 people already treat KP as a recurring tool. That base — not the headline average — is what the roadmap should be protecting and growing.</p>
          </div>
          <div style={{ border: `1px solid ${BDR}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: INK3, marginBottom: 6 }}>The lever</div>
            <p style={{ fontSize: 10, color: INK2, lineHeight: 1.5, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>The goal is not to reach 23.5. It is the second visit: converting one-time users requires no new acquisition — they are already inside.</p>
          </div>
        </div>
      </div>

      {/* METHOD */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "20px 24px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 10 }}>Method & caveats</div>
        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 10, color: INK2, lineHeight: 1.7, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          <li>KP figures from FullStory; all other products from Datadog RUM, 1–31 July 2026, bots excluded (–@device.type:Bot).</li>
          <li>Session criteria differ between FullStory and Datadog RUM — the frequency comparison is indicative, not exact.</li>
          <li>Internal vs external split by @iadb.org domain; email casing is inconsistent across IDB apps, so filters were run in both cases. Approximate in Convergence.</li>
          <li>MAU for comparables read off Datadog charts; treat as ±5%. Operations Portal and Cartera Inteligente have no July data / no instrumentation.</li>
          <li>Penetration denominator: 3,600 eligible IDB staff.</li>
        </ul>
      </div>

    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("august");
  const [monthOpen, setMonthOpen] = useState(false);
  const [launchOpen, setLaunchOpen] = useState(false);

  const MONTHS = [
    { id: "august",  label: "August 2026 · partial (live MCP)" },
    { id: "july",    label: "July 2026" },
    { id: "june",    label: "June 2026" },
    { id: "may",     label: "May 2026" },
    { id: "monthly", label: "April 2026" },
  ];
  const LAUNCH_VIEWS = [
    { id: "week12", label: "Week 1+2", sub: "Mar 31–Apr 17" },
    { id: "week1",  label: "Week 1 Pulse", sub: "Mar 31–Apr 10" },
    { id: "smoke",  label: "Smoke Test", sub: "0–48h" },
  ];

  const isMonth = MONTHS.some(m => m.id === view);
  const currentMonth = MONTHS.find(m => m.id === view);
  const currentLaunch = LAUNCH_VIEWS.find(l => l.id === view);

  const ddBtn = (active, onClick, children) => (
    <button onClick={onClick} style={{
      fontFamily: "inherit", fontSize: 11, fontWeight: 500,
      padding: "8px 14px", border: `1px solid ${active ? BLUE : BDR}`,
      borderRadius: 6, cursor: "pointer", letterSpacing: "0.04em", textTransform: "uppercase",
      background: active ? BLUE : SURF, color: active ? "#fff" : INK3,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      {children}
    </button>
  );

  const ddMenu = (items, onPick, closeFn) => (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 50,
      background: SURF, border: `1px solid ${BDR}`, borderRadius: 8,
      boxShadow: "0 8px 24px rgba(10,35,66,0.12)", minWidth: 180, overflow: "hidden",
    }}>
      {items.map((item) => (
        <button key={item.id}
          onClick={() => { onPick(item.id); closeFn(); }}
          style={{
            fontFamily: "inherit", display: "block", width: "100%", textAlign: "left",
            padding: "10px 14px", border: "none", cursor: "pointer",
            background: view === item.id ? BLUE_L : SURF,
            color: view === item.id ? BLUE_D : INK2, fontSize: 11, fontWeight: 500,
          }}>
          {item.label}
          {item.sub && <span style={{ display: "block", fontSize: 8, color: INK3, marginTop: 2 }}>{item.sub}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: BG, minHeight: "100vh", color: INK, fontSize: 13 }}
      onClick={() => { if (monthOpen) setMonthOpen(false); if (launchOpen) setLaunchOpen(false); }}>

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
        <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
          {/* Month selector */}
          <div style={{ position: "relative" }}>
            {ddBtn(isMonth, () => { setMonthOpen(!monthOpen); setLaunchOpen(false); }, (
              <>Month: {isMonth ? currentMonth.label : MONTHS[0].label} <span style={{ fontSize: 8 }}>▾</span></>
            ))}
            {monthOpen && ddMenu(MONTHS, setView, () => setMonthOpen(false))}
          </div>
          {/* Launch views selector */}
          <div style={{ position: "relative" }}>
            {ddBtn(!isMonth && view !== "benchmark", () => { setLaunchOpen(!launchOpen); setMonthOpen(false); }, (
              <>{!isMonth && currentLaunch ? currentLaunch.label : "Launch views"} <span style={{ fontSize: 8 }}>▾</span></>
            ))}
            {launchOpen && ddMenu(LAUNCH_VIEWS, setView, () => setLaunchOpen(false))}
          </div>
          {/* Benchmark */}
          {ddBtn(view === "benchmark", () => { setView("benchmark"); setMonthOpen(false); setLaunchOpen(false); }, "Benchmark")}
        </div>
      </div>

      {view === "smoke" ? <SmokeTest /> : view === "week1" ? <Week1 data={WEEK1} /> : view === "week12" ? <Week1 data={WEEK12} /> : view === "may" ? <MayMonthly /> : view === "june" ? <JuneMonthly /> : view === "july" ? <JulyMonthly /> : view === "august" ? <AugustMonthly /> : view === "benchmark" ? <Benchmark /> : <Monthly />}

      <div style={{ textAlign: "center", padding: 18, fontSize: 9, color: INK3, letterSpacing: "0.06em", borderTop: `1px solid ${BDR}` }}>
        IDB Knowledge Platform · Post Go-live Key Metrics · Go-live {GO_LIVE_DATE}
      </div>
    </div>
  );
}

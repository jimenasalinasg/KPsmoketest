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
  sessions: 757,
  users: 360,
  prompters: 125,
  prompts: 333,
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
    { name: "United States (HQ)", code: "US", users: 225, pct: 63 },
    { name: "Argentina",          code: "AR", users: 24,  pct: 7  },
    { name: "Brazil",             code: "BR", users: 15,  pct: 4  },
    { name: "Uruguay",            code: "UY", users: 14,  pct: 4  },
    { name: "Peru",               code: "PE", users: 12,  pct: 3  },
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
    { name: "Belize",             code: "BZ", users: 2,   pct: 1  },
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
  prompts: 450,
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
    { name: "United States (HQ)", code: "US", users: 274, pct: 62 },
    { name: "Argentina",          code: "AR", users: 26,  pct: 6  },
    { name: "Brazil",             code: "BR", users: 20,  pct: 5  },
    { name: "Peru",               code: "PE", users: 17,  pct: 4  },
    { name: "Uruguay",            code: "UY", users: 16,  pct: 4  },
    { name: "Colombia",           code: "CO", users: 12,  pct: 3  },
    { name: "Panama",             code: "PA", users: 10,  pct: 2  },
    { name: "Cayman Islands",     code: "KY", users: 9,   pct: 2  },
    { name: "El Salvador",        code: "SV", users: 7,   pct: 2  },
    { name: "Mexico",             code: "MX", users: 6,   pct: 1  },
    { name: "Trinidad & Tobago",  code: "TT", users: 6,   pct: 1  },
    { name: "Barbados",           code: "BB", users: 5,   pct: 1  },
    { name: "Chile",              code: "CL", users: 5,   pct: 1  },
    { name: "Paraguay",           code: "PY", users: 5,   pct: 1  },
    { name: "Spain",              code: "ES", users: 5,   pct: 1  },
    { name: "Bolivia",            code: "BO", users: 4,   pct: 0  },
    { name: "Honduras",           code: "HN", users: 4,   pct: 0  },
    { name: "Dominican Republic", code: "DO", users: 3,   pct: 0  },
    { name: "Ecuador",            code: "EC", users: 3,   pct: 0  },
    { name: "Jamaica",            code: "JM", users: 3,   pct: 0  },
    { name: "Belize",             code: "BZ", users: 2,   pct: 0  },
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
    prompts: 397,
    highlights: 380,
    copies: 158,
    sourceClicks: 142,
    pillPageviews: 932,
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

// ── ENGAGEMENT CARD (reusable for Monthly) ────────────────
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
  sessions: 1118,
  users: 449,
  prompters: 170,
  prompts: 132, // pending validation
  avgTime: "15.49s",
  dropoff: 92,
  retention: 29.3,
  highlighted: 399,
  highlightedOpenSearch: 304,
  copied: 95,
  copiedOpenSearch: 65,
  sourceClicks: 28,
  pillPageviews: 166,
  pillTop: "Similar projects (56)",
  pillBot: "Institutional documents (16)",
  openSearchVisits: 577,
  tourCompletion: 55,
  newUsers: 381,
  thumbsUp: 1,
  thumbsDown: 2,
  topCountry: "Argentina",
  topCountryCode: "AR",
  promptGalleryClicks: 39,
  recentSearchClicks: 20,
  newSearchClicks: 4,
  lwa: {
    visits: 65,
    bounce: 33,
    uniqueUsers: 38,
    usersCreated: 2,
    lessonsStartedTotal: 28,
    lessonsStartedExecution: 20,
    lessonsStartedPCR: 8,
    edited: 3,
    completed: 5,
    avgTime: "42m 46s",
    copiesButton: 2,
    copiesCursor: 3,
    copiesCombined: 5,
    pctReviewed: 60,
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
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 4 }}>Monthly Report</div>
        <div style={{ fontSize: 22, fontWeight: 500, color: INK, letterSpacing: "-0.02em", marginBottom: 4 }}>{MONTH}</div>
        <div style={{ fontSize: 11, color: INK3 }}>IDB Knowledge Platform · Source: FullStory</div>
      </div>

      {/* Metrics in progress banner */}
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#92400e" }}>Metrics in progress</div>
          <div style={{ fontSize: 10, color: "#b45309", marginTop: 2 }}>April data is partial — through Apr 21, 2026. Some figures are pending validation. Final numbers will be updated at month close.</div>
        </div>
      </div>

      {/* ── GENERAL USABILITY ── */}
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
          <MCard label="Unique users" value={String(APRIL.users)} desc="Total for the period" accent />
          <MCard label="New users" value={String(APRIL.newUsers)} desc="First-time visitors" />
          <MCard label="Sessions" value={APRIL.sessions.toLocaleString()} desc="Total for the period" bench={BENCH.monthly.sessions} />
          <MCard label="% Onboarding completed" value={`${APRIL.tourCompletion}%`} desc="Users who finished the tour" />
          <MCard label="% Returning users" value={`${APRIL.retention}%`} desc="Biweekly retention" />
          <MCard label="Countries" value="—" desc="Geographic reach" />
          <MCard label="Top country (excl. HQ)" value={APRIL.topCountry} desc="Pending count" flagCode={APRIL.topCountryCode} />
          <MCard label="CSAT — Customer Satisfaction Score" value="—" desc="Coming soon" />
        </Grid>

      </Section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: `2px solid ${BDR}`, margin: "24px 0" }} />

      {/* ── CONTEXTUAL SEARCH ── */}
      <Section emoji="🔍" title="Contextual Search">
        <Grid cols="repeat(auto-fit, minmax(200px, 1fr))">
          <MCard label="Queries (pill views)" value={String(APRIL.pillPageviews)} desc="Total visits across all contextual search pills" accent bench={BENCH.monthly.pillPageviews} />
          <MCard label="Most used pill" value="Similar projects" desc="56 interactions" small />
          <MCard label={<>Least used<br/>pill</>} value="Institutional documents" desc="16 interactions" small />
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

      {/* ── KNOWLEDGE ASSISTANT ── */}
      <Section emoji="🤖" title="Knowledge Assistant">
        <Grid>
          <MCard label="Sessions (Open Search)" value={String(APRIL.openSearchVisits)} desc="Visits to the Knowledge Assistant" bench={BENCH.monthly.sessions} />
          <MCard label="Prompters (≥1 prompt)" value={String(APRIL.prompters)} desc="38% of unique users" accent />
          <MCard label="Prompts sent" value={String(APRIL.prompts)} desc="Pending validation" accent bench={BENCH.monthly.prompts} />
          <MCard label="Source panel clicks" value={String(APRIL.sourceClicks)} desc="Clicks on source panel" bench={BENCH.monthly.sourceClicks} />
          <MCard label="👍 Thumbs Up" value={String(APRIL.thumbsUp)} desc="Positively rated responses" />
          <MCard label="👎 Thumbs Down" value={String(APRIL.thumbsDown)} desc="Negatively rated responses" />
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

        <div style={{ fontSize: 9, color: INK3, marginBottom: 10, fontStyle: "italic" }}>Adoption</div>
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

      {/* ── QUALITATIVE OBSERVATIONS ── */}
      <div style={{ background: SURF, border: `1px solid ${BDR}`, borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: INK3, marginBottom: 14 }}>
          💬 Qualitative Observations
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ padding: "12px 14px", background: BG, borderRadius: 8, borderLeft: `3px solid ${BDR}`, marginBottom: 8, minHeight: 44 }}>
            <span style={{ fontSize: 10, color: BDR, fontStyle: "italic" }}>Observation {i} — pending</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("monthly");

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
          {tabBtn("Week 1 Pulse", "week1", "Mar 31–Apr 10")}
          {tabBtn("Week 1+2", "week12", "Mar 31–Apr 17")}
          {tabBtn("Monthly Report", "monthly", "Apr 2026")}
        </div>
      </div>

      {view === "smoke" ? <SmokeTest /> : view === "week1" ? <Week1 data={WEEK1} /> : view === "week12" ? <Week1 data={WEEK12} /> : <Monthly />}

      <div style={{ textAlign: "center", padding: 18, fontSize: 9, color: INK3, letterSpacing: "0.06em", borderTop: `1px solid ${BDR}` }}>
        IDB Knowledge Platform · Post Go-live Key Metrics · Go-live {GO_LIVE_DATE}
      </div>
    </div>
  );
}

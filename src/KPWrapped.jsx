// KP Wrapped 2026 — el año contado como historia. Todos los numeros salen de src/data/wrapped.js
// (bloques mensuales de App + ledger + lecturas de FullStory documentadas). Sin valores inventados.
import { useEffect, useMemo, useRef, useState } from "react";
import { latestSnapshot, ledger } from "./data/ledgerView.js";
import {
  YEAR, ALL_MONTHS, MONTH_LABEL, MILESTONES, ORGANIC_USERS, SEGMENT_RULES,
  monthsInRange, sumCovered, fieldByMonth, pillRanking, featureRanking, loyalty, pct, fmt,
  weekdayProfile, COUNTRIES, BORROWERS, TOP_OPERATIONS, EXPLORERS, ANSWER_RATE, TOP_TOPICS, DAILY_THROUGH,
  LEARNINGS, SWEEPS, RETURN_M1,
} from "./data/wrapped.js";

const ES = { "United States": "Estados Unidos", Brazil: "Brasil", Panama: "Panamá", Peru: "Perú", Mexico: "México", Spain: "España", "Dominican Republic": "Rep. Dominicana", "Cayman Islands": "Islas Caimán", "Trinidad and Tobago": "Trinidad y Tobago", Belize: "Belice", Haiti: "Haití", Canada: "Canadá", France: "Francia", "United Kingdom": "Reino Unido", Germany: "Alemania", Belgium: "Bélgica", Italy: "Italia", Switzerland: "Suiza", Korea: "Corea", "Saint Martin": "San Martín", Bahamas: "Bahamas", Suriname: "Surinam" };
const esName = (n) => ES[n] ?? n;

const C = {
  night: "#0B1033", paper: "#F2EFE6", lime: "#D4FF3A", coral: "#FF5A45", sun: "#FFC233",
  cobalt: "#2D4BFF", mint: "#3FE0C5", violet: "#6B4EFF",
};

// Cada historia es un campo de color plano con una sola tinta y un acento. Sin degradados ni manchas.
const THEMES = {
  "w1":       { bg: C.night,  ink: C.paper, acc: C.lime },
  "w2":       { bg: C.paper,  ink: C.night, acc: C.cobalt },
  "w-rec":    { bg: C.sun,    ink: C.night, acc: C.night },
  "w-day":    { bg: C.night,  ink: C.paper, acc: C.mint },
  "w-map":    { bg: C.lime,   ink: C.night, acc: C.night },
  "w3":       { bg: C.paper,  ink: C.night, acc: C.coral },
  "w4":       { bg: C.night,  ink: C.paper, acc: C.sun },
  "w-ops":    { bg: C.coral,  ink: C.night, acc: C.night },
  "w5":       { bg: C.paper,  ink: C.night, acc: C.violet },
  "w-tribes": { bg: C.violet, ink: C.paper, acc: C.lime },
  "w-fast":   { bg: C.mint,   ink: C.night, acc: C.night },
  "w-topics": { bg: C.paper,  ink: C.night, acc: C.cobalt },
  "w6":       { bg: C.night,  ink: C.paper, acc: C.lime },
  "w7":       { bg: C.night,  ink: C.paper, acc: C.lime },
};

const mix = (v, p) => `color-mix(in srgb, var(${v}) ${p}%, transparent)`;

const CSS = `
.kpw{--pad:clamp(20px,5vw,72px);position:relative;height:calc(100dvh - 64px);overflow-y:auto;scroll-snap-type:y proximity;background:${C.night};font-family:"Inter Tight",system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums}
.kpw *{box-sizing:border-box}
.kpw-s{--dim:${mix("--ink", 74)};--faint:${mix("--ink", 54)};--line:${mix("--ink", 22)};--track:${mix("--ink", 10)};--track2:${mix("--ink", 26)};
  position:relative;min-height:calc(100dvh - 64px);scroll-snap-align:start;padding:clamp(84px,12vh,120px) var(--pad) 120px;display:flex;flex-direction:column;justify-content:center;background:var(--bg);color:var(--ink)}
.kpw-frame{position:absolute;top:22px;left:var(--pad);right:var(--pad);display:flex;justify-content:space-between;gap:16px;padding-bottom:10px;border-bottom:1px solid var(--line);font:500 11px/1 "DM Mono",ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.kpw-frame b{color:var(--ink);font-weight:500}
.kpw-in{max-width:1180px;width:100%;margin:0 auto;position:relative}
.kpw-k{font:500 12px/1.2 "DM Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);display:flex;align-items:center;gap:10px}
.kpw-k::before{content:"";width:22px;height:2px;background:var(--acc);flex:none}
.kpw-h{font-weight:800;letter-spacing:-.045em;line-height:.9;font-size:clamp(44px,min(9vw,13vh),128px);margin:18px 0 22px;max-width:14ch}
.kpw-h2{font-weight:800;letter-spacing:-.035em;line-height:.95;font-size:clamp(30px,min(5.2vw,8.5vh),76px);margin:16px 0 18px;max-width:18ch}
.kpw-p{font-size:clamp(16px,1.6vw,20px);line-height:1.45;color:var(--dim);max-width:46ch;margin:0;font-weight:400}
.kpw-big{font-weight:900;letter-spacing:-.06em;line-height:.8;font-size:clamp(96px,min(20vw,30vh),260px);color:var(--acc)}
.kpw-note{font:400 12px/1.55 "Inter Tight",system-ui,sans-serif;color:var(--faint);max-width:92ch;margin-top:28px;padding-top:12px;border-top:1px solid var(--line)}
.kpw-rise{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s cubic-bezier(.2,.7,.2,1)}
.kpw-s.on .kpw-rise{opacity:1;transform:none}
.kpw-d1{transition-delay:.05s}.kpw-d2{transition-delay:.1s}.kpw-d3{transition-delay:.15s}.kpw-d4{transition-delay:.2s}
.kpw-bar{height:100%;background:var(--acc);width:0;transition:width .6s cubic-bezier(.2,.7,.2,1) .1s}
.kpw-s.on .kpw-bar{width:var(--w)}
.kpw-grid{display:grid;gap:clamp(18px,3vw,40px);grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.kpw-stat{border-top:2px solid var(--ink);padding-top:14px}
.kpw-stat b{display:block;font-weight:800;letter-spacing:-.05em;line-height:.85;font-size:clamp(48px,7.5vw,104px);color:var(--acc)}
.kpw-stat span{display:block;margin-top:12px;font-size:15px;line-height:1.45;color:var(--dim)}
.kpw-nav{position:sticky;bottom:16px;z-index:5;display:flex;justify-content:flex-end;padding-right:var(--pad);pointer-events:none;height:0}
.kpw-navi{pointer-events:auto;transform:translateY(-58px);display:flex;align-items:center;gap:10px;background:${C.night};color:${C.paper};padding:6px 10px;outline:1px solid rgba(242,239,230,.18)}
.kpw-btn{all:unset;cursor:pointer;width:32px;height:32px;display:grid;place-items:center;font:500 14px "DM Mono",monospace}
.kpw-btn:hover,.kpw-btn:focus-visible{background:rgba(255,255,255,.12);outline:2px solid ${C.lime};outline-offset:1px}
.kpw-btn[disabled]{opacity:.3;cursor:default}
.kpw-dot{all:unset;cursor:pointer;width:8px;height:3px;background:rgba(242,239,230,.3);transition:background .3s,width .3s}
.kpw-dot[aria-current="step"]{width:22px;background:${C.lime}}
.kpw-dot:focus-visible{outline:2px solid ${C.lime};outline-offset:3px}
.kpw-range{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font:500 12px "DM Mono",monospace;letter-spacing:.04em;color:var(--dim);margin-top:40px;padding-top:14px;border-top:1px solid var(--line);max-width:760px}
.kpw-range select{font:inherit;color:var(--ink);background:transparent;border:0;border-bottom:1px solid var(--ink);border-radius:0;padding:4px 2px}
.kpw-range option{color:#111}
.kpw-tl{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));border-top:2px solid var(--ink)}
.kpw-card{padding:20px 22px 22px 0;border-right:1px solid var(--line)}
.kpw-card + .kpw-card{padding-left:22px}
.kpw-card:last-child{border-right:0}
.kpw-card.hl{background:var(--acc);color:var(--bg);padding-left:22px;border-right:0}
.kpw-card.hl .kpw-p,.kpw-card.hl .kpw-ev,.kpw-card.hl .kpw-k{color:var(--bg)}
.kpw-card.hl .kpw-k::before{background:var(--bg)}
.kpw-ev{font:500 11px/1.4 "DM Mono",ui-monospace,monospace;color:var(--faint);margin-top:14px}
@keyframes kpwpop{0%{transform:translateY(24px);opacity:0}100%{transform:none;opacity:1}}
.kpw-s.on .kpw-pop{animation:kpwpop .5s cubic-bezier(.2,.7,.2,1) both}
@media (max-width:720px){.kpw{height:auto;overflow:visible;scroll-snap-type:none}.kpw-s{min-height:auto;padding:76px var(--pad) 80px}.kpw-frame-mid{display:none}.kpw-nav{position:fixed;left:0;right:0;bottom:12px;height:auto;justify-content:center;padding:0}.kpw-navi{transform:none}.kpw-card{border-right:0;border-bottom:1px solid var(--line);padding:18px 0!important}.kpw-card.hl{padding:18px 16px!important}}
@media (prefers-reduced-motion: reduce){
  .kpw{scroll-behavior:auto}
  .kpw-rise,.kpw-bar{transition:none!important;opacity:1;transform:none}
  .kpw-bar{width:var(--w)}
  .kpw-s.on .kpw-pop{animation:none!important}
}
`;

function Section({ id, active, num, total, label, children }) {
  const t = THEMES[id] ?? THEMES.w1;
  return (
    <section id={id} data-wrap className={`kpw-s${active ? " on" : ""}`} style={{ "--bg": t.bg, "--ink": t.ink, "--acc": t.acc }} aria-roledescription="slide" aria-label={label}>
      <div className="kpw-frame" aria-hidden="true"><span><b>KP Wrapped</b> 2026</span><span className="kpw-frame-mid">{label}</span><span><b>{String(num).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}</span></div>
      <div className="kpw-in">{children}</div>
    </section>
  );
}

const Partial = ({ cov, label }) => cov && !cov.complete
  ? <span style={{ color: "var(--faint)" }}> · {label ?? "con datos en"} {cov.covered} de {cov.total} meses</span> : null;

export default function KPWrapped({ months: monthRows }) {
  const rowsBy = useMemo(() => Object.fromEntries(monthRows.map((r) => [r.month, r])), [monthRows]);
  const lastLoaded = useMemo(() => monthRows.map((r) => r.month).sort().at(-1), [monthRows]);
  const pickable = ALL_MONTHS.filter((m) => m <= lastLoaded);
  const [from, setFrom] = useState(pickable[0]);
  const [to, setTo] = useState(lastLoaded);
  const months = monthsInRange(from, to);

  // ── Cálculos (todos sobre el rango) ──
  const sessions = sumCovered(fieldByMonth(monthRows, "sessions"), months);
  const newPeople = sumCovered(fieldByMonth(monthRows, "first_time"), months);
  const prompts = sumCovered(fieldByMonth(monthRows, "prompts"), months);
  const cum = ledger.snapshot?.unique_users ?? {};
  const cumMonth = Object.keys(cum).filter((m) => m <= to).sort().at(-1);
  const cumUsers = cumMonth ? cum[cumMonth] : null;
  const usersBy = { ...ORGANIC_USERS, ...fieldByMonth(monthRows, "users") };
  const pre = months.filter((m) => m < "2026-04" && usersBy[m] != null);
  const post = months.filter((m) => m >= "2026-04" && usersBy[m] != null && !rowsBy[m]?.partial);
  const avg = (ms) => ms.reduce((a, m) => a + usersBy[m], 0) / ms.length;
  const growth = pre.length && post.length ? avg(post) / avg(pre) - 1 : null;

  const fullMonths = months.filter((m) => rowsBy[m] && !rowsBy[m].partial);
  const loyMonth = [...fullMonths].reverse().find((m) => loyalty(m, rowsBy[m].users));
  const loy = loyMonth ? loyalty(loyMonth, rowsBy[loyMonth].users) : null;
  const loyRow = loyMonth ? rowsBy[loyMonth] : null;
  const returningShare = loyRow && loyRow.first_time != null ? (loyRow.users - loyRow.first_time) / loyRow.users : null;
  const firstLoyMonth = fullMonths.find((m) => ledger.snapshot?.power_users?.[m] != null);

  const pills = pillRanking(months);
  const star = pills.rows[0];
  const feats = featureRanking(months);
  const miles = MILESTONES.filter((m) => m.date.slice(0, 7) >= from && m.date.slice(0, 7) <= to);


  // Mes récord (usuarios únicos Sin DEV por mes; noviembre parcial queda fuera del récord)
  const userMonths = months.filter((m) => usersBy[m] != null);
  const recordMonth = userMonths.filter((m) => !rowsBy[m]?.partial).reduce((a, m) => (a == null || usersBy[m] > usersBy[a] ? m : a), null);
  const maxUsers = Math.max(1, ...userMonths.map((m) => usersBy[m]));
  const week = weekdayProfile(months);
  const borrowersReached = COUNTRIES.rows.filter((c) => BORROWERS.includes(c.name)).length;
  const lat = months.map((m) => ({ m, v: rowsBy[m]?.latency })).filter((x) => x.v != null);
  const latFirst = lat[0], latLast = lat.at(-1);
  const ansFirst = latFirst && ANSWER_RATE[latFirst.m] != null ? latFirst : lat.find((x) => ANSWER_RATE[x.m] != null);
  const ansLast = latLast && ANSWER_RATE[latLast.m] != null ? latLast : null;
  const monthLong = (m) => { const t = new Date(`${m}-01T00:00:00Z`).toLocaleString("es", { month: "long", timeZone: "UTC" }); return t[0].toUpperCase() + t.slice(1); };
  const fmtDay = (d) => new Date(`${d}T00:00:00Z`).toLocaleString("es", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

  // ── Navegación ──
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));
  const SLIDES = TOP_TOPICS ? 14 : 13;
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const secs = [...root.querySelectorAll("[data-wrap]")];
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (!e.isIntersecting) return; const i = secs.indexOf(e.target); setActive(i); setSeen((prev) => (prev.has(i) ? prev : new Set(prev).add(i))); }), { root: null, rootMargin: "-30% 0px -30% 0px", threshold: 0 });
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  const go = (i) => {
    const secs = ref.current?.querySelectorAll("[data-wrap]");
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    secs?.[Math.max(0, Math.min(SLIDES - 1, i))]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const onKey = (e) => {
    if (["ArrowDown", "PageDown", "ArrowRight"].includes(e.key)) { e.preventDefault(); go(active + 1); }
    if (["ArrowUp", "PageUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); go(active - 1); }
  };
  const on = (i) => active === i;
  let n = 0; const nx = () => n++;
  const st = (i) => ({ active: seen.has(i), num: i + 1, total: SLIDES });
  const rangeLabel = `${MONTH_LABEL(from)}–${MONTH_LABEL(to)} ${YEAR}`;
  const partialTo = rowsBy[to]?.partial ? ` (${MONTH_LABEL(to)} hasta el ${rowsBy[to].through})` : "";

  return (
    <div ref={ref} className="kpw" tabIndex={0} onKeyDown={onKey} aria-label="KP Wrapped 2026, el año en revisión">
      <style>{CSS}</style>

      {/* 1 — Bienvenida */}
      <Section id="w1" label="Bienvenida" {...st(nx())}>
        <div className="kpw-k kpw-rise">Knowledge Platform · Wrapped</div>
        <div className="kpw-pop" aria-hidden="true" style={{ fontWeight: 900, fontSize: "clamp(110px,min(26vw,38vh),360px)", letterSpacing: "-.07em", lineHeight: .78, margin: "22px 0 0 -0.05em", color: "var(--acc)" }}>{YEAR}</div>
        <h2 className="kpw-h kpw-rise kpw-d1" aria-label="2026 fue un gran año para el conocimiento." style={{ fontSize: "clamp(36px,min(6vw,8vh),88px)", maxWidth: "16ch", marginTop: 18 }}>fue un gran año para el conocimiento.</h2>
        <p className="kpw-p kpw-rise kpw-d2">Así exploramos, descubrimos y conectamos conocimiento en Knowledge Platform.</p>
        <div className="kpw-range kpw-rise kpw-d3">
          <label>Desde <select value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }}>{pickable.map((m) => <option key={m} value={m}>{MONTH_LABEL(m)} {YEAR}</option>)}</select></label>
          <label>hasta <select value={to} onChange={(e) => { setTo(e.target.value); if (e.target.value < from) setFrom(e.target.value); }}>{pickable.map((m) => <option key={m} value={m}>{MONTH_LABEL(m)} {YEAR}</option>)}</select></label>
          <span>· {rangeLabel}{partialTo}. Avanza con ↓ o con los controles.</span>
        </div>
      </Section>

      {/* 2 — El año en números */}
      <Section id="w2" label="El año en números" {...st(nx())}>
        <div className="kpw-k kpw-rise">El año en números · {rangeLabel}</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Los números, primero.</h2>
        <div className="kpw-grid" style={{ marginTop: 26 }}>
          <div className="kpw-stat kpw-rise kpw-d1">{sessions.covered ? <><b>{fmt(sessions.value)}</b><span>{from === ALL_MONTHS[0] ? "Este año" : `En ${rangeLabel}`} nos visitaron {fmt(sessions.value)} veces (sesiones).<Partial cov={sessions} /></span></> : <span>Sin datos de sesiones en este rango: se registran desde abril.</span>}</div>
          <div className="kpw-stat kpw-rise kpw-d2" style={{ "--acc": "var(--ink)" }}>{newPeople.covered ? <><b>{fmt(newPeople.value)}</b><span>{fmt(newPeople.value)} personas exploraron Knowledge Platform por primera vez.<Partial cov={newPeople} /></span></> : <span>Sin datos de usuarios nuevos en este rango.</span>}</div>
          <div className="kpw-stat kpw-rise kpw-d3" style={{ "--acc": "var(--ink)" }}>{prompts.covered ? <><b>{fmt(prompts.value)}</b><span>Juntos hicimos {fmt(prompts.value)} preguntas al Knowledge Assistant.<Partial cov={prompts} /></span></> : <span>Sin datos de preguntas en este rango.</span>}</div>
        </div>
        <div className="kpw-grid kpw-rise kpw-d4" style={{ marginTop: 34 }}>
          {cumUsers != null && <p className="kpw-p"><strong style={{ color: "var(--ink)" }}>{fmt(cumUsers)} personas</strong> han usado KP desde su lanzamiento orgánico (sept. 2025) — {pct(cumUsers / 7287, 1)} del staff y consultores del BID.</p>}
          {growth != null
            ? <p className="kpw-p"><strong style={{ color: "var(--ink)" }}>{growth > 0 ? "+" : ""}{pct(growth)}</strong> usuarios por mes después del go-live, frente al promedio de los meses orgánicos de {YEAR} ({pre.map(MONTH_LABEL).join(", ")}).</p>
            : <p className="kpw-p">Para comparar con el período orgánico, el rango debe incluir meses antes y después del go-live.</p>}
        </div>
        <p className="kpw-note kpw-rise kpw-d4">Las sesiones cuentan visitas en todos los entornos, con el equipo incluido; personas y preguntas excluyen al equipo (segmento Sin DEV). Las preguntas vienen de la consola de administración, que se carga por mes cerrado. Cada persona cuenta una sola vez, en el mes en que llegó por primera vez: los usuarios mensuales nunca se suman. El promedio orgánico usa marzo del 1 al 30, sin el día del go-live.</p>
      </Section>

      {/* Mes récord */}
      <Section id="w-rec" label="Mes récord" {...st(nx())}>
        <div className="kpw-k kpw-rise">El mes récord</div>
        {recordMonth ? <>
          <h2 className="kpw-h2 kpw-rise kpw-d1">{monthLong(recordMonth)} fue nuestro mes récord: {fmt(usersBy[recordMonth])} personas.</h2>
          <p className="kpw-p kpw-rise kpw-d1">{recordMonth === "2026-04" ? "El mes del go-live: KP se abrió a todo el Banco y la curiosidad hizo el resto." : "El mes con más personas distintas usando KP."}{week.record ? ` Y el día con más visitas fue el ${fmtDay(week.record.date)}, con ${fmt(week.record.value)} sesiones.` : ""}</p>
          <div className="kpw-rise kpw-d2" role="img" aria-label={userMonths.map((m) => `${MONTH_LABEL(m)} ${usersBy[m]}`).join(", ")} style={{ display: "flex", alignItems: "flex-end", gap: "clamp(4px,1vw,12px)", height: "clamp(160px,32vh,280px)", marginTop: 30 }}>
            {userMonths.map((m) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, color: m === recordMonth ? "var(--ink)" : "var(--faint)", fontWeight: m === recordMonth ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>{usersBy[m]}</span>
                <div style={{ width: "100%", height: `${(usersBy[m] / maxUsers) * 100}%`, background: m === recordMonth ? "var(--ink)" : m < "2026-04" ? "var(--track2)" : "var(--dim)", opacity: rowsBy[m]?.partial ? .45 : 1 }} />
                <span style={{ fontSize: 11, color: "var(--dim)" }}>{MONTH_LABEL(m)}</span>
              </div>
            ))}
          </div>
          <p className="kpw-note">Personas distintas por mes (segmento Sin DEV); enero–marzo son meses orgánicos, antes del go-live.{months.includes("2026-11") ? " Noviembre va del 1 al 3 y no compite por el récord." : ""} El día récord cuenta sesiones Sin DEV.</p>
        </> : <p className="kpw-p kpw-rise">Sin datos de usuarios mensuales en este rango.</p>}
      </Section>

      {/* Día favorito */}
      <Section id="w-day" label="Día favorito" {...st(nx())}>
        <div className="kpw-k kpw-rise">Nuestro día favorito</div>
        {week.sum > 0 ? <>
          <h2 className="kpw-h kpw-pop" style={{ textTransform: "capitalize", color: "var(--acc)" }}>{week.best.day}.</h2>
          <p className="kpw-p kpw-rise kpw-d1">El {week.best.day} concentró {pct(week.best.share)} de las sesiones del año. KP es una herramienta de trabajo: el fin de semana apenas suma {pct(week.weekend)}.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "clamp(4px,1vw,10px)", alignItems: "end", height: "clamp(140px,26vh,220px)", marginTop: 28 }} role="img" aria-label={week.rows.map((r) => `${r.day} ${pct(r.share)}`).join(", ")}>
            {week.rows.map((r) => (
              <div key={r.day} className="kpw-rise" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 6, height: "100%" }}>
                <span style={{ fontSize: 11, color: r === week.best ? "var(--acc)" : "var(--faint)" }}>{pct(r.share)}</span>
                <div style={{ width: "100%", height: `${(r.value / week.best.value) * 100}%`, background: r === week.best ? "var(--acc)" : "var(--track2)" }} />
                <span style={{ fontSize: 11, color: "var(--dim)" }}>{r.day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <p className="kpw-note">Sesiones por día de la semana (segmento Sin DEV), {week.days} días con datos hasta el {DAILY_THROUGH.slice(8)}-nov. Día calendario en UTC. La hora del día no se incluye: FullStory no la entrega con zona horaria confiable por MCP.</p>
        </> : <p className="kpw-p kpw-rise">Sin datos diarios en este rango.</p>}
      </Section>

      {/* Mapa */}
      <Section id="w-map" label="Mapa" {...st(nx())}>
        <div className="kpw-k kpw-rise">El mapa del conocimiento</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Personas en {COUNTRIES.rows.length} países usaron KP.</h2>
        <p className="kpw-p kpw-rise kpw-d1">{borrowersReached === BORROWERS.length ? `Llegamos a los ${BORROWERS.length} países miembros prestatarios del BID.` : `Llegamos a ${borrowersReached} de los ${BORROWERS.length} países miembros prestatarios del BID.`} Después de Estados Unidos, donde está la sede, el país que más exploró fue {esName(COUNTRIES.rows[1].name)}.</p>
        <div className="kpw-rise kpw-d2" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(6px,1vw,10px)", alignItems: "center", marginTop: 26 }} aria-label="Países por personas">
          {COUNTRIES.rows.map((c, i) => {
            const size = 26 + Math.sqrt(c.users / COUNTRIES.rows[0].users) * 110;
            return <span key={c.name} title={`${esName(c.name)}: ${c.users}`} style={{ width: size, height: size, borderRadius: "50%", display: "grid", placeItems: "center", textAlign: "center", padding: 4, fontSize: size > 70 ? 12 : 9, lineHeight: 1.1, color: i < 10 ? "var(--bg)" : "var(--ink)", background: i === 0 ? "var(--ink)" : i < 10 ? `color-mix(in srgb, var(--ink) ${82 - i * 4}%, transparent)` : "var(--track2)", overflow: "hidden" }}>{size > 46 ? <span>{esName(c.name)}<br /><b>{c.users}</b></span> : ""}</span>;
          })}
        </div>
        <p className="kpw-note">Personas distintas por país, 1-ene → 3-nov (segmento Sin DEV, sitio de producción); no cambia con el rango. El país es el que detecta FullStory por la conexión: una VPN puede ubicar a alguien en otro país.</p>
      </Section>

      {/* 3 — Usuarios más fieles */}
      <Section id="w3" label="Fidelidad" {...st(nx())}>
        <div className="kpw-k kpw-rise">Nuestros usuarios más fieles{loy ? ` · ${MONTH_LABEL(loyMonth)} ${YEAR}` : ""}</div>
        {loy ? <>
          <h2 className="kpw-h2 kpw-rise kpw-d1">{returningShare != null ? `${pct(returningShare)} de nuestros usuarios volvieron por más.` : `${loy.segments[2].value} personas se convirtieron en nuestros power users.`}</h2>
          <p className="kpw-p kpw-rise kpw-d1">{loy.segments[2].value} personas se convirtieron en nuestros power users en {MONTH_LABEL(loyMonth)}, y {loy.segments[1].value} más nos visitaron cada semana.</p>
          <div className="kpw-rise kpw-d2" role="img" aria-label={loy.segments.map((s) => `${s.label} ${s.value} (${pct(s.share)})`).join(", ")} style={{ display: "flex", height: 54, overflow: "hidden", margin: "34px 0 18px", background: "var(--track)", gap: 2 }}>
            {loy.segments.map((s, i) => (
              <div key={s.key} style={{ width: `${s.share * 100}%`, minWidth: s.value ? 6 : 0, background: ["var(--track2)", "var(--ink)", "var(--acc)"][i] }} />
            ))}
          </div>
          <div className="kpw-grid kpw-rise kpw-d3">
            {loy.segments.map((s, i) => (
              <div key={s.key} className="kpw-stat" style={{ "--acc": ["var(--ink)", "var(--ink)", "var(--acc)"][i] }}>
                <b>{pct(s.share)}</b><span><strong style={{ color: "var(--ink)" }}>{s.label} · {fmt(s.value)}</strong><br />{s.desc}</span>
              </div>
            ))}
          </div>
          <p className="kpw-note kpw-rise kpw-d4">Segmentos mutuamente excluyentes, medidos en una ventana móvil de 28 días que termina el último día de {MONTH_LABEL(loyMonth)} (visitas al home de KP, sin el equipo). Casual = usuarios del mes menos frecuentes: la ventana y el mes calendario difieren en unos días. «Volvieron por más» = personas que ya habían usado KP antes de ese mes. Los umbrales son nuestros, ajustados a los datos: Nielsen Norman Group no publica un umbral ni un benchmark de power users (su regla 90-9-1 trata de participación en comunidades en línea y no aplica aquí).{firstLoyMonth && firstLoyMonth !== loyMonth ? ` Referencia: ${ledger.snapshot.power_users[firstLoyMonth]} power users en ${MONTH_LABEL(firstLoyMonth)}, el mes del lanzamiento.` : ""}</p>
        </> : <p className="kpw-p kpw-rise">No hay un mes completo con datos de frecuencia en este rango: empiezan en abril.</p>}
      </Section>

      {/* 4 — La pill estrella */}
      <Section id="w4" label="Pill estrella" {...st(nx())}>
        <div className="kpw-k kpw-rise">La pill estrella del año</div>
        {pills.total > 0 ? <>
          <p className="kpw-p kpw-rise kpw-d1" style={{ fontSize: "clamp(18px,2.4vw,26px)", color: "var(--ink)" }}>Y la pill favorita del año fue…</p>
          <h2 className="kpw-h kpw-pop" style={{ color: "var(--acc)" }}>{star.name}!</h2>
          <p className="kpw-p kpw-rise kpw-d2">Con {fmt(star.value)} visualizaciones, fue la protagonista de {YEAR}: {pct(star.share)} de todas las vistas de pills.</p>
          <ol style={{ listStyle: "none", padding: 0, margin: "30px 0 0", display: "grid", gap: 12 }}>
            {pills.rows.map((r, i) => (
              <li key={r.name} className={`kpw-rise kpw-d${Math.min(i + 1, 4)}`} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", alignItems: "center", gap: 12, opacity: i < 3 ? 1 : .6 }}>
                <span style={{ font: "500 13px \"DM Mono\", monospace", color: i === 0 ? "var(--acc)" : "var(--faint)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span><span style={{ display: "block", fontSize: 15, marginBottom: 6 }}>{r.name}</span>
                  <span style={{ display: "block", height: 6, background: "var(--track)" }}><span className="kpw-bar" style={{ display: "block", "--w": `${(r.value / star.value) * 100}%`, "--acc": i === 0 ? "var(--acc)" : i < 3 ? "var(--ink)" : "var(--faint)" }} /></span></span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 14, color: "var(--dim)" }}>{fmt(r.value)} · {pct(r.share)}</span>
              </li>
            ))}
          </ol>
          <p className="kpw-note">Visualizaciones, no clics: cada número cuenta sesiones que abrieron esa pill al menos una vez (definiciones de página de FullStory, sin el equipo). El porcentaje es sobre las cinco pills juntas.{months.includes("2026-11") ? " Noviembre cubre del 1 al 3." : ""}</p>
        </> : <p className="kpw-p kpw-rise">Sin vistas de pills en este rango.</p>}
      </Section>

      {/* Operaciones más consultadas */}
      <Section id="w-ops" label="Operaciones" {...st(nx())}>
        <div className="kpw-k kpw-rise">Las operaciones más consultadas</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Y la operación más explorada fue <span style={{ fontFamily: "\"DM Mono\", monospace", fontWeight: 500, letterSpacing: "-.04em" }}>{TOP_OPERATIONS.rows[0].code}</span>.</h2>
        <p className="kpw-p kpw-rise kpw-d1">Abierta en {TOP_OPERATIONS.rows[0].sessions} sesiones. Detrás, una lista muy repartida: nadie se queda con una sola operación.</p>
        <ol style={{ listStyle: "none", padding: 0, margin: "26px 0 0", display: "grid", columnGap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", borderTop: "2px solid var(--ink)" }}>
          {TOP_OPERATIONS.rows.slice(0, 8).map((o, i) => (
            <li key={o.code} className={`kpw-rise kpw-d${Math.min(i + 1, 4)}`} style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div style={{ font: "500 11px \"DM Mono\", monospace", color: "var(--faint)" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: "\"DM Mono\", monospace", fontWeight: 500, fontSize: i === 0 ? 26 : 20, letterSpacing: "-.03em" }}>{o.code}</div>
              <div style={{ fontSize: 13, color: "var(--dim)" }}>{o.sessions} sesiones</div>
            </li>
          ))}
        </ol>
        <p className="kpw-note">Sesiones que abrieron las pills de cada operación (/knowledge/&lt;código&gt;), 1-ene → 3-nov, segmento Sin DEV; no cambia con el rango. Los códigos son números de operación públicos del BID. {TOP_OPERATIONS.rows.filter((o) => o.code.startsWith("BR-")).length} de las 8 primeras son de Brasil.</p>
      </Section>

      {/* 5 — Así exploramos */}
      <Section id="w5" label="Exploración" {...st(nx())}>
        <div className="kpw-k kpw-rise">Así exploramos el conocimiento</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1" style={{ maxWidth: "22ch", fontSize: "clamp(28px,min(4.4vw,7vh),60px)" }}>Cada exploración cuenta una historia. Y estos fueron nuestros caminos favoritos.</h2>
        <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
          {feats.rows.map((f, i) => (
            <div key={f.key} className={`kpw-rise kpw-d${Math.min(i + 1, 4)}`}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: "clamp(17px,2vw,22px)" }}>{f.name}{feats.riser?.key === f.key && <span style={{ marginLeft: 10, font: "500 10px \"DM Mono\", monospace", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--bg)", background: "var(--acc)", padding: "4px 7px", verticalAlign: "middle" }}>▲ ganó relevancia</span>}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--dim)", fontSize: 14 }}>{fmt(f.value)} eventos · {pct(f.share)}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--faint)", margin: "2px 0 8px" }}>{f.sub}</div>
              <div style={{ height: 8, background: "var(--track)" }}><div className="kpw-bar" style={{ "--w": `${feats.rows[0].value ? (f.value / feats.rows[0].value) * 100 : 0}%`, "--acc": feats.riser?.key === f.key || i === 0 ? "var(--acc)" : "var(--ink)" }} /></div>
            </div>
          ))}
        </div>
        {prompts.covered > 0 && <p className="kpw-p kpw-rise kpw-d4" style={{ marginTop: 26 }}>Y en el Knowledge Assistant (Open Search): <strong style={{ color: "var(--ink)" }}>{fmt(prompts.value)} preguntas</strong>, contadas aparte porque vienen de la consola, no de eventos.</p>}
        <p className="kpw-note">Eventos del ledger mensual (segmento Sin DEV), {rangeLabel}. «Ganó relevancia» compara la participación de cada funcionalidad en la primera mitad del rango ({feats.halves[0].map(MONTH_LABEL).join(", ")}) con la segunda ({feats.halves[1].map(MONTH_LABEL).join(", ") || "—"}); se marca solo por encima de +5 puntos.</p>
      </Section>

      {/* Tipos de explorador */}
      <Section id="w-tribes" label="Exploradores" {...st(nx())}>
        <div className="kpw-k kpw-rise">¿Qué tipo de explorador fue KP?</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Somos, sobre todo, {EXPLORERS.rows[0].name.toLowerCase().replace("el ", "")}s.</h2>
        <div className="kpw-grid" style={{ marginTop: 26 }}>
          {EXPLORERS.rows.map((e, i) => (
            <div key={e.key} className={`kpw-stat kpw-rise kpw-d${Math.min(i + 1, 4)}`} style={{ "--acc": i === 0 ? "var(--acc)" : "var(--ink)" }}>
              <b>{pct(e.value / EXPLORERS.base)}</b>
              <span><strong style={{ color: "var(--ink)" }}>{e.name}</strong> · {fmt(e.value)} personas<br />{e.verb}.</span>
            </div>
          ))}
        </div>
        <p className="kpw-note">Porcentaje de las {fmt(EXPLORERS.base)} personas que usaron KP entre el 1-ene y el 3-nov (segmento Sin DEV). Los tipos no son excluyentes: una misma persona puede ser curiosa e investigadora. Fuentes = panel de fuentes del asistente y links a fuente en las pills.</p>
      </Section>

      {/* Más rápido */}
      <Section id="w-fast" label="Velocidad" {...st(nx())}>
        <div className="kpw-k kpw-rise">Más rápido que nunca</div>
        {lat.length >= 2 ? <>
          <div className="kpw-big kpw-pop">{latLast.v}s</div>
          <h2 className="kpw-h2 kpw-rise kpw-d1">El asistente pasó de {latFirst.v} a {latLast.v} segundos por respuesta.</h2>
          <p className="kpw-p kpw-rise kpw-d2">Tiempo promedio de respuesta: {lat.map((x) => `${MONTH_LABEL(x.m)} ${x.v}s`).join(" → ")}.</p>
          {ansFirst && ansLast && ansLast.m !== ansFirst.m && <p className="kpw-p kpw-rise kpw-d3" style={{ marginTop: 16, color: "var(--ink)" }}>Pero la velocidad no lo es todo: en {MONTH_LABEL(ansLast.m)} respondió {pct(ANSWER_RATE[ansLast.m])} de las preguntas, frente a {pct(ANSWER_RATE[ansFirst.m])} en {MONTH_LABEL(ansFirst.m)}. Responder más es el reto de 2027.</p>}
          <p className="kpw-note">Consola de administración, promedio (no mediana). Meses anteriores a agosto se publicaron como mediana y no se comparan.</p>
        </> : <p className="kpw-p kpw-rise">Hacen falta al menos dos meses con latencia en el rango (hay datos de agosto a octubre).</p>}
      </Section>

      {TOP_TOPICS && (
        <Section id="w-topics" label="Temas" {...st(nx())}>
          <div className="kpw-k kpw-rise">Lo que más nos preguntaron</div>
          <h2 className="kpw-h2 kpw-rise kpw-d1">{TOP_TOPICS[0].topic}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gap: 8 }}>
            {TOP_TOPICS.slice(0, 5).map((t, i) => <li key={t.topic} className="kpw-rise" style={{ fontSize: "clamp(16px,2vw,22px)" }}><span style={{ color: "var(--acc)", fontWeight: 800 }}>{i + 1}</span> {t.topic} <span style={{ color: "var(--faint)" }}>· {fmt(t.count)}</span></li>)}
          </ol>
          <p className="kpw-note">Temas de la exportación de preguntas de la consola de administración.</p>
        </Section>
      )}

      {/* 6 — Un año de evolución */}
      <Section id="w6" label="Hitos" {...st(nx())}>
        <div className="kpw-k kpw-rise">Un año de evolución · hitos de producto</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Lo que cambió en el producto.</h2>
        {miles.length ? <div className="kpw-tl" style={{ marginTop: 26 }}>
          {miles.map((m, i) => (
            <article key={m.title} className={`kpw-card kpw-rise kpw-d${Math.min(i + 1, 4)}${m.highlight ? " hl" : ""}`}>
              <div className="kpw-k" style={{ color: m.highlight ? "var(--bg)" : "var(--ink)" }}>{m.date.length > 7 ? new Date(m.date + "T00:00:00Z").toLocaleString("es", { month: "short", day: "numeric", timeZone: "UTC" }).replace(".", "") : MONTH_LABEL(m.date)} {YEAR}</div>
              <h3 style={{ fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 800, letterSpacing: "-.02em", margin: "10px 0 8px", lineHeight: 1.05 }}>{m.title}</h3>
              <p className="kpw-p" style={{ fontSize: 15 }}>{m.body}</p>
              <div className="kpw-ev">Evidencia: {m.evidence}</div>
            </article>
          ))}
        </div> : <p className="kpw-p">No hay hitos documentados en este rango.</p>}
        <p className="kpw-note">Los hitos son cambios de producto, no métricas de uso. Solo aparecen los documentados en el repositorio o visibles en los datos.</p>
      </Section>

      {/* 7 — Cierre */}
      <Section id="w7" label="Cierre" {...st(nx())}>
        <div className="kpw-k kpw-rise">Lo que aprendimos de ustedes</div>
        <div className="kpw-grid" style={{ marginTop: 22 }}>
          {LEARNINGS.map((l, i) => (
            <div key={i} className={`kpw-stat kpw-rise kpw-d${Math.min(i + 1, 4)}`}>
              <b style={{ fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: "-.025em", lineHeight: 1.08, color: "var(--ink)" }}>{l.title}</b>
              <span>{l.body}</span>
            </div>
          ))}
        </div>
        <div className="kpw-k kpw-rise kpw-d2" style={{ marginTop: 44 }}>Los retos que nos dejan los datos para 2027</div>
        <div className="kpw-grid kpw-rise kpw-d3" style={{ marginTop: 18 }}>
          {[
            ansLast && { n: pct(ANSWER_RATE[ansLast.m]), t: "Responder más.", b: `Es la parte de las preguntas que el asistente respondió en ${monthLong(ansLast.m).toLowerCase()}.` },
            { n: pct(RETURN_M1.cohorts.reduce((a, c) => a + c[1], 0) / RETURN_M1.cohorts.reduce((a, c) => a + c[2], 0)), t: "Ganar la segunda visita.", b: `Es la parte de quienes llegaron en ${RETURN_M1.cohorts.map((c) => c[0]).join(" y ")} que volvió al mes siguiente.` },
            cumUsers != null && { n: pct(1 - cumUsers / 7287), t: "Llegar a todos.", b: `Es la parte del staff y los consultores del BID que todavía no ha abierto KP.` },
          ].filter(Boolean).map((c, i) => (
            <div key={i} className="kpw-stat" style={{ borderTopColor: "var(--acc)" }}>
              <b style={{ fontSize: "clamp(40px,5vw,72px)" }}>{c.n}</b>
              <span><strong style={{ color: "var(--ink)" }}>{c.t}</strong> {c.b}</span>
            </div>
          ))}
        </div>
        <h2 className="kpw-h kpw-pop" style={{ marginTop: 56, fontSize: "clamp(48px,10vw,150px)", maxWidth: "none" }}>That's a wrap.<br /><span style={{ color: "var(--acc)" }}>See you in 2027.</span></h2>
        <p className="kpw-note">Aprendizajes: patrones de {SWEEPS.sessions} sesiones leídas de principio a fin ({SWEEPS.months}), sin el equipo; son hipótesis a verificar, no mediciones. Retos: respuesta de la consola de administración; segunda visita de la tabla de cohortes (visita al home el mes siguiente); alcance = 1 − personas acumuladas / 7,287.</p>
      </Section>

      <nav className="kpw-nav" aria-label="Navegación de Wrapped">
        <div className="kpw-navi">
          <button className="kpw-btn" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Historia anterior">↑</button>
          {Array.from({ length: SLIDES }, (_, i) => (
            <button key={i} className="kpw-dot" onClick={() => go(i)} aria-label={`Ir a la historia ${i + 1} de ${SLIDES}`} aria-current={active === i ? "step" : undefined} />
          ))}
          <button className="kpw-btn" onClick={() => go(active + 1)} disabled={active === SLIDES - 1} aria-label="Historia siguiente">↓</button>
        </div>
      </nav>
    </div>
  );
}

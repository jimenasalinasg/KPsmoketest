// KP Wrapped 2026 — el año contado como historia. Todos los numeros salen de src/data/wrapped.js
// (bloques mensuales de App + ledger + lecturas de FullStory documentadas). Sin valores inventados.
import { useEffect, useMemo, useRef, useState } from "react";
import { latestSnapshot, ledger } from "./data/ledgerView.js";
import {
  YEAR, ALL_MONTHS, MONTH_LABEL, MILESTONES, ORGANIC_USERS, SEGMENT_RULES,
  monthsInRange, sumCovered, fieldByMonth, pillRanking, featureRanking, loyalty, pct, fmt,
} from "./data/wrapped.js";

const C = {
  night: "#0b1033", ink: "#f4f6ff", dim: "rgba(244,246,255,.72)", faint: "rgba(244,246,255,.45)",
  cyan: "#3ee0d0", lime: "#c6f432", coral: "#ff6b5b", violet: "#8c6cff", sun: "#ffc93c", blue: "#2f7bff",
};

const CSS = `
.kpw{--pad:clamp(20px,5vw,64px);position:relative;height:calc(100dvh - 64px);overflow-y:auto;scroll-snap-type:y mandatory;scroll-behavior:smooth;background:${C.night};color:${C.ink};font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.kpw *{box-sizing:border-box}
.kpw-s{position:relative;min-height:calc(100dvh - 64px);scroll-snap-align:start;padding:clamp(56px,9vh,96px) var(--pad) 128px;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.kpw-in{max-width:1080px;width:100%;margin:0 auto;position:relative;z-index:1}
.kpw-k{font:500 12px/1.2 "DM Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--acc)}
.kpw-h{font-weight:800;letter-spacing:-.035em;line-height:.95;font-size:clamp(40px,8.5vw,104px);margin:14px 0 18px}
.kpw-h2{font-weight:800;letter-spacing:-.03em;line-height:1;font-size:clamp(30px,5.5vw,64px);margin:12px 0 14px}
.kpw-p{font-size:clamp(15px,1.7vw,19px);line-height:1.5;color:${C.dim};max-width:620px;margin:0}
.kpw-big{font-weight:800;letter-spacing:-.05em;line-height:.85;font-size:clamp(64px,14vw,180px);color:var(--acc)}
.kpw-note{font-size:12px;line-height:1.5;color:${C.faint};max-width:760px;margin-top:22px}
.kpw-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:0;pointer-events:none}
.kpw-rise{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}
.kpw-s.on .kpw-rise{opacity:1;transform:none}
.kpw-d1{transition-delay:.12s}.kpw-d2{transition-delay:.28s}.kpw-d3{transition-delay:.44s}.kpw-d4{transition-delay:.6s}
.kpw-bar{height:100%;border-radius:999px;background:var(--acc);width:0;transition:width 1.1s cubic-bezier(.2,.7,.2,1) .3s}
.kpw-s.on .kpw-bar{width:var(--w)}
.kpw-grid{display:grid;gap:clamp(18px,3vw,36px);grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.kpw-stat{border-top:2px solid rgba(255,255,255,.18);padding-top:14px}
.kpw-stat b{display:block;font-weight:800;letter-spacing:-.04em;line-height:.9;font-size:clamp(44px,7vw,84px);color:var(--acc)}
.kpw-stat span{display:block;margin-top:10px;font-size:15px;line-height:1.4;color:${C.dim}}
.kpw-nav{position:sticky;bottom:16px;z-index:5;display:flex;justify-content:center;pointer-events:none;height:0}
.kpw-navi{pointer-events:auto;transform:translateY(-56px);display:flex;align-items:center;gap:10px;background:rgba(11,16,51,.82);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:6px 8px}
.kpw-btn{all:unset;cursor:pointer;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:${C.ink};font-size:16px}
.kpw-btn:hover,.kpw-btn:focus-visible{background:rgba(255,255,255,.12);outline:2px solid ${C.cyan};outline-offset:1px}
.kpw-btn[disabled]{opacity:.3;cursor:default}
.kpw-dot{all:unset;cursor:pointer;width:8px;height:8px;border-radius:999px;background:rgba(255,255,255,.3);transition:width .3s,background .3s}
.kpw-dot[aria-current="step"]{width:26px;background:${C.cyan}}
.kpw-dot:focus-visible{outline:2px solid ${C.cyan};outline-offset:3px}
.kpw-range{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:12px;color:${C.dim};margin-top:28px}
.kpw-range select{font:inherit;color:${C.ink};background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:6px 8px}
.kpw-range option{color:#111}
.kpw-tl{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(230px,1fr))}
.kpw-card{border-radius:20px;padding:22px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)}
.kpw-card.hl{background:linear-gradient(140deg,${C.lime},${C.cyan});color:${C.night};border:none}
.kpw-card.hl .kpw-p,.kpw-card.hl .kpw-ev{color:rgba(11,16,51,.75)}
.kpw-ev{font:500 11px/1.4 "DM Mono",ui-monospace,monospace;color:${C.faint};margin-top:12px}
.kpw-spin{animation:kpwfloat 9s ease-in-out infinite alternate}
@keyframes kpwfloat{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,-30px) scale(1.15)}}
@keyframes kpwpop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.05);opacity:1}100%{transform:scale(1)}}
.kpw-s.on .kpw-pop{animation:kpwpop .9s cubic-bezier(.2,.7,.2,1) .2s both}
@media (max-width:720px){.kpw{height:auto;overflow:visible;scroll-snap-type:none}.kpw-s{min-height:auto;padding:64px var(--pad) 72px}.kpw-nav{position:fixed;left:0;right:0;bottom:12px;height:auto}.kpw-navi{transform:none}}
@media (prefers-reduced-motion: reduce){
  .kpw{scroll-behavior:auto}
  .kpw-rise,.kpw-bar{transition:none!important;opacity:1;transform:none}
  .kpw-bar{width:var(--w)}
  .kpw-spin,.kpw-s.on .kpw-pop{animation:none!important}
}
`;

function Section({ id, acc, active, children, blobs = [] }) {
  return (
    <section id={id} data-wrap className={`kpw-s${active ? " on" : ""}`} style={{ "--acc": acc }} aria-roledescription="slide">
      {blobs.map((b, i) => <div key={i} aria-hidden="true" className="kpw-blob kpw-spin" style={b} />)}
      <div className="kpw-in">{children}</div>
    </section>
  );
}

const Partial = ({ cov, label }) => cov && !cov.complete
  ? <span style={{ color: C.faint }}> · {label ?? "con datos en"} {cov.covered} de {cov.total} meses</span> : null;

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

  const insights = [];
  if (newPeople.value > 0) insights.push({ t: "Más personas descubrieron la plataforma.", b: `${fmt(newPeople.value)} personas usaron KP por primera vez${cumUsers ? `, y ya son ${fmt(cumUsers)} desde el lanzamiento orgánico` : ""}.` });
  if (growth != null && growth > 0) insights.push({ t: "El lanzamiento multiplicó el alcance.", b: `Después del go-live, el promedio mensual de usuarios fue ${pct(growth)} más alto que en los meses orgánicos de ${YEAR}.` });
  if (star && star.value > 0) insights.push({ t: "Una pill se convirtió en la favorita.", b: `${star.name} abrió ${fmt(star.value)} sesiones, ${pct(star.share)} de todas las vistas de pills.` });
  if (feats.riser) insights.push({ t: "Abrimos nuevas formas de explorar conocimiento.", b: `${feats.riser.name} ganó ${Math.round(feats.riser.shift * 100)} puntos de participación en la segunda mitad del período.` });
  else if (returningShare != null && returningShare >= 0.5) insights.push({ t: "La mayoría ya nos conocía.", b: `En ${MONTH_LABEL(loyMonth)}, ${pct(returningShare)} de las personas que usaron KP ya lo habían usado antes.` });
  const topInsights = insights.slice(0, 4);

  // ── Navegación ──
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const SLIDES = 7;
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const secs = [...root.querySelectorAll("[data-wrap]")];
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) setActive(secs.indexOf(e.target)); }), { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 });
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
  const rangeLabel = `${MONTH_LABEL(from)}–${MONTH_LABEL(to)} ${YEAR}`;
  const partialTo = rowsBy[to]?.partial ? ` (${MONTH_LABEL(to)} hasta el ${rowsBy[to].through})` : "";

  return (
    <div ref={ref} className="kpw" tabIndex={0} onKeyDown={onKey} aria-label="KP Wrapped 2026, el año en revisión">
      <style>{CSS}</style>

      {/* 1 — Bienvenida */}
      <Section id="w1" acc={C.lime} active={on(0)} blobs={[
        { width: 520, height: 520, background: C.violet, top: -120, right: -140 },
        { width: 380, height: 380, background: C.cyan, bottom: -120, left: -80, animationDelay: "-3s" },
      ]}>
        <div className="kpw-k kpw-rise">Knowledge Platform · Wrapped</div>
        <div className="kpw-pop" aria-hidden="true" style={{ fontWeight: 900, fontSize: "clamp(96px,22vw,280px)", letterSpacing: "-.06em", lineHeight: .8, margin: "18px 0 6px", background: `linear-gradient(90deg,${C.lime},${C.cyan},${C.violet})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{YEAR}</div>
        <h2 className="kpw-h kpw-rise kpw-d1">2026 fue un gran año para el conocimiento.</h2>
        <p className="kpw-p kpw-rise kpw-d2">Así exploramos, descubrimos y conectamos conocimiento en Knowledge Platform.</p>
        <div className="kpw-range kpw-rise kpw-d3">
          <label>Desde <select value={from} onChange={(e) => { setFrom(e.target.value); if (e.target.value > to) setTo(e.target.value); }}>{pickable.map((m) => <option key={m} value={m}>{MONTH_LABEL(m)} {YEAR}</option>)}</select></label>
          <label>hasta <select value={to} onChange={(e) => { setTo(e.target.value); if (e.target.value < from) setFrom(e.target.value); }}>{pickable.map((m) => <option key={m} value={m}>{MONTH_LABEL(m)} {YEAR}</option>)}</select></label>
          <span>· {rangeLabel}{partialTo}. Avanza con ↓ o con los controles.</span>
        </div>
      </Section>

      {/* 2 — El año en números */}
      <Section id="w2" acc={C.cyan} active={on(1)} blobs={[{ width: 460, height: 460, background: C.blue, top: -80, left: -160 }]}>
        <div className="kpw-k kpw-rise">El año en números · {rangeLabel}</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Los números, primero.</h2>
        <div className="kpw-grid" style={{ marginTop: 26 }}>
          <div className="kpw-stat kpw-rise kpw-d1">{sessions.covered ? <><b>{fmt(sessions.value)}</b><span>{from === ALL_MONTHS[0] ? "Este año" : `En ${rangeLabel}`} nos visitaron {fmt(sessions.value)} veces (sesiones).<Partial cov={sessions} /></span></> : <span>Sin datos de sesiones en este rango: se registran desde abril.</span>}</div>
          <div className="kpw-stat kpw-rise kpw-d2" style={{ "--acc": C.lime }}>{newPeople.covered ? <><b>{fmt(newPeople.value)}</b><span>{fmt(newPeople.value)} personas exploraron Knowledge Platform por primera vez.<Partial cov={newPeople} /></span></> : <span>Sin datos de usuarios nuevos en este rango.</span>}</div>
          <div className="kpw-stat kpw-rise kpw-d3" style={{ "--acc": C.sun }}>{prompts.covered ? <><b>{fmt(prompts.value)}</b><span>Juntos hicimos {fmt(prompts.value)} preguntas al Knowledge Assistant.<Partial cov={prompts} /></span></> : <span>Sin datos de preguntas en este rango.</span>}</div>
        </div>
        <div className="kpw-grid kpw-rise kpw-d4" style={{ marginTop: 34 }}>
          {cumUsers != null && <p className="kpw-p"><strong style={{ color: C.ink }}>{fmt(cumUsers)} personas</strong> han usado KP desde su lanzamiento orgánico (sept. 2025) — {pct(cumUsers / 7287, 1)} del staff y consultores del BID.</p>}
          {growth != null
            ? <p className="kpw-p"><strong style={{ color: C.ink }}>{growth > 0 ? "+" : ""}{pct(growth)}</strong> usuarios por mes después del go-live, frente al promedio de los meses orgánicos de {YEAR} ({pre.map(MONTH_LABEL).join(", ")}).</p>
            : <p className="kpw-p">Para comparar con el período orgánico, el rango debe incluir meses antes y después del go-live.</p>}
        </div>
        <p className="kpw-note kpw-rise kpw-d4">Las sesiones cuentan visitas en todos los entornos, con el equipo incluido; personas y preguntas excluyen al equipo (segmento Sin DEV). Las preguntas vienen de la consola de administración, que se carga por mes cerrado. Cada persona cuenta una sola vez, en el mes en que llegó por primera vez: los usuarios mensuales nunca se suman. El promedio orgánico usa marzo del 1 al 30, sin el día del go-live.</p>
      </Section>

      {/* 3 — Usuarios más fieles */}
      <Section id="w3" acc={C.coral} active={on(2)} blobs={[{ width: 420, height: 420, background: C.coral, bottom: -160, right: -100 }]}>
        <div className="kpw-k kpw-rise">Nuestros usuarios más fieles{loy ? ` · ${MONTH_LABEL(loyMonth)} ${YEAR}` : ""}</div>
        {loy ? <>
          <h2 className="kpw-h2 kpw-rise kpw-d1">{returningShare != null ? `${pct(returningShare)} de nuestros usuarios volvieron por más.` : `${loy.segments[2].value} personas se convirtieron en nuestros power users.`}</h2>
          <p className="kpw-p kpw-rise kpw-d1">{loy.segments[2].value} personas se convirtieron en nuestros power users en {MONTH_LABEL(loyMonth)}, y {loy.segments[1].value} más nos visitaron cada semana.</p>
          <div className="kpw-rise kpw-d2" role="img" aria-label={loy.segments.map((s) => `${s.label} ${s.value} (${pct(s.share)})`).join(", ")} style={{ display: "flex", height: 54, borderRadius: 16, overflow: "hidden", margin: "30px 0 16px", background: "rgba(255,255,255,.06)" }}>
            {loy.segments.map((s, i) => (
              <div key={s.key} style={{ width: `${s.share * 100}%`, minWidth: s.value ? 6 : 0, background: [C.violet, C.cyan, C.coral][i] }} />
            ))}
          </div>
          <div className="kpw-grid kpw-rise kpw-d3">
            {loy.segments.map((s, i) => (
              <div key={s.key} className="kpw-stat" style={{ "--acc": [C.violet, C.cyan, C.coral][i] }}>
                <b>{pct(s.share)}</b><span><strong style={{ color: C.ink }}>{s.label} · {fmt(s.value)}</strong><br />{s.desc}</span>
              </div>
            ))}
          </div>
          <p className="kpw-note kpw-rise kpw-d4">Segmentos mutuamente excluyentes, medidos en una ventana móvil de 28 días que termina el último día de {MONTH_LABEL(loyMonth)} (visitas al home de KP, sin el equipo). Casual = usuarios del mes menos frecuentes: la ventana y el mes calendario difieren en unos días. «Volvieron por más» = personas que ya habían usado KP antes de ese mes. Los umbrales son nuestros, ajustados a los datos: Nielsen Norman Group no publica un umbral ni un benchmark de power users (su regla 90-9-1 trata de participación en comunidades en línea y no aplica aquí).{firstLoyMonth && firstLoyMonth !== loyMonth ? ` Referencia: ${ledger.snapshot.power_users[firstLoyMonth]} power users en ${MONTH_LABEL(firstLoyMonth)}, el mes del lanzamiento.` : ""}</p>
        </> : <p className="kpw-p kpw-rise">No hay un mes completo con datos de frecuencia en este rango: empiezan en abril.</p>}
      </Section>

      {/* 4 — La pill estrella */}
      <Section id="w4" acc={C.sun} active={on(3)} blobs={[{ width: 500, height: 500, background: C.sun, top: -200, right: -200, opacity: .3 }]}>
        <div className="kpw-k kpw-rise">La pill estrella del año</div>
        {pills.total > 0 ? <>
          <p className="kpw-p kpw-rise kpw-d1" style={{ fontSize: "clamp(18px,2.4vw,26px)", color: C.ink }}>Y la pill favorita del año fue…</p>
          <h2 className="kpw-h kpw-pop" style={{ color: C.sun }}>{star.name}!</h2>
          <p className="kpw-p kpw-rise kpw-d2">Con {fmt(star.value)} visualizaciones, fue la protagonista de {YEAR}: {pct(star.share)} de todas las vistas de pills.</p>
          <ol style={{ listStyle: "none", padding: 0, margin: "30px 0 0", display: "grid", gap: 12 }}>
            {pills.rows.map((r, i) => (
              <li key={r.name} className={`kpw-rise kpw-d${Math.min(i + 1, 4)}`} style={{ display: "grid", gridTemplateColumns: "34px 1fr auto", alignItems: "center", gap: 12, opacity: i < 3 ? 1 : .6 }}>
                <span style={{ fontWeight: 800, fontSize: 22, color: i < 3 ? C.sun : C.faint }}>{i + 1}</span>
                <span><span style={{ display: "block", fontSize: 15, marginBottom: 6 }}>{r.name}</span>
                  <span style={{ display: "block", height: 10, background: "rgba(255,255,255,.08)", borderRadius: 999 }}><span className="kpw-bar" style={{ display: "block", "--w": `${(r.value / star.value) * 100}%`, "--acc": i === 0 ? C.sun : i < 3 ? "#ffe08a" : "rgba(255,255,255,.35)" }} /></span></span>
                <span style={{ fontVariantNumeric: "tabular-nums", fontSize: 14, color: C.dim }}>{fmt(r.value)} · {pct(r.share)}</span>
              </li>
            ))}
          </ol>
          <p className="kpw-note">Visualizaciones, no clics: cada número cuenta sesiones que abrieron esa pill al menos una vez (definiciones de página de FullStory, sin el equipo). El porcentaje es sobre las cinco pills juntas.{months.includes("2026-11") ? " Noviembre cubre del 1 al 3." : ""}</p>
        </> : <p className="kpw-p kpw-rise">Sin vistas de pills en este rango.</p>}
      </Section>

      {/* 5 — Así exploramos */}
      <Section id="w5" acc={C.violet} active={on(4)} blobs={[{ width: 460, height: 460, background: C.violet, bottom: -180, left: -120 }]}>
        <div className="kpw-k kpw-rise">Así exploramos el conocimiento</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Cada exploración cuenta una historia. Y estos fueron nuestros caminos favoritos.</h2>
        <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
          {feats.rows.map((f, i) => (
            <div key={f.key} className={`kpw-rise kpw-d${Math.min(i + 1, 4)}`}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: "clamp(17px,2vw,22px)" }}>{f.name}{feats.riser?.key === f.key && <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 600, color: C.night, background: C.lime, borderRadius: 999, padding: "3px 8px", verticalAlign: "middle" }}>▲ ganó relevancia</span>}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: C.dim, fontSize: 14 }}>{fmt(f.value)} eventos · {pct(f.share)}</span>
              </div>
              <div style={{ fontSize: 13, color: C.faint, margin: "2px 0 8px" }}>{f.sub}</div>
              <div style={{ height: 14, background: "rgba(255,255,255,.08)", borderRadius: 999 }}><div className="kpw-bar" style={{ "--w": `${feats.rows[0].value ? (f.value / feats.rows[0].value) * 100 : 0}%`, "--acc": [C.violet, C.cyan, C.lime, C.coral][i % 4] }} /></div>
            </div>
          ))}
        </div>
        {prompts.covered > 0 && <p className="kpw-p kpw-rise kpw-d4" style={{ marginTop: 26 }}>Y en el Knowledge Assistant (Open Search): <strong style={{ color: C.ink }}>{fmt(prompts.value)} preguntas</strong>, contadas aparte porque vienen de la consola, no de eventos.</p>}
        <p className="kpw-note">Eventos del ledger mensual (segmento Sin DEV), {rangeLabel}. «Ganó relevancia» compara la participación de cada funcionalidad en la primera mitad del rango ({feats.halves[0].map(MONTH_LABEL).join(", ")}) con la segunda ({feats.halves[1].map(MONTH_LABEL).join(", ") || "—"}); se marca solo por encima de +5 puntos.</p>
      </Section>

      {/* 6 — Un año de evolución */}
      <Section id="w6" acc={C.lime} active={on(5)}>
        <div className="kpw-k kpw-rise">Un año de evolución · hitos de producto</div>
        <h2 className="kpw-h2 kpw-rise kpw-d1">Lo que cambió en el producto.</h2>
        {miles.length ? <div className="kpw-tl" style={{ marginTop: 26 }}>
          {miles.map((m, i) => (
            <article key={m.title} className={`kpw-card kpw-rise kpw-d${Math.min(i + 1, 4)}${m.highlight ? " hl" : ""}`}>
              <div className="kpw-k" style={{ color: m.highlight ? "rgba(11,16,51,.7)" : C.lime }}>{m.date.length > 7 ? new Date(m.date + "T00:00:00Z").toLocaleString("es", { month: "short", day: "numeric", timeZone: "UTC" }).replace(".", "") : MONTH_LABEL(m.date)} {YEAR}</div>
              <h3 style={{ fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 800, letterSpacing: "-.02em", margin: "10px 0 8px", lineHeight: 1.05 }}>{m.title}</h3>
              <p className="kpw-p" style={{ fontSize: 15 }}>{m.body}</p>
              <div className="kpw-ev">Evidencia: {m.evidence}</div>
            </article>
          ))}
        </div> : <p className="kpw-p">No hay hitos documentados en este rango.</p>}
        <p className="kpw-note">Los hitos son cambios de producto, no métricas de uso. Solo aparecen los documentados en el repositorio o visibles en los datos.</p>
      </Section>

      {/* 7 — Cierre */}
      <Section id="w7" acc={C.cyan} active={on(6)} blobs={[
        { width: 520, height: 520, background: C.cyan, top: -160, left: -160, opacity: .35 },
        { width: 420, height: 420, background: C.violet, bottom: -160, right: -120, animationDelay: "-4s" },
      ]}>
        <div className="kpw-k kpw-rise">El conocimiento sigue creciendo</div>
        <div className="kpw-grid" style={{ marginTop: 22 }}>
          {topInsights.map((it, i) => (
            <div key={i} className={`kpw-stat kpw-rise kpw-d${Math.min(i + 1, 4)}`} style={{ "--acc": [C.lime, C.cyan, C.sun, C.coral][i] }}>
              <b style={{ fontSize: "clamp(22px,2.6vw,30px)", letterSpacing: "-.02em", lineHeight: 1.1, color: [C.lime, C.cyan, C.sun, C.coral][i] }}>{it.t}</b>
              <span>{it.b}</span>
            </div>
          ))}
        </div>
        <h2 className="kpw-h kpw-pop" style={{ marginTop: 48 }}>That's a wrap.<br /><span style={{ color: C.cyan }}>See you in 2027.</span></h2>
        <p className="kpw-note">Cada insight aparece solo si los datos del rango lo respaldan. Rango: {rangeLabel}{partialTo}.</p>
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

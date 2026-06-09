<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KP Field Findings · IDB Knowledge Platform</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;1,300&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0D1B2E;--navy-2:#162236;
  --blue:#2563EB;--blue-light:#EFF6FF;--blue-mid:#3B82F6;
  --teal:#0F766E;--teal-light:#F0FDFA;--teal-mid:#14B8A6;
  --amber:#92400E;--amber-light:#FFFBEB;--amber-mid:#F59E0B;
  --red:#991B1B;--red-light:#FEF2F2;--red-mid:#EF4444;
  --purple:#5B21B6;--purple-light:#F5F3FF;--purple-mid:#8B5CF6;
  --ink:#111827;--ink-muted:#6B7280;--ink-faint:#9CA3AF;
  --surface:#F3F4F6;--surface-2:#E5E7EB;--white:#FFFFFF;
  --border:rgba(0,0,0,0.08);--border-strong:rgba(0,0,0,0.15);
  --col-co:#14B8A6;--col-br:#F59E0B;--col-cr:#6366F1;--col-cr:#6366F1;
}
body{font-family:'IBM Plex Sans',sans-serif;background:var(--surface);color:var(--ink);min-height:100vh;font-size:14px}

/* ── HEADER ── */
.header{background:var(--navy);padding:0}
.header-top{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2.5rem 0}
.brand-label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:3px}
.header-title{font-family:'IBM Plex Sans',sans-serif;font-weight:600;font-size:1.1rem;color:#fff}
.tab-nav{display:flex;gap:2px;padding:0 2.5rem;margin-top:1rem;overflow-x:auto}
.tab-btn{background:none;border:none;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;color:rgba(255,255,255,0.4);letter-spacing:0.08em;text-transform:uppercase;padding:0.625rem 1rem;border-bottom:2px solid transparent;transition:all 0.15s;display:flex;align-items:center;gap:7px;white-space:nowrap;border-radius:4px 4px 0 0}
.tab-btn:hover{color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.05)}
.tab-btn.active{color:#fff;border-bottom-color:var(--blue-mid);background:rgba(255,255,255,0.07)}
.tab-btn.disabled{opacity:0.25;cursor:default;pointer-events:none}
.tab-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.td-sint{background:#3B82F6}.td-co{background:var(--col-co)}.td-br{background:var(--col-br)}.td-cr{background:#6366F1}.td-dim{background:rgba(255,255,255,0.2)}.td-cr{background:#6366F1}

/* ── VIEWS ── */
.view{display:none}.view.active{display:block}

/* ── SUBHEADER ── */
.subheader{background:var(--white);border-bottom:1px solid var(--border);padding:1rem 2.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.report-label{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-faint);margin-bottom:2px}
.report-title{font-size:1.5rem;font-weight:600;color:var(--ink);line-height:1}
.report-source{font-size:12px;color:var(--ink-faint);margin-top:3px}
.export-btn{display:flex;align-items:center;gap:6px;background:var(--white);border:1px solid var(--border-strong);border-radius:6px;padding:7px 14px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;color:var(--ink-muted);cursor:pointer;letter-spacing:0.06em;transition:all 0.15s;white-space:nowrap}
.export-btn:hover{background:var(--surface);color:var(--ink);border-color:var(--ink-muted)}

/* ── CUMULATIVE ── */
.cumulative{background:var(--navy);margin:1.5rem 2.5rem 0;border-radius:10px;padding:1.25rem 2rem}
.cum-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin-bottom:0.875rem}
.cum-stats{display:flex;flex-wrap:wrap;gap:0}
.cum-item{padding-right:2.5rem}
.cum-val{font-family:'IBM Plex Mono',monospace;font-size:1.75rem;font-weight:500;color:#fff;line-height:1}
.cum-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);margin-top:3px}
.cum-div{width:1px;background:rgba(255,255,255,0.1);margin-right:2.5rem;align-self:stretch}

/* ── STAT CARDS ── */
.section{padding:1.5rem 2.5rem 0}
.section-head{display:flex;align-items:center;gap:8px;margin-bottom:1rem}
.section-mono{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:var(--ink-muted);font-weight:500}
.stat-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:0.875rem}
.stat-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:1rem 1.1rem}
.stat-card.hi{border-color:rgba(37,99,235,0.25);background:var(--blue-light)}
.sc-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-faint);margin-bottom:0.5rem}
.sc-val{font-family:'IBM Plex Mono',monospace;font-size:1.75rem;font-weight:500;color:var(--ink);line-height:1;margin-bottom:4px}
.sc-val.blue{color:var(--blue)}
.sc-sub{font-size:11px;color:var(--ink-muted);margin-bottom:8px}
.delta{display:inline-flex;align-items:center;gap:4px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;padding:2px 7px;border-radius:4px}
.up{background:#DCFCE7;color:#166534}.dn{background:#FEE2E2;color:#991B1B}.neu{background:var(--surface-2);color:var(--ink-muted)}

/* ── TWO COL ── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem;padding:1.5rem 2.5rem 0}
.full-w{padding:1.5rem 2.5rem 0}

/* ── TABLE CARD ── */
.table-card{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden}
.tc-head{padding:0.875rem 1.1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.tc-title{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-muted);font-weight:500}
.tc-sub{font-size:11px;color:var(--ink-faint)}

.ch-row{display:flex;align-items:center;gap:10px;padding:9px 1.1rem;border-bottom:1px solid var(--border)}
.ch-row:last-child{border-bottom:none}
.ch-badge{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:500;padding:2px 6px;border-radius:3px;flex-shrink:0;width:54px;text-align:center;letter-spacing:0.06em}
.b-crit{background:var(--red-light);color:var(--red)}.b-high{background:#FEF3C7;color:#92400E}.b-mid{background:var(--surface-2);color:var(--ink-muted)}
.ch-info{flex:1}.ch-name{font-size:12px;font-weight:500;color:var(--ink);margin-bottom:1px}.ch-sub2{font-size:11px;color:var(--ink-faint)}.ch-count{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink-faint);white-space:nowrap}

.opp-row{display:flex;align-items:center;gap:10px;padding:9px 1.1rem;border-bottom:1px solid var(--border)}
.opp-row:last-child{border-bottom:none}
.opp-num{width:20px;height:20px;border-radius:50%;background:var(--navy);color:#fff;font-family:'IBM Plex Mono',monospace;font-size:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.opp-name{font-size:12px;flex:1;color:var(--ink);line-height:1.3}
.opp-bar-wrap{width:64px;flex-shrink:0}
.opp-bar-bg{height:3px;background:var(--surface-2);border-radius:2px;overflow:hidden}
.opp-bar-fill{height:100%;border-radius:2px;background:var(--teal-mid)}
.opp-pct{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;width:36px;text-align:right;white-space:nowrap}
.pct-h{color:var(--teal)}.pct-m{color:var(--amber)}.pct-l{color:var(--ink-faint)}

/* ── MODES ── */
.modes-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.875rem}
.mode-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:0.875rem 1rem;display:flex;align-items:center;gap:10px}
.mode-rank{font-family:'IBM Plex Mono',monospace;font-size:1.1rem;font-weight:500;color:var(--ink-faint);width:24px;flex-shrink:0}
.mode-rank.top{color:var(--blue)}
.mode-name{font-size:12px;font-weight:500;color:var(--ink);line-height:1.3;margin-bottom:2px}
.mode-pts{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--ink-faint)}

/* ── TOOLS ── */
.tools-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.875rem}
.tool-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:0.875rem 1rem;display:flex;align-items:center;gap:10px}
.tool-num{font-family:'IBM Plex Mono',monospace;font-size:1.3rem;font-weight:500;color:var(--ink);flex-shrink:0;width:32px}
.tool-info{flex:1}
.tool-name{font-size:12px;font-weight:500;color:var(--ink);margin-bottom:4px}
.tool-bar-bg{height:3px;background:var(--surface-2);border-radius:2px;overflow:hidden}
.tool-bar-fill{height:100%;border-radius:2px;background:var(--blue-mid)}

/* ── TOP BLOCK (takeaways + quotes) ── */
.top-block{display:grid;grid-template-columns:1fr 310px;gap:0.875rem;padding:1.5rem 2.5rem 0}
.tk-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem}
.tk-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:1.1rem;position:relative;overflow:hidden}
.tk-card:first-child{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start}
.tk-card:first-child .tk-signal{border-top:none;padding-top:0;margin-top:0;border-left:2px solid var(--blue-light);padding-left:0.875rem}
.tk-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.tc1::before{background:var(--teal-mid)}.tc2::before{background:var(--amber-mid)}.tc3::before{background:var(--red-mid)}.tc4::before{background:var(--purple-mid)}
.tk-num{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-faint);margin-bottom:6px}
.tk-tension{font-size:12px;font-weight:600;color:var(--ink);line-height:1.4}
.tk-signal{font-size:11px;color:var(--ink-muted);line-height:1.6;border-top:1px solid var(--border);padding-top:0.75rem;margin-top:0.75rem}
.tk-impl{font-size:10px;font-style:italic;color:var(--ink-faint);border-top:1px solid var(--border);padding-top:0.75rem;margin-top:0.5rem;line-height:1.5}

/* ── QUOTES COL ── */
.quotes-col{display:flex;flex-direction:column;gap:0.875rem}
.quote-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:1rem 1.1rem;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:0.625rem}
.quote-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:2px}
.quote-card:nth-child(1)::before{background:var(--teal-mid)}.quote-card:nth-child(2)::before{background:var(--amber-mid)}.quote-card:nth-child(3)::before{background:var(--red-mid)}
.q-glyph{font-size:1.5rem;color:var(--surface-2);line-height:0.7;font-weight:700;user-select:none}
.q-text{font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:0.8rem;line-height:1.65;color:var(--ink);flex:1}
.q-foot{display:flex;align-items:center;justify-content:space-between;gap:6px}
.q-tag{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:0.06em;padding:2px 7px;border-radius:3px}
.qt-teal{background:var(--teal-light);color:var(--teal)}.qt-amber{background:var(--amber-light);color:var(--amber)}.qt-red{background:var(--red-light);color:var(--red)}
.q-etapa{font-size:10px;color:var(--ink-faint);white-space:nowrap}

.pb{height:2.5rem}

/* ══ SÍNTESIS ══ */
.sint-subheader{background:var(--white);border-bottom:1px solid var(--border);padding:1rem 2.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.sint-pills{display:flex;gap:8px}
.sint-pill{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:4px 12px 4px 8px}
.sp-dot{width:7px;height:7px;border-radius:50%}
.sp-dot.co{background:var(--col-co)}.sp-dot.br{background:var(--col-br)}.sp-dot.cr{background:#6366F1}
.sp-text{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--ink-muted)}

.sint-scale{background:var(--navy);margin:1.5rem 2.5rem 0;border-radius:10px;padding:1.25rem 2rem}
.ss-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin-bottom:0.875rem}
.ss-items{display:flex;flex-wrap:wrap;gap:0}
.ss-item{padding-right:2rem}
.ss-val{font-family:'IBM Plex Mono',monospace;font-size:1.75rem;font-weight:500;color:#fff;line-height:1}
.ss-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);margin-top:3px}
.ss-div{width:1px;background:rgba(255,255,255,0.1);margin-right:2rem;align-self:stretch}

.sint-page{padding:1.5rem 2.5rem 4rem}
.sh{display:flex;align-items:baseline;gap:10px;margin-bottom:1rem}
.sh-num{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;color:var(--ink-faint);letter-spacing:0.1em}
.sh-title{font-size:1.05rem;font-weight:600;color:var(--ink)}
.sh-title em{font-style:italic;color:var(--blue);font-weight:300}
.sh-rule{flex:1;height:1px;background:var(--border)}

.editorial{background:var(--navy);border-radius:10px;padding:1.75rem 2rem;margin-bottom:1.5rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem}
.ed-lead{font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:1rem;line-height:1.75;color:rgba(255,255,255,0.9)}
.ed-lead strong{font-style:normal;font-weight:600;color:var(--amber-mid)}
.ed-body{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.75;border-left:1px solid rgba(255,255,255,0.1);padding-left:1.5rem}

.universals-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem;margin-bottom:1.5rem}
.u-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:1.1rem;position:relative;overflow:hidden}
.u-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.uc1::before{background:var(--teal-mid)}.uc2::before{background:var(--amber-mid)}.uc3::before{background:var(--red-mid)}.uc4::before{background:var(--purple-mid)}.uc5::before{background:#3B82F6}.uc6::before{background:#EC4899}
.u-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-faint);margin-bottom:6px}
.u-signal{font-size:12px;font-weight:600;color:var(--ink);line-height:1.35;margin-bottom:6px}
.u-body{font-size:11px;color:var(--ink-muted);line-height:1.6}
.u-tags{display:flex;gap:6px;margin-top:0.75rem}
.u-tag{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:2px 7px;border-radius:3px}
.tag-co{background:var(--teal-light);color:var(--teal)}.tag-br{background:var(--amber-light);color:var(--amber)}.tag-cr{background:#EEF2FF;color:#4338CA}

.trust-bar{background:var(--amber-light);border:1px solid rgba(245,158,11,0.2);border-radius:8px;padding:1.25rem 1.5rem;margin-bottom:1.5rem;display:grid;grid-template-columns:auto 1fr;gap:1.5rem;align-items:center}
.trust-num{font-family:'IBM Plex Mono',monospace;font-size:2.5rem;font-weight:500;color:var(--amber);line-height:1}
.trust-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--amber);margin-top:2px}
.trust-body{font-size:12px;color:var(--ink-muted);line-height:1.7}
.trust-body strong{color:var(--ink);font-weight:500}

.opp-compare{background:var(--white);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:0.5rem}
.occ-head-row{display:grid;grid-template-columns:1fr 20px 1fr}
.occ-h{font-family:'IBM Plex Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;padding:8px 12px}
.occ-h.co{color:var(--teal)}.occ-h.br{color:var(--amber);text-align:right}
.occ-body-grid{display:grid;grid-template-columns:1fr 20px 1fr}
.occ-row{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--border)}
.occ-row:last-child{border-bottom:none}
.occ-row.br{flex-direction:row-reverse}
.occ-rank{font-family:'IBM Plex Mono',monospace;font-size:9px;color:var(--ink-faint);width:14px;text-align:center;flex-shrink:0}
.occ-name{font-size:11px;color:var(--ink);flex:1;line-height:1.3}
.occ-name.br{text-align:right}
.occ-pct{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;width:34px;flex-shrink:0}
.occ-pct.co{color:var(--teal)}.occ-pct.br{color:var(--amber);text-align:right}
.occ-mid{border-left:1px solid var(--border);border-right:1px solid var(--border)}
.occ-note{font-size:11px;color:var(--ink-faint);margin-bottom:1.5rem;padding:6px 2px 0}
.occ-note strong{color:var(--ink-muted)}

.diverge-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;margin-bottom:2rem}
.div-card{border-radius:8px;padding:1.4rem;border:1px solid var(--border)}
.div-card.co{background:rgba(20,184,166,0.04);border-color:rgba(20,184,166,0.2)}
.div-card.br{background:rgba(245,158,11,0.04);border-color:rgba(245,158,11,0.2)}
.div-head{display:flex;align-items:center;gap:8px;margin-bottom:1.1rem}
.div-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.div-dot.co{background:var(--col-co)}.div-dot.br{background:var(--col-br)}
.div-ctry{font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.08em}
.div-ctry.co{color:var(--teal)}.div-ctry.br{color:var(--amber)}
.div-item{display:flex;gap:10px;padding:11px 0;border-bottom:1px solid var(--border)}
.div-item:last-child{border-bottom:none}
.div-bul{width:3px;height:3px;border-radius:50%;margin-top:7px;flex-shrink:0}
.div-item.co .div-bul{background:var(--teal-mid)}.div-item.br .div-bul{background:var(--amber-mid)}
.div-text{font-size:11.5px;color:var(--ink-muted);line-height:1.6}

.impl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.875rem;margin-bottom:1.5rem}
.impl-card{background:var(--white);border:1px solid var(--border);border-radius:8px;padding:1.1rem;display:flex;flex-direction:column;gap:0.625rem}
.impl-ey{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:var(--ink-faint)}
.impl-title{font-size:12px;font-weight:600;color:var(--ink);line-height:1.35}
.impl-body{font-size:11px;color:var(--ink-muted);line-height:1.65;flex:1}
.impl-sw{font-size:11px;font-style:italic;color:var(--teal);border-top:1px solid var(--border);padding-top:0.625rem;line-height:1.5}

.hypothesis{background:var(--navy);border-radius:10px;padding:1.75rem 2rem;display:grid;grid-template-columns:2px 1fr;gap:1.5rem}
.hyp-bar{background:var(--amber-mid);border-radius:2px}
.hyp-label{font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);margin-bottom:0.625rem}
.hyp-text{font-family:'Fraunces',serif;font-style:italic;font-weight:300;font-size:1.05rem;color:#fff;line-height:1.65;margin-bottom:0.875rem}
.hyp-text strong{font-style:normal;font-weight:600;color:var(--amber-mid)}
.hyp-sub{font-size:11px;color:rgba(255,255,255,0.4);line-height:1.65}

/* ── FOOTER ── */
footer{border-top:1px solid var(--border);padding:1rem 2.5rem;display:flex;align-items:center;justify-content:space-between;background:var(--white)}
.ft{font-family:'IBM Plex Mono',monospace;font-size:10px;color:var(--ink-faint);letter-spacing:0.06em}

@media(max-width:900px){
  .stat-cards,.modes-grid,.tools-grid,.universals-grid,.impl-grid{grid-template-columns:1fr 1fr}
  .two-col,.top-block,.diverge-grid,.editorial{grid-template-columns:1fr}
  .tk-grid{grid-template-columns:1fr}.tk-card:first-child{grid-template-columns:1fr}
  .sint-page,.section,.full-w,.top-block,.two-col{padding-left:1.25rem;padding-right:1.25rem}
  .cumulative,.sint-scale{margin-left:1.25rem;margin-right:1.25rem}
}
</style>
</head>
<body>

<!-- HEADER -->
<header class="header">
  <div class="header-top">
    <div>
      <div class="brand-label">IDB Knowledge Platform · VPS/KLD</div>
      <div class="header-title">Field Research Findings</div>
    </div>
  </div>
  <nav class="tab-nav">
    <button class="tab-btn active" onclick="switchTab('sintesis',this)">SYNTHESIS</button>
    <button class="tab-btn" onclick="switchTab('colombia',this)">🇨🇴 COLOMBIA · MAY 26–27</button>
    <button class="tab-btn" onclick="switchTab('brasil',this)">🇧🇷 BRASIL · JUN 1</button>
    <button class="tab-btn" onclick="switchTab('costarica',this)">🇨🇷 COSTA RICA · JUN 8</button>
    <button class="tab-btn disabled">🇵🇦 PANAMÁ — coming soon</button>
  </nav>
</header>

<!-- ══════════ SÍNTESIS ══════════ -->
<div id="view-sintesis" class="view active">
  <div class="sint-subheader">
    <div>
      <div class="report-label">Comparative Report</div>
      <div class="report-title">Synthesis</div>
      <div class="report-source">IDB Knowledge Platform · Source: Field missions + survey data</div>
    </div>
    <div class="sint-pills">
      <div class="sint-pill"><span class="sp-dot co"></span><span class="sp-text">🇨🇴 Colombia · May 26–27</span></div>
      <div class="sint-pill"><span class="sp-dot br"></span><span class="sp-text">Brasil · Jun 1, 2026</span></div>
          <div class="sint-pill"><span class="sp-dot cr"></span><span class="sp-text">🇨🇷 Costa Rica · Jun 8</span></div>
    </div>
  </div>

  <div class="sint-scale">
    <div class="ss-label">Cumulative totals — all 3 missions</div>
    <div class="ss-items">
      <div class="ss-item"><div class="ss-val">3</div><div class="ss-lbl">Countries</div></div>
      <div class="ss-div"></div>
      <div class="ss-item"><div class="ss-val">41</div><div class="ss-lbl">Participants</div></div>
      <div class="ss-div"></div>
      <div class="ss-item"><div class="ss-val">139</div><div class="ss-lbl">Challenges</div></div>
      <div class="ss-div"></div>
      <div class="ss-item"><div class="ss-val">496</div><div class="ss-lbl">Votes</div></div>
      <div class="ss-div"></div>
      <div class="ss-item"><div class="ss-val">~80%</div><div class="ss-lbl">Use AI daily</div></div>
      <div class="ss-div"></div>
      <div class="ss-item"><div class="ss-val">≥87%</div><div class="ss-lbl">Prefer traceability</div></div>
    </div>
  </div>

  <div class="sint-page">
    <div class="editorial">
      <p class="ed-lead">Three countries, three operational contexts. And yet, <strong>the same desire</strong>: an institutional knowledge source that is reliable, traceable and speaks the language of real work — not the language of the formal archive.</p>
      <p class="ed-body">What emerges isn't a technology or access problem. It's an epistemic trust problem. Teams already use AI daily — 64% in Colombia, 85% in Brasil, 75% in Costa Rica. But they don't trust it for official documents. Costa Rica adds a new signal: the spontaneous benchmark is no longer Copilot — it's Claude. The question is no longer whether they'll use AI. It's which one, and for what.</p>
    </div>

    <div class="sh"><span class="sh-num">01</span><h2 class="sh-title">Universal signals — <em>what crosses borders</em></h2><span class="sh-rule"></span></div>
    <div class="universals-grid">
      <div class="u-card uc1">
        <p class="u-label">Trust · Universal</p>
        <p class="u-signal">Traceability over speed — always</p>
        <p class="u-body">Colombia: 100%, Brasil: 87%, Costa Rica: 60% prefer slower answers with cited sources. CR is the first country where speed preference appears (40%) — but the majority still demands traceability. <em style="color:var(--ink-faint);font-size:10px">"La respuesta muestra la fuente de manera que se puede validar." [The answer shows the source in a way that can be validated] — CR participant</em></p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 100%</span><span class="u-tag tag-br">🇧🇷 87%</span><span class="u-tag tag-cr">🇨🇷 60%</span></div>
      </div>
      <div class="u-card uc2">
        <p class="u-label">Tools · Universal</p>
        <p class="u-signal">Copilot #1, but Claude is rising</p>
        <p class="u-body">Copilot leads all 3 countries (11 mentions each in CO/CR, 18 in BR). Claude is growing: 3→4→6 mentions across CO, CR, BR. In CR, ChatGPT ties with colegas at 8 — the most AI-diverse tool mix of the three missions.</p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 Colombia</span><span class="u-tag tag-br">🇧🇷 Brasil</span><span class="u-tag tag-cr">🇨🇷 Costa Rica</span></div>
      </div>
      <div class="u-card uc3">
        <p class="u-label">Adoption · Universal</p>
        <p class="u-signal">Complement, not replace — across all 3</p>
        <p class="u-body">0% want the KP as their main tool in any country. CR: 7 complement + 6 find sources = 76% see it as a layer, not a replacement. <em style="color:var(--ink-faint);font-size:10px">"Ya lo hace" [It already does it] — one CR participant, when asked what they need from the platform in one click.</em></p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 Colombia</span><span class="u-tag tag-br">🇧🇷 Brasil</span><span class="u-tag tag-cr">🇨🇷 Costa Rica</span></div>
      </div>
      <div class="u-card uc4">
        <p class="u-label">Source quality · Universal</p>
        <p class="u-signal">Integration #1 need in CR; cited sources #1 in CO+BR</p>
        <p class="u-body">CO and BR rank fuentes confiables y citadas as #1 to switch. CR flips it — integración con herramientas actuales is #1, fuentes #2. CR users are already more integrated in their workflows and want seamless embedding, not just better search.</p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 cited sources first</span><span class="u-tag tag-br">🇧🇷 cited sources first</span><span class="u-tag tag-cr">🇨🇷 tool integration first</span></div>
      </div>
      <div class="u-card uc5">
        <p class="u-label">AI Use · Universal</p>
        <p class="u-signal">AI daily: BR 85% · CR 75% · CO 64%</p>
        <p class="u-body">All three missions show majority daily AI use — and 0% "never" in any country. CR and BR are most mature. The benchmark CR named for retention: <em style="color:var(--ink-faint);font-size:10px">"Parecerse más a Claude" [Be more like Claude] — CR participant, Mentimeter retention question.</em></p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 64%</span><span class="u-tag tag-br">🇧🇷 85%</span><span class="u-tag tag-cr">🇨🇷 75%</span></div>
      </div>
      <div class="u-card uc6">
        <p class="u-label">Platform perception · Universal</p>
        <p class="u-signal">Prior use highest in CR — and so is utility rating</p>
        <p class="u-body">CR: 46% had used KP before (vs 33% CO, 20% BR) — and 91% rate it useful, the highest across missions. More familiarity → higher perceived value. But bugs in Convergencia integration threaten this trust: projects that don't appear break the adoption cycle.</p>
        <div class="u-tags"><span class="u-tag tag-co">🇨🇴 33% / 57%</span><span class="u-tag tag-br">🇧🇷 20% / 65%</span><span class="u-tag tag-cr">🇨🇷 46% / 91%</span></div>
      </div>
    </div>

    <div class="trust-bar">
      <div><div class="trust-num">60–100%</div><div class="trust-lbl">all 3 countries</div></div>
      <p class="trust-body"><strong>Prefer traceability over speed.</strong> In all 3 missions, the majority chose slower-but-traceable over fast-but-unverified. Costa Rica is the first country where 40% preferred speed — a signal of growing AI confidence, not declining quality standards. Across all three: <em>"El link a la fuente oficial, siempre hago cross check" [The link to the official source, I always cross-check] (CR) · "Que utilice fuentes oficiales" [That it uses official sources] (CR) · "Que la herramienta se use de manera masiva por funcionarios del BID" [That it be used widely by BID staff] (BR). <strong>Social proof and institutional provenance are the two trust levers — design for both.</strong></p>
    </div>

    <div class="sh"><span class="sh-num">02</span><h2 class="sh-title">Opportunities — where they <em>converge</em> and <em>diverge</em></h2><span class="sh-rule"></span></div>
    <div style="padding:0.25rem 0 0.5rem">
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:1.25rem">
        <span style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted)"><span style="width:10px;height:10px;border-radius:2px;background:#14B8A6"></span>🇨🇴 Colombia</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted)"><span style="width:10px;height:10px;border-radius:2px;background:#F59E0B"></span>🇧🇷 Brasil</span>
        <span style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted)"><span style="width:10px;height:10px;border-radius:2px;background:#6366F1"></span>🇨🇷 Costa Rica</span>
      </div>
      <div id="opp-bars-chart" style="display:flex;flex-direction:column;gap:18px"></div>
      <p class="occ-note" style="margin-top:1rem">% of participants who said they would use each feature. Ordered by average approval across 3 missions. <strong>Key read:</strong> Connect with AI agents is the widest spread (38%→70%→100%) — the clearest signal of growing AI maturity across countries. Detect gaps and Consult policies hit 100% in Costa Rica while remaining strong across all three.</p>
    </div>
    <script>
    (function(){
      const oppData = [
        { label: "Detect gaps in a document",        co: 88, br: 88, cr: 100 },
        { label: "Consult policies (exact citation)", co: 88, br: 92, cr: 100 },
        { label: "Find rigorous evidence",            co: 63, br: 90, cr: 100 },
        { label: "How a topic evolved (region)",      co: 75, br: 73, cr: 100 },
        { label: "Connect with AI agents",            co: 38, br: 70, cr: 100 },
        { label: "Search & download operations",      co: 100, br: 79, cr: 67  },
        { label: "Map country/sector ecosystem",      co: 75, br: 69, cr: 67  },
        { label: "Draft first POD version",           co: 100, br: 71, cr: 71  },
      ];
      oppData.sort((a,b)=>((b.co+b.br+b.cr)/3)-((a.co+a.br+a.cr)/3));

      const container = document.getElementById('opp-bars-chart');
      if (!container) return;
      const isDark = matchMedia('(prefers-color-scheme:dark)').matches;
      const textPri = isDark?'#e5e5e5':'#111827';
      const textSec = isDark?'#9CA3AF':'#6B7280';
      const bgTrack = isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)';
      const countries = [
        {key:'co',color:'#14B8A6',label:'Colombia'},
        {key:'br',color:'#F59E0B',label:'Brasil'},
        {key:'cr',color:'#6366F1',label:'Costa Rica'},
      ];

      oppData.forEach(d=>{
        const avg = Math.round((d.co+d.br+d.cr)/3);
        const row = document.createElement('div');
        row.style.cssText='display:grid;grid-template-columns:180px 1fr;gap:12px;align-items:center';

        const labelEl = document.createElement('div');
        labelEl.style.cssText=`font-size:12px;color:${textPri};line-height:1.35;text-align:right`;
        labelEl.textContent=d.label;
        row.appendChild(labelEl);

        const barsCol = document.createElement('div');
        barsCol.style.cssText='display:flex;flex-direction:column;gap:4px';

        countries.forEach(c=>{
          const pct=d[c.key];
          const barRow=document.createElement('div');
          barRow.style.cssText='display:flex;align-items:center;gap:8px';
          const track=document.createElement('div');
          track.style.cssText=`flex:1;height:14px;background:${bgTrack};border-radius:3px;overflow:hidden`;
          const fill=document.createElement('div');
          fill.style.cssText=`height:100%;width:${pct}%;background:${c.color};border-radius:3px`;
          track.appendChild(fill);
          const pctLabel=document.createElement('div');
          pctLabel.style.cssText=`font-size:11px;font-weight:500;color:${c.color};width:34px;flex-shrink:0`;
          pctLabel.textContent=pct+'%';
          barRow.appendChild(track);
          barRow.appendChild(pctLabel);
          barsCol.appendChild(barRow);
        });

        const avgBadge=document.createElement('div');
        avgBadge.style.cssText=`font-size:10px;color:${textSec};margin-top:1px`;
        avgBadge.textContent='avg '+avg+'%';
        barsCol.appendChild(avgBadge);

        row.appendChild(barsCol);
        container.appendChild(row);
      });
    })();
    </script>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;margin-bottom:2rem">

      <div class="div-card co">
        <div class="div-head"><span class="div-dot co"></span><span class="div-ctry co">🇨🇴 Colombia · Unique tensions</span></div>
        <div class="div-item co"><span class="div-bul"></span><p class="div-text"><strong>TdR (Terms of Reference) as the most urgent use case.</strong> When designing a new operation, teams search for TdR from similar past projects to avoid starting from scratch. Today there's no centralized way to find them — it's the most concrete, immediately solvable gap the platform could close.</p></div>
        <div class="div-item co"><span class="div-bul"></span><p class="div-text"><strong>Draft POD as #1 opportunity.</strong> Colombia wants generation more than search — already trusts enough to want outputs, not just inputs. The most generation-forward profile of the three missions.</p></div>
        <div class="div-item co"><span class="div-bul"></span><p class="div-text"><strong>Knowledge Careers gap.</strong> KM work isn't valued or visible. Metrics reward academic publications over field execution. Knowledge work often happens outside working hours with no system to capture it.</p></div>
      </div>

      <div class="div-card br">
        <div class="div-head"><span class="div-dot br"></span><span class="div-ctry br">🇧🇷 Brasil · Unique tensions</span></div>
        <div class="div-item br"><span class="div-bul"></span><p class="div-text"><strong>Portfolio intelligence demand.</strong> Specialists need disbursement projections by month and project, risks by sector/region. Today this is built manually in Excel — the platform could replace it.</p></div>
        <div class="div-item br"><span class="div-bul"></span><p class="div-text"><strong>PCR automation — explicit demand.</strong> "Why isn't there a system that automatically generates a PCR (Project Completion Report)?" Teams want closure documents generated from execution data, not written from scratch.</p></div>
        <div class="div-item br"><span class="div-bul"></span><p class="div-text"><strong>Institutional memory dispersed.</strong> Lessons learned by state, municipality and execution mechanism aren't accessible. The most experienced country context — with the hardest knowledge retrieval problem.</p></div>
      </div>

      <div class="div-card" style="background:rgba(99,102,241,0.04);border-color:rgba(99,102,241,0.2)">
        <div class="div-head"><span class="div-dot" style="background:#6366F1"></span><span class="div-ctry" style="color:#6366F1">🇨🇷 Costa Rica · Unique tensions</span></div>
        <div class="div-item co"><span class="div-bul" style="background:#6366F1"></span><p class="div-text"><strong>"Be more like Claude."</strong> The most candid retention signal in the corpus — a user named Claude as the benchmark spontaneously. The platform must win on institutional specialization, not by restricting access to generic AI.</p></div>
        <div class="div-item co"><span class="div-bul" style="background:#6366F1"></span><p class="div-text"><strong>Cross-window silos — BID Invest, BID Lab, BID.</strong> No structured cross-visibility between windows. Users can't consult environmental/social docs from BID Invest projects. Synergies still depend on personal relationships.</p></div>
        <div class="div-item co"><span class="div-bul" style="background:#6366F1"></span><p class="div-text"><strong>Highest prior use (46%) — but Convergencia has bugs.</strong> Most mature adopter across 3 missions, yet technical failures erode trust. Projects that don't appear in the platform break the adoption cycle built over months.</p></div>
      </div>

    </div>
    <div class="sh"><span class="sh-num">04</span><h2 class="sh-title">Design <em>implications</em> — what to do with all this</h2><span class="sh-rule"></span></div>
    <div class="impl-grid">
      <div class="impl-card"><p class="impl-ey">Trust architecture · All 3 countries</p><p class="impl-title">Design for the citation, not the answer</p><p class="impl-body">Every result must show its evidence chain visibly and clickably: source doc, section, date. Not as collapsed metadata — as part of the result itself. Costa Rica makes this explicit: <em>"la respuesta muestra la fuente de manera que se puede validar"</em> — and users already do cross-checks before using any AI output in official documents.</p><p class="impl-sw">→ Trust isn't built with disclaimers — it's built with radical source transparency.</p></div>

      <div class="impl-card"><p class="impl-ey">Positioning · Costa Rica signal</p><p class="impl-title">Don't replace Copilot — and don't try to replace Claude either</p><p class="impl-body">Copilot has speed and BID integration. Claude has conversational fluency. Costa Rica users already use Claude directly (4 mentions) and named it as the retention benchmark. The platform's edge is neither: it's the only tool with cited BID institutional knowledge — real bank documents, specific operations, policies with page numbers.</p><p class="impl-sw">→ The platform wins where neither Copilot nor Claude can go: institutional precision with provenance.</p></div>

      <div class="impl-card"><p class="impl-ey">Differentiated roadmap · 3 trust curves</p><p class="impl-title">Colombia generates. Brasil verifies. Costa Rica integrates.</p><p class="impl-body">Colombia wants outputs (Draft POD #1). Brasil prioritizes evidence before generating (Consult policies #1). Costa Rica — the most mature adopter — wants the platform embedded in their existing workflow: integration with tools is their #1 switching trigger, unlike the other two missions.</p><p class="impl-sw">→ One platform, three entry points on the trust curve. UX must adapt to where each user is.</p></div>

      <div class="impl-card"><p class="impl-ey">MVP → next expansion</p><p class="impl-title">Similar projects is live. Next: exact policy citation + TC contextual search</p><p class="impl-body">The MVP already covers similar projects. The clearest expansion validated across all 3 missions: <strong>consult policies with exact citation</strong> (top-3 in all countries) and <strong>deeper TC integration in contextual search</strong> — Cooperaciones Técnicas appear as key instruments in Colombia and Brasil but aren't fully surfaced in search results today.</p><p class="impl-sw">→ Expand from what works. Both next features are low-lift, high-signal for institutional trust.</p></div>

      <div class="impl-card"><p class="impl-ey">Cross-window · Costa Rica priority</p><p class="impl-title">BID Invest + BID Lab integration: a governance problem, not a technical one</p><p class="impl-body">Costa Rica surfaced the sharpest version of this: users from BID can't consult BID Invest environmental and social documents. Synergies between windows depend on personal relationships. This is the use case that makes the platform truly institutional — but it requires cross-team governance decisions before any technical work.</p><p class="impl-sw">→ Align with BID Invest and BID Lab teams before scoping. The blocker is access policy, not engineering.</p></div>

      <div class="impl-card"><p class="impl-ey">Big bets · Align with Project Preparation team</p><p class="impl-title">PCR automation + portfolio intelligence: legitimate, scoped, not solo</p><p class="impl-body">Brasil named PCR automation explicitly. The vision — capturing execution changes and synthesizing at closure — redefines the platform as a production system. Same with portfolio intelligence (disbursements, risks by region). Both are part of the Project Preparation project roadmap: these field signals should feed that team's prioritization, not be built in parallel.</p><p class="impl-sw">→ Share these findings with the Project Preparation team. They're building the infrastructure these use cases need.</p></div>
    </div>

    <div class="hypothesis">
      <div class="hyp-bar"></div>
      <div>
        <p class="hyp-label">Design hypothesis · Transversal</p>
        <p class="hyp-text">The Knowledge Platform doesn't compete in the generative AI market. It competes in the market of <strong>institutional trust</strong>. Its differential advantage isn't response speed but knowledge traceability — and that's exactly what no generalist tool can offer.</p>
        <p class="hyp-sub">Colombia, Brasil, and Costa Rica — with distinct operational profiles and adoption curves — converge on the same signal: <em>we don't need more information, we need information we can trust, embedded in how we already work</em>. That is the platform the IDB has the unique opportunity to build.</p>
      </div>
    </div>
  </div>
</div>

<!-- ══════════ COLOMBIA ══════════ -->
<div id="view-colombia" class="view">
  <div class="subheader">
    <div>
      <div class="report-label">Mission Report</div>
      <div class="report-title">🇨🇴 Colombia</div>
      <div class="report-source">IDB Knowledge Platform · Source: Field mission + Mentimeter survey · Bogotá, 26–27 May 2026</div>
    </div>
    <button class="export-btn" onclick="exportCSV('colombia')">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ↓ Export raw data
    </button>
  </div>

  <div class="cumulative">
    <div class="cum-label">Cumulative totals — 🇨🇴 Colombia mission · May 26–27, 2026</div>
    <div class="cum-stats">
      <div class="cum-item"><div class="cum-val">12</div><div class="cum-lbl">Participants</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">19</div><div class="cum-lbl">Challenges</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">64</div><div class="cum-lbl">Votes</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">33%</div><div class="cum-lbl">Prior KP use</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">57%</div><div class="cum-lbl">Rated KP useful (4–5)</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">64%</div><div class="cum-lbl">Use AI daily</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-head"><span class="section-mono">&#9646; General Usability</span></div>
    <div class="stat-cards">
      <div class="stat-card hi">
        <div class="sc-label">Prior platform use</div>
        <div class="sc-val blue">33%</div>
        <div class="sc-sub">Had used it before</div>
        <span class="delta neu">50% never used it</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Adoption intent</div>
        <div class="sc-val">100%</div>
        <div class="sc-sub">Would complement tools</div>
        <span class="delta up">↑ 0% as main tool</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Integration #1 need</div>
        <div class="sc-val">#1</div>
        <div class="sc-sub">Cited reliable sources</div>
        <span class="delta neu">vs. speed</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Source preference</div>
        <div class="sc-val">100%</div>
        <div class="sc-sub">Prefer traceability</div>
        <span class="delta up">↑ vs speed</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Internal tools sufficient</div>
        <div class="sc-val">4.8</div>
        <div class="sc-sub">Score /10</div>
        <span class="delta neu">Neutral</span>
      </div>
    </div>
  </div>

  <div class="top-block">
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Key tensions from the mission</span></div>
      <div class="tk-grid" id="tk-colombia"></div>
    </div>
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Top quotes</span></div>
      <div class="quotes-col" id="q-colombia"></div>
    </div>
  </div>

  <div class="two-col">
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Challenges by stage</span><span class="tc-sub">19 reported · 64 votes</span></div>
      <div id="ch-colombia"></div>
    </div>
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Opportunities ranking</span><span class="tc-sub">% would use it</span></div>
      <div id="opp-colombia"></div>
    </div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Preferred use modes</span></div>
    <div class="modes-grid" id="modes-colombia"></div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Current tools used · mentions</span></div>
    <div class="tools-grid" id="tools-colombia"></div>
  </div>
  <div class="pb"></div>
</div>

<!-- ══════════ BRASIL ══════════ -->
<div id="view-brasil" class="view">
  <div class="subheader">
    <div>
      <div class="report-label">Mission Report</div>
      <div class="report-title">🇧🇷 Brasil</div>
      <div class="report-source">IDB Knowledge Platform · Source: Field mission + Mentimeter survey (PT) · 1 Jun 2026</div>
    </div>
    <button class="export-btn" onclick="exportCSV('brasil')">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ↓ Export raw data
    </button>
  </div>

  <div class="cumulative">
    <div class="cum-label">Cumulative totals — 🇧🇷 Brasil mission · June 1, 2026</div>
    <div class="cum-stats">
      <div class="cum-item"><div class="cum-val">20</div><div class="cum-lbl">Participants</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">107</div><div class="cum-lbl">Challenges</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">383</div><div class="cum-lbl">Votes</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">20%</div><div class="cum-lbl">Prior KP use</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">65%</div><div class="cum-lbl">Rated KP useful (4–5)</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">85%</div><div class="cum-lbl">Use AI daily</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-head"><span class="section-mono">&#9646; General Usability</span></div>
    <div class="stat-cards">
      <div class="stat-card hi">
        <div class="sc-label">Prior platform use</div>
        <div class="sc-val blue">20%</div>
        <div class="sc-sub">Had used it before</div>
        <span class="delta neu">60% never used it</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Adoption intent</div>
        <div class="sc-val">87%</div>
        <div class="sc-sub">Complement or find sources</div>
        <span class="delta up">↑ 0% as main tool</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Integration #1 need</div>
        <div class="sc-val">#1</div>
        <div class="sc-sub">Cited reliable sources</div>
        <span class="delta neu">vs. speed</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Source preference</div>
        <div class="sc-val">87%</div>
        <div class="sc-sub">Prefer traceability</div>
        <span class="delta up">↑ vs speed</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Internal tools sufficient</div>
        <div class="sc-val">4.0</div>
        <div class="sc-sub">Score /10</div>
        <span class="delta dn">↓ vs Colombia 4.8</span>
      </div>
    </div>
  </div>

  <div class="top-block">
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Key tensions from the mission</span></div>
      <div class="tk-grid" id="tk-brasil"></div>
    </div>
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Top quotes</span></div>
      <div class="quotes-col" id="q-brasil"></div>
    </div>
  </div>

  <div class="two-col">
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Challenges by stage</span><span class="tc-sub">107 reported · 383 votes</span></div>
      <div id="ch-brasil"></div>
    </div>
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Opportunities ranking</span><span class="tc-sub">% would use it</span></div>
      <div id="opp-brasil"></div>
    </div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Preferred use modes</span></div>
    <div class="modes-grid" id="modes-brasil"></div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Current tools used · mentions</span></div>
    <div class="tools-grid" id="tools-brasil"></div>
  </div>
  <div class="pb"></div>
</div>


<!-- ══════════ COSTA RICA ══════════ -->
<div id="view-costarica" class="view">
  <div class="subheader">
    <div>
      <div class="report-label">Mission Report</div>
      <div class="report-title">🇨🇷 Costa Rica</div>
      <div class="report-source">IDB Knowledge Platform · Source: Field mission + Mentimeter survey · San José, 8 Jun 2026</div>
    </div>
    <button class="export-btn" onclick="exportCSV('costarica')">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ↓ Export raw data
    </button>
  </div>

  <div class="cumulative">
    <div class="cum-label">Cumulative totals — 🇨🇷 Costa Rica mission · June 8, 2026</div>
    <div class="cum-stats">
      <div class="cum-item"><div class="cum-val">12</div><div class="cum-lbl">Participants</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">13</div><div class="cum-lbl">Challenges</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">49</div><div class="cum-lbl">Votes</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">46%</div><div class="cum-lbl">Prior KP use</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">91%</div><div class="cum-lbl">Rated KP useful (4–5)</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">75%</div><div class="cum-lbl">Use AI daily</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-head"><span class="section-mono">&#9646; General Usability</span></div>
    <div class="stat-cards">
      <div class="stat-card hi">
        <div class="sc-label">Prior KP use</div>
        <div class="sc-val blue">46%</div>
        <div class="sc-sub">Had used it before</div>
        <span class="delta up">↑ highest across missions</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Rated KP useful (4–5)</div>
        <div class="sc-val">91%</div>
        <div class="sc-sub">0% rated 1–2</div>
        <span class="delta up">↑ highest across missions</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Use AI daily</div>
        <div class="sc-val">75%</div>
        <div class="sc-sub">25% weekly, 0% never</div>
        <span class="delta neu">vs BR 85% / CO 64%</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Adoption intent</div>
        <div class="sc-val">81%</div>
        <div class="sc-sub">Complement or find sources</div>
        <span class="delta up">↑ 0% as main tool</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Integration #1 need</div>
        <div class="sc-val">#1</div>
        <div class="sc-sub">Tool integration with stack</div>
        <span class="delta neu">≠ other countries</span>
      </div>
    </div>
  </div>

  <div class="top-block">
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Key tensions from the mission</span></div>
      <div class="tk-grid" id="tk-costarica"></div>
    </div>
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Top quotes</span></div>
      <div class="quotes-col" id="q-costarica"></div>
    </div>
  </div>

  <div class="two-col">
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Challenges by stage</span><span class="tc-sub">13 reported · 49 votes</span></div>
      <div id="ch-costarica"></div>
    </div>
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Opportunities ranking</span><span class="tc-sub">% would use it</span></div>
      <div id="opp-costarica"></div>
    </div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Preferred use modes</span></div>
    <div class="modes-grid" id="modes-costarica"></div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Current tools used · mentions</span></div>
    <div class="tools-grid" id="tools-costarica"></div>
  </div>
  <div class="pb"></div>
</div>


<!-- ══════════ COSTA RICA ══════════ -->
<div id="view-costarica" class="view">
  <div class="subheader">
    <div>
      <div class="report-label">Mission Report</div>
      <div class="report-title">🇨🇷 Costa Rica</div>
      <div class="report-source">IDB Knowledge Platform · Source: Field mission + Mentimeter survey · June 8, 2026</div>
    </div>
    <button class="export-btn" onclick="exportCSV('costarica')">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      ↓ Export raw data
    </button>
  </div>

  <div class="cumulative">
    <div class="cum-label">Cumulative totals — 🇨🇷 Costa Rica mission · June 8, 2026</div>
    <div class="cum-stats">
      <div class="cum-item"><div class="cum-val">12</div><div class="cum-lbl">Participants</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">13</div><div class="cum-lbl">Challenges</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">49</div><div class="cum-lbl">Votes</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">46%</div><div class="cum-lbl">Prior KP use</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">91%</div><div class="cum-lbl">Rated KP useful (4–5)</div></div>
      <div class="cum-div"></div>
      <div class="cum-item"><div class="cum-val">75%</div><div class="cum-lbl">Use AI daily</div></div>
    </div>
  </div>

  <div class="section">
    <div class="section-head"><span class="section-mono">&#9646; General Usability</span></div>
    <div class="stat-cards">
      <div class="stat-card hi">
        <div class="sc-label">Prior platform use</div>
        <div class="sc-val blue">46%</div>
        <div class="sc-sub">Had used it before</div>
        <span class="delta up">↑ highest across missions</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Adoption intent</div>
        <div class="sc-val">81%</div>
        <div class="sc-sub">Complement or find sources</div>
        <span class="delta up">↑ 0% as main tool</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Integration #1 need</div>
        <div class="sc-val">#1</div>
        <div class="sc-sub">Tool integration</div>
        <span class="delta neu">≠ other countries</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Source preference</div>
        <div class="sc-val">60%</div>
        <div class="sc-sub">Prefer traceability</div>
        <span class="delta neu">40% prefer speed</span>
      </div>
      <div class="stat-card">
        <div class="sc-label">Internal tools sufficient</div>
        <div class="sc-val">5.4</div>
        <div class="sc-sub">Score /10</div>
        <span class="delta up">↑ vs Colombia 4.8</span>
      </div>
    </div>
  </div>

  <div class="top-block">
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Key tensions from the mission</span></div>
      <div class="tk-grid" id="tk-costarica"></div>
    </div>
    <div>
      <div class="section-head" style="margin-bottom:0.875rem"><span class="section-mono">&#9646; Top quotes</span></div>
      <div class="quotes-col" id="q-costarica"></div>
    </div>
  </div>

  <div class="two-col">
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Challenges by stage</span><span class="tc-sub">13 reported · 49 votes</span></div>
      <div id="ch-costarica"></div>
    </div>
    <div class="table-card">
      <div class="tc-head"><span class="tc-title">Opportunities ranking</span><span class="tc-sub">% would use it</span></div>
      <div id="opp-costarica"></div>
    </div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Preferred use modes</span></div>
    <div class="modes-grid" id="modes-costarica"></div>
  </div>

  <div class="full-w">
    <div class="section-head"><span class="section-mono">&#9646; Current tools used · mentions</span></div>
    <div class="tools-grid" id="tools-costarica"></div>
  </div>
  <div class="pb"></div>
</div>

<footer>
  <span class="ft">© 2026 IDB KNOWLEDGE PLATFORM · VPS/KLD</span>
  <span class="ft" id="footer-label" style="text-align:center">SYNTHESIS · COMPARATIVE REPORT</span>
  <span class="ft" style="text-align:right">INTERNAL USE ONLY</span>
</footer>

<script>
const DATA = {
  colombia: {
    takeaways: [
      {num:"Tension 1",tension:"Knowledge Loop — Gap between operations and analytical knowledge",signal:"Need to systematize non-visible knowledge: workshop minutes, semester reports, TC products. Knowledge is generated but doesn't circulate.",impl:"The platform must expand beyond the institutional archive and make field knowledge visible.",cls:"tc1"},
      {num:"Tension 2",tension:"Systems interoperability",signal:"1,500+ agents operating without articulation. Duplicated dashboards and parallel initiatives without integration between bank platforms.",impl:"Interoperability isn't a technical problem — it's a governance problem.",cls:"tc2"},
      {num:"Tension 3",tension:"Demand for personalization and ad hoc reporting",signal:"Reports are built from scratch for each corporate request. Organic use of Claude grows even with personal funding.",impl:"The platform must enable continuous production, not just access to the accumulated stock.",cls:"tc3"},
      {num:"Tension 4 · Knowledge Careers",tension:"Non-transferable tacit knowledge and misaligned incentives",signal:"Knowledge work happens outside working hours. Metrics reward academic publications over field execution. Access to synergies depends on personal networks, not systems.",impl:"The most valuable knowledge — field knowledge — isn't systematized or transferred.",cls:"tc4"}
    ],
    quotes: [
      {text:"What makes the platform different is the curated knowledge. But there are too many dashboards. Make it one single place — I have eighty things to do at once.",tag:"Fragmentation",tagCls:"qt-teal",etapa:"Plenary session"},
      {text:"The fact that the information comes from BID documents gives me peace of mind.",tag:"Trust",tagCls:"qt-amber",etapa:"Day 2 · Synergies"},
      {text:"We're always doing a lot — the problem is connecting what we do in an organized way.",tag:"Coordination",tagCls:"qt-red",etapa:"Synergies session"}
    ],
    challenges: [
      {name:"TdR and similar contracts — no centralized access",sub:"Execution · Documents",badge:"CRITICAL",bcls:"b-crit",count:"4 reports"},
      {name:"Quick search for similar projects",sub:"Preparation · Search",badge:"HIGH",bcls:"b-high",count:"2 reports"},
      {name:"Platform fragmentation, lack of integration",sub:"Preparation · Tools",badge:"HIGH",bcls:"b-high",count:"2 reports"},
      {name:"Process and tool harmonization",sub:"Execution · Tools",badge:"HIGH",bcls:"b-high",count:"2 reports"},
      {name:"Results matrix historical traceability",sub:"Closure · Tools",badge:"MED",bcls:"b-mid",count:"1 report"},
      {name:"Disbursements and portfolio in manual Excel",sub:"Execution · Data",badge:"MED",bcls:"b-mid",count:"1 report"}
    ],
    opportunities: [
      {name:"Draft the first POD version",pct:100},
      {name:"Search and download operations or documents",pct:100},
      {name:"Detect gaps in a document",pct:88},
      {name:"Consult policies with exact citation",pct:88},
      {name:"Map ecosystem of a country and sector",pct:75},
      {name:"How a topic has evolved in the region",pct:75},
      {name:"Find rigorous evidence for decisions",pct:63},
      {name:"Connect with AI agents",pct:38}
    ],
    modes: [
      {rank:1,name:"Create document from existing content",pts:"22 pts"},
      {rank:2,name:"Search for a quick answer",pts:"18 pts"},
      {rank:3,name:"Compare or analyze information",pts:"17 pts"},
      {rank:4,name:"Export data to spreadsheet",pts:"16 pts"}
    ],
    tools: [
      {name:"Copilot",count:11,pct:100},{name:"Colleagues",count:10,pct:91},
      {name:"SharePoint/EzShare",count:7,pct:64},{name:"Google",count:6,pct:55},
      {name:"BID Catalog",count:6,pct:55},{name:"Claude",count:3,pct:27},
      {name:"ChatGPT",count:2,pct:18},{name:"Other",count:3,pct:27}
    ]
  },
  brasil: {
    takeaways: [
      {num:"Tension 1",tension:"Institutional memory untraceable — knowledge dispersed in old programs",signal:"In older programs it's hard to find documents and execution agreements. Lessons learned by state, municipality and execution mechanism aren't accessible.",impl:"The platform must be where the BID's operational memory becomes queryable, not just formal publications.",cls:"tc1"},
      {num:"Tension 2",tension:"Portfolio intelligence demand — transversal data inaccessible",signal:"Specialists need disbursement projections by month and project, risks by sector/borrower/executor/region. Today this is done manually in Excel.",impl:"The opportunity isn't just document search — it's building real-time portfolio intelligence.",cls:"tc2"},
      {num:"Tension 3",tension:"PCR automático — closure document generation is a critical pain point",signal:"'Why isn't there a system that automatically generates a PCR?' Changes made during execution aren't recorded, making closure difficult.",impl:"The most desired use case isn't search — it's automated document generation with traceability.",cls:"tc3"},
      {num:"Tension 4 · Trust",tension:"Adoption conditioned on traceability — speed doesn't compensate without cited sources",signal:"87% prefer answers with greater traceability even if slower. The unanimous demand: clear reference with link to source document.",impl:"Adoption isn't won with speed but with precision and source transparency.",cls:"tc4"}
    ],
    quotes: [
      {text:"I'd like portfolio-level information: lessons learned from a specific execution mechanism in a specific state or municipality in Brasil, and a risk compilation by sector, borrower, executor, and region.",tag:"Portfolio intelligence",tagCls:"qt-teal",etapa:"Preparation"},
      {text:"Future ask: why isn't there a system or tool that automatically generates a PCR?",tag:"Automation",tagCls:"qt-amber",etapa:"Closure & Evaluation"},
      {text:"If the tool is used widely and frequently by BID staff across the board — that would be a powerful signal of reliability.",tag:"Adoption & trust",tagCls:"qt-red",etapa:"Plenary session"}
    ],
    challenges: [
      {name:"Search for linked and similar operations",sub:"Preparation · Search",badge:"CRITICAL",bcls:"b-crit",count:"23 reports"},
      {name:"Theoretical references and operation design docs",sub:"Preparation · Documents",badge:"HIGH",bcls:"b-high",count:"11 reports"},
      {name:"Structured data for evidence in documents",sub:"Preparation · Data",badge:"HIGH",bcls:"b-high",count:"11 reports"},
      {name:"Lessons learned from execution",sub:"Execution · Documents",badge:"HIGH",bcls:"b-high",count:"10 reports"},
      {name:"Tools for bank policy alignment",sub:"Execution · Tools",badge:"HIGH",bcls:"b-high",count:"8 reports"},
      {name:"Historical documents in older programs",sub:"Closure · Documents",badge:"MED",bcls:"b-mid",count:"6 reports"}
    ],
    opportunities: [
      {name:"Consult policies with exact citation",pct:92},
      {name:"Find rigorous evidence for decisions",pct:90},
      {name:"Detect gaps in a document",pct:88},
      {name:"Buscar y descargar un grupo de operaciones",pct:79},
      {name:"How a topic has evolved in the region",pct:73},
      {name:"Draft the first POD version",pct:71},
      {name:"Connect with AI agents",pct:70},
      {name:"Map ecosystem of a country and sector",pct:69}
    ],
    modes: [
      {rank:1,name:"Create document from existing content",pts:"60 pts"},
      {rank:2,name:"Compare or analyze information",pts:"58 pts"},
      {rank:3,name:"Search for a quick answer",pts:"52 pts"},
      {rank:4,name:"Export data to spreadsheet",pts:"24 pts"}
    ],
    tools: [
      {name:"Copilot",count:18,pct:100},{name:"SharePoint/EzShare",count:16,pct:89},
      {name:"Colleagues",count:15,pct:83},{name:"Google",count:14,pct:78},
      {name:"ChatGPT",count:11,pct:61},{name:"BID Catalog",count:8,pct:44},
      {name:"Claude",count:6,pct:33},{name:"Other",count:6,pct:33}
    ]
  }
  ,costarica: {
    takeaways: [
      {num:"Tension 1",tension:"Integration as adoption condition — the platform cannot live in a silo",signal:"Costa Rica is the only mission where tool integration surpasses cited sources as the #1 requirement to switch to the platform. They already use Copilot 11 times — they want the KP to plug into that ecosystem, not compete with it.",impl:"The value proposition only materializes if the platform speaks with the existing stack: Teams, SharePoint, email. Without integration, it is just another tool.",cls:"tc1"},
      {num:"Tension 2",tension:"High prior adoption, already formed expectations — the most demanding user base",signal:"46% had already used the platform before — double Colombia. This creates higher expectations: 'be more like Claude', 'no generic answers', 'quality'. The bar is set. These users don't need onboarding — they need depth.",impl:"Costa Rica doesn't need basic onboarding — it needs depth. Expert users are the hardest to recover if the first real experience disappoints.",cls:"tc2"},
      {num:"Tension 3",tension:"Institutional planning documents — a very specific, concrete gap",signal:"The hottest challenge is Programming/Documents (3 reports): institutional capacity analyses, market studies, country system evaluations. And Preparation stage has 6 reports focused on documents for the Ministry of Planning — content that isn't in the platform today.",impl:"Costa Rica has a very specific need profile — policy documents and institutional assessments — that the platform must be able to serve with precision and traceability.",cls:"tc3"},
      {num:"Tension 4 · Productivity",tension:"The platform already works for some — the challenge is scaling that trust",signal:"'It already does it' [Ya lo hace] appears as an answer to what the platform should help you do — one participant is already satisfied. But alongside 'be more like Claude' and 'no generic answers' — there is a gap between satisfied users and demanding ones.",impl:"Growth in CR doesn't come from new users but from deepening with existing ones — converting occasional users into daily ones.",cls:"tc4"}
    ],
    quotes: [
      {text:"The answer shows the source in a way that can be validated. I always cross-check — I need the link to the official source.",tag:"Traceability & sources",tagCls:"qt-teal",etapa:"Trust in official documents"},
      {text:"No generic answers. Be more like Claude.",tag:"Response quality",tagCls:"qt-amber",etapa:"What would make you return?"},
      {text:"Let users themselves rate the lesson learned — that would give it credibility.",tag:"Social validation",tagCls:"qt-red",etapa:"What would you need to see?"}
    ],
    challenges: [
      {name:"Institutional capacity analyses, market studies, country system evaluations",sub:"Programming · Documents",badge:"CRITICAL",bcls:"b-crit",count:"3 reports"},
      {name:"Elaboration documents for Ministry of Planning",sub:"Preparation · Documents",badge:"HIGH",bcls:"b-high",count:"6 reports"},
      {name:"Project status visualization (planning, updates, progress)",sub:"Execution · Tools",badge:"HIGH",bcls:"b-high",count:"4 reports"},
      {name:"Information search for programming stage",sub:"Preparation · Search",badge:"HIGH",bcls:"b-high",count:"3 reports"},
      {name:"Tools and collaboration in execution",sub:"Execution · Other",badge:"MED",bcls:"b-mid",count:"3 reports"},
      {name:"No closure & evaluation challenges reported",sub:"Closure & Evaluation",badge:"N/A",bcls:"b-mid",count:"0 reports"}
    ],
    opportunities: [
      {name:"Detect gaps in a document",pct:100},
      {name:"Consult policies with exact citation",pct:100},
      {name:"Find rigorous evidence for decision-making",pct:100},
      {name:"How a topic has evolved in the region",pct:100},
      {name:"Connect with AI agents",pct:100},
      {name:"Draft the first POD version",pct:71},
      {name:"Map ecosystem of a country and sector",pct:67},
      {name:"Search and download a group of operations or documents",pct:67}
    ],
    modes: [
      {rank:1,name:"Create document from existing content",pts:"14 pts"},
      {rank:2,name:"Search for a quick answer",pts:"10 pts"},
      {rank:3,name:"Compare or analyze information",pts:"7 pts"},
      {rank:4,name:"Export data to spreadsheet",pts:"5 pts"}
    ],
    tools: [
      {name:"Copilot",count:11,pct:100},
      {name:"ChatGPT",count:8,pct:73},
      {name:"Colleagues",count:8,pct:73},
      {name:"Google",count:7,pct:64},
      {name:"SharePoint/EzShare",count:7,pct:64},
      {name:"Claude",count:4,pct:36},
      {name:"BID Catalog",count:4,pct:36},
      {name:"Other",count:0,pct:0}
    ]
  }

};

function pctCls(p){return p>=75?'pct-h':p>=50?'pct-m':'pct-l'}

function renderCountry(k){
  const d=DATA[k];

  // Takeaways
  document.getElementById('tk-'+k).innerHTML=d.takeaways.map(t=>`
    <div class="tk-card ${t.cls}">
      <div><p class="tk-num">${t.num}</p><p class="tk-tension">${t.tension}</p></div>
      <div><p class="tk-signal">${t.signal}</p><p class="tk-impl">${t.impl}</p></div>
    </div>`).join('');

  // Quotes
  document.getElementById('q-'+k).innerHTML=d.quotes.map(q=>`
    <div class="quote-card">
      <span class="q-glyph">"</span>
      <p class="q-text">${q.text}</p>
      <div class="q-foot">
        <span class="q-tag ${q.tagCls}">${q.tag}</span>
        <span class="q-etapa">${q.etapa}</span>
      </div>
    </div>`).join('');

  // Challenges
  document.getElementById('ch-'+k).innerHTML=d.challenges.map(c=>`
    <div class="ch-row">
      <span class="ch-badge ${c.bcls}">${c.badge}</span>
      <div class="ch-info"><div class="ch-name">${c.name}</div><div class="ch-sub2">${c.sub}</div></div>
      <span class="ch-count">${c.count}</span>
    </div>`).join('');

  // Opportunities
  document.getElementById('opp-'+k).innerHTML=d.opportunities.map((o,i)=>`
    <div class="opp-row">
      <span class="opp-num">${i+1}</span>
      <span class="opp-name">${o.name}</span>
      <div class="opp-bar-wrap"><div class="opp-bar-bg"><div class="opp-bar-fill" style="width:${o.pct}%"></div></div></div>
      <span class="opp-pct ${pctCls(o.pct)}">${o.pct}%</span>
    </div>`).join('');

  // Modes
  document.getElementById('modes-'+k).innerHTML=d.modes.map(m=>`
    <div class="mode-card">
      <div class="mode-rank${m.rank<=2?' top':''}">${m.rank}</div>
      <div><div class="mode-name">${m.name}</div><div class="mode-pts">${m.pts}</div></div>
    </div>`).join('');

  // Tools
  document.getElementById('tools-'+k).innerHTML=d.tools.map(t=>`
    <div class="tool-card">
      <div class="tool-num">${t.count}</div>
      <div class="tool-info">
        <div class="tool-name">${t.name}</div>
        <div class="tool-bar-bg"><div class="tool-bar-fill" style="width:${t.pct}%"></div></div>
      </div>
    </div>`).join('');
}

function switchTab(tab,btn){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('view-'+tab).classList.add('active');
  btn.classList.add('active');
  const labels={sintesis:'SYNTHESIS · COMPARATIVE REPORT',colombia:'COLOMBIA · MISSION REPORT · 26–27 MAY 2026',brasil:'BRASIL · MISSION REPORT · 1 JUN 2026',costarica:'COSTA RICA · MISSION REPORT · 8 JUN 2026'};
  document.getElementById('footer-label').textContent=labels[tab]||'';
}

function exportCSV(country){
  const d=DATA[country];
  const rows=[
    ['Section','Item','Value','Notes'],
    ['','','',''],
    ['OPPORTUNITIES','','',''],
    ...d.opportunities.map((o,i)=>[`Opportunity ${i+1}`,o.name,`${o.pct}%`,'% would use it']),
    ['','','',''],
    ['CHALLENGES','','',''],
    ...d.challenges.map(c=>['Challenge',c.name,c.count,`${c.badge} · ${c.sub}`]),
    ['','','',''],
    ['USE MODES','','',''],
    ...d.modes.map(m=>[`Mode ${m.rank}`,m.name,m.pts,'']),
    ['','','',''],
    ['TOOLS','','',''],
    ...d.tools.map(t=>['Tool',t.name,`${t.count} mentions`,`${t.pct}% of max`]),
    ['','','',''],
    ['QUOTES','','',''],
    ...d.quotes.map((q,i)=>[`Quote ${i+1}`,q.text,q.tag,q.etapa])
  ];
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`KP-field-findings-${country}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

renderCountry('colombia');
renderCountry('brasil');
renderCountry('costarica');
renderCountry('costarica');
</script>
</body>
</html>

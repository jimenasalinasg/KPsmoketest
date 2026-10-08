// Como se mide cada metrica de la vista "Usability metrics": lo que muestra el hover (i) junto a cada cifra.
// Los numeros de las formulas salen del ledger (via ctx); aca solo hay texto y IDs.
//
// REGLA DE LOS IDs: un ID de FullStory solo se lista si su DEFINICION es la del evento que cuenta el ledger
// (nombre y definicion leidos con get_metric el 8-oct-2026). Las metricas guardadas cuentan a todos, incluido el
// equipo interno; el ledger cuenta el mismo evento sobre el segmento Sin DEV (copy), por eso el ledger es igual o
// menor (septiembre: highlights 675 en FullStory contra 392 en el ledger). Para las filas de Contextual no hay metrica
// guardada cuya definicion coincida (dan menos que el ledger), asi que no llevan ID: dicen "pending".
// Si aparece un ID nuevo: agregarlo en FS y en la entrada que corresponda.

const FS = {
  users:        ["1123293977", "Usuarios únicos sin DEV · unique users that visited knowledgeplatform.iadb.org"],
  usersMonthly: ["a30wnMzqgtJk", "unique users, any activity · same count, used for the monthly view"],
  osHighlight:  ["RQ6IjtoMbeD5", "Highlighted text en BA · highlights on the Open Search page"],
  osCopy:       ["JOTETVLPeJKh", "Copied text BA · copies on the Open Search page"],
  osSource:     ["Ge6P9qbIeu3b", "Consultas en panel de fuentes en BA · clicks on Open-Search-Button-Response-SourcesOverview, Open-Search-Fonts-Item-Document and Open-Search-Fonts-Item-Source"],
  word:         ["3EkjBy6jYByB", "Download Word en la BA · unique users who clicked Open-Search-Button-Response-DownloadWord"],
  excel:        ["FIw2VjBWkJ6J", "Download Excel en la BA · unique users who clicked Open-Search-Button-Response-DownloadExcel"],
  csQueries:    ["2EYT9yOW6odB", "Sum de Page Views de la Búsqueda Contextual · views of the five pill pages and the project detail page"],
};
// Metricas guardadas de los mismos elementos de Global Search, pero que cuentan USUARIOS UNICOS (el ledger cuenta eventos).
const FS_GS_RELATED = [
  ["NbBvIvRRSR0V", "Usuarios con proyecto que usaron Global Search (chips) · unique users"],
  ["nXz9zXz1v5wN", "Usuarios sin proyecto que usaron Global Search (chips) · unique users"],
  ["wO6AxZbNP3wO", "Usuarios que buscan proyectos en el search bar · unique users"],
];

// cs_copy: PsOR0eOxZVkB verificado en FullStory (11 elementos de copy). Los otros dos son subconjuntos de un solo boton: "a confirmar".
const CS_COPY_IDS = [
  ["PsOR0eOxZVkB", "Copied text BC · 11 copy buttons (the ledger values come from it, on Sin DEV (copy)). Covers 11 of ~18 copy buttons, so it undercounts"],
];
const CS_COPY_TO_CONFIRM = [
  ["fD3J4eCjx0JC", "Copy - Literature (Pills-Knowledge-copy-lit) · to confirm"],
  ["BPdIt4S8cmik", "Copy - Lessons Learned (Pills-Knowledge-copy-ll) · to confirm"],
];
const EV = {
  cards: "Elements [data-fs-element*=\"Pills-Knowledge\"] (the sidebar cards).",
  detail: "Detail page /open-pill/*/*/SimilarProjects.",
  source: "8 elements: the 3 POD-Card-*-Button-SourceLink, plus Pills-Knowledge-*-Card-Button-Link and Card-Source.",
};
const EVENT_ONLY = "No saved FullStory metric of its own: defined by these events/elements. Exact element list to be documented.";
const PENDING = "FullStory metric ID to be added: this ledger row uses the product team's own definition.";
const CONSOLE = "Admin console, not FullStory.";

// ctx = { fmt, sum, baseline, snap, noteOf, totalStaff }
export function buildDocs(ctx) {
  const { fmt, sum, baseline, snap, noteOf, totalStaff } = ctx;
  const osH = sum("os_highlight"), osC = sum("os_copy"), osS = sum("os_source_panel"), osD = baseline("os_downloads");
  const csHd = sum("cs_highlight_detail"), csHc = sum("cs_highlight_cards"), csC = sum("cs_copy"), csL = sum("cs_source_link");
  const chips = sum("cs_chips"), bar = sum("cs_search_bar");
  const users = snap("unique_users"), returning = snap("returning_rate_pct");
  const eventBasis = "Counted on the Sin DEV (copy) segment: the internal team (DEV) is excluded. The saved FullStory metrics define the event but count everyone, so they read equal or higher than the ledger.";

  const D = {
    // ── tarjetas ──────────────────────────────────────────
    users: {
      kind: "Snapshot", title: "Unique users",
      what: "Distinct people who have used KP since the Sep 2025 launch, each counted once.",
      formula: `Last month-close + the current month's delta: [Sep 1, 2025 → today] − [Sep 1, 2025 → previous month-end]. Latest snapshot (${users.month}): ${fmt(users.value)}.`,
      ids: [FS.users, FS.usersMonthly],
      note: "A snapshot is cumulative, so it is never summed across months.",
    },
    penetration: {
      kind: "Derived", title: "Penetration",
      what: "Share of IDB staff and consultants who have used KP.",
      formula: `${fmt(users.value)} unique users ÷ ${fmt(totalStaff)} IDB staff = ${(Math.round((users.value / totalStaff) * 1000) / 10)}%.`,
      note: `The ${fmt(totalStaff)} headcount is a fixed reference, not a FullStory metric.`,
    },
    returning: {
      kind: "Snapshot", title: "Returning user rate",
      what: "Of the people who visit KP, the share who come back within 14 days.",
      formula: `Ledger snapshot returning_rate_pct = ${returning.value}%, shown as ${Math.round(returning.value / 10)}/10 (the rate divided by 10, rounded).`,
      idsNote: PENDING,
      note: "A rate with numerator and denominator over the same window, so FullStory's ~12-month retention does not distort it.",
    },
    prompts: {
      kind: "Console", title: "Prompts sent",
      what: "Prompts sent to Open Search, cumulative.",
      formula: `Ledger snapshot prompts_sent (latest: ${fmt(snap("prompts_sent").value)}).`,
      note: `${CONSOLE} FullStory's prompt metrics count one submit button, not prompts, so they are not used.`,
    },
    avePrompt: {
      kind: "Console", title: "Ave. prompt",
      what: "Average prompt figure reported by the admin console.",
      formula: `Ledger snapshot ave_prompt (latest: ${snap("ave_prompt").value}).`,
      note: `${CONSOLE} Console-derived: refresh it against the latest prompts sent.`,
    },
    osEngagement: {
      kind: "Ledger", title: "Open Search · content engagement",
      what: "Times someone took content out of Open Search: highlighted it, copied it, opened a source, or downloaded it.",
      formula: `Highlights ${fmt(osH)} + copies ${fmt(osC)} + source panel ${fmt(osS)} + downloads ${fmt(osD)} = ${fmt(osH + osC + osS + osD)}. The first three are the sum of the monthly ledger rows; downloads are a cumulative baseline of unique users (Word + Excel).`,
      ids: [FS.osHighlight, FS.osCopy, FS.osSource, FS.word, FS.excel],
      note: eventBasis,
    },
    queries: {
      kind: "Ledger", title: "Contextual Search · queries",
      what: "Visits to the Contextual Search pills, and to the project detail page they open.",
      formula: `Sum of the monthly ledger rows cs_queries = ${fmt(sum("cs_queries"))}.`,
      ids: [FS.csQueries],
      note: eventBasis,
    },
    mostUsedPill: {
      kind: "Manual", title: "Most used pill",
      what: "The contextual pill with the most use.",
      formula: "Set by hand by the product team; it is not computed from the ledger.",
      note: "Update it manually when it changes.",
    },
    csEngagement: {
      kind: "Ledger", title: "Contextual Search · content engagement",
      what: "Times someone took content out of Contextual Search, or used Global Search.",
      formula: `Copies ${fmt(csC)} + source links ${fmt(csL)} + highlights ${fmt(csHd + csHc)} (detail ${fmt(csHd)} + sidebar cards ${fmt(csHc)}) + Global Search ${fmt(chips + bar)} (chips ${fmt(chips)} + search bar ${fmt(bar)}) = ${fmt(csC + csL + csHd + csHc + chips + bar)}. Every term is the sum of its monthly ledger rows.`,
      ids: CS_COPY_IDS,
      idsNote: `Copies: ${"PsOR0eOxZVkB"} above. Highlights and source links have no saved metric of their own (see the events below); Global Search chips/search bar are the related user counts.`,
      events: `Highlight cards: ${EV.cards} Highlight detail: ${EV.detail} Source links: ${EV.source}`,
      related: [...CS_COPY_TO_CONFIRM, ...FS_GS_RELATED],
      relatedLabel: "Other copy metrics (to confirm) and Global Search user counts (unique users, not these counts)",
      note: eventBasis,
    },
    lessons: {
      kind: "Console", title: "Lessons learned created",
      what: "Lessons written in the Lessons Writing Assistant, from the Client Portal and KP together.",
      formula: `Ledger snapshot lessons_created (latest: ${fmt(snap("lessons_created").value)}).`,
      note: CONSOLE,
    },
    // ── columnas de la tabla de historia ─────────────────
    os_highlight: { kind: "Ledger", title: "OS highlight", what: "Highlights on the Open Search page, per month.", formula: `Ledger row os_highlight; total ${fmt(osH)}.`, ids: [FS.osHighlight], note: eventBasis },
    os_copy: { kind: "Ledger", title: "OS copy", what: "Copies on the Open Search page, per month.", formula: `Ledger row os_copy; total ${fmt(osC)}.`, ids: [FS.osCopy], note: eventBasis },
    os_source_panel: { kind: "Ledger", title: "OS source", what: "Clicks on the source panel in Open Search, per month.", formula: `Ledger row os_source_panel; total ${fmt(osS)}.`, ids: [FS.osSource], note: eventBasis },
    cs_queries: { kind: "Ledger", title: "CS queries", what: "Contextual Search pill and detail page views, per month.", formula: `Ledger row cs_queries; total ${fmt(sum("cs_queries"))}.`, ids: [FS.csQueries], note: eventBasis },
    cs_copy: { kind: "Ledger", title: "CS copy", what: "Copies in Contextual Search, per month.", formula: `Ledger row cs_copy; total ${fmt(csC)}.`, ids: CS_COPY_IDS, related: CS_COPY_TO_CONFIRM, relatedLabel: "Other copy metrics (to confirm)", note: eventBasis },
    cs_source_link: { kind: "Ledger", title: "CS source", what: "Source link clicks in Contextual Search, per month.", formula: `Ledger row cs_source_link; total ${fmt(csL)}.`, idsNote: EVENT_ONLY, events: EV.source, note: eventBasis },
    cs_highlight_detail: { kind: "Ledger", title: "CS hl detail", what: "Highlights in the Contextual Search detail views, per month.", formula: `Ledger row cs_highlight_detail; total ${fmt(csHd)}.`, idsNote: EVENT_ONLY, events: EV.detail, note: eventBasis },
    cs_highlight_cards: { kind: "Ledger", title: "CS hl cards", what: "Highlights on the sidebar pill cards, per month.", formula: `Ledger row cs_highlight_cards; total ${fmt(csHc)}.${noteOf("cs_highlight_cards") ? ` Ledger note: ${noteOf("cs_highlight_cards")}.` : ""}`, idsNote: EVENT_ONLY, events: EV.cards, note: eventBasis },
    cs_chips: { kind: "Ledger", title: "GS chips", what: "Global Search · filter chips, per month.", formula: `Ledger row cs_chips; total ${fmt(chips)}. The ledger counts events.`, idsNote: PENDING, related: FS_GS_RELATED.slice(0, 2), note: eventBasis },
    cs_search_bar: { kind: "Ledger", title: "GS search bar", what: "Global Search · search bar, per month.", formula: `Ledger row cs_search_bar; total ${fmt(bar)}. The ledger counts events.`, idsNote: PENDING, related: FS_GS_RELATED.slice(2), note: eventBasis },
  };
  return D;
}

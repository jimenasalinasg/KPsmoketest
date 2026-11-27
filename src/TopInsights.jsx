// Top 3 insights per month: signal → so what → recommended action.
// The goal is to move from reporting numbers to informing a decision.
// Figures come from the month objects in App.jsx (segment Sin DEV) and the admin console.
import { SURF, BDR, INK, INK2, INK3, BLUE_D, BLUE_L, PURPLE, T, R, SHADOW } from "./theme.js";

export const INSIGHTS = {
  "2026-04": {
    takeaway: "Launch brought volume; the next step is turning visits into a first question.",
    items: [
      { title: "A strong launch, mostly first visits", signal: "584 users, 411 of them new (70%).", soWhat: "Awareness worked. Whether people stay is still unproven.", action: "Track May returning users as the main health metric, not total reach." },
      { title: "Most visitors don't ask anything", signal: "37% of users sent a prompt; 2 prompts per prompter.", soWhat: "Visitors explore but do not commit to the Assistant.", action: "Put example questions on the home page, tied to real operations." },
      { title: "Similar projects is the entry point", signal: "Top pill: Similar projects (78 views).", soWhat: "Users come to find precedent before anything else.", action: "Make similar projects the first result after searching an operation." },
    ],
  },
  "2026-05": {
    takeaway: "Fewer users, deeper use: the core audience is forming.",
    items: [
      { title: "Reach fell, depth rose", signal: "344 users (−41%); prompts per prompter up from 2.0 to 5.1.", soWhat: "Launch curiosity faded; the remaining users are getting real value.", action: "Shift the goal from reach to activating new teams through divisional champions." },
      { title: "Half the audience is returning", signal: "169 returning users, 49% of the month.", soWhat: "There is a stable base to learn from.", action: "Interview 5 returning users to document the jobs the KP does for them." },
      { title: "Satisfaction is solid", signal: "CSAT 82.4%.", soWhat: "Quality is not the barrier to adoption.", action: "Invest in discoverability before adding new features." },
    ],
  },
  "2026-06": {
    takeaway: "Usage is concentrating in fewer, heavier users.",
    items: [
      { title: "Heavier use per person", signal: "1,025 prompts; 6.8 per prompter (5.1 in May).", soWhat: "The Assistant fits real work for those who adopt it.", action: "Capture the questions heavy users ask and turn them into templates." },
      { title: "Onboarding is losing people", signal: "Tour completion fell to 44% (52% in May).", soWhat: "New users leave before reaching value.", action: "Shorten the tour to one step that leads straight to a first question." },
      { title: "Lessons Writing Assistant has no traction", signal: "14 people opened it, none created a lesson.", soWhat: "Inside the KP, the assistant is not part of anyone's workflow.", action: "Place it where lessons are actually written: the reporting cycle." },
    ],
  },
  "2026-07": {
    takeaway: "Summer drop in reach, but retention holds.",
    items: [
      { title: "Two of three users are returning", signal: "237 users; 151 returning (64%).", soWhat: "The core base is loyal; new-user inflow is the bottleneck.", action: "Plan an acquisition push for September, after the summer break." },
      { title: "Lessons Learned leads the pills", signal: "Top pill: Lessons Learned (46).", soWhat: "Interest in institutional learning is real.", action: "Connect lessons to the operation users are searching for." },
      { title: "Few take content out", signal: "9 downloads (6 Word, 3 Excel).", soWhat: "Output is read in the KP but rarely reused elsewhere.", action: "Test one-click export of answers into the documents teams already produce." },
    ],
  },
  "2026-08": {
    takeaway: "Stable month: a good baseline before the September cycle.",
    items: [
      { title: "Steady base", signal: "271 users; 54% returning.", soWhat: "Usage holds without promotion.", action: "Use August as the baseline to measure any campaign against." },
      { title: "Onboarding recovered", signal: "Tour completion 51% (44% in July).", soWhat: "Recent onboarding changes are working.", action: "Keep the current tour; focus effort on the step after it." },
      { title: "Deeper conversations", signal: "634 prompts; 5.8 per prompter.", soWhat: "Those who ask, ask more than once.", action: "Make the first question easier; the rest follows." },
    ],
  },
  "2026-09": {
    takeaway: "The best activation month so far, while onboarding weakens.",
    items: [
      { title: "Highest share of users asking", signal: "46% of users sent a prompt; 7 prompts per prompter.", soWhat: "When users reach the Assistant, it delivers.", action: "Remove friction between landing and the first question." },
      { title: "Tour completion dropped", signal: "40% (51% in August).", soWhat: "Fewer new users finish onboarding.", action: "Replace the tour with a contextual first prompt suggestion." },
      { title: "Few new users", signal: "110 new users; 59% returning.", soWhat: "Growth depends on discovery, not on the product.", action: "Reach new users where they already work: divisional channels and reporting tools." },
    ],
  },
  "2026-10": {
    takeaway: "The platform retains its users; the challenge is reaching more of them.",
    items: [
      { title: "High retention, low acquisition", signal: "79 new users; 62% of the month were returning.", soWhat: "Visibility is the gap, not the product.", action: "Identify the moments in the workflow where the KP adds the most value and show up there." },
      { title: "Low conversion to a first question", signal: "25% of users sent a prompt (46% in September). Many start by pasting an operation code.", soWhat: "Users arrive with an operation, not a question.", action: "Suggest frequent questions when an operation code is entered." },
      { title: "Faster, but less coverage", signal: "Latency 14s (25s). 76% of prompts went unanswered; missing sources doubled to 58.", soWhat: "Part is one heavy user, but the content gaps are real.", action: "Use unanswered questions to prioritize which content to add next." },
    ],
  },
  "2026-11": {
    partial: true,
    takeaway: "Reach is back at October's level, carried by returning users; new users still trail.",
    items: [
      { title: "Returning users dominate", signal: "204 users through Nov 26; 140 returning (69%). 64 new, against 79 in all of October.", soWhat: "The base is loyal; acquisition still lags.", action: "Confirm at month close; if the trend holds, prioritize an acquisition experiment for Q1." },
      { title: "Asking stays low", signal: "28% of users sent a prompt (57 of 204; 25% in October).", soWhat: "October's drop was not a one-off.", action: "Prototype suggested questions on operation search and test it with 5 users." },
      { title: "Lessons Learned is the top pill", signal: "25 sessions opened Lessons Learned, nearly double Data (13).", soWhat: "Demand for institutional learning keeps showing.", action: "Explore surfacing Client Portal lessons when users search an operation." },
    ],
  },
};

export default function TopInsights({ month }) {
  const d = INSIGHTS[month];
  if (!d) return null;
  return (
    <section aria-label="Top 3 insights" style={{ background: SURF, border: `1px solid ${BDR}`, borderTop: `4px solid ${PURPLE}`, borderRadius: R.lg, boxShadow: SHADOW, padding: "16px 20px" }}>
      <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: PURPLE, fontWeight: 600 }}>
        Top 3 insights · from measuring to recommending{d.partial ? " · partial month" : ""}
      </div>
      <div style={{ fontSize: T.md, fontWeight: 600, color: INK, margin: "4px 0 14px", lineHeight: 1.35 }}>{d.takeaway}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {d.items.map((it, i) => (
          <div key={i} style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8, border: `1px solid ${BDR}`, borderRadius: R.md, padding: "12px 14px" }}>
            <div style={{ fontSize: T.sm, fontWeight: 600, color: INK }}>{i + 1}. {it.title}</div>
            <Row label="Signal" text={it.signal} />
            <Row label="So what" text={it.soWhat} />
            <div style={{ marginTop: "auto", background: BLUE_L, borderRadius: R.sm, padding: "8px 10px" }}>
              <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: BLUE_D, fontWeight: 600 }}>Recommended action</div>
              <div style={{ fontSize: T.sm, color: INK, lineHeight: 1.45, marginTop: 2 }}>{it.action}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ label, text }) {
  return (
    <div>
      <div style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.04em", color: INK3, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: T.sm, color: INK2, lineHeight: 1.45 }}>{text}</div>
    </div>
  );
}

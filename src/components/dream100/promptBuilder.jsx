// Dream 100 Prompt Builder — Claude-Optimized, Industry-Enriched
// All prompts are built for Claude API execution.
// Uses INDUSTRY_DATA for richer, more specific prompts.

const CLAUDE_NOTE = 'Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice. Deliver exactly the deliverables described. Do NOT use emoji anywhere in your output — not in headers, labels, bullet points, or section markers. Use plain text only (e.g., "THE GAP" not "🕳️ THE GAP", "Handwritten Note Moments" not "✍️ Handwritten Note Moments"). This is a hard requirement.';

// ── Industry-Specific Context ─────────────────────────────────────────────
// This data enriches every prompt with specific partner types, trigger events,
// and objection categories instead of making Claude guess from scratch.

const INDUSTRY_DATA = {
  "Real Estate": {
    triggerEvents: "home purchase, home sale, refinance, investment property acquisition, relocation, lease signing, portfolio expansion",
    upstreamPartners: "mortgage brokers, financial advisors, estate attorneys, CPAs, divorce attorneys, relocation specialists, property managers",
    sideStreamPartners: "home inspectors, title companies, interior designers, contractors, insurance agents, moving companies, stagers",
    lifecycleMoments: "pre-listing, active search, under contract, closing, post-close 30/60/90 days, first anniversary, refinance trigger",
    partnerValueAdd: "priority referrals, client pre-qualification support, co-marketing materials, market report sharing, closing gift coordination",
    objectionContext: "existing referral relationships, territory overlap concerns, reciprocity expectations, compliance considerations",
    scriptTone: "consultative, confidence-based, neighborhood-authority positioning",
  },
};

// Always use Real Estate since this is a realtor-focused tool
const IND = INDUSTRY_DATA["Real Estate"];

export function buildPrompts(formData) {
  const n = formData.name || 'I';
  const niche = formData.niche || 'General Residential';
  const geo = formData.geo || 'my market area';
  const client = formData.client ? formData.client : `buyers and sellers in the ${niche} segment`;
  const challenge = formData.challenge || 'building consistent referral partner relationships';
  const years = formData.years || '';

  const ctx = `MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- Ideal client: ${client}
- Referral challenge: ${challenge}
${years ? `- My experience: ${years}` : ''}
- My name: ${n}`;

  return [
    {
      id: 1,
      title: 'Phase 1: Lifecycle Trigger Mapping',
      prompt: `${ctx}

TASK — Lifecycle Trigger Mapping

Map the complete lifecycle of my ideal real estate client. Identify every major life event, financial trigger, and transition point that causes someone in the ${niche} segment to buy or sell in ${geo}.

Common trigger events in real estate include: ${IND.triggerEvents}. Use these as a starting point, then add triggers SPECIFIC to ${niche} in ${geo}.

Key lifecycle moments to consider: ${IND.lifecycleMoments}

For each trigger provide:
1. The specific trigger event
2. Months before a real estate transaction this typically occurs
3. Which professional type sees the client at this trigger BEFORE they contact a realtor
4. Why that professional has high trust at that exact moment

DELIVERABLE: Markdown table with columns:
| Trigger Event | Months Before Transaction | Upstream Professional | Why They Have High Trust |

Include at least 12 distinct trigger events. Mark top 3 with ★ and explain in 2-3 sentences each why they are the priority for the ${niche} niche specifically.

${CLAUDE_NOTE}`
    },
    {
      id: 2,
      title: 'Phase 2: Upstream & Side-stream Partner Mapping',
      prompt: `${ctx}

TASK — Upstream & Side-stream Partner Mapping

UPSTREAM PARTNERS (see client 3–12 months before a transaction):
Known upstream partner types for real estate: ${IND.upstreamPartners}

List 8–10 partner types relevant to ${niche} in ${geo}. Every partner type must be realistically able to make referrals without violating their professional code of ethics. Do not include partner types (e.g., therapists, counselors) where referral behavior would conflict with confidentiality obligations or professional ethical constraints. For each:
— Why they see my ${niche} client early
— The specific problem they're solving at that moment
— What a ${niche} specialist in ${geo} can offer them in return (specific value exchange)
— Estimated monthly referral frequency

SIDE-STREAM PARTNERS (see client during the transaction):
Known side-stream partner types: ${IND.sideStreamPartners}

List 4–6 partner types. Same format.

UNDERUTILIZED PARTNERS:
Identify the top 3 underutilized partner types that most ${niche} agents overlook. Explain why they are high-value and underserved in ${geo} specifically.

${CLAUDE_NOTE}`
    },
    {
      id: 3,
      title: 'Phase 3: Dream 10 Tier Ranking & Shortlist',
      prompt: `${ctx}

TASK — Dream 10 Tier Ranking & Shortlist

TIER STRUCTURE:
— Tier 1 (Direct Upstream): Partners who see clients immediately before a transaction trigger
— Tier 2 (Lifestyle & Transition): Partners who see clients during a life phase shift
— Tier 3 (Community & Maintenance): Partners with consistent long-term client contact

Build the Dream 10 table:
| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority for ${niche} | First Contact Strategy |

Then answer: What 3 personal characteristics should ${n} look for when identifying WHICH INDIVIDUAL at each company to target (beyond just finding the business)?

IMPORTANT: The Dream 10 list you create here will be used as the foundation for ALL remaining phases. Be specific and deliberate with your rankings. Phases 4, 5, 6, and 7 will all reference this exact list.

${CLAUDE_NOTE}`
    },
    {
      id: "4a",
      title: 'Phase 4a: Value Strategy Cards (Partners 1–3)',
      prompt: `${ctx}

TASK — Value Strategy Cards for Top 3 Partner Types

For each of the top 3 referral partner types from the Dream 10 ranking, create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${niche} specialist in ${geo} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can ${n} create or offer to start the relationship — with no ask? Be extremely specific (not "a market report" but "a quarterly ${niche}-specific absorption rate report for ${geo} with their branding included").

Known value-add categories in real estate: ${IND.partnerValueAdd}. Go beyond these — what would make this specific partner type think "I need to keep this agent close"?

**3. THE RECURRING TOUCHPOINT:** What ongoing value can ${n} deliver monthly or quarterly to keep the relationship warm?

Format each card clearly with the partner type as a header.

${CLAUDE_NOTE}`
    },
    {
      id: "4b",
      title: 'Phase 4b: Value Strategy Cards (Partners 4–6) + Value Manifesto',
      prompt: `${ctx}

TASK — Value Strategy Cards for Partners 4–6 + Value Manifesto

For each of the next 3 referral partner types (partners ranked 4–6 from the Dream 10), create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${niche} specialist in ${geo} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can ${n} create or offer to start the relationship — with no ask?

**3. THE RECURRING TOUCHPOINT:** What ongoing value can ${n} deliver monthly or quarterly?

---

Then write ${n}'s **Value Manifesto** — a 3-paragraph positioning statement ${n} would use when meeting new referral partners in person. It should focus entirely on how ${n} serves the partner's clients, not on promoting ${n}'s own production. Warm, peer-to-peer tone. No buzzwords.

Start with a **"Cocktail Party Version"** — 2-3 sentences that ${n} could deliver in 30 seconds when someone asks "what do you do?" This is the quick version for casual introductions.

Then write the full 3-paragraph version — what ${n} would say in a sit-down coffee meeting. The manifesto should feel like something ${n} would actually say — not a marketing page.

${CLAUDE_NOTE}`
    },
    {
      id: 5,
      title: 'Phase 5: Objection Anticipation & Response Prep',
      prompt: `${ctx}

TASK — Objection Anticipation & Response Prep

Known objection categories in real estate referral partnerships: ${IND.objectionContext}

For each objection, frame it around a SPECIFIC Dream 10 partner type from Phase 3 — name the partner type in the header (e.g., "When a Wealth Manager says..." or "When a CPA says..."). Choose the partner type where that objection is most likely to surface.

For each objection provide:
— The specific Dream 10 partner type most likely to say this
— WHY this objection comes up (the real fear underneath it)
— A non-defensive, conversational response that reframes without being pushy
— A follow-up question that keeps the door open

OBJECTIONS:
1. "I already have a realtor I work with."
2. "I'm not in a position to refer clients right now."
3. "I don't want to refer someone and have it reflect badly on me."
4. "I don't encounter that many clients who need a realtor."
5. "I'm too busy to meet — can you just send me your card?"
6. "Can I think about it and get back to you?"
7. One objection specific to ${niche} partnerships in ${geo}
8. One more objection specific to ${niche} partnerships that most agents don't think of

BONUS: Write a "trust reset" script for: (a) a relationship that went cold after initial contact, and (b) a past referral relationship that ended badly.

TONE: ${IND.scriptTone}. Not salesy.

${CLAUDE_NOTE}`
    },
    {
      id: 6,
      title: 'Phase 6: Complete Outreach Script Suite',
      prompt: `${ctx}

TASK — Complete Outreach Script Suite

Write all 6 scripts below. Each script should reference the specific partner types and value gifts established in earlier phases.

Tone for all scripts: ${IND.scriptTone}

**SCRIPT 1 — Cold Intro Email**
3 subject line options. Body under 150 words. Focus on partner's business, not ${n}'s needs. Mention a specific value gift from the Value Strategy Cards. End with a low-commitment ask.

**SCRIPT 2 — LinkedIn Connection Message**
Under 300 characters. Reference something real about their work. Do not mention referrals.

**SCRIPT 3 — Coffee/Zoom Invitation**
4–6 sentences. Frame around their business growth. Include a curiosity hook specific to ${niche} in ${geo}.

**SCRIPT 4 — Handwritten Note Introduction**
3–4 sentences. Sent BEFORE any other outreach. Completely personal. Zero sales language. This is the first impression that opens every door. This is the most important script in the entire suite — it's what separates ${n} from every other agent who sends an email.

**SCRIPT 5 — Value-First Follow-Up**
Brief message after delivering the value gift. Conversational. Plant a seed without making an ask.

**SCRIPT 6 — Referral Thank-You Note**
Warm, personal, non-templated. Sent immediately after receiving a referral. Handwritten if possible.

All scripts sound like ${n} — warm, credible, peer-to-peer. No buzzwords or corporate-speak.

${CLAUDE_NOTE}`
    },
    {
      id: "7a",
      title: 'Phase 7a: 90-Day Week-by-Week Plan + Relationship Tracker',
      prompt: `${ctx}

TASK — 90-Day Launch Plan + Relationship Tracker

**PART A — Week-by-Week 90-Day Sequence**
For a new Tier 1 referral partner, provide a week-by-week action plan for the first 90 days (13 weeks). For each week:
— Specific action
— Channel (handwritten note, email, phone, in-person, social media)
— Goal of the touchpoint
— Time investment estimate

The handwritten note should always be the first touchpoint (Week 1). This is non-negotiable — it's the foundation of the entire sequence and what makes this system different from generic networking.

**End Part A with a "Quick Reference Grid"** — a compact summary table showing all 13 weeks in one view:
| Week | Channel | Action (5 words max) |
This should fit on one printed page and serve as a desk reference ${n} can print and check off.

**PART B — Relationship Tracker Template**
Design a simple tracker structure for managing all 10 Dream Partners. Include columns for:
partner name, tier, last contact date, next action, relationship stage (Cold / Warm / Active / Advocate), notes, inbound referral count, outbound referrals sent TO this partner. The outbound column is critical — it makes referral reciprocity visible and trackable, not just aspirational.

Format both parts clearly with markdown headers and tables where appropriate.

${CLAUDE_NOTE}`
    },
    {
      id: "7b",
      title: 'Phase 7b: 12-Month Calendar + Referral Math',
      prompt: `${ctx}

TASK — 12-Month Quarterly Calendar + Referral Math

**PART C — 12-Month Quarterly Calendar**
After a partner becomes active, what does ${n} do each quarter to maintain and deepen the relationship? Create a 4-quarter calendar with:
— Specific touchpoints per quarter
— Value gifts (reference the ones from Phase 4)
— Personal gestures
— Exact moments where a handwritten note is the highest-leverage move (quarterly check-in, referral thank-you, partner's business milestone, holiday)

**PART D — Referral Math**
Walk through the referral math simply and conservatively. The goal is to show how the system produces closed deals — NOT to project income or commission. Never include dollar amounts, commission calculations, or income projections. The agent knows their own average deal size and split — they can do that math themselves.

Show 3 scenarios: conservative, moderate, strong. For each scenario:
— NAME which specific Dream 10 partner types (by rank from Phase 3) are active. For example, the conservative scenario might assume partners #1, #2, and #4 are active.
— How many referrals per partner per quarter at that tier
— Total referrals per year
— Realistic close rate (be honest — 35-45% for warm referrals)
— **Total closed deals from referrals** ← stop here. No dollar amounts.

End with a "What ${n} needs to believe is true for this system to work" section — the honest gut-check on patience, reciprocity, and consistency. Realtors respect straight talk over hype.

Format with markdown headers and tables.

${CLAUDE_NOTE}`
    }
  ];
}
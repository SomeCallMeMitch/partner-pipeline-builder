/**
 * Extracts the 10 individual phase prompts from a Build record.
 * Phases split to keep each prompt focused and avoid timeouts.
 */

import { INDUSTRY_DATA } from "./promptEngine";

function buildProfile(data) {
  const ind = INDUSTRY_DATA[data.industry] || INDUSTRY_DATA["Real Estate"];
  return {
    ...ind,
    industry: data.industry,
    niche: data.niche,
    geography: data.geography,
    avgDeal: data.avg_deal_size ? `$${Number(data.avg_deal_size).toLocaleString()}` : "not specified",
    salesCycle: data.sales_cycle_months ? `${data.sales_cycle_months} months` : "not specified",
    referralPct: data.referral_revenue_pct ? `${data.referral_revenue_pct}%` : "not specified",
    teamSize: data.team_size ? `${data.team_size} people` : "not specified",
  };
}

const PERSONA = "You are a Strategic Alliances Director specializing in referral partner systems for high-performing sales professionals.";

export function buildPhasePrompts(build) {
  const p = buildProfile(build);

  const ctx = `MY CONTEXT:
- Industry: ${p.industry}
- Niche: ${p.niche}
- Market area: ${p.geography}
- Average deal size: ${p.avgDeal}
- Sales cycle: ${p.salesCycle}
- Current referral revenue: ${p.referralPct}
- Team size: ${p.teamSize}`;

  return [
    {
      id: 1,
      title: "Phase 1: Lifecycle Trigger Mapping",
      prompt: `${PERSONA}

${ctx}

TASK — Lifecycle Trigger Mapping

Map the complete lifecycle of my ideal client. Identify every major life event, financial trigger, and transition point that causes someone in the ${p.niche} segment to need my services in ${p.geography}.

For each trigger provide:
1. The specific trigger event
2. Months before a transaction this typically occurs
3. Which professional type sees the client at this trigger BEFORE they contact me
4. Why that professional has high trust at that exact moment

DELIVERABLE: Markdown table:
| Trigger Event | Months Before Transaction | Upstream Professional | Why They Have High Trust |

Include at least 12 distinct trigger events. Mark top 3 with ★ and explain why they are the priority.

Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice.`
    },
    {
      id: 2,
      title: "Phase 2: Upstream & Side-stream Partner Mapping",
      prompt: `${PERSONA}

${ctx}

TASK — Upstream & Side-stream Partner Mapping

UPSTREAM PARTNERS (see the client 3–12 months before a transaction):
Known upstream categories for ${p.industry}: ${p.upstreamPartners}
For each type provide:
— Why they see my ideal client early
— The specific problem they're solving at that moment
— What a ${p.niche} specialist in ${p.geography} can offer them in return (value exchange)
— Estimated monthly referral frequency

SIDE-STREAM PARTNERS (see the client during the transaction):
Known side-stream categories: ${p.sideStreamPartners}
Same format as above.

Then identify the top 3 UNDERUTILIZED partner types for ${p.niche} in ${p.geography} that most professionals overlook, and explain why they are high-value and underserved.

DELIVERABLE: Organized lists with clear headers. Include 8–10 upstream types and 4–6 side-stream types.

Use markdown formatting with clear headers.`
    },
    {
      id: "3.5",
      title: "Phase 3.5: Local Partner Research",
      isSearch: true,
      searchCategories: [
        `Hard money / private money lenders (${p.niche}-focused)`,
        `CPAs or tax strategists specializing in ${p.industry.toLowerCase()} clients`,
        `Attorneys relevant to ${p.niche} transactions`,
        `Title and escrow officers with high ${p.niche} transaction volume`,
        `General contractors active in ${p.niche} projects`,
        `Property managers serving ${p.niche} clients`,
        `Financial advisors or wealth managers serving ${p.niche} clients`,
        `Insurance brokers specializing in ${p.niche}`,
      ],
      prompt: `You are a local market research specialist. Search the web for real, currently active businesses and professionals in ${p.geography} who serve clients in the ${p.niche} market.

For each of the following partner categories, find 2–3 specific, currently active businesses or individual professionals in ${p.geography}:

1. Hard money / private money lenders (${p.niche}-focused)
2. CPAs or tax strategists specializing in ${p.industry.toLowerCase()} clients
3. Attorneys relevant to ${p.niche} transactions
4. Title and escrow officers with high ${p.niche} transaction volume
5. General contractors active in ${p.niche} projects
6. Property managers serving ${p.niche} clients
7. Financial advisors or wealth managers serving ${p.niche} clients
8. Insurance brokers specializing in ${p.niche}

For each result provide:
- Business or professional name
- Website or LinkedIn URL (if findable)
- Brief description of their specialty
- Confidence level: High (verified active), Medium (appears active), or Low (verify before outreach)

Prioritize results that show recent activity (last 12 months). Flag any results you are uncertain about. Format with clear category headers in markdown.`
    },
    {
      id: 3,
      title: "Phase 3: Dream 10 Tier Ranking & Shortlist",
      prompt: `${PERSONA}

${ctx}

TASK — Dream 10 Tier Ranking & Shortlist

TIER STRUCTURE:
— Tier 1 (Direct Upstream): Partners who see clients immediately before a transaction trigger
— Tier 2 (Lifestyle & Transition): Partners who see clients during a life phase shift
— Tier 3 (Community & Maintenance): Partners with consistent long-term client contact

Build the Dream 10 table:
| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority for ${p.niche} | First Contact Strategy |

Then answer: What 3 personal characteristics should I look for when identifying which individual at each company to target?

DELIVERABLE: The complete Dream 10 table plus the 3 individual selection criteria.

Use markdown formatting with clear headers.`
    },
    {
      id: "4a",
      title: "Phase 4a: Value Strategy Cards (Partners 1–3)",
      prompt: `${PERSONA}

${ctx}

TASK — Value Strategy Cards for Top 3 Partner Types

For each of the top 3 referral partner types for ${p.niche} in ${p.geography}, create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${p.niche} specialist in ${p.geography} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can I create or offer to start the relationship — with no ask? Be specific.

**3. THE RECURRING TOUCHPOINT:** What ongoing value can I deliver monthly or quarterly to keep the relationship warm?

Format each card clearly with the partner name as a header. Use markdown.`
    },
    {
      id: "4b",
      title: "Phase 4b: Value Strategy Cards (Partners 4–6) + Value Manifesto",
      prompt: `${PERSONA}

${ctx}

TASK — Value Strategy Cards for Partners 4–6 + Value Manifesto

For each of the next 3 referral partner types (partners ranked 4–6 from the Dream 10 for ${p.niche} in ${p.geography}), create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${p.niche} specialist in ${p.geography} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can I create or offer to start the relationship — with no ask?

**3. THE RECURRING TOUCHPOINT:** What ongoing value can I deliver monthly or quarterly?

---

Then write a **Value Manifesto** — a 3-paragraph positioning statement I would use when meeting new referral partners in person. It should focus entirely on how I serve the partner's clients, not on promoting my own production. Warm, peer-to-peer tone. No buzzwords.

Use markdown formatting.`
    },
    {
      id: 5,
      title: "Phase 5: Objection Anticipation & Response Prep",
      prompt: `${PERSONA}

${ctx}

TASK — Objection Anticipation & Response Prep

Known objection categories for ${p.industry}: ${p.objectionContext}

For each objection provide:
— WHY this objection comes up (the real fear underneath it)
— A non-defensive, conversational response that reframes without being pushy
— A follow-up question that keeps the door open

OBJECTIONS TO ADDRESS:
1. "I already have a referral partner I work with."
2. "I'm not in a position to refer clients right now."
3. "I don't want to refer someone and have it reflect badly on me."
4. "I don't encounter that many clients who need your services."
5. "I'm too busy to meet — can you just send me your card?"
6. "Can I think about it and get back to you?"
7. One objection specific to ${p.niche} referral partnerships
8. One more objection specific to ${p.niche} partnerships that most professionals don't anticipate

BONUS: Provide a "trust reset" script for: (a) a relationship that went cold after initial contact, and (b) a past referral relationship that ended badly.

TONE: Confident, low-pressure, peer-to-peer. Not salesy. Use markdown headers.`
    },
    {
      id: 6,
      title: "Phase 6: Complete Outreach Script Suite",
      prompt: `${PERSONA}

${ctx}

TASK — Complete Outreach Script Suite

SCRIPT 1 — Cold Intro Email
Write 3 subject line options.
Email body (under 150 words): Focus on the partner's business, not my needs. Mention a specific value gift. End with a low-commitment ask.

SCRIPT 2 — LinkedIn Connection Message
Under 300 characters. Reference something real about their work. Do not mention referrals.

SCRIPT 3 — Coffee/Zoom Invitation
4–6 sentences (text or email). Frame it around their business growth. Include a specific curiosity hook relevant to ${p.niche} in ${p.geography}.

SCRIPT 4 — The Handwritten Note Introduction
3–4 sentence handwritten note script sent BEFORE any other outreach. Must feel completely personal. Zero sales language. First impression that opens every door.

SCRIPT 5 — Value-First Follow-Up
Brief message after delivering the value gift. Conversational. Plant the seed without making an ask.

SCRIPT 6 — Referral Thank-You Note
Warm, personal, non-templated note to send immediately after receiving a referral.

All scripts must sound warm, credible, peer-to-peer. No buzzwords or corporate-speak. Use markdown formatting with clear headers.`
    },
    {
      id: "7a",
      title: "Phase 7a: 90-Day Week-by-Week Plan + Relationship Tracker",
      prompt: `${PERSONA}

${ctx}

TASK — 90-Day Launch Plan + Relationship Tracker

**PART A — Week-by-Week 90-Day Sequence**
For a new Tier 1 referral partner, provide a week-by-week action plan for the first 90 days (13 weeks). For each week:
— Specific action
— Channel (handwritten note, email, phone, in-person, social media)
— Goal of the touchpoint
— Time investment estimate

**PART B — Relationship Tracker Template**
Design a simple tracker structure for managing all 10 Dream Partners. Include columns for:
partner name, tier, last contact date, next action, relationship stage (Cold / Warm / Active / Advocate), notes, referral count.

Format both parts clearly with markdown headers and tables where appropriate.`
    },
    {
      id: "7b",
      title: "Phase 7b: 12-Month Calendar + Production Math",
      prompt: `${PERSONA}

${ctx}

TASK — 12-Month Quarterly Calendar + Production Math

**PART C — 12-Month Quarterly Calendar**
After a partner becomes active, what do I do each quarter to maintain and deepen the relationship? Create a 4-quarter calendar with:
— Specific touchpoints per quarter
— Value gifts
— Personal gestures
— Exact moments where a handwritten note is the highest-leverage move (quarterly check-in, referral thank-you, partner's business milestone, holiday)

**PART D — 12-Month Production Math**
Walk through the math simply and conservatively:
— How many Dream 10 partnerships at what referral frequency = what level of closed volume?
— Assume average deal size for ${p.niche} in ${p.geography}
— Show 3 scenarios: conservative, moderate, strong
— What do I need to believe is true for this system to work?

Format with markdown headers and tables.`
    }
  ];
}
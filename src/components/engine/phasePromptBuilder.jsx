/**
 * Extracts the 7 individual phase prompts from a Build record.
 * 7-phase structure (consolidated from 9). See CHANGELOG-7phase-consolidation.md.
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
List 5–6 partner types most relevant to ${p.niche} in ${p.geography}. Focus on the highest-value types — quality over quantity. For each:
— Why they see my ideal client early
— The specific problem they're solving at that moment
— What a ${p.niche} specialist in ${p.geography} can offer them in return (value exchange)
— Estimated monthly referral frequency

SIDE-STREAM PARTNERS (see the client during the transaction):
Known side-stream categories: ${p.sideStreamPartners}
List 3 partner types most relevant. Same format as above.

DELIVERABLE: Organized lists with clear headers.

Use markdown formatting with clear headers.`
    },
    {
      id: 3,
      title: "Phase 3: Dream 5 Tier Ranking & Shortlist",
      prompt: `${PERSONA}

${ctx}

TASK — Dream 5 Tier Ranking & Shortlist

From the partners identified in Phase 2, select and rank the TOP 5 partner types that will drive the most referral volume for ${p.niche} in ${p.geography}.

TIER STRUCTURE:
— Tier 1 (Direct Upstream): Partners who see clients immediately before a transaction trigger
— Tier 2 (Lifestyle & Transition): Partners who see clients during a life phase shift
— Tier 3 (Community & Maintenance): Partners with consistent long-term client contact

Build the Dream 5 table:
| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority for ${p.niche} | First Contact Strategy |

Then answer: What 3 personal characteristics should I look for when identifying which individual at each company to target?

DELIVERABLE: The complete Dream 5 table plus the 3 individual selection criteria.

Use markdown formatting with clear headers.`
    },
    {
      id: 4,
      title: "Phase 4: Value Strategy Cards + Value Manifesto",
      prompt: `${PERSONA}

${ctx}

TASK — Value Strategy Cards for All 5 Dream Partners + Value Manifesto

For EACH of the 5 referral partner types from the Dream 5 ranking, create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${p.niche} specialist in ${p.geography} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can I create or offer to start the relationship — with no ask? Be specific.

**3. THE RECURRING TOUCHPOINT:** What ongoing value can I deliver monthly or quarterly to keep the relationship warm?

Format each card clearly with the partner name as a header.

---

Then write a **Value Manifesto** — a positioning statement for meeting new referral partners. Focus entirely on how I serve the partner's clients, not promoting my own production. Warm, peer-to-peer tone. No buzzwords.

Start with a "Cocktail Party Version" (2-3 sentences, 30 seconds). Then a longer "Coffee Meeting Version" (2-3 paragraphs).

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
      id: 7,
      title: "Phase 7: 90-Day Plan, Tracker & 12-Month System",
      prompt: `${PERSONA}

${ctx}

TASK — 90-Day Launch Plan, Relationship Tracker, 12-Month Calendar & Referral Math

**PART A — Week-by-Week 90-Day Sequence**
For a new Tier 1 referral partner, provide a week-by-week action plan for the first 90 days (13 weeks). For each week:
— Specific action
— Channel (handwritten note, email, phone, in-person, social media)
— Goal of the touchpoint
— Time investment estimate

**PART B — Relationship Tracker Template**
Design a simple tracker structure for managing all 5 Dream Partners. Include columns for:
partner name, tier, last contact date, next action, relationship stage (Cold / Warm / Active / Advocate), notes, referral count.

**PART C — 12-Month Quarterly Calendar**
After a partner becomes active, what do I do each quarter? Create a single summary table:
| Quarter | Touchpoints | Value Gift | Personal Gesture | Handwritten Note Moment |

**PART D — Referral Math**
Show 3 scenarios: conservative (2 active partners), moderate (4 active), strong (all 5). For each:
— Which Dream 5 partners are active (by name from Phase 3)
— Referrals per partner per quarter
— Total annual referrals
— Close rate (35-45%)
— Total closed deals from referrals
Do NOT include dollar amounts, commission, or income projections.

End with "What I need to believe" — the honest gut-check.

Format with markdown headers and tables.`
    }
  ];
}
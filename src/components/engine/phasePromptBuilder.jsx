/**
 * Extracts the 7 individual phase prompts from a Build record.
 * The promptEngine already generates the full 7-phase advanced text.
 * Here we build clean standalone prompts for each phase to send to Claude directly.
 */

import { INDUSTRY_DATA, LLM_PROFILES } from "./promptEngine";

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

PHASE 1 TASK — Lifecycle Trigger Mapping

Map the complete lifecycle of my ideal client. Identify every major life event, financial trigger, and transition point that causes someone in the ${p.niche} segment to need my services in ${p.geography}.

For each trigger event provide:
1. The trigger itself (be specific)
2. How far before a transaction this typically occurs
3. Which professional type sees the client at this trigger point BEFORE they contact me
4. Why that professional has high trust with the client at that exact moment

DELIVERABLE:
A Lifecycle Trigger Map formatted as a markdown table:
| Trigger Event | Months Before Transaction | Upstream Professional | Why They Have High Trust |

Include at least 12 distinct trigger events specific to ${p.niche} in ${p.geography}.
Mark the top 3 highest-leverage triggers with a ★ and explain why they are the priority.

Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice.`
    },
    {
      id: 2,
      title: "Phase 2: Upstream & Side-stream Partner Mapping",
      prompt: `${PERSONA}

${ctx}

PHASE 2 TASK — Upstream & Side-stream Partner Mapping

Using the lifecycle triggers from Phase 1, identify the specific types of referral partners I should target.

UPSTREAM PARTNERS (see the client 3–12 months before a transaction):
Known upstream categories for ${p.industry}: ${p.upstreamPartners}
For each type provide:
— Why they see my ideal client early
— The specific problem they're solving for that client at that moment
— What a ${p.niche} specialist in ${p.geography} can offer them in return (value exchange)
— Estimated monthly referral frequency

SIDE-STREAM PARTNERS (see the client during the transaction itself):
Known side-stream categories: ${p.sideStreamPartners}
Same format as above.

Then identify the top 3 UNDERUTILIZED partner types for ${p.niche} in ${p.geography} that most professionals overlook, and explain why they are high-value and underserved.

DELIVERABLE:
Organized lists with clear headers. Include 8–10 upstream types and 4–6 side-stream types. Each must include the specific value exchange idea.

Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice.`
    },
    {
      id: 3,
      title: "Phase 3: Dream 10 Tier Ranking & Shortlist",
      prompt: `${PERSONA}

${ctx}

PHASE 3 TASK — Dream 10 Tier Ranking & Shortlist

Using the partner types from Phase 2, build my prioritized Dream 10 Strategic Partner Map.

TIER STRUCTURE:
— Tier 1 (Direct Upstream): Partners who see clients immediately before a transaction trigger
— Tier 2 (Lifestyle & Transition): Partners who see clients during a life phase shift
— Tier 3 (Community & Maintenance): Partners with consistent long-term client contact

BUILD THE DREAM 10 SHORTLIST:
Select the 10 highest-priority partner types for ${p.niche} in ${p.geography} and provide a table:

| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority | First Contact Strategy |

Also answer: What 3 personal characteristics should I look for when identifying which individual at each company to target?

DELIVERABLE: The complete Dream 10 table plus the 3 individual selection criteria.

Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice.`
    },
    {
      id: 4,
      title: "Phase 4: Gap Analysis & Value-First Positioning",
      prompt: `${PERSONA}

${ctx}

PHASE 4 TASK — Gap Analysis & Value-First Positioning

For each of my top 6 partner types (from Phase 3), create a "Value Strategy Card" that includes:

1. THE GAP: What is currently missing from this partner's client service that a ${p.niche} specialist in ${p.geography} can fill?
2. THE VALUE GIFT: What specific, tangible asset can I create or offer to start the relationship with no ask?
3. THE RECURRING TOUCHPOINT: After the first gift, what ongoing value can I deliver monthly or quarterly?

Then write a 3-paragraph "Value Manifesto" — a positioning statement I could use when meeting new referral partners in person. Focus entirely on how I serve the partner's clients, not on promoting my own production.

DELIVERABLE: 6 Value Strategy Cards + the Value Manifesto paragraph.

Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice.`
    },
    {
      id: 5,
      title: "Phase 5: Objection Anticipation & Response Prep",
      prompt: `${PERSONA}

${ctx}

PHASE 5 TASK — Objection Anticipation & Response Prep

Known objection categories for ${p.industry}: ${p.objectionContext}

For each objection provide:
— WHY this objection comes up (the real fear or logic underneath it)
— A non-defensive, conversational response that reframes without being pushy
— A follow-up question that keeps the door open

OBJECTIONS TO ADDRESS:
1. "I already have a referral partner I work with."
2. "I'm not in a position to refer clients right now."
3. "I don't want to refer someone and have it reflect badly on me."
4. "I don't encounter that many clients who need your services."
5. "I'm too busy to meet — can you just send me your card?"
6. "Can I think about it and get back to you?"
7. Two objections SPECIFIC to ${p.niche} referral partnerships that most professionals don't anticipate

BONUS: Provide a "trust reset" script for: (a) a relationship that went cold after initial contact, and (b) a past referral relationship that ended badly.

TONE: Confident, low-pressure, peer-to-peer. Not salesy.

Use markdown formatting with clear headers.`
    },
    {
      id: 6,
      title: "Phase 6: Complete Outreach Script Suite",
      prompt: `${PERSONA}

${ctx}

PHASE 6 TASK — Complete Outreach Script Suite

SCRIPT 1 — Cold Intro Email
Write 3 subject line options.
Email body (under 150 words): Focus on the partner's business, not my needs. Mention a specific value gift. End with a low-commitment ask.

SCRIPT 2 — LinkedIn Connection Message
Under 300 characters. Reference something real about their work. Do not mention referrals.

SCRIPT 3 — Coffee/Zoom Invitation
4–6 sentences (text or email). Frame it around their business growth. Include a specific curiosity hook relevant to ${p.niche} in ${p.geography}.

SCRIPT 4 — The Handwritten Note Introduction
3–4 sentence handwritten note script I send BEFORE any other outreach. Must feel completely personal. Zero sales language. First impression that opens every door.

SCRIPT 5 — Value-First Follow-Up
Brief message after delivering the value gift. Conversational. Plant the seed without making an ask.

SCRIPT 6 — Referral Thank-You Note
Warm, personal, non-templated note to send immediately after receiving a referral.

All scripts must sound warm, credible, peer-to-peer. No buzzwords or corporate-speak.

Use markdown formatting with clear headers.`
    },
    {
      id: 7,
      title: "Phase 7: 90-Day Plan & Quarterly System",
      prompt: `${PERSONA}

${ctx}

PHASE 7 TASK — 90-Day Launch Plan & Quarterly Reinforcement System

PART A — Week-by-Week 90-Day Sequence
For a new Tier 1 referral partner, give a week-by-week action plan for the first 90 days:
— Specific action
— Channel (handwritten note, email, phone, in-person, social media engagement)
— Goal of the touchpoint
— Time investment estimate

PART B — Relationship Tracker Template
Design a simple tracker structure for managing all 10 Dream partners. Include: partner name, tier, last contact date, next action, relationship stage (Cold / Warm / Active / Advocate), notes, and referral count.

PART C — 12-Month Quarterly Calendar
After a partner becomes active, what do I do each quarter to maintain and deepen the relationship? Create a 4-quarter calendar of touchpoints, value gifts, and personal gestures. Include specific moments where a handwritten note is the highest-leverage move.

PART D — 12-Month Production Math
Help me set a realistic target: How many Dream 10 partnerships, at what referral frequency, would generate what level of closed volume for ${p.niche} in ${p.geography}? Walk through the math simply and conservatively.

DELIVERABLE: All four parts, specific and actionable.

Use markdown formatting with clear headers.`
    }
  ];
}
// Dream 100 Prompt Builder — Haiku-Optimized, Industry-Enriched
// Updated: tighter decision rules, scoring rubrics, practicality enforcement,
// strategic context framing, hard consistency across phases.

// ─── Shared Rule Blocks ───────────────────────────────────────────────────────
// These are injected into each phase prompt to enforce consistent behavior.

const PRACTICALITY_OVERRIDE = `PRACTICALITY OVERRIDE:
When choosing between an interesting partner type and a more practical partner type, choose the practical one.
Prefer partners who:
- already recommend outside professionals as part of their normal workflow
- are easy to identify and contact in or near the market area
- can plausibly produce repeat referrals within 12 months
- fit the client profile without requiring unusual assumptions
- are ethically and operationally comfortable making referrals

Avoid over-ranking institutional, government, medical, or community figures unless they are clearly practical, reachable, and likely to refer in a normal solo-agent workflow.`;

const EXCLUSION_RULES = `EXCLUSION RULES:
Do not rank a partner type in the top 5 if:
- the person is difficult for a solo agent to reach through normal outreach
- referral behavior would be unusual, awkward, or institutionally constrained
- the role depends on speculative or uncommon access rather than repeatable business development
- the partner would be unlikely to refer more than 1-2 times per year in a normal workflow

If a partner is high-trust but low-practicality, note them as a secondary option — do not make them a top-5 priority.`;

const SCORING_RUBRIC = `WEIGHTED SCORING RUBRIC:
Score each partner type using this framework:
- Transaction proximity / timing: 30%
- Likelihood they already refer outside professionals in normal workflow: 25%
- Trust transfer strength: 20%
- Ease of outreach / number of reachable targets near the market area: 15%
- Niche specificity: 10%

Choose partner types with the highest total score. Do not choose based on novelty, emotional resonance, or creativity.`;

const CONSERVATIVE_ESTIMATES = `CONSERVATIVE ESTIMATE RULE:
Use real-world conservative referral assumptions. Do not assume more than:
- 2-4 referrals/month for mortgage brokers or property managers
- 1-2 referrals/month for financial planners, attorneys, relocation specialists, or lenders
- 1 referral/quarter for slower relationship-based professionals

If uncertain, choose the lower estimate. Conservative numbers are more credible and more useful to the agent.`;

const CONSISTENCY_RULE = `HARD CONSISTENCY RULE:
- Do not introduce any new partner types in this phase
- Do not rename, broaden, or swap the Dream 5 partner types established in Phase 3
- Reference the exact Dream 5 partner names from Phase 3 only
- Use only the value gifts created in Phase 4
- If a better idea appears, do not substitute it — stay with the established system`;

const OUTPUT_RULES = `OUTPUT RULES:
- Use compact markdown only
- No introductory paragraphs unless specifically requested below
- No concluding summaries unless specifically requested below
- Prefer tables over prose wherever possible
- Keep all explanations to 1-2 sentences max unless the prompt requests more
- Do not restate the user context at the top of your response
- Do not use emoji anywhere — not in headers, labels, bullets, or section markers
- Plain text only (e.g. "THE GAP" not "🕳️ THE GAP")`;

// ─── Industry Data ────────────────────────────────────────────────────────────

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

const IND = INDUSTRY_DATA["Real Estate"];

// ─── Prompt Builder ───────────────────────────────────────────────────────────

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

    // ── Phase 1 ──────────────────────────────────────────────────────────────
    {
      id: 1,
      title: 'Phase 1: Lifecycle Trigger Mapping',
      prompt: `${ctx}

TASK — Lifecycle Trigger Mapping

STRATEGIC CONTEXT SECTION (write this first):
Before the table, write 3-4 sentences that explain:
- The behavioral pattern that drives this client's decision timeline in the ${niche} segment
- Why mapping upstream professionals (not the client directly) is the right strategy for this niche
- What this means for ${n}'s approach in ${geo}
Keep this section tight. No headers, no bullets — plain prose only. This is the only narrative section in this phase.

---

MAP THE TRIGGERS:
Identify the 8 most practical lifecycle trigger events that cause someone in the ${niche} segment to buy or sell in ${geo}.

Common trigger events in real estate: ${IND.triggerEvents}
Key lifecycle moments: ${IND.lifecycleMoments}

For each trigger provide:
1. The specific trigger event
2. Months before a real estate transaction this typically occurs
3. Which professional type sees the client before a realtor does
4. Why that professional has high trust at that moment
5. Referral Practicality: High / Medium / Low

DELIVERABLE — one markdown table:
| Trigger Event | Months Before Transaction | Upstream Professional | Why They Have High Trust | Referral Practicality |

Include exactly 8 triggers. Mark top 3 with ★.

TOP 3 PRIORITIES:
After the table, add a short section. For each starred trigger, write 1-2 sentences explaining:
- Why it matters specifically for ${niche} in ${geo}
- Why the associated professional is practical to target for a solo agent

TOP 3 SELECTION RULES:
Select the top 3 based on:
1. How often the trigger occurs in ${geo}
2. How likely the upstream professional is to refer in their normal workflow
3. How reachable that professional is for outreach by a solo agent
4. Whether the referral behavior is natural and ethical

Do NOT mark a trigger as top 3 if the associated professional is hard to reach, institutionally constrained, or unlikely to refer a realtor in their normal workflow.

${PRACTICALITY_OVERRIDE}

${EXCLUSION_RULES}

${OUTPUT_RULES}`
    },

    // ── Phase 2 ──────────────────────────────────────────────────────────────
    {
      id: 2,
      title: 'Phase 2: Upstream & Side-stream Partner Mapping',
      prompt: `${ctx}

TASK — Upstream & Side-stream Partner Mapping

STRATEGIC CONTEXT SECTION (write this first):
Before the tables, write 2-3 sentences explaining:
- Which category of upstream partner is most likely to produce referrals for the ${niche} segment specifically
- Why that category wins over alternatives for this client profile
Keep it to 2-3 sentences. No headers, plain prose. This is the only narrative section in this phase.

---

UPSTREAM PARTNERS (see client 3-12 months before a transaction):
Known upstream partner types: ${IND.upstreamPartners}

List exactly 5 upstream partner types for ${niche} in ${geo}.

UPSTREAM SELECTION RULES:
- At least 3 of the 5 must be financially, legally, mortgage, relocation, or housing adjacent
- Do not include partner types where referral behavior is ethically awkward, institutionally constrained, or unlikely in normal workflow
- Prefer partner types with at least 10 reachable individuals within or near ${geo}
- For each partner, score them using the weighted rubric below before ranking

${SCORING_RUBRIC}

For each upstream partner include:
- Why they see the ${niche} client early
- The specific problem they are solving at that moment
- What ${n} can offer in return (specific value exchange)
- Estimated monthly referral frequency
- Outreach accessibility: Easy / Moderate / Hard
- Why this partner beats the next-best alternative (1 sentence)

DELIVERABLE — Table 1:
| Upstream Partner Type | Why They See Client Early | Problem They Solve | Value Exchange | Est. Monthly Referrals | Outreach Accessibility | Why They Beat Next-Best |

---

SIDE-STREAM PARTNERS (see client during the transaction):
Known side-stream partner types: ${IND.sideStreamPartners}

List exactly 2 side-stream partner types most relevant to ${niche} transactions.
Same format as upstream, same columns.

DELIVERABLE — Table 2:
| Side-Stream Partner Type | Why They Appear During Transaction | Problem They Solve | Value Exchange | Est. Monthly Referrals | Outreach Accessibility | Why They Beat Next-Best |

${PRACTICALITY_OVERRIDE}

${EXCLUSION_RULES}

${CONSERVATIVE_ESTIMATES}

${OUTPUT_RULES}`
    },

    // ── Phase 3 ──────────────────────────────────────────────────────────────
    {
      id: 3,
      title: 'Phase 3: Dream 5 Tier Ranking & Shortlist',
      prompt: `${ctx}

TASK — Dream 5 Tier Ranking & Shortlist

STRATEGIC CONTEXT SECTION (write this first):
Write 2-3 sentences explaining the ranking logic for this specific niche:
- Which tier of partner is most valuable for ${niche} in ${geo} and why
- What makes this Dream 5 different from a generic real estate referral list
Plain prose, no headers. This is the only narrative section in this phase.

---

RANKING TASK:
From the Phase 2 partner list, rank the top 5 partner types by expected referral ROI for a solo agent over the next 12 months in ${geo}.

TIER STRUCTURE:
- Tier 1 (Direct Upstream): sees client immediately before a transaction trigger
- Tier 2 (Lifestyle & Transition): sees client during a life phase shift
- Tier 3 (Community & Maintenance): longer-term contact, slower conversion

RANKING RULES:
- Rank by practical referral value — not novelty, not trust level alone
- At least 2 of the top 3 must be Tier 1 direct upstream partners
- No more than 1 Tier 3 partner in the Dream 5 unless clearly justified with referral volume evidence
- Use the weighted scoring rubric to justify rankings

${SCORING_RUBRIC}

DELIVERABLE — one markdown table:
| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority for ${niche} | First Contact Strategy | Practicality Score (1-10) |

Then answer: What 3 personal characteristics should ${n} look for when identifying WHICH INDIVIDUAL at each company to target?

Format as:
| Characteristic | Why It Matters for ${niche} in ${geo} |

IMPORTANT — FOUNDATION FOR PHASES 4-7:
The Dream 5 selected here are locked. Phases 4, 5, 6, and 7 will all use these exact partner types and exact names. Do not add a section explaining how these will be used in later phases — just make sure the rankings are deliberate and defensible.

${PRACTICALITY_OVERRIDE}

${EXCLUSION_RULES}

${CONSERVATIVE_ESTIMATES}

${CONSISTENCY_RULE}

${OUTPUT_RULES}`
    },

    // ── Phase 4 ──────────────────────────────────────────────────────────────
    {
      id: 4,
      title: 'Phase 4: Value Strategy Cards + Value Manifesto',
      prompt: `${ctx}

TASK — Value Strategy Cards for All 5 Dream Partners + Value Manifesto

Using ONLY the exact Dream 5 partner types from Phase 3, create one Value Strategy Card for each of the 5 partners.

For each partner type use this exact format:

### [Partner Type — use exact name from Phase 3]
- THE GAP: What is currently missing from this partner's client service that a ${niche} specialist in ${geo} can fill?
- THE VALUE GIFT: One specific, low-lift asset ${n} can create or offer — with no ask.
- THE RECURRING TOUCHPOINT: One realistic quarterly action to keep the relationship warm.

PRACTICAL VALUE GIFT RULES — every value gift must:
- Be creatable by one agent in under 2 hours
- Cost under $100 initially
- Be reusable across multiple partners with light customization
- Be useful to the partner even if they never meet with ${n}
- Solve a specific client conversation the partner is already having

Known value-add categories: ${IND.partnerValueAdd}. Go beyond these — what would make this specific partner think "I need to keep this agent close"?

Prefer: one-page tools, checklists, comparison sheets, neighborhood summaries, intake guides, scenario handouts, or market snapshots.
Avoid: co-hosted events, webinars, co-branded campaigns, or any gift that requires a commitment before the relationship is established.

RECURRING TOUCHPOINT RULES:
- Must be realistic for one agent to maintain across all 5 partners simultaneously
- Prefer quarterly over monthly unless monthly is clearly justified
- Must be low-friction — no events, no presentations

---

VALUE MANIFESTO:
Then write ${n}'s Value Manifesto — how ${n} describes their work to referral partners.
Focus entirely on how ${n} serves the partner's clients, not on production or credentials.

1. Cocktail Party Version
2 sentences max. Something ${n} can say in 30 seconds.

2. Coffee Meeting Version
120 words max. Peer-to-peer tone. Warm and specific to the ${niche} segment and ${geo}. Should sound like something ${n} would actually say — not a marketing page.

${CONSISTENCY_RULE}

${OUTPUT_RULES}`
    },

    // ── Phase 5 ──────────────────────────────────────────────────────────────
    {
      id: 5,
      title: 'Phase 5: Objection Anticipation & Response Prep',
      prompt: `${ctx}

TASK — Objection Anticipation & Response Prep

Using ONLY the Dream 5 partner types from Phase 3, assign each objection to the most likely partner type.

Known objection categories: ${IND.objectionContext}

ASSIGNMENT RULE: At least 5 of the 8 objections must be assigned to the top 3 Dream 5 partner types.

For each objection use this exact format:

### Objection [#]
- Partner Type: [exact Dream 5 name from Phase 3]
- Real Fear: [2 sentences max — what is the actual fear underneath this objection]
- Response: [under 100 words — non-defensive, conversational, reframes without being pushy]
- Follow-Up Question: [1 sentence — diagnostic, not persuasive. Opens the door, doesn't push through it.]

OBJECTIONS:
1. "I already have a realtor I work with."
2. "I'm not in a position to refer clients right now."
3. "I don't want to refer someone and have it reflect badly on me."
4. "I don't encounter that many clients who need a realtor."
5. "I'm too busy to meet — can you just send me your card?"
6. "Can I think about it and get back to you?"
7. One objection specific to ${niche} partnerships in ${geo}
8. One objection specific to ${niche} that most agents don't anticipate

TONE: ${IND.scriptTone}. Not salesy. Responses must sound like spoken language.

BONUS — Trust Reset Scripts:
Add two short scripts after the objections:

Trust Reset A: A relationship that went cold after initial contact.
Trust Reset B: A past referral relationship that ended badly.

Each reset script:
- 120 words max
- Plain spoken
- No over-apologizing
- Acknowledges the gap without making it awkward

${CONSISTENCY_RULE}

${OUTPUT_RULES}`
    },

    // ── Phase 6 ──────────────────────────────────────────────────────────────
    {
      id: 6,
      title: 'Phase 6: Complete Outreach Script Suite',
      prompt: `${ctx}

TASK — Complete Outreach Script Suite

Write all 6 scripts below. Use ONLY the Dream 5 partner types from Phase 3 and ONLY the value gifts from Phase 4.

Write each script as a universal template lightly customizable for any Dream 5 partner. Where partner-specific detail is needed, write one version per partner type (labeled clearly).

Tone for all scripts: ${IND.scriptTone}. Plain spoken, peer-to-peer. No corporate language, no hype.

SCRIPT REALISM RULES:
- Every script must include one concrete local detail specific to ${geo} or one concrete client scenario specific to ${niche}
- Do not invent new assets, offers, or positioning angles in this phase — use only what was established in Phase 4
- Simpler language is better than elegant language when both convey the same meaning
- The handwritten note must sound like something a real agent would actually write in under 2 minutes

---

SCRIPT 1 — Cold Intro Email
- 3 subject line options
- Body under 120 words
- Focus on the partner's business, not ${n}'s needs
- Mention one specific value gift from Phase 4
- End with a low-commitment ask

SCRIPT 2 — LinkedIn Connection Message
- Under 220 characters
- Reference something real and specific about their work or location
- No mention of referrals

SCRIPT 3 — Coffee/Zoom Invitation
- 4 sentences max
- Frame around their business, not ${n}'s
- Include one curiosity hook tied to ${niche} in ${geo}

SCRIPT 4 — Handwritten Note Introduction
Write one version per Dream 5 partner type (5 versions total), each labeled clearly.
- 3 sentences max per version
- Zero sales language
- Completely personal — sounds like a real person, not a template
- Must pass the 2-minute test: could ${n} write this by hand in under 2 minutes?
- This note is sent BEFORE any other outreach. It is the most important script in the suite.

After the 5 versions, add a short Handwritten Note Protocol table:
| Step | Action |
(Cover: write by hand, use quality card stock, address envelope by hand, real stamp, mail 5-7 days before follow-up, do not reference the note in the follow-up email.)

SCRIPT 5 — Value-First Follow-Up
- 60 words max
- Sent after delivering the value gift
- Conversational, no ask
- Reference the specific value gift delivered

SCRIPT 6 — Referral Thank-You Note
- 90 words max
- Handwritten tone
- Warm and specific — references the actual client or situation, not a generic thank-you

${CONSISTENCY_RULE}

${OUTPUT_RULES}`
    },

    // ── Phase 7 ──────────────────────────────────────────────────────────────
    {
      id: 7,
      title: 'Phase 7: 90-Day Plan, Tracker & 12-Month System',
      prompt: `${ctx}

TASK — 90-Day Launch Plan, Relationship Tracker, 12-Month Calendar & Referral Math

Use ONLY the Dream 5 partner types from Phase 3 and value gifts from Phase 4.

---

PART A — Week-by-Week 90-Day Sequence
Build the 90-day plan specifically for the #1 ranked Dream 5 partner — not a generic Tier 1 partner.

For each of the 13 weeks provide:
- Specific action (tailored to this partner type)
- Channel (handwritten note, email, phone, in-person, LinkedIn)
- Goal of the touchpoint
- Time estimate

Week 1 must be the handwritten note. This is non-negotiable.

DELIVERABLE — one table:
| Week | Action | Channel | Goal | Time |

Then add a Quick Reference Grid:
| Week | Channel | Action (5 words max) |

BRANCH POINTS — add two short sections after the grid:
If no response by Week 4:
- 2 specific follow-up actions (1 sentence each)

If no response by Week 8:
- 2 specific fallback actions (1 sentence each)

---

PART B — Relationship Tracker
A simple table for managing all 5 Dream Partners. Columns:
| Partner Name | Tier | Last Contact | Next Action | Stage (Cold/Warm/Active/Advocate) | Notes | Referrals In | Referrals Out |

---

PART C — 12-Month Quarterly Calendar
After a partner becomes active, what does ${n} do each quarter?
One summary table only — not a separate section per quarter:
| Quarter | Touchpoints | Value Gift | Personal Gesture | Handwritten Note Moment |

---

PART D — Referral Math
Show how the Dream 5 system produces closed deals. Do NOT project income or commissions.

Show 3 scenarios using the exact Dream 5 partner names from Phase 3:
| Scenario | Active Partners (by name) | Referrals per Partner per Quarter | Annual Referrals | Close Rate | Closed Deals |

Scenarios: Conservative (2 active partners), Moderate (4 active), Strong (all 5).

${CONSERVATIVE_ESTIMATES}

End with: WHAT ${n} NEEDS TO BELIEVE
3 bullet points. Honest gut-check on patience and consistency. Plain spoken.

${CONSISTENCY_RULE}

${PRACTICALITY_OVERRIDE}

${OUTPUT_RULES}`
    }

  ];
}
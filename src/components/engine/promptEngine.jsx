/**
 * Partner Pipeline Builder — Prompt Engine
 * Generates prompts that are BOTH industry-specific AND LLM-specific
 */

// ─── LLM Persona & Style Profiles ─────────────────────────────────────────────
export const LLM_PROFILES = {
  "ChatGPT Standard": {
    label: "ChatGPT Standard",
    shortLabel: "GPT",
    persona: "You are a strategic sales consultant with deep expertise in referral partner ecosystems.",
    systemNotes: "Use clear, structured output with numbered lists and bold key terms. ChatGPT Standard excels at clarity and actionability.",
    formatInstruction: "Output results in clearly labeled sections with numbered action items. Use **bold** for partner types and priorities.",
    strengths: "Structured reasoning, actionable steps, clear formatting",
    invocation: "Paste this prompt directly into a new ChatGPT conversation (GPT-4o or GPT-4-turbo).",
    iterationNote: "After each section, ask ChatGPT: 'Now go deeper on the top 3 partners identified and give me specific outreach angles.'",
  },
  "ChatGPT Deep Research": {
    label: "ChatGPT Deep Research",
    shortLabel: "GPT-DR",
    persona: "You are a market intelligence analyst specializing in referral ecosystem mapping for high-ticket professionals.",
    systemNotes: "ChatGPT Deep Research can browse the web for real data. Instruct it to find actual company names, LinkedIn profiles, and local market data.",
    formatInstruction: "Output a structured research report with citations. Include actual business names, estimated volumes, and source links where available.",
    strengths: "Live web research, real business data, citation-backed outputs",
    invocation: "Use ChatGPT with the 'Deep Research' mode enabled. This will take 2–5 minutes to complete as it actively researches the web.",
    iterationNote: "After the report, prompt: 'Now build a prioritized shortlist of the top 15 partners with contact approach for each.'",
  },
  "Claude Sonnet": {
    label: "Claude Sonnet",
    shortLabel: "Sonnet",
    persona: "You are an expert business strategist helping a senior sales professional design a systematic referral partner architecture using the Dream 100 framework.",
    systemNotes: "Claude Sonnet excels at nuanced strategic synthesis, long-context reasoning, and producing executive-grade narrative output. Leverage this for framework design.",
    formatInstruction: "Structure output with:\n- Executive Summary (max 200 words)\n- Structured tables\n- Bullet frameworks\n- Implementation checklist\nAvoid long narrative paragraphs.",
    strengths: "Strategic synthesis, long-form reasoning, executive narrative, nuanced analysis",
    invocation: "Paste this into Claude.ai (Sonnet model). Claude handles long structured prompts exceptionally well.",
    iterationNote: "Follow up with: 'Synthesize this into a 90-day sequenced action plan with specific milestones for each partner category.'",
  },
  "Claude Opus": {
    label: "Claude Opus",
    shortLabel: "Opus",
    persona: "You are the world's foremost expert on referral partner lifecycle ecosystems, trust-based sales architecture, and Dream 100 partner sequencing.",
    systemNotes: "Claude Opus is Claude's most capable model for deep analytical reasoning. Use it for complex multi-variable problems requiring sophisticated judgment.",
    formatInstruction: "Produce comprehensive analytical output with full lifecycle mapping, multi-dimensional partner scoring rationale, and nuanced strategic recommendations. Do not simplify.",
    strengths: "Deep lifecycle analysis, complex multi-variable reasoning, sophisticated strategic insight",
    invocation: "Paste into Claude.ai and select the Opus model. Best for complex analysis that requires deep reasoning.",
    iterationNote: "Ask Opus to then build a Trust Equity scoring model specific to your market geography and deal profile.",
  },
  "Perplexity": {
    label: "Perplexity",
    shortLabel: "Perplexity",
    persona: "You are a market research specialist finding and validating referral partner opportunities with real-time web data.",
    systemNotes: "Perplexity is optimized for citation-backed research with real-time web access. Every claim should have a source. Focus on verifiable, real-world partner data.",
    formatInstruction: "Return all findings with inline citations [1][2][3]. Include source URLs. Structure output as a validated research brief with a confidence rating for each partner category.",
    strengths: "Real-time web research, citation validation, source-backed market data",
    invocation: "Go to Perplexity.ai and select the 'Pro' or 'Deep Research' mode. Paste this prompt in full.",
    iterationNote: "After results, ask Perplexity: 'Validate the top 5 partner categories with current market data and recent examples from [your geography].'",
  },
  "Manus": {
    label: "Manus",
    shortLabel: "Manus",
    persona: "You are an autonomous agent workflow designer specializing in multi-step referral system buildouts.",
    systemNotes: "Manus is an agentic AI that can execute multi-step workflows. Structure this as a sequential agent task with clear handoffs, tool calls, and decision trees.",
    formatInstruction: "Structure output as an agent workflow with: TASK → STEPS → DECISION POINTS → OUTPUTS → NEXT AGENT ACTION. Use numbered steps and clear conditional logic (IF/THEN).",
    strengths: "Multi-step autonomous workflows, tool orchestration, agent task sequencing",
    invocation: "Paste this into Manus as an Agent task. Manus will work through the steps autonomously — do not interrupt mid-execution.",
    iterationNote: "After Manus completes, review the workflow output and ask it to execute the outreach sequencing step as a new agent task.",
  },
};

// ─── Industry-Specific Data ────────────────────────────────────────────────────
const INDUSTRY_DATA = {
  "Real Estate": {
    triggerEvents: "home purchase, home sale, refinance, investment property acquisition, relocation, lease signing, portfolio expansion",
    upstreamPartners: "mortgage brokers, financial advisors, estate attorneys, CPAs, divorce attorneys, relocation specialists, property managers",
    sideStreamPartners: "home inspectors, title companies, interior designers, contractors, insurance agents, moving companies, stagers",
    lifecycleMoments: "pre-listing, active search, under contract, closing, post-close 30/60/90 days, first anniversary, refinance trigger",
    trustSignals: "transaction volume, days-on-market performance, neighborhood specialization depth, builder relationships, investor network",
    scriptTone: "consultative, confidence-based, neighborhood-authority positioning",
    dealContext: "transaction-based, milestone-driven, relationship-compounding",
    nicheExamples: "luxury residential, first-time buyers, investment/multi-family, commercial leasing, 1031 exchanges, relocation, new construction",
    partnerValueAdd: "priority referrals, client pre-qualification support, co-marketing materials, market report sharing, closing gift coordination",
    objectionContext: "existing referral relationships, territory overlap concerns, reciprocity expectations, compliance considerations",
    d100Context: "The Dream 100 in real estate means identifying the 100 most influential upstream and side-stream professionals in your market who are consistently positioned earlier in the client journey than you are.",
  },
  "Insurance": {
    triggerEvents: "policy renewal, life event (marriage, child, divorce, retirement), business launch, property purchase, income change, estate planning, Medicare eligibility",
    upstreamPartners: "financial advisors, estate planning attorneys, CPAs, HR benefits consultants, mortgage brokers, business attorneys, payroll providers",
    sideStreamPartners: "real estate agents, car dealerships, health & wellness professionals, employee benefits platforms, risk managers, business consultants",
    lifecycleMoments: "annual review window, open enrollment, life event trigger, policy lapse risk, Medicare enrollment window, business expansion, beneficiary review",
    trustSignals: "claims advocacy reputation, carrier relationships, policy retention rate, specialty knowledge depth, responsiveness track record",
    scriptTone: "advisory, risk-education based, protection-framing, compliance-aware",
    dealContext: "recurring premium-based, lifecycle-anchored, multi-policy household/business penetration",
    nicheExamples: "life insurance, P&C personal lines, commercial lines, Medicare/supplemental, group benefits, disability income, key-person coverage",
    partnerValueAdd: "client risk assessments, coverage gap education, referral of uninsurable leads, co-authored client communications, policy review support",
    objectionContext: "existing carrier preferred partnerships, commission concerns, client relationship ownership, regulatory compliance, product conflicts",
    d100Context: "The Dream 100 in insurance means mapping all professionals who interact with clients during financial decisions, life transitions, and risk events — all upstream of the insurance conversation.",
  },
};

// ─── Phase Assignments for Multi-LLM Mode ─────────────────────────────────────
export const PHASE_MODEL_MAP = {
  "Strategic Synthesis": "Claude Sonnet",
  "Deep Lifecycle Mapping": "Claude Opus",
  "Live Partner Research": "ChatGPT Deep Research",
  "Citation Validation": "Perplexity",
  "Agent Workflow": "Manus",
  "Script Writing": "ChatGPT Standard",
};

// ─── Core Prompt Builder ───────────────────────────────────────────────────────
function buildProfile(data) {
  const ind = INDUSTRY_DATA[data.industry];
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

function llmHeader(modelName) {
  const profile = LLM_PROFILES[modelName];
  if (!profile) return "";
  return `> **🤖 Optimized for: ${profile.label}**  
> *Strengths: ${profile.strengths}*  
> **How to use:** ${profile.invocation}

---

`;
}

function trustEquityDefinition() {
  return `
### Trust Equity Framework

For each partner evaluated, assess their **Trust Equity Score** across five dimensions:

| Dimension | What to Measure |
|---|---|
| **Review Strength** | Volume of reviews, average rating, recency, response rate |
| **Community Visibility** | Speaking engagements, association memberships, local media presence |
| **Client Longevity** | Average client tenure, repeat transaction rate, referral reciprocity |
| **Authority Credentials** | Certifications, designations, thought leadership content |
| **Recurring Interaction** | How frequently they touch clients throughout the year |

Partners with high Trust Equity in your niche and geography should be Tier 1 priorities regardless of volume.
`;
}

function referralVolumeFramework() {
  return `
### Referral Volume Estimation Framework

Estimate referral potential for each partner category using:

| Factor | Scoring Weight |
|---|---|
| **Client Transaction Frequency** | How often do their clients transact vs. your trigger event? |
| **Lifecycle Timing Alignment** | Do their client interactions happen *before* yours? |
| **Decision-Maker Access** | Do they speak directly to the financial/strategic decision-maker? |
| **Market Concentration** | How many professionals in this category serve your exact geography/niche? |

Score each partner category 1–5 per factor. Prioritize categories scoring 16+ out of 20.
`;
}

// ─── SIMPLE MODE ───────────────────────────────────────────────────────────────
function generateSimplePrompts(data, model) {
  const p = buildProfile(data);
  const llm = LLM_PROFILES[model];
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return `# Partner Pipeline Blueprint
### ${p.industry} · ${p.niche} · ${p.geography}
*Generated: ${date} · Mode: Simple · Model: ${llm.label}*

---

> **📋 Execution Order:** Run these three prompts in sequence. Complete each fully before moving to the next.  
> **💡 Iteration Tip:** ${llm.iterationNote}

---

## Phase 1 of 3 — Strategic Mapping Prompt

${llmHeader(model)}

${llm.persona}

I am a ${p.industry} professional specializing in **${p.niche}** operating in **${p.geography}**.

**My Sales Profile:**
- Average deal size: ${p.avgDeal}
- Sales cycle: ${p.salesCycle}
- Current referral revenue: ${p.referralPct}
- Team size: ${p.teamSize}

**Your task:** Apply the Dream 100 methodology to map my referral partner ecosystem.

${p.d100Context}

Build me a complete strategic map that includes:

1. **Upstream Partner Categories** — professionals who interact with my ideal clients *before* the ${p.triggerEvents} trigger. For ${p.industry} in ${p.geography}, these include profiles like: ${p.upstreamPartners}.

2. **Side-Stream Partner Categories** — professionals serving the same client simultaneously or immediately after. These include: ${p.sideStreamPartners}.

3. **Tier Classification:**
   - **Tier 1:** Highest referral volume potential + lifecycle alignment + client overlap
   - **Tier 2:** Moderate alignment, strong for specific niches or seasonal triggers
   - **Tier 3:** Low frequency but high-value when they do refer

4. **Lifecycle Trigger Moments** to map for ${p.industry}: ${p.lifecycleMoments}

${trustEquityDefinition()}

${referralVolumeFramework()}

${llm.formatInstruction}

Focus specifically on the **${p.niche}** niche in **${p.geography}**. Make all examples, naming, and prioritization specific to this context.

---

## Phase 2 of 3 — Partner Identification Prompt

${llmHeader(model)}

${llm.persona}

Building on the strategic map above, now identify specific partner profiles for my ${p.industry} practice specializing in **${p.niche}** in **${p.geography}**.

For each Tier 1 and Tier 2 partner category, provide:

**Partner Profile Template:**

| Field | Details |
|---|---|
| Category Name | e.g., Estate Planning Attorney |
| Why They're Upstream | What they do before my client reaches me |
| Trigger Alignment | Which of my trigger events (${p.triggerEvents}) they activate |
| Trust Equity Profile | Typical review volume, visibility signals, credential markers |
| Referral Volume Estimate | Monthly/quarterly referral potential per active partner |
| Value I Can Offer Them | ${p.partnerValueAdd} |
| Reciprocity Structure | What I give, what I ask, and what makes it fair |

**Influence Mapping:**
For the top 5 categories identified, map the **influence chain** — who referred them clients, who they refer clients to, and where I should insert myself into that chain.

**Geography-Specific Lens:**
In **${p.geography}**, which of these partner categories have the highest market concentration? Which are undersupplied or where the competition for referral relationships is lowest?
When suggesting specific companies: Prioritize independent or locally dominant firms in ${p.geography} over national enterprise brands unless strategically justified.

${llm.formatInstruction}

---

## Phase 3 of 3 — Outreach Script Prompt

${llmHeader(model)}

${llm.persona}

Now write a complete outreach script suite for a **${p.industry} professional** specializing in **${p.niche}** in **${p.geography}** to initiate referral partner relationships.

**Context:**
- Deal profile: ${p.avgDeal} average, ${p.salesCycle} cycle
- Tone: ${p.scriptTone}
- Primary partner targets: [Use Tier 1 categories from Phase 1]

**Script Suite Required:**

### 1. Cold LinkedIn Connection Note (300 characters max)
Personalized for reaching out to [Tier 1 Partner Type]. Reference the shared client, not the referral ask.

### 2. First Email — The Value-Lead Opener
- Subject line options (3 variations)
- Opening that references a shared client problem, not a referral request
- Value proposition: what I bring to their clients
- Single, low-friction CTA

### 3. Coffee/Zoom Meeting Agenda (15-minute format)
- What I'll ask about them (3 questions)
- What I'll share about my niche value
- How I'll plant the reciprocity seed without asking directly
- How I'll close with a next step

### 4. Post-Meeting Follow-Up Email
- Reference something specific from the conversation
- Deliver the promised value (e.g., resource, introduction, report)
- Soft referral structure introduction

### 5. Objection Handling Scripts
Address likely objections in ${p.industry}: ${p.objectionContext}

**Tone guidance:** ${p.scriptTone}. All scripts must sound like a trusted peer, not a vendor or solicitor.

${llm.formatInstruction}

---

*Partner Pipeline Blueprint generated by Partner Pipeline Builder · Dream 100 Methodology*
`;
}

// ─── ADVANCED MODE ─────────────────────────────────────────────────────────────
function generateAdvancedPrompts(data, model, optimizePerPhase) {
  const p = buildProfile(data);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const getModelName = (phase) => optimizePerPhase ? PHASE_MODEL_MAP[phase] : model;
  const getModel = (phase) => LLM_PROFILES[getModelName(phase)] || LLM_PROFILES[model];
  const modelLabel = optimizePerPhase ? "Multi-Model Optimized" : LLM_PROFILES[model]?.label;

  return `# Partner Pipeline Blueprint — Advanced
### ${p.industry} · ${p.niche} · ${p.geography}
*Generated: ${date} · Mode: Advanced (Beta) · ${modelLabel}*

---

${optimizePerPhase ? `> **🔁 Multi-Model Workflow:** Each phase is assigned to its optimal LLM. Run them in sequence using the specified model.
>
> | Phase | Assigned Model | Reason |
> |---|---|---|
> | 1. Lifecycle Trigger Mapping | Claude Opus | Deep analytical lifecycle reasoning |
> | 2. Upstream + Side-stream Mapping | Claude Sonnet | Strategic synthesis & structure |
> | 3. Tier Ranking & Influence | Claude Sonnet | Executive framework design |
> | 4. Gap & Value-Add Design | Claude Opus | Multi-variable gap analysis |
> | 5. Objection Anticipation | ChatGPT Standard | Practical script output |
> | 6. Script Suite Generator | ChatGPT Standard | Actionable copy generation |
> | 7. Quarterly Reinforcement System | Manus | Agent workflow execution |

` : `> **🤖 All phases optimized for: ${LLM_PROFILES[model]?.label}**
> ${LLM_PROFILES[model]?.invocation}

`}
---

## Phase 1 of 7 — Lifecycle Trigger Mapping Prompt
*${optimizePerPhase ? `Run in: **Claude Opus**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Deep Lifecycle Mapping"))}

${getModel("Deep Lifecycle Mapping").persona}

I am a **${p.industry} professional** specializing in **${p.niche}** serving clients in **${p.geography}**.

**Objective:** Map the complete client lifecycle for my niche and identify every moment where a referral trigger could fire.

**My Sales Profile:**
- Average deal size: ${p.avgDeal}
- Sales cycle: ${p.salesCycle}
- Current referral revenue: ${p.referralPct} of total
- Team size: ${p.teamSize}

**Task — Build a Full Lifecycle Trigger Map:**

For the ${p.industry} client in the **${p.niche}** segment, map every stage of the client journey chronologically:

1. **Pre-Decision Phase** — What triggers someone to consider entering my pipeline?
   - Life events in ${p.industry}: ${p.triggerEvents}
   - Who else is involved in this pre-decision moment?

2. **Active Decision Phase** — Milestones during the ${p.salesCycle} cycle
   - At each milestone: Who else is the client speaking to?
   - At each milestone: What referral opportunity exists?

3. **Transaction / Close Phase** — The ${p.avgDeal} transaction moment
   - Who else participates in this event?
   - What warm referral windows open immediately post-close?

4. **Post-Transaction Lifecycle** — Mapped at 30, 60, 90 days, 6 months, 1 year, 3 years
   - Which lifecycle events re-activate the client as a referral source?
   - Which events create new partner introduction opportunities?

5. **Trigger Calendar** — Build a 12-month trigger calendar showing seasonal moments in **${p.geography}** where referral activity peaks for ${p.niche} clients.

${trustEquityDefinition()}

${getModel("Deep Lifecycle Mapping").formatInstruction}

---

## Phase 2 of 7 — Upstream + Side-stream Mapping Prompt
*${optimizePerPhase ? `Run in: **Claude Sonnet**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Strategic Synthesis"))}

${getModel("Strategic Synthesis").persona}

For a **${p.industry} professional** in **${p.niche}** in **${p.geography}**, map the complete upstream and side-stream partner ecosystem using Dream 100 principles.

**UPSTREAM PARTNERS** — professionals who touch my ideal client *before* the ${p.triggerEvents} trigger:

Primary upstream categories for ${p.industry}: ${p.upstreamPartners}

For each upstream category:
- Why they're upstream (what they do before the client reaches me)
- Client overlap percentage estimate
- Typical referral lead time (how many months before they refer)
- Natural conversation entry point where my niche arises
- Their current referral behavior

**SIDE-STREAM PARTNERS** — professionals serving the same client simultaneously:

Primary side-stream categories: ${p.sideStreamPartners}

For each side-stream category:
- What creates natural co-referral opportunities
- How to structure a reciprocal referral agreement
- Risk of conflict or competition

**GEOGRAPHY-SPECIFIC ANALYSIS for ${p.geography}:**
- Which categories are oversupplied with professionals competing for relationships?
- Which categories are underleveraged or relationship-sparse?
- Locally dominant players who would be high-value anchor partners?
- When suggesting specific companies: Prioritize independent or locally dominant firms in ${p.geography} over national enterprise brands unless strategically justified.

${referralVolumeFramework()}

${getModel("Strategic Synthesis").formatInstruction}

---

## Phase 3 of 7 — Tier Ranking & Influence Prioritization Prompt
*${optimizePerPhase ? `Run in: **Claude Sonnet**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Strategic Synthesis"))}

${getModel("Strategic Synthesis").persona}

Using the partner map from Phase 2, build the complete Dream 100 Tier Classification system for my **${p.niche}** practice in **${p.geography}**.

**Tier Classification:**

| Tier | Volume Potential | Lifecycle Alignment | Trust Equity | Access Difficulty |
|---|---|---|---|---|
| **Tier 1** | High (5+ referrals/yr) | Directly upstream | High | Moderate–High |
| **Tier 2** | Moderate (2–4/yr) | Adjacent or seasonal | Moderate | Low–Moderate |
| **Tier 3** | Low (0–2/yr) | Loosely connected | Variable | Low |

**Task:**

1. Assign every partner category from Phase 2 to a tier with scoring rationale.

2. **Influence Chain Mapping** — For the top 10 Tier 1 partners:
   - Who referred them their best clients?
   - Who do they currently refer out to?
   - What would make them refer to me instead?

3. **Trust Equity Gap Analysis:**
   What Trust Equity level is needed to displace existing referral relationships for each Tier 1 category?

4. **Quick-Win Tier 2 Opportunities:**
   5 categories where I could establish relationships quickly (low competition, high receptiveness).

5. **Dream 10 Prioritized Shortlist Table:**
   You must include a Dream 10 prioritized shortlist table with columns:
   | Partner Category | Tier | Trust Equity (1–5) | Referral Leverage (1–5) | Ease of Access (1–5) | Rationale |

6. **Priority Matrix:**
   Build a 2x2 matrix: Volume Potential (Y) × Access Speed (X). Label each partner category.

${getModel("Strategic Synthesis").formatInstruction}

---

## Phase 4 of 7 — Gap & Value-Add Design Prompt
*${optimizePerPhase ? `Run in: **Claude Opus**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Deep Lifecycle Mapping"))}

${getModel("Deep Lifecycle Mapping").persona}

For my **${p.industry} · ${p.niche}** practice in **${p.geography}**, design a complete Value-Add Architecture.

**Part A — Value Gap Analysis**

For each Tier 1 partner category:
- What does the *current* referral source offer them? (status quo)
- What gaps exist? (responsiveness, expertise depth, reciprocity, marketing support)
- How do I fill those gaps specifically?

**Part B — Value-Add Menu**

| Offer | Effort Level | Partner Benefit | What I Need to Execute |
|---|---|---|---|
| Monthly market report | Low | Credibility signal for their clients | 1 hr/month |
| Client pre-screening calls | Medium | Saves them awkward conversations | Phone availability |
| [Add 6 more specific to ${p.industry}] | | | |

Design value-adds specific to **${p.industry}** partners where ${p.triggerEvents} creates natural value exchange.

**Part C — Reciprocity Architecture**

For top 5 Tier 1 partner categories:
- What I give proactively (before asking)
- What I ask for specifically
- How I track and communicate reciprocity
- How I escalate from transactional to strategic

**Part D — Differentiation Statement**

Write a 2-sentence "Partner Value Proposition" — why partnering with me is different from any other ${p.industry} professional in ${p.geography}.

${getModel("Deep Lifecycle Mapping").formatInstruction}

---

## Phase 5 of 7 — Objection Anticipation Prompt
*${optimizePerPhase ? `Run in: **ChatGPT Standard**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Script Writing"))}

${getModel("Script Writing").persona}

Complete objection-handling playbook for building referral partnerships in **${p.industry} · ${p.niche}** in **${p.geography}**.

**Known Objection Categories for ${p.industry}:** ${p.objectionContext}

For each objection:
1. **The Objection** — exact language a partner might use
2. **What's Really Being Said** — the underlying concern
3. **Acknowledge Statement** — validate without arguing
4. **Reframe** — shift the frame without dismissing
5. **Evidence or Example** — story, data, or scenario that resolves it
6. **Bridge to Yes** — specific ask that makes it easy to move forward

**Additional Objection Scenarios:**
- The partner already has a preferred referral contact
- The partner has been burned by a ${p.industry} professional before
- The partner is worried about confidentiality or client poaching
- The partner is too busy / sees partner meetings as low-value
- The partner's compliance department restricts referrals

**Tone:** ${p.scriptTone}

${getModel("Script Writing").formatInstruction}

---

## Phase 6 of 7 — Script Suite Generator Prompt
*${optimizePerPhase ? `Run in: **ChatGPT Standard**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Script Writing"))}

${getModel("Script Writing").persona}

Write a complete 8-piece outreach and relationship script suite for a **${p.industry} professional** specializing in **${p.niche}** in **${p.geography}**.

**Tone Profile:** ${p.scriptTone}  
**Deal Context:** ${p.dealContext}

---

### Script 1 — LinkedIn Connection Request
300 characters max. Reference shared client profile, not the referral ask.

### Script 2 — First Touch Email (Value-Lead Opener)
- 3 subject line variations (curiosity, value, relevance)
- Opening: shared client problem, no referral ask
- Value bridge: what you bring to their clients specifically
- CTA: one low-friction next step

### Script 3 — Phone/Voicemail Script
Under 30 seconds. Curiosity-based. No selling.

### Script 4 — Coffee/Zoom Meeting Agenda (15–20 min)
Full structure: what you ask, what you share, how you plant reciprocity, how you close with a next step.

### Script 5 — Post-Meeting Follow-Up
- Reference something specific from the conversation
- Deliver a promised value item
- Soft reciprocity structure introduction

### Script 6 — First Referral Thank You
- Immediate acknowledgment
- Update cadence promise
- Reciprocity reinforcement

### Script 7 — Quarterly Relationship Nurture Email
For partners who've gone quiet. Re-engage with value, not an ask.

### Script 8 — Annual Partnership Review Conversation Guide
30-minute annual check-in structure to deepen relationship and realign reciprocity.

All scripts must sound like a trusted peer in **${p.industry}** — never a vendor or solicitor.

${getModel("Script Writing").formatInstruction}

---

## Phase 7 of 7 — Quarterly Reinforcement System Prompt
*${optimizePerPhase ? `Run in: **Manus**` : `Run in: **${LLM_PROFILES[model]?.label}**`}*

${llmHeader(getModelName("Agent Workflow"))}

${getModel("Agent Workflow").persona}

Design a complete Quarterly Partner Reinforcement System for a **${p.industry} · ${p.niche}** professional managing a Dream 100 partner network in **${p.geography}**.

**System Scope:**
- Team size: ${p.teamSize}
- Partner network target: 100 active partners across Tiers 1–3
- Revenue target: grow referral revenue from ${p.referralPct} toward 50%+

**Q1 — Relationship Foundation (Months 1–3)**
- Week-by-week partner outreach cadence (how many per week, which tier first)
- First 90-day touch sequence per partner
- Milestone: First referral received target

**Q2 — Value Delivery Cycle (Months 4–6)**
- Monthly value-add delivery calendar
- Partner appreciation touchpoints
- Referral reciprocity tracking system design
- Milestone: 10 active referral partnerships

**Q3 — Deepening & Scaling (Months 7–9)**
- Top 10 partners for strategic deepening
- Co-marketing or co-education opportunity design
- Referral volume review with each Tier 1 partner
- Milestone: 25% of new business from referrals

**Q4 — Annual Review & Year 2 Planning (Months 10–12)**
- Annual Partnership Review meeting structure
- Partner graduation/demotion criteria (Tier adjustments)
- Year 2 Dream 100 refresh — who to add, who to remove
- Milestone: Referral system operating semi-autonomously

${optimizePerPhase ? `
**Agent Workflow Format (Manus-Optimized):**
Structure this as an autonomous agent workflow:
TASK → STEPS → DECISION POINTS → OUTPUTS → TRIGGER NEXT ACTION
Use IF/THEN conditional logic for each quarterly decision point.
` : ""}

${getModel("Agent Workflow").formatInstruction}

---

*Partner Pipeline Blueprint — Advanced Mode · Dream 100 Methodology*  
*Partner Pipeline Builder · ${date}*
`;
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export function generatePrompt(data) {
  const { mode, model_selection, optimize_per_phase } = data;
  if (mode === "advanced") {
    return generateAdvancedPrompts(data, model_selection, optimize_per_phase);
  }
  return generateSimplePrompts(data, model_selection);
}

export { INDUSTRY_DATA };
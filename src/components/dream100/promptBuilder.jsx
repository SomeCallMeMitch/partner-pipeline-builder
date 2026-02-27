export function getLLMNote(llm) {
  const m = {
    'ChatGPT': 'Format your response with clear section headers and bullet points where helpful. Be specific to the niche and market provided.',
    'Claude (Anthropic)': 'Use markdown formatting with clear headers. Prioritize strategic depth and specificity. Avoid generic advice. Deliver exactly the deliverables described.',
    'Perplexity': 'Search for real, currently active businesses and professionals in the specified geographic area. Cite sources. Prioritize actionable, locally specific intelligence.',
    'Gemini': 'Respond in clearly organized sections. Ground your response in the specific niche and market. Use examples wherever possible.',
    'Grok': 'Be direct and specific. Avoid generic advice. Ground every recommendation in the specific niche and geographic market provided. Format with clear section headers.',
    "I'm not sure yet": 'Format your response with clear section headers. Be specific to the niche and market. Avoid generic real estate advice.'
  };
  return m[llm] || m['ChatGPT'];
}

export function buildPrompts(formData) {
  const n = formData.name || 'I';
  const niche = formData.niche || 'General Residential';
  const geo = formData.geo || 'my market area';
  const client = formData.client ? formData.client : `buyers and sellers in the ${niche} segment`;
  const challenge = formData.challenge || 'building consistent referral partner relationships';
  const years = formData.years || '';
  const llm = formData.llm || 'ChatGPT';
  const llmNote = getLLMNote(llm);

  return [
    {
      id: 1,
      title: 'Phase 1: Lifecycle Trigger Mapping',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- Ideal client: ${client}
- Referral challenge: ${challenge}
${years ? `- My experience: ${years}` : ''}

TASK — Lifecycle Trigger Mapping

Map the complete lifecycle of my ideal real estate client. Identify every major life event, financial trigger, and transition point that causes someone in the ${niche} segment to buy or sell in ${geo}.

For each trigger provide:
1. The specific trigger event
2. Months before a real estate transaction this typically occurs
3. Which professional type sees the client at this trigger BEFORE they contact a realtor
4. Why that professional has high trust at that exact moment

DELIVERABLE: Markdown table with columns:
| Trigger Event | Months Before Transaction | Upstream Professional | Why They Have High Trust |

Include at least 12 distinct trigger events. Mark top 3 with ★ and explain in 2-3 sentences each why they are the priority.

${llmNote}`
    },
    {
      id: 2,
      title: 'Phase 2: Upstream & Side-stream Partner Mapping',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- Ideal client: ${client}

TASK — Upstream & Side-stream Partner Mapping

UPSTREAM PARTNERS (see client 3–12 months before a transaction):
List 8–10 partner types. For each:
— Why they see my ${niche} client early
— The specific problem they're solving at that moment
— What a ${niche} specialist in ${geo} can offer them in return (specific value exchange)
— Estimated monthly referral frequency

SIDE-STREAM PARTNERS (see client during the transaction):
List 4–6 partner types. Same format.

UNDERUTILIZED PARTNERS:
Identify the top 3 underutilized partner types most agents overlook. Explain why they are high-value and underserved.

Use markdown formatting with clear headers.

${llmNote}`
    },
    {
      id: 3,
      title: 'Phase 3: Dream 10 Tier Ranking & Shortlist',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- Ideal client: ${client}

TASK — Dream 10 Tier Ranking & Shortlist

TIER STRUCTURE:
— Tier 1 (Direct Upstream): Partners who see clients immediately before a transaction trigger
— Tier 2 (Lifestyle & Transition): Partners who see clients during a life phase shift
— Tier 3 (Community & Maintenance): Partners with consistent long-term client contact

Build the Dream 10 table:
| Rank | Partner Type | Tier | Est. Monthly Referral Potential | Why Top Priority for ${niche} | First Contact Strategy |

Then answer: What 3 personal characteristics should I look for when identifying WHICH INDIVIDUAL at each company to target (beyond just finding the business)?

Use markdown formatting with clear headers.

${llmNote}`
    },
    {
      id: "4a",
      title: 'Phase 4a: Value Strategy Cards (Partners 1–3)',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}

TASK — Value Strategy Cards for Top 3 Partner Types

For each of the top 3 referral partner types for ${niche} in ${geo}, create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${niche} specialist in ${geo} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can ${n} create or offer to start the relationship — with no ask? Be specific.

**3. THE RECURRING TOUCHPOINT:** What ongoing value can ${n} deliver monthly or quarterly to keep the relationship warm?

Format each card clearly with the partner name as a header. Use markdown.

${llmNote}`
    },
    {
      title: 'Phase 4b: Value Strategy Cards (Partners 4–6) + Value Manifesto',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}

TASK — Value Strategy Cards for Partners 4–6 + Value Manifesto

For each of the next 3 referral partner types (partners ranked 4–6 from the Dream 10 for ${niche} in ${geo}), create a Value Strategy Card:

**1. THE GAP:** What is currently missing from this partner's client service that a ${niche} specialist in ${geo} can fill?

**2. THE VALUE GIFT:** What specific, tangible asset can ${n} create or offer to start the relationship — with no ask?

**3. THE RECURRING TOUCHPOINT:** What ongoing value can ${n} deliver monthly or quarterly?

---

Then write ${n}'s **Value Manifesto** — a 3-paragraph positioning statement ${n} would use when meeting new referral partners in person. It should focus entirely on how ${n} serves the partner's clients, not on promoting ${n}'s own production. Warm, peer-to-peer tone. No buzzwords.

Use markdown formatting.

${llmNote}`
    },
    {
      title: 'Phase 5: Objection Anticipation & Response Prep',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}
- Challenge: ${challenge}

TASK — Objection Anticipation & Response Prep

For each objection provide:
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
7. One objection specific to ${niche} partnerships
8. One more objection specific to ${niche} partnerships that most agents don't think of

BONUS: Write a "trust reset" script for: (a) a relationship that went cold after initial contact, and (b) a past referral relationship that ended badly.

TONE: Confident, low-pressure, peer-to-peer. Not salesy. Use markdown headers.

${llmNote}`
    },
    {
      title: 'Phase 6: Complete Outreach Script Suite',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director and copywriter specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}
${years ? `- Experience: ${years}` : ''}

TASK — Complete Outreach Script Suite

Write all 6 scripts:

**SCRIPT 1 — Cold Intro Email**
3 subject line options. Body under 150 words. Focus on partner's business, not ${n}'s needs. Mention a specific value gift. End with a low-commitment ask.

**SCRIPT 2 — LinkedIn Connection Message**
Under 300 characters. Reference something real about their work. Do not mention referrals.

**SCRIPT 3 — Coffee/Zoom Invitation**
4–6 sentences. Frame around their business growth. Include a curiosity hook specific to ${niche} in ${geo}.

**SCRIPT 4 — Handwritten Note Introduction**
3–4 sentences. Sent BEFORE any other outreach. Completely personal. Zero sales language. This is the first impression that opens every door.

**SCRIPT 5 — Value-First Follow-Up**
Brief message after delivering the value gift. Conversational. Plant a seed without making an ask.

**SCRIPT 6 — Referral Thank-You Note**
Warm, personal, non-templated. Sent immediately after receiving a referral.

All scripts sound like ${n} — warm, credible, peer-to-peer. No buzzwords. Use markdown headers.

${llmNote}`
    },
    {
      title: 'Phase 7a: 90-Day Week-by-Week Plan + Relationship Tracker',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}

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

Format both parts clearly with markdown headers and tables where appropriate.

${llmNote}`
    },
    {
      title: 'Phase 7b: 12-Month Calendar + Production Math',
      model: llm,
      modelNote: `Optimized for ${llm}. ${llmNote}`,
      prompt: `You are a Strategic Alliances Director specializing in real estate referral systems.

MY CONTEXT:
- Real estate niche: ${niche}
- Market area: ${geo}
- My name: ${n}

TASK — 12-Month Quarterly Calendar + Production Math

**PART C — 12-Month Quarterly Calendar**
After a partner becomes active, what does ${n} do each quarter to maintain and deepen the relationship? Create a 4-quarter calendar with:
— Specific touchpoints per quarter
— Value gifts
— Personal gestures
— Exact moments where a handwritten note is the highest-leverage move (quarterly check-in, referral thank-you, partner's business milestone, holiday)

**PART D — 12-Month Production Math**
Walk through the math simply and conservatively:
— How many Dream 10 partnerships at what referral frequency = what level of closed volume?
— Assume average deal size for ${niche} in ${geo}
— Show 3 scenarios: conservative, moderate, strong
— What does ${n} need to believe is true for this system to work?

Format with markdown headers and tables.

${llmNote}`
    }
  ];
}
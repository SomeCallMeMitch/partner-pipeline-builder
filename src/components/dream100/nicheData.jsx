export const NICHES = [
  { value: 'Luxury & High-End Residential', icon: '🏛️', title: 'Luxury & High-End', desc: '$1M+ properties' },
  { value: 'First-Time Homebuyers', icon: '🔑', title: 'First-Time Buyers', desc: 'FHA, down payment programs' },
  { value: 'Empty Nesters & Downsizing', icon: '🌿', title: 'Empty Nesters', desc: 'Downsizing, 55+ lifestyle' },
  { value: 'Investor & Fix-and-Flip', icon: '📈', title: 'Investors', desc: 'BRRRR, fix-and-flip' },
  { value: 'Military Relocation (PCS)', icon: '🎖️', title: 'Military PCS', desc: 'VA loans, relocation' },
  { value: 'Divorce & Estate Sales', icon: '⚖️', title: 'Divorce & Estate', desc: 'Probate, court-ordered' },
  { value: 'New Construction & Builder Representation', icon: '🏗️', title: 'New Construction', desc: 'Builder rep, new dev' },
  { value: 'General Residential', icon: '🏡', title: 'General Residential', desc: 'Mix of buyers & sellers' },
];

export const NICHE_HELPERS = {
  'Luxury & High-End Residential': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Waterfront estates $2M+', 'Gated communities with private amenities', 'Luxury condos for empty nesters', 'Primary residence to vacation home buyers', 'International/out-of-state luxury buyers']
  },
  'First-Time Homebuyers': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Young professionals age 25–35', 'FHA and down payment assistance buyers', 'Renters moving to suburbs', 'Dual-income couples buying their first home', 'Single buyers in urban markets']
  },
  'Empty Nesters & Downsizing': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Couples 55–70 selling a 4BR family home', 'Moving to a 55+ active adult community', 'Seeking lock-and-leave condos', 'Downsizing to be near grandchildren', 'Trading a large home for a smaller home + cash']
  },
  'Investor & Fix-and-Flip': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Out-of-state investors buying remotely', 'BRRRR strategy buyers', 'Local flippers doing 5–10 deals a year', 'Multifamily 2–4 unit investors', 'Short-term rental (Airbnb) buyers']
  },
  'Military Relocation (PCS)': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Active duty families on PCS orders', 'VA loan buyers near a base', 'Retiring military buying their forever home', 'Dual military couples', 'Military families relocating to/from overseas']
  },
  'Divorce & Estate Sales': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Divorce attorneys who refer clients needing to sell', 'Probate and estate attorneys', 'Inherited property owners', 'Court-ordered sales needing quick close', 'Executors managing estate real estate']
  },
  'New Construction & Builder Representation': {
    hint: 'Write your own in a sentence or two. Tap an example if you want a starting point:',
    chips: ['Representing buyers in new subdivisions', 'Exclusive builder sales rep partnerships', 'Custom home lot buyers', 'Buyers torn between resale and new build', '55+ new construction communities']
  },
  'General Residential': {
    hint: 'Describe who you most often work with:',
    chips: ['Mix of move-up buyers and sellers', 'Suburban families in a specific price range', 'Buyers and sellers in a specific neighborhood', 'Referral-based business, all price points']
  }
};

// Shared by IdealClientModal (shown filtered by the selected niche) and
// WizardStep2's isUnmodifiedExample check (so a click-through-unedited
// submission can be detected and nudged once, without blocking).
export const IDEAL_CLIENT_EXAMPLES = [
  {
    icon: "🔑",
    label: "First-Time Buyer, Modest Down Payment",
    text: "Single or dual-income buyer in their late 20s to mid-30s, FHA or low-down-payment loan, tight budget, first time navigating the process and needs extra guidance.",
    niches: ["First-Time Homebuyers"],
  },
  {
    icon: "🔨",
    label: "Investor / Fix-and-Flip",
    text: "Men 35–55, high net worth, doing 5–10 flips per year. Self-made, data-driven, moves fast. Values an agent who speaks investor language. Usually referred by their hard money lender or CPA.",
    niches: ["Investor & Fix-and-Flip"],
  },
  {
    icon: "🏡",
    label: "Luxury Downsizer",
    text: "Couples 55–70, empty nesters, $3M+ home, ready to right-size into a gated community or luxury condo. Emotionally attached to their current home. Need patience and a clear financial case.",
    niches: ["Luxury & High-End Residential", "Empty Nesters & Downsizing"],
  },
  {
    icon: "✨",
    label: "High-Income Next-Home Buyer",
    text: "Tech professionals 30–45, dual income $400K+, buying their forever home in a top school district. Overwhelmed by the market, need guidance. Often referred by their financial advisor.",
    niches: ["Luxury & High-End Residential", "New Construction & Builder Representation"],
  },
  {
    icon: "✈️",
    label: "Relocation Executive",
    text: "Corporate executives relocating from out of state, 45–60, company-assisted move, $1.5–$3M budget. Time-pressed and decisive. Want an agent who makes fast, confident decisions on their behalf.",
    niches: ["Luxury & High-End Residential"],
  },
  {
    icon: "🌅",
    label: "55+ Active Adult",
    text: "Active retirees 60–75, downsizing from a large family home. Want community amenities, single-story living, low maintenance. Often have significant equity and are paying cash or close to it.",
    niches: ["Empty Nesters & Downsizing"],
  },
  {
    icon: "🎖️",
    label: "Military PCS Family",
    text: "Active-duty family relocating on PCS orders, using a VA loan, working a tight window between orders and report date. Needs someone who moves fast and already knows the area around the base.",
    niches: ["Military Relocation (PCS)"],
  },
  {
    icon: "⚖️",
    label: "Divorce or Estate Sale",
    text: "Court-ordered or executor-directed sale. The decision is often shared between parties who are not on the best terms, and the priority is a clean, fast, defensible sale over squeezing out maximum price.",
    niches: ["Divorce & Estate Sales"],
  },
  {
    icon: "👨‍👩‍👧",
    label: "Move-Up Family Buyer",
    text: "Growing families 35–50, outgrowing their starter home, $800K–$1.5M budget. Prioritize school district, yard, safety. Both partners in the decision. Usually 60–90 days before school starts.",
    niches: ["General Residential", "New Construction & Builder Representation"],
  },
];

// Exact-match check: the person clicked a card and submitted it completely
// unedited. Used to show a one-time, non-blocking nudge to add one real
// detail, rather than silently letting the example stand in for their
// actual clients.
export function isUnmodifiedExample(clientText) {
  if (!clientText) return false;
  const trimmed = clientText.trim();
  if (!trimmed) return false;
  return IDEAL_CLIENT_EXAMPLES.some(ex => ex.text.trim() === trimmed);
}

export const CHALLENGES = [
  { value: "I don't have a systematic approach to finding referral partners", label: "No systematic approach yet" },
  { value: "I rely on one or two relationships that aren't consistent enough", label: "Too dependent on a few people" },
  { value: "I know who the right partners are but don't know how to approach them without it feeling like a cold call", label: "I know who — just can't break in" },
  { value: "I've tried reaching out to partners but haven't gotten traction or real responses", label: "Reached out but can't get traction" },
  { value: "I don't know which partner types are most valuable for my specific niche", label: "Don't know which partners to prioritize" },
];

export const YEARS_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "I'm in my first 2 years and building my referral base from scratch", label: "Under 2 years" },
  { value: "I have 3–5 years of experience and am building more consistent systems", label: "3–5 years" },
  { value: "I have 6–10 years of experience and am refining my referral approach", label: "6–10 years" },
  { value: "I have over 10 years of experience and want to systematize what I've been doing informally", label: "10+ years" },
];

// Detects an obvious mismatch between the selected niche and the ideal client description.
// Returns a warning string if a contradiction is found, otherwise null.
export function detectContradiction(nicheBase, clientText) {
  if (!nicheBase || !clientText || clientText.trim().length < 20) return null;
  const text = clientText.toLowerCase();

  if (nicheBase === 'First-Time Homebuyers') {
    const luxurySignals = ['luxury', '$1m', '$2m', '$3m', 'million', 'high-net', 'estate', 'empty nester', 'downsiz', 'wealthy', 'affluent', 'gated'];
    if (luxurySignals.some(k => text.includes(k))) {
      return "Your niche is set to First-Time Homebuyers, but your ideal client description sounds more like a luxury or downsizing buyer. The blueprint will try to serve both audiences, which can dilute your partner recommendations. You may want to go back and select the Luxury or Empty Nesters niche instead.";
    }
  }

  if (nicheBase === 'Luxury & High-End Residential') {
    const firstTimeSignals = ['first-time', 'first time', 'fha', 'down payment assistance', 'starter home'];
    if (firstTimeSignals.some(k => text.includes(k))) {
      return "Your niche is set to Luxury & High-End Residential, but your ideal client description sounds more like first-time buyers. This may produce mismatched partner recommendations.";
    }
  }

  if (nicheBase === 'Empty Nesters & Downsizing') {
    const firstTimeSignals = ['first-time', 'first time', 'fha', 'young professional', 'starter home'];
    if (firstTimeSignals.some(k => text.includes(k))) {
      return "Your niche is set to Empty Nesters & Downsizing, but your ideal client description sounds more like a first-time or younger buyer. Consider switching to the First-Time Homebuyers niche.";
    }
  }

  return null;
}
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
    hint: 'Tap any example below or write your own. The more specific, the better your prompts:',
    chips: ['Waterfront estates $2M+', 'Gated communities with private amenities', 'Luxury condos for empty nesters', 'Primary residence to vacation home buyers', 'International/out-of-state luxury buyers']
  },
  'First-Time Homebuyers': {
    hint: 'Tap any example or write your own:',
    chips: ['Young professionals age 25–35', 'FHA and down payment assistance buyers', 'Renters moving to suburbs', 'Dual-income couples buying their first home', 'Single buyers in urban markets']
  },
  'Empty Nesters & Downsizing': {
    hint: 'Tap any example or write your own:',
    chips: ['Couples 55–70 selling a 4BR family home', 'Moving to a 55+ active adult community', 'Seeking lock-and-leave condos', 'Downsizing to be near grandchildren', 'Trading a large home for a smaller home + cash']
  },
  'Investor & Fix-and-Flip': {
    hint: 'Tap any example or write your own:',
    chips: ['Out-of-state investors buying remotely', 'BRRRR strategy buyers', 'Local flippers doing 5–10 deals a year', 'Multifamily 2–4 unit investors', 'Short-term rental (Airbnb) buyers']
  },
  'Military Relocation (PCS)': {
    hint: 'Tap any example or write your own:',
    chips: ['Active duty families on PCS orders', 'VA loan buyers near a base', 'Retiring military buying their forever home', 'Dual military couples', 'Military families relocating to/from overseas']
  },
  'Divorce & Estate Sales': {
    hint: 'Tap any example or write your own:',
    chips: ['Divorce attorneys who refer clients needing to sell', 'Probate and estate attorneys', 'Inherited property owners', 'Court-ordered sales needing quick close', 'Executors managing estate real estate']
  },
  'New Construction & Builder Representation': {
    hint: 'Tap any example or write your own:',
    chips: ['Representing buyers in new subdivisions', 'Exclusive builder sales rep partnerships', 'Custom home lot buyers', 'Buyers torn between resale and new build', '55+ new construction communities']
  },
  'General Residential': {
    hint: 'Describe who you most often work with:',
    chips: ['Mix of move-up buyers and sellers', 'Suburban families in a specific price range', 'Buyers and sellers in a specific neighborhood', 'Referral-based business, all price points']
  }
};

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

export const LLM_OPTIONS = [
  { value: "ChatGPT", label: "ChatGPT" },
  { value: "Claude (Anthropic)", label: "Claude (Anthropic)" },
  { value: "Perplexity", label: "Perplexity" },
  { value: "Gemini", label: "Gemini" },
  { value: "Grok", label: "Grok (xAI)" },
  { value: "I'm not sure yet", label: "Not sure yet" },
];
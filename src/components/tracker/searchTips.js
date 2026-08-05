// searchTips.js
// The generic "how to actually pick a good partner" advice shown before the
// agent goes off to search. This is the half that is the same for every
// partner type -- the type-specific half comes from each partner's own
// whyPriority line, written by the blueprint.
//
// Pure data + helpers. No React here.

export const RESEARCH_TIME_NOTE = {
  title: "This is where the real time goes",
  body: "If you actually want this to produce referrals, this is the step that takes some real investment, not the naming. Read a few reviews, not just the star count. Look at how they talk about clients, whether people mention feeling rushed or genuinely cared for. You are looking for someone you would click with, not just the first listing. A relationship you are asking someone to trust you with is worth ten extra minutes of reading.",
};

export const REACH_OUT_TO_BOTH = {
  title: "Reach out to both, not just the primary",
  body: "Contact your primary and your secondary around the same time, not one after the other. If you work one person for weeks before trying the other, a single quiet inbox costs you a month. Two in motion at once means a stall on one doesn't stall the whole line.",
};

export const GENERIC_SEARCH_TIPS = [
  {
    title: "Scroll past the first two results",
    body: "The top of a Google or Maps search is usually paid placement, and the biggest names are large firms or franchises. A one-to-one referral relationship is much harder to build with a big brand than with an individual who owns their book of business.",
  },
  {
    title: "Look for a real person, not just a firm",
    body: "You want a name and a face. Open the firm's site and find the team or about page. Someone with their own bio, photo, and direct line is someone you can actually build a relationship with.",
  },
  {
    title: "Grab the phone, email, and address while you are there",
    body: "You are already on their website. Copy their direct phone, email, and office address into the fields here now, so when it is time to reach out, or send a card, you are not starting the search over.",
  },
];

// A short, honest answer to the question every agent asks: why only ten?
export const WHY_TEN = {
  title: "Why ten people and not a hundred",
  body: "Anyone can hand you a list of a hundred names. A hundred names produces a hundred cold, shallow contacts and almost no referrals. What you are really asking a partner to do is trust you with their own clients and friends. That trust is earned over time, not in one call. Ten people, worked properly, two per type, is the most a solo agent can actually sustain, and it is far more than enough to build a steady stream of business.",
};

// Builds the full tip set for one card: the type-specific "why this partner"
// context first (from the blueprint), then the generic how-to-search advice.
export function tipsForPartner(partner) {
  const specific = [];
  if (partner?.whyPriority) {
    specific.push({
      title: "Why this type matters for you",
      body: partner.whyPriority,
      fromBlueprint: true,
    });
  }
  return { specific, generic: GENERIC_SEARCH_TIPS };
}

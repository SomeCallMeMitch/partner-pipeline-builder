// searchTips.js
// The generic "how to actually pick a good partner" advice shown in the
// expandable "What to look for" panel on each naming card. This is the half
// that is the same for every partner type -- the type-specific half comes from
// each partner's own whyPriority line, written by the blueprint.
//
// Pure data + one helper. No React here.

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
    title: "Grab the phone and email while you are there",
    body: "You are already on their website. Copy their direct phone and email into the fields here now, so when it is time to reach out you are not starting the search over.",
  },
  {
    title: "Line up two, not one",
    body: "Put a primary and a backup on each type. Not to contact both at once, but because the first person may not bite, and a relationship you are building toward should never rest on a single name.",
  },
];

// A short, honest answer to the question every agent asks: why only ten?
export const WHY_TEN = {
  title: "Why ten people and not a hundred",
  body: "Anyone can hand you a list of a hundred names. A hundred names produces a hundred cold, shallow contacts and almost no referrals. What you are really asking a partner to do is trust you with their own clients and friends. That trust is earned over time, not in one call. Ten people, worked properly, is the most a solo agent can actually sustain, and it is far more than enough to build a steady stream of business.",
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

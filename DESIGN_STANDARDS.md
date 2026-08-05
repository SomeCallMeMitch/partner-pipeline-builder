# Design standards for this app

Read this before building or resizing any page, modal, or card. It exists because
the same three mistakes (text too small, leading too loose or too tight, a modal
sized for less content than it holds) kept recurring across sessions. This is not
a style guide for colors or brand voice -- it is a checklist against that specific
failure pattern.

## The rule, stated plainly

**Fonts default too small. Assume the first draft needs to go up, not down.**
When in doubt, size for someone reading on a laptop at arm's length, not for
someone with their face six inches from a phone. If a screen has room to grow
(a modal, a single-card view, anything not fighting for space against a dense
grid), use the room. A modal that could be 800px wide but ships at 500px with
14px text is not "clean," it is undersized.

## Font-size scale (desktop; see mobile section for scaling down)

| Use | Size | Line-height |
|---|---|---|
| Modal / page hero title | 26-32px | 1.2-1.3 |
| Section heading | 18-21px | 1.3 |
| Card title / label | 15-17px | 1.3-1.4 |
| Body copy, the stuff people actually read | 15-16px | 1.55-1.7 |
| Supporting / secondary text | 13-14px | 1.5-1.6 |
| Micro labels (pills, eyebrows, badges) | 10-11px | 1.2 |

**Never ship body copy under 14px** outside of micro labels. If a design pass
lands at 12-13px for a paragraph someone is meant to read (not skim), that is
the bug, not a stylistic choice.

## Leading (line-height): the other half of the same mistake

Too-tight leading (under 1.4 on multi-line body text) makes paragraphs feel
cramped and harder to scan. Too-loose leading (over 1.8) makes short modal copy
feel airy and padded rather than confident. The working range for anything a
person reads more than one line of is **1.5 to 1.7**. Headings can go tighter
(1.2-1.35) because they wrap less and density reads as intentional there.

## Modal and card sizing

A modal earns its width with content, not the other way around. Before setting
`max-width`, count what's actually inside: a pitch plus a benefits list plus a
CTA needs meaningfully more room than a single confirmation message. As a
starting point:

| Content | max-width |
|---|---|
| Single message + one button | 420-480px |
| Pitch + supporting detail, one column | 500-560px |
| Two-column layout (pitch + benefits, form + preview) | 700-880px |
| A single focused card in a step-by-step flow | 700-820px (not full page width) |

If a design gets built at the small end and then the request comes back "make
it bigger," that is a sign this table should have been consulted first, not a
sign the person asking is being fussy.

## Don't hide fields that matter

If a field is part of the point of the screen (an address on a screen whose
purpose is mailing something, a phone number on a contact card), it should be
visible by default, not revealed after some other field is filled. Progressive
disclosure is fine for genuinely optional extras; it is the wrong tool for a
field the user came to the screen to fill in. When a screen has room (a single
card, not a dense grid), default to showing everything relevant rather than
folding it behind an interaction.

## Width follows content shape, not habit

A dense multi-column grid of forms needs more horizontal room than a single
card presented one at a time. Don't carry a "make it wider" fix from a grid
layout into a sequential, one-thing-at-a-time layout without rechecking --
the one-at-a-time version usually wants to be narrower and more centered, like
a wizard step, not stretched to fill a grid's width.

## Process for anyone (human or model) building a new screen

1. Read this file first.
2. Sketch what content the screen actually holds before picking dimensions.
3. Size text from the table above, then read it back at arm's length before
   shipping -- not on a maximized editor window three feet from your face.
4. If a screen fights for space (a dense form, a multi-column grid), fields
   can be pared down or revealed progressively. If it doesn't (a modal, a
   single-card step), don't hide things that matter.
5. When you're not sure, oversize slightly rather than undersize. It is a
   five-minute fix to shrink something that reads as too bold; it is a full
   round-trip to catch something that reads as too small, because small text
   doesn't look "wrong" in a screenshot, it just quietly doesn't get read.

## History (why this file exists)

Three consecutive rounds on the Partner Tracker naming screen and completion
modal shipped with undersized text, and one round hid required fields (phone,
email, mailing address) behind a name-entry trigger on a screen that had the
room to show them outright. Each fix was correct in isolation but the pattern
repeating three times is the actual signal: check this file before building,
not after the third round of feedback.

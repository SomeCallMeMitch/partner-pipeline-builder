// nextAction.js
// Pure logic. Given a partner record, decide the single next thing to do.
// No component may invent its own rule. Everything routes through here.

export const STAGES = [
  { key: 'identified', label: 'Identified', hint: 'A type, not yet a person' },
  { key: 'named', label: 'Named', hint: 'You know who they are' },
  { key: 'contacted', label: 'Contacted', hint: 'You have reached out' },
  { key: 'met', label: 'Met', hint: 'You have talked properly' },
  { key: 'active', label: 'Active', hint: 'A real working relationship' },
  { key: 'dormant', label: 'Dormant', hint: 'Gone quiet' },
];

export const STAGE_LABEL = STAGES.reduce((acc, s) => {
  acc[s.key] = s.label;
  return acc;
}, {});

const DAY = 24 * 60 * 60 * 1000;

function ts(value) {
  if (!value) return null;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

function addDays(base, days) {
  return new Date(base + days * DAY).toISOString();
}

export function daysBetween(from, to) {
  const a = ts(from);
  const b = ts(to);
  if (a === null || b === null) return null;
  return Math.round((b - a) / DAY);
}

/**
 * The one next action for a partner.
 * kind: name | outreach | card | checkin
 */
export function getNextAction(partner, nowMs) {
  const now = nowMs || Date.now();
  const p = partner || {};
  const stage = p.stage || 'identified';
  const anchor = ts(p.stageChangedAt) || ts(p.created_date) || now;
  const lastTouch = ts(p.lastTouchAt) || anchor;
  const referral = ts(p.referralReceivedAt);
  const touches = p.touchCount || 0;

  let action;

  if (referral && (!ts(p.lastTouchAt) || ts(p.lastTouchAt) < referral)) {
    action = {
      key: 'thank_referral',
      kind: 'card',
      label: 'Thank them by hand',
      detail: 'They sent you business. A written card inside 48 hours is the whole difference between a one-off and a habit.',
      dueAt: addDays(referral, 2),
      priority: 0,
    };
  } else if (stage === 'identified') {
    action = {
      key: 'name_person',
      kind: 'name',
      label: 'Name the person',
      detail: 'A category cannot take your call. Put one real human here, even a rough guess you can correct later.',
      dueAt: new Date(now).toISOString(),
      priority: 1,
    };
  } else if (stage === 'named') {
    action = {
      key: 'first_touch',
      kind: 'card',
      label: 'Send the handwritten note first',
      detail: 'This is already written for you. Mail it before any call or email -- a note on a desk gets read, an intro email does not.',
      dueAt: addDays(anchor, 3),
      priority: 2,
    };
  } else if (stage === 'contacted' && touches < 2) {
    action = {
      key: 'follow_up',
      kind: 'outreach',
      label: 'Follow up on a different channel',
      detail: 'If the first one was email, try a call. Same message, different door.',
      dueAt: addDays(lastTouch, 10),
      priority: 3,
    };
  } else if (stage === 'contacted') {
    action = {
      key: 'break_through',
      kind: 'card',
      label: 'Send a handwritten card',
      detail: 'Two touches with no reply means the inbox is not working. Nobody throws away a handwritten card.',
      dueAt: addDays(lastTouch, 7),
      priority: 3,
    };
  } else if (stage === 'met') {
    action = {
      key: 'thank_meeting',
      kind: 'card',
      label: 'Send a thank-you card',
      detail: 'Reference one specific thing they said. That is what makes it read as a person rather than a process.',
      dueAt: addDays(anchor, 2),
      priority: 1,
    };
  } else if (stage === 'active') {
    action = {
      key: 'check_in',
      kind: 'checkin',
      label: 'Check in. Ask for nothing.',
      detail: 'No update, no pitch, no ask. Relationships go quiet because every contact has a price tag on it.',
      dueAt: addDays(lastTouch, 60),
      priority: 4,
    };
  } else {
    action = {
      key: 'restart',
      kind: 'card',
      label: 'Restart with a card',
      detail: 'Quiet does not mean closed. A card with no ask attached reopens the door more reliably than a call.',
      dueAt: addDays(lastTouch, 90),
      priority: 5,
    };
  }

  const snooze = ts(p.snoozeUntil);
  const isSnoozed = !!(snooze && snooze > now);
  const due = ts(action.dueAt);

  return {
    ...action,
    isSnoozed,
    isDue: !isSnoozed && due !== null && due <= now,
    daysUntilDue: due === null ? null : Math.ceil((due - now) / DAY),
  };
}

/**
 * What changes on the record when the user says the action is done.
 */
export function completeActionPatch(partner, action, nowIso) {
  const now = nowIso || new Date().toISOString();
  const p = partner || {};
  const patch = {
    lastTouchAt: now,
    touchCount: (p.touchCount || 0) + 1,
    snoozeUntil: '',
  };

  if (action.kind === 'outreach' && p.stage === 'named') {
    patch.stage = 'contacted';
    patch.stageChangedAt = now;
  }
  if (action.key === 'thank_meeting') {
    patch.stage = 'active';
    patch.stageChangedAt = now;
  }
  if (p.stage === 'dormant') {
    patch.stage = 'contacted';
    patch.stageChangedAt = now;
  }

  return patch;
}

export function snoozePatch(days, nowMs) {
  const now = nowMs || Date.now();
  return { snoozeUntil: addDays(now, days) };
}

export function stageChangePatch(nextStage, nowIso) {
  return {
    stage: nextStage,
    stageChangedAt: nowIso || new Date().toISOString(),
    snoozeUntil: '',
  };
}

export function addNotePatch(partner, text, nowIso) {
  const now = nowIso || new Date().toISOString();
  const existing = Array.isArray(partner?.notes) ? partner.notes : [];
  return { notes: [{ at: now, text: String(text).trim() }, ...existing].slice(0, 100) };
}

/**
 * Due first, then by how soon, then by blueprint rank.
 * Snoozed partners sink to the bottom without being scolded about it.
 */
export function sortPartners(partners, nowMs) {
  const now = nowMs || Date.now();
  return [...(partners || [])].map(p => ({ p, a: getNextAction(p, now) })).sort((x, y) => {
    if (x.a.isSnoozed !== y.a.isSnoozed) return x.a.isSnoozed ? 1 : -1;
    if (x.a.isDue !== y.a.isDue) return x.a.isDue ? -1 : 1;
    if (x.a.isDue && y.a.isDue) {
      if (x.a.priority !== y.a.priority) return x.a.priority - y.a.priority;
    }
    const dx = x.a.daysUntilDue === null ? 9999 : x.a.daysUntilDue;
    const dy = y.a.daysUntilDue === null ? 9999 : y.a.daysUntilDue;
    if (dx !== dy) return dx - dy;
    return (x.p.rank || 99) - (y.p.rank || 99);
  });
}

export function dueSummary(action) {
  if (action.isSnoozed) return 'Snoozed';
  if (action.isDue) return 'Ready now';
  const d = action.daysUntilDue;
  if (d === null) return '';
  if (d <= 1) return 'Tomorrow';
  if (d < 14) return `In ${d} days`;
  if (d < 60) return `In ${Math.round(d / 7)} weeks`;
  return `In ${Math.round(d / 30)} months`;
}

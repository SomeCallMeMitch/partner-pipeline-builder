// Shared client-side input sanitization for the Dream Partner Blueprint wizard.
// This is a UX layer only -- the server re-applies its own caps and checks in
// startGenerationJob because the client can never be trusted as the real gate.

export const FIELD_LIMITS = {
  geo: 100,
  name: 60,
  client: 600,
  customNiche: 120,
};

// Strips control characters (keeps normal whitespace) and enforces a max
// length. Does not trim interior spacing -- that's left to the field itself.
export function sanitizeInput(value, maxLen) {
  if (typeof value !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  let cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  if (typeof maxLen === 'number') cleaned = cleaned.slice(0, maxLen);
  return cleaned;
}

export function isBlank(value) {
  return !value || !value.trim();
}

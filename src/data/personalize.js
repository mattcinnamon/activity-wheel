import { getNames } from "./storage";

/**
 * Replaces "Big Person" / "your Big Person" in text with actual names from settings.
 * e.g. "your Big Person" → "your Big Person, Matt or Jess,"
 */
export function personalize(text) {
  if (!text) return text;
  const names = getNames();
  const bp1 = names.bigPerson1?.trim();
  const bp2 = names.bigPerson2?.trim();

  if (!bp1 && !bp2) return text;

  let nameStr;
  if (bp1 && bp2) {
    nameStr = `${bp1} or ${bp2}`;
  } else {
    nameStr = bp1 || bp2;
  }

  // Replace "your Big Person" or "Big Person" (case-insensitive) with name appended
  return text.replace(/(?:your\s+)?Big\s+Person(?:'s)?/gi, (match) => {
    return `${match}, ${nameStr},`;
  });
}

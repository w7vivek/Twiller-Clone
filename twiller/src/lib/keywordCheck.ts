export const KEYWORDS = ["cricket", "science"];

export function containsKeyword(text: string) {
  return KEYWORDS.some(k =>
    text.toLowerCase().includes(k)
  );
}

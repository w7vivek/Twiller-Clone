export function containsImportantKeyword(text: string) {
  const keywords = ["cricket", "science"];
  return keywords.some(keyword =>
    text.toLowerCase().includes(keyword)
  );
}
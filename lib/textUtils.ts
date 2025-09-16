export function formatPositionText(text: string): string[] {
  if (!text) return [];

  // First split on periods followed by capital letters
  let sentences = text.split(/\.\s+(?=[A-Z])/g);

  // Then split each sentence on semicolons that separate distinct points
  sentences = sentences.flatMap((sentence) => sentence.split(/;\s*/));

  // Clean up and filter
  const cleanedSentences = sentences
    .map((point) => point.trim())
    .filter((point) => point.length > 20) // Filter out very short fragments
    .map((point) => {
      // Capitalize first letter
      point = point.charAt(0).toUpperCase() + point.slice(1);
      
      // Add periods back if missing
      if (
        !point.endsWith('.') &&
        !point.endsWith(';') &&
        !point.endsWith('?') &&
        !point.endsWith('!')
      ) {
        return point + '.';
      }
      return point.replace(/;$/, '.');
    })
    .filter((point) => point.length > 0);

  return cleanedSentences;
}

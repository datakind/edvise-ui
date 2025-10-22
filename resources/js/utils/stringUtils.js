/**
 * Utility functions for string formatting
 */

/**
 * Formats model names by removing underscores and capitalizing words
 * @param {string} str - The input string (e.g., "midway_uni_graduation_4y_end_of_first_year")
 * @returns {string} - Formatted string (e.g., "Midway Uni Graduation 4Y End Of First Year")
 */
export const formatModelName = str => {
  if (!str || typeof str !== 'string') return '';

  return str
    .split('_')
    .map(word => {
      // Skip empty words
      if (!word) return '';

      // Handle special cases like "4y" -> "4Y"
      if (/^\d+[a-z]$/i.test(word)) {
        return word.toUpperCase();
      }
      // Handle acronyms (all caps words)
      if (/^[A-Z]+$/.test(word)) {
        return word;
      }
      // Regular word capitalization
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Converts a string to title case with proper handling of small words
 * Small words (a, an, the, in, on, at, etc.) are not capitalized unless they're the first or last word
 * @param {string} str - The input string
 * @returns {string} - Title cased string
 */
export const toTitleCase = str => {
  if (!str || typeof str !== 'string') return '';

  // List of small words that should not be capitalized (unless first or last word)
  const smallWords = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in',
    'into', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'up', 'via', 'with'
  ]);

  const words = str.trim().split(/\s+/);

  return words
    .map((word, index) => {
      // Skip empty words
      if (!word) return '';

      // Get the lowercase version for comparison
      const lowerWord = word.toLowerCase();

      // Always capitalize first and last words
      const isFirstOrLast = index === 0 || index === words.length - 1;

      // Check if it's a small word
      const isSmallWord = smallWords.has(lowerWord);

      // Capitalize if it's first/last word, or not a small word
      if (isFirstOrLast || !isSmallWord) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // Keep small words lowercase
      return lowerWord;
    })
    .join(' ');
};

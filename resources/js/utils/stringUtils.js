/**
 * Utility functions for string formatting
 */

/**
 * Formats model names by removing underscores and capitalizing words.
 * Time-limit units and FT/PT are uppercased to match the domain model
 * (e.g. 4.5Y, 3Y, FT, PT).
 *
 * @param {string} str - The input string (e.g., "graduation_in_3y_ft_4.5Y_pt_checkpoint_2_core_terms")
 * @returns {string} - Formatted string (e.g., "Graduation In 3Y FT 4.5Y PT Checkpoint 2 Core Terms")
 */
export const formatModelName = str => {
  if (!str || typeof str !== 'string') return '';

  // UC stores decimals as 4d5y; API usually returns 4.5Y already.
  const decoded = str.replace(/(\d+)d(\d+)([yYmM])/g, '$1.$2$3');

  return decoded
    .split('_')
    .filter(Boolean)
    .map(word => {
      // Decimal time limit: 4.5y / 4.5Y → 4.5Y
      if (/^\d+\.\d+[a-zA-Z]$/.test(word)) {
        return word.slice(0, -1) + word.slice(-1).toUpperCase();
      }
      // Integer time limit: 3y → 3Y
      if (/^\d+[a-zA-Z]$/.test(word)) {
        return word.toUpperCase();
      }
      // Enrollment intensity: ft / pt → FT / PT
      if (/^(ft|pt)$/i.test(word)) {
        return word.toUpperCase();
      }
      // Preserve all-caps acronyms
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
    'a',
    'an',
    'and',
    'as',
    'at',
    'but',
    'by',
    'for',
    'from',
    'in',
    'into',
    'nor',
    'of',
    'on',
    'or',
    'per',
    'the',
    'to',
    'up',
    'via',
    'with',
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

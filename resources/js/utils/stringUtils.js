/**
 * Utility functions for string formatting
 */

/**
 * Formats model names by removing underscores and capitalizing words
 * @param {string} str - The input string (e.g., "midway_uni_graduation_4y_end_of_first_year")
 * @returns {string} - Formatted string (e.g., "Midway Uni Graduation 4Y End Of First Year")
 */
export const formatModelName = str => {
  if (!str) return '';

  return str
    .split('_')
    .map(word => {
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

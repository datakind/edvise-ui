/**
 * Utility functions for batch operations
 */

import axios from 'axios';

/**
 * Parses a date string in MM/DD/YYYY HH:MM:SS format to a Date object
 * @param {string} dateStr - Date string in format "MM/DD/YYYY HH:MM:SS"
 * @returns {Date|null} Parsed Date object or null if invalid
 */
const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  
  // Handle MM/DD/YYYY HH:MM:SS format
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    const [, month, day, year, hour, minute, second] = match;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // Month is 0-indexed
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );
  }
  
  // Fallback to standard Date parsing for ISO format or other formats
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Fetches batches from the API and filters for valid (completed, not deleted) batches
 * @returns {Promise<Array>} Array of valid batches
 * @throws {Error} If API call fails or no batches data is received
 */
export const fetchValidBatches = async () => {
  const response = await axios.get('/view-uploaded-data');
  
  if (!response.data || !response.data.batches) {
    throw new Error('No batches data received from API');
  }

  const batches = response.data.batches;

  // Filter batches: exclude deleted, only include completed
  const validBatches = batches.filter(batch => 
    batch.deleted === false && batch.completed === true
  );

  return validBatches;
};

/**
 * Gets the most recent valid batch ID
 * @returns {Promise<string|null>} The batch_id of the most recent batch, or null if none found
 * @throws {Error} If API call fails or no batches data is received
 */
export const getMostRecentBatchId = async () => {
  const validBatches = await fetchValidBatches();

  if (validBatches.length === 0) {
    return null;
  }

  // Sort by created_at descending (most recent first)
  const sortedBatches = [...validBatches].sort((a, b) => {
    const dateA = parseDateString(a.created_at);
    const dateB = parseDateString(b.created_at);
    if (!dateA || !dateB) return 0; // If either date is invalid, don't change order
    return dateB - dateA; // Descending order
  });

  return sortedBatches[0].batch_id;
};

/**
 * Checks if there are any valid (completed, not deleted) batches
 * @returns {Promise<boolean>} True if there are valid batches, false otherwise
 */
export const hasValidBatches = async () => {
  try {
    const validBatches = await fetchValidBatches();
    return validBatches.length > 0;
  } catch (err) {
    console.error('Error checking for valid batches:', err);
    return false;
  }
};

/**
 * Gets the most recent valid batch with full information
 * @returns {Promise<Object|null>} The most recent batch object, or null if none found
 * @throws {Error} If API call fails or no batches data is received
 */
export const getMostRecentBatch = async () => {
  const validBatches = await fetchValidBatches();

  if (validBatches.length === 0) {
    return null;
  }

  // Sort by created_at descending (most recent first)
  const sortedBatches = [...validBatches].sort((a, b) => {
    const dateA = parseDateString(a.created_at);
    const dateB = parseDateString(b.created_at);
    if (!dateA || !dateB) return 0; // If either date is invalid, don't change order
    return dateB - dateA; // Descending order
  });

  return sortedBatches[0];
};

/**
 * Gets batch information by batch_id from the batches list, or returns the most recent batch if no batch_id is provided
 * @param {string|null|undefined} batch_id - Optional Batch ID. If not provided, returns the most recent batch
 * @returns {Promise<Object|null>} Batch information object, or null if not found
 * @throws {Error} If API call fails
 */
export const getBatchInfo = async (batch_id) => {
  const validBatches = await fetchValidBatches();
  
  // If no batch_id provided, return the most recent batch
  if (!batch_id) {
    if (validBatches.length === 0) {
      return null;
    }

    // Sort by created_at descending (most recent first)
    const sortedBatches = [...validBatches].sort((a, b) => {
      const dateA = parseDateString(a.created_at);
      const dateB = parseDateString(b.created_at);
      if (!dateA || !dateB) return 0; // If either date is invalid, don't change order
      return dateB - dateA; // Descending order
    });

    return sortedBatches[0];
  }
  
  // Otherwise, find the specific batch
  const batch = validBatches.find(b => b.batch_id === batch_id);
  
  return batch || null;
};


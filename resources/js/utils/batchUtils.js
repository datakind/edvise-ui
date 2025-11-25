/**
 * Utility functions for batch operations
 */

import axios from 'axios';

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
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
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


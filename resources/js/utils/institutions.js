import axios from 'axios';

/** Sorted institution list from GET /view-all-institutions-api (same source as Set Institution). */
export function fetchAllInstitutions() {
  return axios.get('/view-all-institutions-api').then(res => {
    const list = Array.isArray(res.data) ? res.data : [];
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  });
}

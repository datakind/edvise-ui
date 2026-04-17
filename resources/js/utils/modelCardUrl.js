/** Laravel {@see ApiController::downloadModelCard} — optional `name` is the model name (filename built server-side). */
export function modelCardDownloadUrl(instId, modelRunId, modelName) {
  const base = `/institutions/${instId}/training/model-cards/${modelRunId}`;
  if (!modelName) return base;
  return `${base}?name=${encodeURIComponent(modelName)}`;
}

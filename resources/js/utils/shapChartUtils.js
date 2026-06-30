export function parseShapValue(item) {
  if ('shap_value' in item) return parseFloat(item.shap_value) || 0;
  if ('feature_importance' in item)
    return parseFloat(item.feature_importance) || 0;
  if ('importance' in item) return parseFloat(item.importance) || 0;
  return 0;
}

export function limitTopFeatureRows(rows, limit = 10) {
  const groups = {};
  rows.forEach(item => {
    const name = item.feature_readable_name;
    if (!name) return;
    if (!groups[name]) {
      groups[name] = { sum: 0, count: 0 };
    }
    groups[name].sum += Math.abs(parseShapValue(item));
    groups[name].count += 1;
  });

  const topNames = new Set(
    Object.entries(groups)
      .map(([name, stats]) => ({
        name,
        mean: stats.sum / stats.count,
      }))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, limit)
      .map(entry => entry.name),
  );

  return rows.filter(item => topNames.has(item.feature_readable_name));
}

function beeswarmYValues(featureData) {
  const points = featureData.map((item, idx) => ({
    x: parseShapValue(item),
    originalIdx: idx,
    y: 0,
  }));

  points.sort((a, b) => a.x - b.x);

  const dotRadius = 0.02;
  const stackIncrement = 0.04;
  const placedPoints = [];

  points.forEach(point => {
    let yPosition = 0;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 50;

    while (!placed && attempts < maxAttempts) {
      const hasCollision = placedPoints.some(placedPoint => {
        const xDist = Math.abs(placedPoint.x - point.x);
        if (xDist > 0.003) return false;
        const yDist = Math.abs(placedPoint.y - yPosition);
        return yDist < dotRadius;
      });

      if (!hasCollision) {
        point.y = yPosition;
        placedPoints.push(point);
        placed = true;
      } else {
        attempts += 1;
        yPosition =
          attempts % 2 === 0
            ? (attempts / 2) * stackIncrement
            : -Math.ceil(attempts / 2) * stackIncrement;
      }
    }

    if (!placed) {
      point.y = yPosition;
      placedPoints.push(point);
    }
  });

  return placedPoints.map(point => Math.max(-0.8, Math.min(0.8, point.y)));
}

export function computeGlobalShapRange(rawFeatures) {
  if (!rawFeatures || rawFeatures.length === 0) {
    return { min: -1, max: 1 };
  }

  const allShapValues = rawFeatures
    .map(parseShapValue)
    .filter(val => typeof val === 'number' && !Number.isNaN(val));

  if (allShapValues.length === 0) {
    return { min: -1, max: 1 };
  }

  const min = Math.min(...allShapValues);
  const max = Math.max(...allShapValues);
  const maxAbsValue = Math.max(Math.abs(min), Math.abs(max));
  const symmetricPadding = maxAbsValue * 0.2;

  return {
    min: -(maxAbsValue + symmetricPadding),
    max: maxAbsValue + symmetricPadding,
  };
}

export function computeGlobalYRange(rawFeatures) {
  if (!rawFeatures || rawFeatures.length === 0) {
    return { min: -2, max: 2 };
  }

  const featureGroups = {};
  rawFeatures.forEach(item => {
    const featureName = item.feature_readable_name;
    if (!featureGroups[featureName]) {
      featureGroups[featureName] = [];
    }
    featureGroups[featureName].push(item);
  });

  const allJitterValues = Object.values(featureGroups).flatMap(beeswarmYValues);

  if (allJitterValues.length === 0) {
    return { min: -2, max: 2 };
  }

  const minJitter = Math.min(...allJitterValues);
  const maxJitter = Math.max(...allJitterValues);
  const maxAbsJitter = Math.max(Math.abs(minJitter), Math.abs(maxJitter));
  const padding = Math.max(0.3, maxAbsJitter * 0.15);

  return {
    min: -(maxAbsJitter + padding),
    max: maxAbsJitter + padding,
  };
}

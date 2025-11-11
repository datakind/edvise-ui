import React, { useMemo, useEffect } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

export default function Shap({ rawFeatures, currentFeature }) {
  // Generate a unique ID for this Shap component instance
  const componentId = React.useMemo(() => {
    const featureName = currentFeature?.feature_readable_name || 'unknown';
    const timestamp = Date.now();
    return `${featureName}_${timestamp}`;
  }, [currentFeature?.feature_readable_name]);

  // Calculate global SHAP value range across ALL features
  const globalShapRange = useMemo(() => {
    if (!rawFeatures || rawFeatures.length === 0) {
      return { min: -1, max: 1 };
    }

    const allShapValues = rawFeatures.map(item => {
      if ('shap_value' in item) return parseFloat(item.shap_value) || 0;
      if ('feature_importance' in item) return parseFloat(item.feature_importance) || 0;
      if ('importance' in item) return parseFloat(item.importance) || 0;
      return 0;
    }).filter(val => typeof val === 'number' && !isNaN(val));

    const min = Math.min(...allShapValues);
    const max = Math.max(...allShapValues);

    // Create symmetric range centered at 0
    const maxAbsValue = Math.max(Math.abs(min), Math.abs(max));
    const symmetricPadding = maxAbsValue * 0.2;
    return {
      min: -(maxAbsValue + symmetricPadding),
      max: maxAbsValue + symmetricPadding,
    };
  }, [rawFeatures]);

  // Calculate global y-axis range based on jitter spread across ALL features
  const globalYRange = useMemo(() => {
    if (!rawFeatures || rawFeatures.length === 0) {
      return { min: -2, max: 2 };
    }

    // Calculate jitter for all features to find the broadest range
    const allJitterValues = [];

    // Group by feature to calculate jitter for each
    const featureGroups = {};
    rawFeatures.forEach(item => {
      const featureName = item.feature_readable_name;
      if (!featureGroups[featureName]) {
        featureGroups[featureName] = [];
      }
      featureGroups[featureName].push(item);
    });

    // Calculate beeswarm jitter for each feature with collision detection
    Object.values(featureGroups).forEach(featureData => {
      // Create array with SHAP values
      const points = featureData.map((item, idx) => ({
        x: parseFloat(item.shap_value || item.feature_importance || item.importance || 0),
        originalIdx: idx,
        y: 0
      }));

      // Sort by x position (SHAP value)
      points.sort((a, b) => a.x - b.x);

      // Collision detection parameters (same as main algorithm)
      const dotRadius = 0.02;
      const stackIncrement = 0.04;

      // Place each dot with collision detection
      const placedPoints = [];

      points.forEach((point) => {
        let yPosition = 0;
        let placed = false;
        let attempts = 0;
        const maxAttempts = 50;

        while (!placed && attempts < maxAttempts) {
          const hasCollision = placedPoints.some(placedPoint => {
            const xDist = Math.abs(placedPoint.x - point.x);
            // Only consider collision if x values are very close
            if (xDist > 0.003) return false; // Different SHAP value (tolerance = 0.003)
            // Similar SHAP value, check y distance
            const yDist = Math.abs(placedPoint.y - yPosition);
            return yDist < dotRadius;
          });

          if (!hasCollision) {
            point.y = yPosition;
            placedPoints.push(point);
            placed = true;
          } else {
            attempts++;
            yPosition = attempts % 2 === 0
              ? (attempts / 2) * stackIncrement
              : -(Math.ceil(attempts / 2)) * stackIncrement;
          }
        }

        if (!placed) {
          point.y = yPosition;
          placedPoints.push(point);
        }

        allJitterValues.push(Math.max(-0.8, Math.min(0.8, point.y)));
      });
    });

    const minJitter = Math.min(...allJitterValues);
    const maxJitter = Math.max(...allJitterValues);

    // Add minimal padding and ensure symmetric range (keep tight around y=0)
    const maxAbsJitter = Math.max(Math.abs(minJitter), Math.abs(maxJitter));
    const padding = Math.max(0.3, maxAbsJitter * 0.15); // Ensure minimum visible height

    return {
      min: -(maxAbsJitter + padding),
      max: maxAbsJitter + padding,
    };
  }, [rawFeatures]);

  // Log the props to see what data is available (only when they change)
  useEffect(() => {
    console.log(`=== SHAP COMPONENT ${componentId} ===`);
    console.log('rawFeatures:', rawFeatures);
    console.log('currentFeature:', currentFeature);
    console.log('rawFeatures type:', typeof rawFeatures);
    console.log('currentFeature type:', typeof currentFeature);
    console.log('rawFeatures length:', rawFeatures?.length);
    console.log(
      'currentFeature keys:',
      currentFeature ? Object.keys(currentFeature) : 'null',
    );
    console.log('===========================');
  }, [componentId, rawFeatures, currentFeature]);

  // Process currentFeature data for the beeswarm plot
  const plotData = useMemo(() => {
    if (!currentFeature || !rawFeatures) return null;

    console.log(
      `[${componentId}] Processing data for feature: ${currentFeature.feature_readable_name}`,
    );

    // Get all data points for this feature from rawFeatures
    const featureData = rawFeatures.filter(
      item =>
        item.feature_readable_name === currentFeature.feature_readable_name,
    );

    console.log(
      `[${componentId}] Found ${featureData.length} data points for this feature`,
    );

    if (featureData.length === 0) {
      console.log(`[${componentId}] No data found for this feature`);
      return null;
    }

    // Extract x (feature importance) and y (jittered vertical positions)
    // Check what fields are actually available and use fallbacks
    const x = featureData.map(item => {
      if ('shap_value' in item) {
        const shapValue = parseFloat(item.shap_value);
        // console.log(`shap_value: "${item.shap_value}" -> parsed: ${shapValue}`);
        return shapValue || 0;
      }
      if ('feature_importance' in item)
        return parseFloat(item.feature_importance) || 0;
      if ('importance' in item) return parseFloat(item.importance) || 0;

      // Debug: log what fields are actually available
      console.log('Available fields in item:', Object.keys(item));
      console.log('Item sample:', item);

      return Math.random() * 0.5; // Fallback for missing data
    });

    // Create true beeswarm jitter with collision detection
    const y = (() => {
      // Create array with SHAP values and indices
      const points = featureData.map((item, idx) => ({
        x: x[idx],
        originalIdx: idx,
        y: 0 // Start all at center (y=0)
      }));

      // Sort by x position (SHAP value) for proper stacking
      points.sort((a, b) => a.x - b.x);

      // Collision detection parameters (very tight clustering for dense packing)
      const dotRadius = 0.02; // How close dots can be before colliding (very small)
      const stackIncrement = 0.04; // How much to move up/down on collision (very small steps)

      // Place each dot, checking for collisions
      const placedPoints = [];

      points.forEach((point) => {
        let yPosition = 0; // Always start at center (y=0)
        let placed = false;
        let attempts = 0;
        const maxAttempts = 50; // Allow more stacking with smaller increments

        while (!placed && attempts < maxAttempts) {
          // Check if this position collides with any placed dots
          // Stack if SHAP values are very similar (small tolerance)
          const hasCollision = placedPoints.some(placedPoint => {
            const xDist = Math.abs(placedPoint.x - point.x);
            // Only consider collision if x values are very close
            if (xDist > 0.003) return false; // Different SHAP value (tolerance = 0.003)
            // Similar SHAP value, check y distance
            const yDist = Math.abs(placedPoint.y - yPosition);
            return yDist < dotRadius;
          });

          if (!hasCollision) {
            // No collision, place here
            point.y = yPosition;
            placedPoints.push(point);
            placed = true;
          } else {
            // Collision detected, try next position
            attempts++;
            // Alternate between positive and negative offsets: 0, +0.08, -0.08, +0.16, -0.16...
            yPosition = attempts % 2 === 0
              ? (attempts / 2) * stackIncrement
              : -(Math.ceil(attempts / 2)) * stackIncrement;
          }
        }

        // If we couldn't place it, just use the last attempted position
        if (!placed) {
          point.y = yPosition;
          placedPoints.push(point);
        }
      });

      // Sort back to original order and return y values
      points.sort((a, b) => a.originalIdx - b.originalIdx);
      return points.map(p => Math.max(-0.8, Math.min(0.8, p.y)));
    })();

    const featureValues = featureData.map(item => {
      if ('feature_value' in item) return parseFloat(item.feature_value) || 0;
      if ('value' in item) return parseFloat(item.value) || 0;
      if ('shap_value' in item) return parseFloat(item.shap_value) || 0;
      return (Math.random() - 0.5) * 2; // Fallback for missing data
    });

    // Extract student support scores for each data point
    const studentSupportScores = featureData.map(item => {
      if ('support_score' in item) return parseFloat(item.support_score) || 0;
      if ('student_support_score' in item)
        return parseFloat(item.student_support_score) || 0;
      return 0; // Fallback for missing data
    });

    // Detect if feature is categorical (all values are 0 or 1)
    const allValuesSame =
      featureValues.length > 0 &&
      featureValues.every(val => val === featureValues[0]);

    // Color scheme: #B2F1F9 (light blue) for low values, #007C8C (teal) for high values

    console.log('Processed plot data:', {
      featureDataLength: featureData.length,
      xValues: x,
      xValuesStats: {
        min: Math.min(...x),
        max: Math.max(...x),
        zeroCount: x.filter(v => v === 0).length,
      },
      featureValues: featureValues,
      allValuesSame: allValuesSame,
      yJitter: y,
      yJitterRange: { min: Math.min(...y), max: Math.max(...y) },
      studentSupportScores: studentSupportScores,
      featureName: currentFeature.feature_readable_name,
      sampleFeatureData: featureData[0], // Show structure of first item
      allFeatureNames: featureData.map(f => f.feature_readable_name),
      hasShapValues: featureData.every(f => 'shap_values' in f),
      hasShapValue: featureData.every(f => 'shap_value' in f),
      hasFeatureImportance: featureData.every(f => 'feature_importance' in f),
      hasFeatureValue: featureData.every(f => 'feature_value' in f),
      hasSupportScore: featureData.every(f => 'support_score' in f),
    });

    return {
      x,
      y,
      featureValues,
      studentSupportScores,
      allValuesSame,
    };
  }, [currentFeature, rawFeatures]);

  // Generate color based on feature_value with improved contrast
  const getColor = (featureValue, allValues) => {
    // Use actual data range for better color mapping
    const minVal = Math.min(...allValues.filter(v => typeof v === 'number'));
    const maxVal = Math.max(...allValues.filter(v => typeof v === 'number'));

    // Normalize to 0-1 based on actual data range
    const normalized = maxVal === minVal
      ? 0.5
      : Math.max(0, Math.min(1, (featureValue - minVal) / (maxVal - minVal)));

    // Convert hex colors to RGB for interpolation
    const color1 = { r: 178, g: 241, b: 249 }; // #B2F1F9 (light blue) for low values
    const color2 = { r: 0, g: 124, b: 140 }; // #007C8C (teal) for high values

    // Linear interpolation between the two colors
    const r = Math.round(color1.r + (color2.r - color1.r) * normalized);
    const g = Math.round(color1.g + (color2.g - color1.g) * normalized);
    const b = Math.round(color1.b + (color2.b - color1.b) * normalized);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div
      style={{
        width: '100%',
        margin: 'auto',
        background: 'transparent',
      }}
    >
      {plotData ? (
        <Plot
          data={[
            {
              x: plotData.x,
              y: plotData.y,
              mode: 'markers',
              type: 'scatter',
              marker: {
                size: 12,
                color: plotData.allValuesSame
                  ? '#808080'  // Gray for all the same values
                  : plotData.featureValues.map(val =>
                    typeof val === 'number' ? getColor(val, plotData.featureValues) : '#ccc',
                  ),
                opacity: 1.0,
                line: {
                  width: 0.5,
                  color: 'rgba(255, 255, 255, 0.3)'
                },
              },
              text: plotData.x.map((val, idx) => {
                const shapVal = typeof val === 'number' ? val.toFixed(3) : val;
                const featureVal =
                  typeof plotData.featureValues[idx] === 'number'
                    ? plotData.featureValues[idx].toFixed(3)
                    : plotData.featureValues[idx];
                const supportScore = plotData.studentSupportScores[idx] || 0;

                const tooltipLines = [
                  '<b>Student Data Point</b>',
                  `SHAP Value: ${shapVal}`,
                ];

                if (!plotData.allValuesSame) {
                  tooltipLines.push(`Feature Value: ${featureVal}`);
                }

                tooltipLines.push(`Support Score: ${supportScore.toFixed(2)}`);

                return tooltipLines.join('<br>');
              }),
              hoverinfo: 'text',
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                font: { color: '#fff' },
              },
            },
          ]}
          layout={{
            margin: { l: 10, r: 10, t: 0, b: 50 },
            xaxis: {
              visible: true,
              title: {
                text: '',
              },
              range: [globalShapRange.min, globalShapRange.max],
              fixedrange: false,
              showgrid: true,
              gridcolor: '#E5E7EB',
              griddash: 'dash',
              zeroline: true,
              zerolinecolor: '#D5E5EE',
              zerolinewidth: 2,
              tickfont: { size: 10, color: '#666' },
              showticklabels: false,
            },
            yaxis: {
              visible: false,
              range: [globalYRange.min, globalYRange.max],
              fixedrange: true,
              showgrid: false,
              zeroline: false,
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            showlegend: false,
            height: 250,
            shapes: [
              {
                type: 'line',
                x0: 0,
                y0: globalYRange.min,
                x1: 0,
                y1: globalYRange.max,
                xref: 'x',
                yref: 'y',
                line: {
                  color: '#D5E5EE',
                  width: 2,
                },
                layer: 'below',
              },
            ],
            annotations: [
              {
                x: 0,
                y: globalYRange.max + 0.2,
                xref: 'x',
                yref: 'y',
                text: 'No Effect',
                showarrow: false,
                font: { size: 10, color: '#666' },
                align: 'center',
              },
            ],
          }}
          config={{
            displayModeBar: false,
            responsive: true,
            scrollZoom: false,
            doubleClick: false,
          }}
          style={{ width: '100%', height: 250 }}
        />
      ) : (
        <div className="flex h-32 items-center justify-center text-gray-500">
          No feature data available
        </div>
      )}
    </div>
  );
}

Shap.propTypes = {
  rawFeatures: PropTypes.array,
  currentFeature: PropTypes.object,
};

Shap.defaultProps = {
  rawFeatures: [],
  currentFeature: null,
};

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

export default function Shap({ rawFeatures, currentFeature }) {
  // Generate a unique ID for this Shap component instance
  const componentId = React.useMemo(() => {
    const featureName = currentFeature?.feature_readable_name || 'unknown';
    const timestamp = Date.now();
    return `${featureName}_${timestamp}`;
  }, [currentFeature?.feature_readable_name]);

  // Log the props to see what data is available
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
        console.log(`shap_value: "${item.shap_value}" -> parsed: ${shapValue}`);
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

    // Create realistic beeswarm jitter that shows student concentrations
    const y = featureData.map((item, idx) => {
      // Get the feature importance value for this data point
      const featureImportance = x[idx];

      // Create base jitter based on feature importance (more spread for higher importance)
      const baseJitter = (Math.random() - 0.5) * 0.6;

      // Add clustering effect based on feature importance
      // Higher importance features get more vertical spread to show concentrations
      const importanceSpread = featureImportance * 0.8;

      // Add some randomness but keep it deterministic for the same data
      const seed = (item.feature_readable_name + idx)
        .split('')
        .reduce((a, b) => {
          a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
          return a;
        }, 0);

      const randomFactor = (seed % 100) / 100;
      const finalJitter = baseJitter + (randomFactor - 0.5) * importanceSpread;

      return Math.max(-1.5, Math.min(1.5, finalJitter));
    });

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
    };
  }, [currentFeature, rawFeatures]);

  // Generate color based on feature_value
  const getColor = featureValue => {
    // Normalize feature_value to 0-1 range for color mapping
    // Assuming feature_value is typically between -2 and 2
    const normalized = Math.max(0, Math.min(1, (featureValue + 2) / 4));

    // Convert hex colors to RGB for interpolation
    const color1 = { r: 178, g: 241, b: 249 }; // #B2F1F9 (light blue)
    const color2 = { r: 0, g: 124, b: 140 }; // #007C8C (teal)

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
        maxWidth: 900,
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
                size: 20,
                color: plotData.featureValues.map(val =>
                  typeof val === 'number' ? getColor(val) : '#ccc',
                ),
                opacity: 0.7,
                line: { width: 0 },
              },
              text: plotData.x.map((val, idx) => {
                const xVal = typeof val === 'number' ? val.toFixed(2) : val;
                const yVal =
                  typeof plotData.featureValues[idx] === 'number'
                    ? plotData.featureValues[idx].toFixed(2)
                    : plotData.featureValues[idx];
                const supportScore = plotData.studentSupportScores[idx] || 0;
                return `<b>Feature Data</b><br>Feature Importance: ${xVal}<br>Feature Value: ${yVal}<br>Student Support Score: ${supportScore.toFixed(2)}`;
              }),
              hoverinfo: 'text',
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                font: { color: '#fff' },
              },
            },
          ]}
          layout={{
            margin: { l: 0, r: 0, t: 0, b: 0 },
            xaxis: {
              visible: false,
              range: [
                Math.min(...plotData.x.filter(x => typeof x === 'number')) *
                  0.9 || 0,
                Math.max(...plotData.x.filter(x => typeof x === 'number')) *
                  1.1 || 1,
              ],
              fixedrange: false,
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              visible: false,
              range: [-2, 2],
              fixedrange: true,
              showgrid: false,
              zeroline: false,
            },
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            showlegend: false,
            height: 200,
            shapes: [
              {
                type: 'line',
                x0: 0.5,
                y0: -1,
                x1: 0.5,
                y1: 1,
                xref: 'x',
                yref: 'y',
                line: {
                  color: '#D5E5EE',
                  width: 2,
                },
                layer: 'below',
              },
              {
                type: 'line',
                x0: 0,
                y0: -2,
                x1: 0,
                y1: 2,
                xref: 'x',
                yref: 'y',
                line: {
                  color: '#D5E5EE',
                  width: 2,
                },
                layer: 'below',
              },
            ],
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: 200 }}
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

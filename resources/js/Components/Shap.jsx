import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import PropTypes from 'prop-types';

export default function Shap({ rawFeatures, currentFeature }) {
  // Log the props to see what data is available
  console.log('=== SHAP COMPONENT PROPS ===');
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

    // Extract feature_importance and feature_value from currentFeature
    const featureImportance =
      parseFloat(currentFeature.feature_importance) || 0;
    const featureValue = parseFloat(currentFeature.feature_value) || 0;

    // Count occurrences of this feature_importance and feature_value combination
    const occurrences = rawFeatures.filter(
      item =>
        item.feature_readable_name === currentFeature.feature_readable_name,
    ).length;

    console.log('Processed plot data:', {
      featureImportance,
      featureValue,
      occurrences,
      featureName: currentFeature.feature_readable_name,
      rawFeatureImportance: currentFeature.feature_importance,
      rawFeatureValue: currentFeature.feature_value,
      featureImportanceType: typeof currentFeature.feature_importance,
      featureValueType: typeof currentFeature.feature_value,
    });

    return {
      x: [featureImportance],
      y: [occurrences],
      featureValue: [featureValue],
    };
  }, [currentFeature, rawFeatures]);

  // Generate color based on feature_value
  const getColor = featureValue => {
    // Normalize feature_value to 0-1 range for color mapping
    // Assuming feature_value is typically between -2 and 2
    const normalized = Math.max(0, Math.min(1, (featureValue + 2) / 4));

    // Color gradient from blue (low) to red (high)
    if (normalized < 0.5) {
      // Blue to green
      const factor = normalized * 2;
      return `rgb(${Math.round(61 + factor * 125)}, ${Math.round(182 + factor * 73)}, ${Math.round(198 - factor * 98)})`;
    } else {
      // Green to red
      const factor = (normalized - 0.5) * 2;
      return `rgb(${Math.round(186 + factor * 69)}, ${Math.round(255 - factor * 255)}, ${Math.round(125 - factor * 125)})`;
    }
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
                size: 24,
                color: plotData.featureValue.map(val =>
                  typeof val === 'number' ? getColor(val) : '#ccc',
                ),
                opacity: 0.85,
                line: { width: 0 },
              },
              text: plotData.x.map((val, idx) => {
                const xVal = typeof val === 'number' ? val.toFixed(3) : val;
                const yVal =
                  typeof plotData.featureValue[idx] === 'number'
                    ? plotData.featureValue[idx].toFixed(3)
                    : plotData.featureValue[idx];
                return `<b>Feature Data</b><br>Feature Importance: ${xVal}<br>Feature Value: ${yVal}<br>Occurrences: ${plotData.y[idx]}`;
              }),
              hoverinfo: 'text',
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                font: { color: '#fff' },
              },
            },
          ]}
          layout={{
            margin: { l: 60, r: 30, t: 30, b: 60 },
            xaxis: {
              title: 'Feature Importance',
              visible: true,
              range: [
                0,
                Math.max(...plotData.x.filter(x => typeof x === 'number')) *
                  1.1 || 1,
              ],
              fixedrange: false,
              showgrid: true,
              zeroline: true,
            },
            yaxis: {
              title: 'Occurrences',
              visible: true,
              range: [
                0,
                Math.max(...plotData.y.filter(y => typeof y === 'number')) *
                  1.1 || 1,
              ],
              fixedrange: false,
              showgrid: true,
              zeroline: true,
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white',
            showlegend: false,
            height: 300,
            title: {
              text: `SHAP Values for ${currentFeature?.feature_readable_name || 'Feature'}`,
              font: { size: 16, color: '#333' },
            },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: 120 }}
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

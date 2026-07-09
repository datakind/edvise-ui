import React, { useMemo } from 'react';
import Plot from '@/utils/reactPlotly';
import PropTypes from 'prop-types';
import {
  computeGlobalShapRange,
  computeGlobalYRange,
  parseShapValue,
} from '@/utils/shapChartUtils';

function beeswarmYValuesForFeature(featureData, x) {
  const points = featureData.map((item, idx) => ({
    x: x[idx],
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

  points.sort((a, b) => a.originalIdx - b.originalIdx);
  return points.map(point => Math.max(-0.8, Math.min(0.8, point.y)));
}

export default function Shap({
  rawFeatures,
  currentFeature,
  globalShapRange: globalShapRangeProp,
  globalYRange: globalYRangeProp,
}) {
  const globalShapRange = useMemo(
    () => globalShapRangeProp ?? computeGlobalShapRange(rawFeatures),
    [globalShapRangeProp, rawFeatures],
  );
  const globalYRange = useMemo(
    () => globalYRangeProp ?? computeGlobalYRange(rawFeatures),
    [globalYRangeProp, rawFeatures],
  );

  const plotData = useMemo(() => {
    if (!currentFeature || !rawFeatures) return null;

    const featureData = rawFeatures.filter(
      item =>
        item.feature_readable_name === currentFeature.feature_readable_name,
    );

    if (featureData.length === 0) {
      return null;
    }

    const x = featureData.map(item => parseShapValue(item));
    const y = beeswarmYValuesForFeature(featureData, x);
    const featureValues = featureData.map(item => {
      if ('feature_value' in item) return parseFloat(item.feature_value) || 0;
      if ('value' in item) return parseFloat(item.value) || 0;
      if ('shap_value' in item) return parseFloat(item.shap_value) || 0;
      return 0;
    });
    const studentSupportScores = featureData.map(item => {
      if ('support_score' in item) return parseFloat(item.support_score) || 0;
      if ('student_support_score' in item)
        return parseFloat(item.student_support_score) || 0;
      return 0;
    });

    return {
      x,
      y,
      featureValues,
      studentSupportScores,
      dataType: currentFeature?.data_type || '',
    };
  }, [currentFeature, rawFeatures]);

  const getColor = (featureValue, allValues) => {
    const minVal = Math.min(...allValues.filter(v => typeof v === 'number'));
    const maxVal = Math.max(...allValues.filter(v => typeof v === 'number'));
    const normalized =
      maxVal === minVal
        ? 0.5
        : Math.max(0, Math.min(1, (featureValue - minVal) / (maxVal - minVal)));
    const color1 = { r: 178, g: 241, b: 249 };
    const color2 = { r: 0, g: 124, b: 140 };
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
                color:
                  plotData.dataType === 'Categorical'
                    ? '#808080'
                    : plotData.featureValues.map(val =>
                        typeof val === 'number'
                          ? getColor(val, plotData.featureValues)
                          : '#ccc',
                      ),
                opacity: 1.0,
                line: {
                  width: 0.5,
                  color: 'rgba(255, 255, 255, 0.3)',
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

                if (plotData.dataType !== 'Categorical') {
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
  globalShapRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }),
  globalYRange: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }),
};

Shap.defaultProps = {
  rawFeatures: [],
  currentFeature: null,
  globalShapRange: null,
  globalYRange: null,
};

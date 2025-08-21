import React from 'react';
import Plot from 'react-plotly.js';

// Generate placeholder data for a beeswarm/dot plot
const N = 120;
const x = Array.from({ length: N }, () => 0.2 + 0.6 * Math.random());
const y = Array.from({ length: N }, () => (Math.random() - 0.5) * 1.5); // jitter vertically
const supportScores = Array.from({ length: N }, () => Math.random()); // Support scores between 0-1
const colors = x.map(val =>
  val < 0.35 ? '#7ED6E8' : val < 0.5 ? '#3DB6C6' : '#2A8CA5',
);

export default function Shap() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        margin: 'auto',
        background: 'transparent',
      }}
    >
      <Plot
        data={[
          {
            x,
            y,
            mode: 'markers',
            type: 'scatter',
            marker: {
              size: 24,
              color: colors,
              opacity: 0.85,
              line: { width: 0 },
            },
            text: x.map(
              (val, idx) =>
                `<b>Student Data</b><br>Feature Importance: ${val.toFixed(1)}<br>Feature Value: ${y[idx].toFixed(1)}<br>Support Score: ${supportScores[idx].toFixed(1)}`,
            ),
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
            range: [0, 1],
            fixedrange: true,
          },
          yaxis: {
            visible: false,
            range: [-2, 2],
            fixedrange: true,
          },
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)',
          showlegend: false,
          height: 120,
          shapes: [
            {
              type: 'line',
              x0: 0.5,
              y0: -2,
              x1: 0.5,
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
        style={{ width: '100%', height: 120 }}
      />
    </div>
  );
}

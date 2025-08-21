import React from 'react';
import Plot from 'react-plotly.js';

export default function BoxWhiskerPlot({
  data,
  color = '#7ED6E8',
  borderColor = '#1796A5',
}) {
  // Placeholder data if none provided
  const plotData = data || [
    1.2, 1.5, 2.1, 2.3, 2.7, 2.9, 3.1, 3.2, 3.5, 3.8, 4.0,
  ];
  return (
    <Plot
      data={[
        {
          x: plotData,
          type: 'box',
          orientation: 'h',
          boxpoints: false,
          fillcolor: color,
          marker: { color: borderColor },
          line: { color: borderColor, width: 3 },
          whiskerwidth: 0.8,
          width: 0.5,
          hoverinfo: 'none',
          hoverlabel: { enabled: false },
        },
      ]}
      layout={{
        margin: { l: 30, r: 30, t: 20, b: 30 },
        height: 80,
        xaxis: {
          range: [0, 4],
          tickvals: [0, 1, 2, 3, 4],
          tickformat: '.2f',
          tickfont: { size: 12, color: '#222' },
          showgrid: false,
          zeroline: false,
        },
        yaxis: {
          visible: false,
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: '#EEF2F680',
        showlegend: false,
        hovermode: 'closest',
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: 80 }}
    />
  );
}

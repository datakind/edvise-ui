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

  // Calculate statistics dynamically
  const sortedData = [...plotData].sort((a, b) => a - b);
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];
  const median = sortedData[Math.floor(sortedData.length * 0.5)];

  return (
    <div className="relative">
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
          margin: { l: 30, r: 30, t: 50, b: 30 },
          height: 120,
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
        style={{ width: '100%', height: 120 }}
      />

      {/* Static Labels positioned above the plot */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        {/* Minimum Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${(min / 4) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {min.toFixed(2)} Minimum
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Median Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${(median / 4) * 92}% + 30px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {median.toFixed(2)} Median
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Maximum Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${(max / 4) * 92}% + 30px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {max.toFixed(2)} Maximum
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>
      </div>
    </div>
  );
}

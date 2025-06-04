import React from 'react';
import Plot from 'react-plotly.js';

const placeholderData = Array.from(
  { length: 500 },
  () => 0.15 + 0.7 * Math.random(),
);

export default function SupportScores() {
  return (
    <div className="mt-6 rounded-3xl bg-white p-8 shadow">
      <h2 className="pb-4 text-2xl font-light">
        Distribution of Support Scores for Test Data
      </h2>
      <div className="text-base text-black">
        This chart provides the distribution of student support scores in the
        test dataset. You can use this plot for reference, to see how the
        distribution has changed from your original dataset to your{' '}
        <b>
          <a
            href="#"
            style={{
              color: '#222',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            latest model results
          </a>
        </b>
        .
      </div>
      <Plot
        data={[
          {
            x: placeholderData,
            type: 'histogram',
            xbins: { start: 0.1, end: 0.9, size: 0.1 },
            marker: {
              color: 'rgba(247,146,34,1)',
              line: { color: 'rgba(247,146,34,1)', width: 2 },
              pattern: { shape: '' },
              opacity: 0.7,
              gradient: 'vertical',
            },
            autobinx: false,
            hoverinfo: 'x+y',
            name: 'Support Score',
          },
        ]}
        layout={{
          margin: { l: 60, r: 30, t: 10, b: 60 },
          xaxis: {
            title: {
              text: 'Support Score',
              font: { size: 18, family: 'inherit', color: '#222' },
            },
            range: [0.1, 0.9],
            tickfont: { size: 16, color: '#222' },
            showgrid: false,
            zeroline: false,
          },
          yaxis: {
            title: {
              text: '# of Students',
              font: { size: 18, family: 'inherit', color: '#222' },
            },
            tickfont: { size: 16, color: '#222' },
            showgrid: false,
            zeroline: false,
          },
          showlegend: false,
          plot_bgcolor: '#fff',
          paper_bgcolor: '#fff',
          shapes: [],
          annotations: [],
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: 440 }}
      />
    </div>
  );
}

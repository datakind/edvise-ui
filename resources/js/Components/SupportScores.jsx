import React from 'react';
import Plot from 'react-plotly.js';

const inferenceData = [
  {
    bin_lower: '0.8',
    bin_upper: '0.9',
    support_score: '0.85',
    count_of_students: '47',
    pct: '6.71',
  },
  {
    bin_lower: '0.9',
    bin_upper: '1.0',
    support_score: '0.95',
    count_of_students: '19',
    pct: '2.71',
  },
  {
    bin_lower: '0.2',
    bin_upper: '0.3',
    support_score: '0.25',
    count_of_students: '91',
    pct: '13.0',
  },
  {
    bin_lower: '0.5',
    bin_upper: '0.6',
    support_score: '0.55',
    count_of_students: '102',
    pct: '14.57',
  },
  {
    bin_lower: '0.7',
    bin_upper: '0.8',
    support_score: '0.75',
    count_of_students: '68',
    pct: '9.71',
  },
  {
    bin_lower: '0.1',
    bin_upper: '0.2',
    support_score: '0.15',
    count_of_students: '40',
    pct: '5.71',
  },
  {
    bin_lower: '0.3',
    bin_upper: '0.4',
    support_score: '0.35',
    count_of_students: '130',
    pct: '18.57',
  },
  {
    bin_lower: '0.4',
    bin_upper: '0.5',
    support_score: '0.45',
    count_of_students: '128',
    pct: '18.29',
  },
  {
    bin_lower: '0.6',
    bin_upper: '0.7',
    support_score: '0.65',
    count_of_students: '75',
    pct: '10.71',
  },
];

export default function SupportScores({ setTab }) {
  // Sort inferenceData by bin_lower to ensure proper ordering
  const sortedData = [...inferenceData].sort(
    (a, b) => parseFloat(a.bin_lower) - parseFloat(b.bin_lower),
  );

  // Extract x and y values from inferenceData, centering bars on bin midpoints
  const xValues = sortedData.map(
    item =>
      parseFloat(item.bin_lower) +
      (parseFloat(item.bin_upper) - parseFloat(item.bin_lower)) / 2,
  );
  const yValues = sortedData.map(item => parseInt(item.count_of_students));

  // Create color array based on the number of bins
  const colors = sortedData.map((_, i) => {
    const position = (i / (sortedData.length - 1)) * 0.8 + 0.1; // Map 0-1 to 0.1-0.9
    return `rgb(${Math.round(
      245 + ((position - 0.1) / 0.8) * (247 - 245),
    )}, ${Math.round(
      202 + ((position - 0.1) / 0.8) * (145 - 202),
    )}, ${Math.round(158 + ((position - 0.1) / 0.8) * (34 - 158))})`;
  });

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
            onClick={() => setTab('results')}
            className="font-semibold text-[#222] underline"
          >
            latest model results
          </a>
        </b>
        .
      </div>
      <Plot
        data={[
          {
            x: xValues,
            y: yValues,
            type: 'bar',
            width: 0.1,
            marker: {
              color: colors,
              line: { color: 'rgba(247,146,34,1)', width: 0 },
              pattern: { shape: '' },
              opacity: 0.7,
            },
            hoverinfo: 'skip',
            hovertemplate:
              '<span style="font-weight:bold;font-size:16px">%{y}</span> students have a<br>support score of <span style="font-weight:bold;font-size:16px">%{x}</span><extra></extra>',
            name: 'Support Score',
          },
        ]}
        layout={{
          margin: { l: 80, r: 30, t: 10, b: 60 },
          hoverlabel: {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            font: {
              color: 'white',
              size: 16,
            },
            align: 'center',
          },
          xaxis: {
            title: {
              text: 'Support Score',
              font: { size: 18, family: 'inherit', color: '#222' },
            },
            range: [0.05, 0.95],
            tickfont: { size: 16, color: '#222' },
            showgrid: false,
            zeroline: false,
          },
          yaxis: {
            title: {
              text: '# of Students',
              font: { size: 18, family: 'inherit', color: '#222' },
            },
            range: [0, Math.max(...yValues) * 1.1],
            tickfont: { size: 16, color: '#222' },
            showgrid: false,
            zeroline: false,
          },
          showlegend: false,
          plot_bgcolor: '#fff',
          paper_bgcolor: '#fff',
          shapes: [
            {
              type: 'line',
              x0: 0.0,
              y0: 0,
              x1: 1,
              y1: 0,
              line: {
                color: '#80868B',
                width: 3,
              },
            },
            ...sortedData.map(item => ({
              type: 'line',
              x0: parseFloat(item.bin_lower),
              y0: parseInt(item.count_of_students),
              x1: parseFloat(item.bin_upper),
              y1: parseInt(item.count_of_students),
              line: {
                color: '#F79122',
                width: 3,
              },
            })),
          ],
          annotations: [],
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{
          width: '100%',
          height: 440,
          '.js-plotly-plot .plotly .hoverlayer .hover': {
            maxWidth: '75px !important',
          },
        }}
      />
    </div>
  );
}

import React from 'react';
import Plot from 'react-plotly.js';

const placeholderData = Array.from(
  { length: 500 },
  () => 0.15 + 0.7 * Math.random(),
);

export default function SupportScores({ tab, setTab }) {
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
            x: placeholderData,
            type: 'histogram',
            xbins: { start: 0.1, end: 0.9, size: 0.1 },
            marker: {
              color: Array.from({ length: 8 }, (_, i) => {
                const position = (i / 7) * 0.8 + 0.1; // Map 0-1 to 0.1-0.9
                return `rgb(${Math.round(
                  245 + ((position - 0.1) / 0.8) * (247 - 245),
                )}, ${Math.round(
                  202 + ((position - 0.1) / 0.8) * (146 - 202),
                )}, ${Math.round(
                  158 + ((position - 0.1) / 0.8) * (34 - 158),
                )})`;
              }),
              line: { color: 'rgba(247,146,34,1)', width: 0 },
              pattern: { shape: '' },
              opacity: 0.7,
              gradient: 'horizontal',
            },
            autobinx: false,
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
            range: [0, 100],
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
            ...Array.from({ length: 8 }, (_, i) => ({
              type: 'line',
              x0: 0.1 + i * 0.1,
              y0: placeholderData.filter(
                x => x >= 0.1 + i * 0.1 && x < 0.2 + i * 0.1,
              ).length,
              x1: 0.2 + i * 0.1,
              y1: placeholderData.filter(
                x => x >= 0.1 + i * 0.1 && x < 0.2 + i * 0.1,
              ).length,
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

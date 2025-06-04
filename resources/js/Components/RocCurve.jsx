import React from 'react';
import Plot from 'react-plotly.js';

// Placeholder ROC curve data
const fpr = [
  0, 0.05, 0.1, 0.13, 0.18, 0.22, 0.28, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
];
const tpr = [
  0, 0.2, 0.35, 0.45, 0.6, 0.7, 0.8, 0.85, 0.9, 0.93, 0.96, 0.98, 0.99, 1, 1,
];

export default function RocCurve() {
  return (
    <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
      <div
        style={{
          flex: 1,
          minWidth: 320,
          maxWidth: 420,
          marginRight: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h2
          style={{
            fontWeight: 400,
            fontSize: 38,
            marginBottom: 8,
            letterSpacing: -1,
          }}
        >
          ROC Curve for
          <br />
          Test Data
        </h2>
        <ul
          style={{
            color: '#222',
            fontSize: 18,
            fontWeight: 400,
            marginLeft: 24,
            marginBottom: 0,
            paddingLeft: 0,
            listStyle: 'disc',
          }}
        >
          <li style={{ marginBottom: 12 }}>
            A Receiver Operating Characteristic Curve (ROC) assesses how well
            the model distinguishes between students who need support and those
            who do not.
          </li>
          <li style={{ marginBottom: 12 }}>
            The closer the curve hugs the top-left corner, the <b>better</b> the
            model is at separating the two groups.
          </li>
          <li>
            This ROC curve shows the results for a subset of the original data
            you provided that was not used to train the model. More details on
            the test dataset are available in the{' '}
            <b>
              <a
                href="#"
                style={{
                  color: '#222',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                model card
              </a>
            </b>
            .
          </li>
        </ul>
      </div>
      <div style={{ flex: 2, minWidth: 0 }}>
        <Plot
          data={[
            // ROC curve
            {
              x: fpr,
              y: tpr,
              mode: 'lines',
              line: { color: 'rgba(247,146,34,1)', width: 4, shape: 'hv' },
              name: 'ROC Curve',
              hoverinfo: 'none',
            },
            // Diagonal reference
            {
              x: [0, 1],
              y: [0, 1],
              mode: 'lines',
              line: { color: '#888', width: 2, dash: 'dash' },
              name: 'Random',
              hoverinfo: 'none',
              showlegend: false,
            },
          ]}
          layout={{
            margin: { l: 60, r: 30, t: 10, b: 60 },
            xaxis: {
              title: {
                text: 'False Positive Rate',
                font: { size: 18, family: 'inherit', color: '#222' },
              },
              range: [0, 1],
              tickfont: { size: 16, color: '#222' },
              showgrid: false,
              zeroline: false,
            },
            yaxis: {
              title: {
                text: 'True Positive Rate',
                font: { size: 18, family: 'inherit', color: '#222' },
              },
              range: [0, 1],
              tickfont: { size: 16, color: '#222' },
              showgrid: false,
              zeroline: false,
            },
            showlegend: false,
            plot_bgcolor: '#f7f8fa',
            paper_bgcolor: '#f7f8fa',
            shapes: [],
            annotations: [],
            height: 480,
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: '100%', height: 480 }}
        />
      </div>
    </div>
  );
}

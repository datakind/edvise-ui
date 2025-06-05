import React from 'react';
import Plot from 'react-plotly.js';

const placeholderData = Array.from(
  { length: 1000 },
  () => 0.1 + 0.7 * Math.random(),
);

export default function SupportOverview() {
  // Histogram bins and counts (placeholder)
  const bins = Array.from({ length: 30 }, (_, i) => 0.1 + (0.7 / 30) * i);
  const counts = Array(30).fill(0);
  placeholderData.forEach(val => {
    const idx = Math.min(Math.floor((val - 0.1) / (0.7 / 30)), 29);
    counts[idx]++;
  });

  return (
    <div className="mt-6 rounded-3xl bg-white p-8 shadow">
      <h2 className="text-2xl font-light">
        Support Overview - How Many Total Students May Need Extra Support?
      </h2>
      <div className="my-8 text-base text-black">
        The following graph shows the distribution of support scores for the
        most recent student data uploaded. The higher the support score the more
        likely these students are in need of extra support. See{' '}
        <span className="font-semibold underline">About this Model</span> to
        learn more.
      </div>
      <div className="flex items-start gap-8">
        {/* At a Glance */}
        <div className="min-w-[200px]">
          <div className="mb-4 text-sm font-bold text-[#1E343F]">
            At a Glance
          </div>
          <div className="mb-4 rounded-lg bg-[#D5E5EE] p-6 text-center">
            <div className="text-5xl font-medium text-[#1E343F]">504</div>
            <div className="mt-2 text-sm text-[#1E343F]">
              Students fall into the <b>higher support</b> category
            </div>
          </div>
          <div className="rounded-lg bg-[#D5E5EE] p-6 text-center">
            <div className="text-5xl font-medium text-[#1E343F]">7,304</div>
            <div className="mt-2 text-sm text-[#1E343F]">
              Students fall into the <b>lower support</b> category
            </div>
          </div>
        </div>
        {/* Histogram */}
        <div className="min-w-0 flex-1">
          <Plot
            data={[
              {
                x: placeholderData,
                type: 'histogram',
                xbins: { start: 0.1, end: 0.8, size: 0.7 / 30 },
                marker: {
                  color: 'rgba(247,146,34,1)',
                  line: { color: 'rgba(247,146,34,1)', width: 1 },
                  pattern: { shape: '' },
                  opacity: 0.7,
                },
                autobinx: false,
                hoverinfo: 'x+y',
                name: 'Support Score',
              },
              // Vertical line annotation as a scatter
              {
                x: [0.5, 0.5],
                y: [0, 200],
                mode: 'lines',
                line: { color: '#888', width: 2, dash: 'dot' },
                hoverinfo: 'none',
                showlegend: false,
              },
            ]}
            layout={{
              margin: { l: 60, r: 30, t: 10, b: 60 },
              xaxis: {
                title: {
                  text: 'Support Score',
                  font: { size: 16, family: 'inherit', color: '#4B5B6B' },
                },
                range: [0.1, 0.8],
                tickfont: { size: 16, color: '#4B5B6B' },
                showgrid: false,
              },
              yaxis: {
                title: {
                  text: '# of Students',
                  font: { size: 16, family: 'inherit', color: '#4B5B6B' },
                },
                tickfont: { size: 16, color: '#4B5B6B' },
                showgrid: false,
              },
              showlegend: false,
              plot_bgcolor: '#fff',
              paper_bgcolor: '#fff',
              shapes: [],
              annotations: [
                {
                  x: 0.7,
                  y: 200,
                  xref: 'x',
                  yref: 'y',
                  text: 'Students in greater<br>need of support',
                  showarrow: true,
                  arrowhead: 3,
                  ax: -100,
                  ay: 0,
                  font: { size: 14, color: '#5F6368' },
                  align: 'left',
                },
              ],
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: 400 }}
          />
        </div>
      </div>
    </div>
  );
}

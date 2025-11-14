import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import H2 from '@/Components/H2';

// Mock data for fallback
const mockInferenceData = [
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

export default function SupportOverview({ tab, setTab, run_id, inst_id }) {
  // Only use mock data as initial state in local development
  const isLocalDev =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === 'sst-app-ui.test';
  const [inferenceData, setInferenceData] = useState(
    isLocalDev ? mockInferenceData : [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupportOverview = async () => {
      console.log('SupportOverview - run_id:', run_id);
      console.log('SupportOverview - inst_id:', inst_id);

      if (!run_id || !inst_id) {
        console.log(
          'SupportOverview - Missing required parameters, skipping API call',
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the same pattern as fetchRunDetails: /institutions/{inst_id}/inference/support-overview/{run_id}
        const apiUrl = `/institutions/${inst_id}/inference/support-overview/${run_id}`;
        console.log('SupportOverview - Making API call to:', apiUrl);
        console.log(
          'SupportOverview - Full URL:',
          window.location.origin + apiUrl,
        );
        const response = await axios.get(apiUrl);
        console.log('SupportOverview - API response:', response.data);
        setInferenceData(response.data);
        setError(null);
      } catch (err) {
        console.error(
          'SupportOverview - Error fetching support overview:',
          err,
        );
        console.error('SupportOverview - Error response:', err.response?.data);
        setError('Failed to load support overview data');

        // Only use mock data in local development
        if (
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname === 'sst-app-ui.test'
        ) {
          setInferenceData(mockInferenceData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSupportOverview();
  }, [run_id, inst_id]);

  const highSupport = inferenceData
    .filter(item => parseFloat(item.support_score) >= 0.5)
    .reduce((sum, item) => sum + parseInt(item.count_of_students), 0);
  const lowSupport = inferenceData
    .filter(item => parseFloat(item.support_score) < 0.5)
    .reduce((sum, item) => sum + parseInt(item.count_of_students), 0);

  const yRange =
    Math.ceil(
      Math.max(...inferenceData.map(item => parseInt(item.count_of_students))) /
        10,
    ) * 10;

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">
            Loading support overview data...
          </div>
        </div>
      </div>
    );
  }

  // Show error state (only in non-local environments)
  if (error && !isLocalDev) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Show empty state if no data available
  if (!inferenceData || inferenceData.length === 0) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">
            No support overview data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-3xl bg-white p-8 shadow">
      <H2>
        Support Overview - How Many Total Students May Need Extra Support?
      </H2>
      <div className="my-8 text-base text-black">
        The following graph shows the distribution of support scores for the
        most recent student data uploaded. The higher the support score the more
        likely these students are in need of extra support. See{' '}
        <a
          href="#"
          onClick={() => setTab('about')}
          className="font-semibold text-[#222] underline"
        >
          About this Model
        </a>{' '}
        to learn more.
      </div>
      <div className="flex items-start gap-8">
        {/* At a Glance */}
        <div className="min-w-[200px]">
          <div className="mb-4 text-sm font-bold text-[#1E343F]">
            At a Glance
          </div>
          <div className="mb-4 rounded-lg bg-[#D5E5EE] p-6 text-center">
            <div className="font-[merriweather] text-5xl font-medium text-[#1E343F]">
              {highSupport}
            </div>
            <div className="mt-2 text-sm text-[#1E343F]">
              Students fall into the <b>higher support</b> category
            </div>
          </div>
          <div className="rounded-lg bg-[#D5E5EE] p-6 text-center">
            <div className="font-[merriweather] text-5xl font-medium text-[#1E343F]">
              {lowSupport}
            </div>
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
                x: inferenceData.map(item => item.support_score),
                y: inferenceData.map(item => item.count_of_students),
                customdata: inferenceData.map(item => [
                  item.bin_lower,
                  item.bin_upper,
                ]),
                type: 'bar',
                marker: {
                  color: inferenceData.map(item => item.support_score),
                  colorscale: [
                    [0, '#F9F0E8'],
                    [1, '#F79222'],
                  ],
                  showscale: false,
                },
                hoverinfo: 'skip',
                hovertemplate:
                  '<span style="font-weight:bold;font-size:16px">%{y}</span> students have a support score between <span style="font-weight:bold;font-size:16px">%{customdata[0]}</span> and <span style="font-weight:bold;font-size:16px">%{customdata[1]}</span><extra></extra>',
                name: 'Support Score',
              },
              {
                x: [0.5, 0.5],
                y: [0, yRange * 1.05],
                type: 'scatter',
                mode: 'lines',
                line: {
                  color: '#1E343F',
                  width: 1,
                  dash: 'dash',
                },
                hoverinfo: 'skip',
                showlegend: false,
              },
            ]}
            layout={{
              margin: { l: 60, r: 30, t: 30, b: 60 },
              xaxis: {
                title: {
                  text: 'Support Score',
                  font: { size: 18, family: 'inherit', color: '#637381' },
                  standoff: 20,
                },
                range: [0, 1],
                fixedrange: true,
                tickfont: { size: 16, family: 'inherit', color: '#637381' },
                ticks: '',
                tickpad: 10,
                showgrid: false,
                zeroline: false,
              },
              yaxis: {
                title: {
                  text: 'Count of Students',
                  font: { size: 18, family: 'inherit', color: '#637381' },
                  standoff: 20,
                },
                range: [0, yRange * 1.05],
                fixedrange: true,
                tickfont: { size: 16, family: 'inherit', color: '#637381' },
                ticks: '',
                tickpad: 10,
                showgrid: false,
                zeroline: false,
              },
              showlegend: false,
              dragmode: false,
              plot_bgcolor: '#fff',
              paper_bgcolor: '#fff',
              bargap: 0,
              shapes: [
                {
                  type: 'line',
                  x0: 0,
                  y0: 0,
                  x1: 1,
                  y1: 0,
                  line: {
                    color: '#80868B',
                    width: 3,
                  },
                },
                ...inferenceData.map(item => ({
                  type: 'line',
                  x0: parseFloat(item.bin_lower),
                  y0: parseInt(item.count_of_students),
                  x1: parseFloat(item.bin_upper),
                  y1: parseInt(item.count_of_students),
                  line: {
                    color: '#F79222',
                    width: 3,
                  },
                })),
              ],
              annotations: [
                {
                  x: 0.7,
                  y:
                    (Math.max(
                      ...inferenceData.map(item => item.count_of_students),
                    ) + 10) * 1.05,
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
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                font: {
                  color: 'white',
                  size: 16,
                },
                align: 'center',
                bordercolor: 'transparent',
              },
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: '100%', height: 440 }}
          />
        </div>
      </div>
    </div>
  );
}

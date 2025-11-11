import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function SupportScores({ setTab, model_run_id, inst_id }) {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch support scores data when model_run_id and inst_id are available
  useEffect(() => {
    const fetchSupportScores = async () => {
      if (!model_run_id || !inst_id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch support scores data
        const response = await axios.get(
          `/institutions/${inst_id}/training/support-overview/${model_run_id}`,
        );

        if (response.data) {
          setSupportData(response.data);
        }
      } catch (error) {
        console.error('Error fetching support scores data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        setError(
          `Failed to load support scores data: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSupportScores();
  }, [model_run_id, inst_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            Loading support scores data...
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!supportData || supportData.length === 0) {
    return (
      <div className="mt-6 rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            No support scores data available
          </div>
        </div>
      </div>
    );
  }

  // Sort supportData by bin_lower to ensure proper ordering
  const sortedData = [...supportData].sort(
    (a, b) => parseFloat(a.bin_lower) - parseFloat(b.bin_lower),
  );

  // Extract x and y values from supportData, centering bars on bin midpoints
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
            customdata: sortedData.map(item => [
              item.bin_lower,
              item.bin_upper,
            ]),
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
              '<span style="font-weight:bold;font-size:16px">%{y}</span> students have a support score between <span style="font-weight:bold;font-size:16px">%{customdata[0]}</span> and <span style="font-weight:bold;font-size:16px">%{customdata[1]}</span><extra></extra>',
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

SupportScores.propTypes = {
  setTab: PropTypes.func.isRequired,
  model_run_id: PropTypes.string,
};

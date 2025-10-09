import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function RocCurve({ model_run_id, modelName }) {
  const [rocData, setRocData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inst_id, setInstId] = useState(null);

  // Fetch ROC curve data when model_run_id is available
  useEffect(() => {
    const fetchRocCurve = async () => {
      if (!model_run_id) return;

      setLoading(true);
      setError(null);

      try {
        // Get the current user's institution ID
        const instResponse = await axios.get('/user-current-inst-api');
        if (instResponse.data && instResponse.data.length > 0) {
          const inst_id = instResponse.data[0];
          setInstId(inst_id);

          // Fetch ROC curve data
          const response = await axios.get(
            `/institutions/${inst_id}/training/roc_curve/${model_run_id}`,
          );

          if (response.data) {
            setRocData(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching ROC curve data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        setError(
          `Failed to load ROC curve data: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRocCurve();
  }, [model_run_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">Loading ROC curve data...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!rocData || rocData.length === 0) {
    return (
      <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            No ROC curve data available
          </div>
        </div>
      </div>
    );
  }

  // Sort the API data
  const sortedRocData = [...rocData].sort(
    (a, b) => Number(a.threshold) - Number(b.threshold),
  );
  return (
    <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
      <div className="mr-8 flex min-w-[320px] max-w-[420px] flex-1 flex-col justify-start">
        <h2 className="pb-4 text-2xl font-light">ROC Curve for Test Data</h2>
        <ul className="list-disc pl-6 text-base text-black">
          <li className="mb-4">
            A Receiver Operating Characteristic Curve (ROC) assesses how well
            the model distinguishes between students who need support and those
            who do not.
          </li>
          <li className="mb-4">
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
                onClick={e => {
                  e.preventDefault();
                  if (inst_id && modelName) {
                    const apiUrl = `/institutions/${inst_id}/training/model-cards/${modelName}`;
                    console.log('Downloading model card from:', apiUrl);
                    // Create a temporary link element to force download
                    const link = document.createElement('a');
                    link.href = apiUrl;
                    link.download = `${modelName}_model_card.pdf`; // Suggest filename
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    console.error(
                      'Missing inst_id or modelName for model card download',
                      { inst_id, modelName },
                    );
                  }
                }}
                className="cursor-pointer font-semibold text-[#222] underline hover:opacity-80"
              >
                model card
              </a>
            </b>
            .
          </li>
        </ul>
      </div>
      <div className="flex min-w-0">
        <Plot
          data={[
            // ROC curve
            {
              x: sortedRocData.map(d => Number(d.false_positive_rate)),
              y: sortedRocData.map(d => Number(d.true_positive_rate)),
              mode: 'lines+markers',
              line: { color: '#F79122', width: 4 },
              hoverinfo: 'text',
              hoverlabel: {
                bgcolor: 'rgba(0,0,0,0.8)',
                font: { color: '#fff' },
              },
              text: sortedRocData.map(
                d =>
                  `True Positive Rate: ${d.true_positive_rate}<br>False Positive Rate: ${d.false_positive_rate}<br>Threshold: ${d.threshold}`,
              ),
              marker: { size: 6 },
              name: 'ROC Curve',
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
            plot_bgcolor: '#EEF2F6',
            paper_bgcolor: '#fff',
            shapes: [
              {
                type: 'line',
                x0: 0.0,
                y0: 0,
                x1: 1,
                y1: 0,
                line: {
                  color: '#000000',
                  width: 3,
                },
              },
              {
                type: 'line',
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 1,
                line: {
                  color: '#000000',
                  width: 3,
                },
              },
            ],
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

RocCurve.propTypes = {
  model_run_id: PropTypes.string,
  modelName: PropTypes.string,
};

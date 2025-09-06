import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

export default function BoxWhiskerPlot({
  run_id,
  feature_name,
  inst_id,
  color = '#7ED6E8',
  borderColor = '#1796A5',
}) {
  const [boxplotData, setBoxplotData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch boxplot data from API
  useEffect(() => {
    const fetchBoxplotData = async () => {
      console.log('BoxWhiskerPlot useEffect triggered with:', {
        run_id,
        feature_name,
        inst_id,
        hasAllProps: !!(run_id && feature_name && inst_id),
      });

      if (!run_id || !feature_name || !inst_id) {
        console.log('BoxWhiskerPlot - Missing required props, skipping fetch');
        return;
      }

      setLoading(true);
      setError(null);
      setBoxplotData(null); // Clear previous data

      try {
        console.log('BoxWhiskerPlot - Fetching data for:', {
          run_id,
          feature_name,
          inst_id,
        });

        const response = await axios.get(
          `/institutions/${inst_id}/inference/features-boxplot-stat/${run_id}`,
          {
            params: { feature_name },
          },
        );

        console.log('BoxWhiskerPlot - API response:', response.data);

        if (response.data && response.data.length > 0) {
          console.log('BoxWhiskerPlot - Setting data:', response.data[0]);
          setBoxplotData(response.data[0]);
        } else {
          console.log('BoxWhiskerPlot - No data in response');
        }
      } catch (error) {
        console.error('Error fetching boxplot data:', error);
        setError(
          `Failed to load boxplot data: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBoxplotData();
  }, [run_id, feature_name, inst_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-gray-600">Loading boxplot data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!boxplotData) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-gray-600">No boxplot data available</div>
      </div>
    );
  }

  // Extract statistics from API response
  const min = parseFloat(boxplotData.min);
  const q1 = parseFloat(boxplotData.q_1);
  const median = parseFloat(boxplotData.median);
  const q3 = parseFloat(boxplotData.q_3);
  const max = parseFloat(boxplotData.max);
  const count = parseInt(boxplotData.count);

  // Calculate dynamic range based on actual data
  const dataRange = max - min;
  const padding = dataRange * 0.1; // 10% padding
  const xMin = Math.max(0, min - padding);
  const xMax = max + padding;

  return (
    <div className="relative">
      <Plot
        data={[
          {
            x: [min, q1, median, q3, max], // Box plot data points
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
            // Use the actual statistics for the box plot
            q1: [q1],
            median: [median],
            q3: [q3],
            lowerfence: [min],
            upperfence: [max],
          },
        ]}
        layout={{
          margin: { l: 30, r: 30, t: 50, b: 30 },
          height: 180,
          xaxis: {
            range: [xMin, xMax],
            tickformat: '.2f',
            tickfont: { size: 12, color: '#222' },
            showgrid: false,
            zeroline: false,
          },
          yaxis: {
            visible: false,
            range: [-0.5, 0.5],
          },
          plot_bgcolor: '#EEF2F680',
          paper_bgcolor: '#FFFFFF',
          showlegend: false,
          hovermode: 'closest',
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: '100%', height: 140 }}
      />

      {/* Static Labels positioned above the plot */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        {/* Minimum Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${((min - xMin) / (xMax - xMin)) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {min.toFixed(2)} Min
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Q1 Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${((q1 - xMin) / (xMax - xMin)) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {q1.toFixed(2)} Q1
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Median Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${((median - xMin) / (xMax - xMin)) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {median.toFixed(2)} Median
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Q3 Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${((q3 - xMin) / (xMax - xMin)) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {q3.toFixed(2)} Q3
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>

        {/* Maximum Label */}
        <div
          className="absolute -translate-x-1/2 transform"
          style={{
            left: `calc(${((max - xMin) / (xMax - xMin)) * 100}% + 15px)`,
            top: '8px',
          }}
        >
          <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
            {max.toFixed(2)} Max
          </div>
          <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
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
  const [hoveredLabel, setHoveredLabel] = useState(null); // 'min', 'q1', 'median', 'q3', 'max', or null
  const chartRef = useRef(null);
  const [overlayStyle, setOverlayStyle] = useState(null);

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

  // Create ECharts option configuration
  const chartOption = useMemo(() => {
    if (!boxplotData) return null;

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

    // ECharts boxplot data format: [min, Q1, median, Q3, max]
    const boxplotDataArray = [[min, q1, median, q3, max]];

    return {
      backgroundColor: '#FFFFFF',
      tooltip: {
        show: false, // Disable default tooltip, we're using custom hover labels
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '10%',
        bottom: '15%',
        containLabel: true,
        backgroundColor: '#EEF2F680',
      },
      xAxis: {
        type: 'value',
        min: xMin,
        max: xMax,
        splitNumber: 5,
        axisLabel: {
          formatter: (value) => value.toFixed(2),
          color: '#222',
          fontFamily: 'Helvetica Neue',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: [''],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'Box Plot',
          type: 'boxplot',
          data: boxplotDataArray,
          itemStyle: {
            color: '#007c8c', // Dark teal for left half
            borderColor: '#007c8c',
            borderWidth: 3,
          },
          emphasis: {
            itemStyle: {
              borderColor: '#007c8c',
              borderWidth: 3,
            },
            focus: 'self',
          },
          tooltip: {
            show: false, // Disable series tooltip
          },
        },
      ],
    };
  }, [boxplotData, color, borderColor]);

  // Calculate overlay position for light cyan right half (Median to Q3)
  // This is handled in onChartReady callback instead

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
  if (!boxplotData || !chartOption) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-gray-600">No boxplot data available</div>
      </div>
    );
  }

  // Extract statistics for hover labels
  const min = boxplotData ? parseFloat(boxplotData.min) : 0;
  const q1 = boxplotData ? parseFloat(boxplotData.q_1) : 0;
  const median = boxplotData ? parseFloat(boxplotData.median) : 0;
  const q3 = boxplotData ? parseFloat(boxplotData.q_3) : 0;
  const max = boxplotData ? parseFloat(boxplotData.max) : 0;

  // Calculate dynamic range for label positioning
  const dataRange = max - min;
  const padding = dataRange * 0.1;
  const xMin = Math.max(0, min - padding);
  const xMax = max + padding;

  // Determine which label to show based on hover position
  const getHoveredLabel = (xValue) => {
    if (!xValue) return null;

    // Calculate distances to each point and find the closest
    const distances = {
      min: Math.abs(xValue - min),
      q1: Math.abs(xValue - q1),
      median: Math.abs(xValue - median),
      q3: Math.abs(xValue - q3),
      max: Math.abs(xValue - max),
    };

    // Find the minimum distance
    const minDistance = Math.min(...Object.values(distances));

    // If too far from any point, don't show label
    const threshold = (xMax - xMin) * 0.05; // 5% of range
    if (minDistance > threshold) return null;

    // Return the label with minimum distance
    return Object.keys(distances).find(key => distances[key] === minDistance);
  };

  // Calculate label positions accounting for grid padding
  // Grid has left: 3%, right: 4%, so chart area is 93% of width
  const getLabelLeft = (value) => {
    // Calculate percentage within data range
    const dataPercent = ((value - xMin) / (xMax - xMin)) * 100;
    // Map to chart area: 3% offset + (dataPercent * 93%)
    return `calc(3% + ${dataPercent * 0.93}%)`;
  };

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        // Get mouse position relative to chart container
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const chartWidth = rect.width;

        // Account for grid padding (left: 3%, right: 4%)
        const chartAreaLeft = chartWidth * 0.03;
        const chartAreaWidth = chartWidth * 0.93; // 100% - 3% - 4%
        const relativeX = x - chartAreaLeft;

        // Only process if mouse is within chart area
        if (relativeX < 0 || relativeX > chartAreaWidth) {
          setHoveredLabel(null);
          return;
        }

        // Convert pixel position to data value
        const xValue = xMin + (relativeX / chartAreaWidth) * (xMax - xMin);

        // Determine which label to show
        const label = getHoveredLabel(xValue);
        setHoveredLabel(label);
      }}
      onMouseLeave={() => {
        setHoveredLabel(null);
      }}
    >
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ width: '100%', height: '140px' }}
        opts={{ renderer: 'svg' }}
        notMerge={true}
        lazyUpdate={false}
        onChartReady={(chart) => {
          // Function to calculate and set overlay position
          const calculateOverlay = () => {
            if (!boxplotData) return;

            setTimeout(() => {
              try {
                const minVal = parseFloat(boxplotData.min);
                const maxVal = parseFloat(boxplotData.max);
                const medianVal = parseFloat(boxplotData.median);
                const q3Val = parseFloat(boxplotData.q_3);

                if (isFinite(minVal) && isFinite(maxVal) && isFinite(medianVal) && isFinite(q3Val)) {
                  const medianPixel = chart.convertToPixel('xAxis', medianVal);
                  const q3Pixel = chart.convertToPixel('xAxis', q3Val);
                  const categoryPixel = chart.convertToPixel('yAxis', '');

                  // Box height - make taller to fully cover the box
                  const boxHeight = 54;
                  const boxTop = categoryPixel - boxHeight / 2;

                  // Start overlay at median (no offset needed if alignment is good)
                  const overlayLeft = medianPixel;
                  // Extend overlay to Q3 with slight extension for coverage
                  const overlayWidth = (q3Pixel - medianPixel) + 1.5;

                  setOverlayStyle({
                    position: 'absolute',
                    left: `${overlayLeft}px`,
                    top: `${boxTop}px`,
                    width: `${overlayWidth}px`,
                    height: `${boxHeight}px`,
                    backgroundColor: '#b2f1f9',
                    pointerEvents: 'none',
                    zIndex: 10,
                  });
                }
              } catch (error) {
                console.error('Error calculating overlay:', error);
              }
            }, 100);
          };

          // Calculate overlay when chart is ready
          calculateOverlay();

          // Recalculate on resize
          const handleResize = () => {
            calculateOverlay();
          };
          window.addEventListener('resize', handleResize);

          // Store resize handler for cleanup (if needed)
          chart.getDom().addEventListener('resize', handleResize);
        }}
      />

      {/* Light cyan overlay for right half (Median to Q3) */}
      {overlayStyle && (
        <div style={overlayStyle} />
      )}

      {/* Dynamic hover labels - only show when hovering */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
        {/* Minimum Label */}
        {hoveredLabel === 'min' && (
          <div
            className="absolute -translate-x-1/2 transform transition-opacity"
            style={{
              left: getLabelLeft(min),
              top: '-2px',
            }}
          >
            <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
              {min.toFixed(2)} Min
            </div>
            <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
          </div>
        )}

        {/* Q1 Label */}
        {hoveredLabel === 'q1' && (
          <div
            className="absolute -translate-x-1/2 transform transition-opacity"
            style={{
              left: getLabelLeft(q1),
              top: '-2px',
            }}
          >
            <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
              {q1.toFixed(2)} Q1
            </div>
            <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
          </div>
        )}

        {/* Median Label */}
        {hoveredLabel === 'median' && (
          <div
            className="absolute -translate-x-1/2 transform transition-opacity"
            style={{
              left: getLabelLeft(median),
              top: '-2px',
            }}
          >
            <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
              {median.toFixed(2)} Median
            </div>
            <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
          </div>
        )}

        {/* Q3 Label */}
        {hoveredLabel === 'q3' && (
          <div
            className="absolute -translate-x-1/2 transform transition-opacity"
            style={{
              left: getLabelLeft(q3),
              top: '-2px',
            }}
          >
            <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
              {q3.toFixed(2)} Q3
            </div>
            <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
          </div>
        )}

        {/* Maximum Label */}
        {hoveredLabel === 'max' && (
          <div
            className="absolute -translate-x-1/2 transform transition-opacity"
            style={{
              left: getLabelLeft(max),
              top: '-2px',
            }}
          >
            <div className="whitespace-nowrap rounded bg-[#333] px-2 py-1 text-xs font-bold text-white">
              {max.toFixed(2)} Max
            </div>
            <div className="mx-auto h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#333]"></div>
          </div>
        )}
      </div>
    </div>
  );
}

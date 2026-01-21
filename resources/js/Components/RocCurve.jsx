import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import axios from 'axios';
import PropTypes from 'prop-types';
import H2 from '@/Components/H2';

export default function RocCurve({ model_run_id, modelName, inst_id }) {
  const [rocData, setRocData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortedRocData = useMemo(() => {
    if (!rocData || rocData.length === 0) return [];
    return [...rocData].sort(
      (a, b) => Number(a.false_positive_rate) - Number(b.false_positive_rate),
    );
  }, [rocData]);

  const chartData = useMemo(() => {
    return sortedRocData.map(d => ({
      fpr: Number(d.false_positive_rate),
      tpr: Number(d.true_positive_rate),
      threshold: d.threshold,
    }));
  }, [sortedRocData]);

  const calculateAUC = useMemo(() => {
    if (chartData.length < 2) return 0;

    let auc = 0;
    for (let i = 0; i < chartData.length - 1; i++) {
      const fpr1 = chartData[i].fpr;
      const tpr1 = chartData[i].tpr;
      const fpr2 = chartData[i + 1].fpr;
      const tpr2 = chartData[i + 1].tpr;
      
      const width = fpr2 - fpr1;
      const avgHeight = (tpr1 + tpr2) / 2;
      auc += width * avgHeight;
    }

    return Math.max(0, Math.min(1, auc));
  }, [chartData]);

  const aucPercentage = useMemo(() => {
    return (calculateAUC * 100).toFixed(1);
  }, [calculateAUC]);

  // Fetch ROC curve data when model_run_id and inst_id are available
  useEffect(() => {
    const fetchRocCurve = async () => {
      if (!model_run_id || !inst_id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch ROC curve data
        const response = await axios.get(
          `/institutions/${inst_id}/training/roc_curve/${model_run_id}`,
        );

        if (response.data) {
          setRocData(response.data);
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
  }, [model_run_id, inst_id]);

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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl bg-black/80 px-4 py-3 text-white shadow-lg">
          <p className="text-sm">
            <strong>True Positive Rate:</strong> {data.tpr?.toFixed(3)}
          </p>
          <p className="text-sm">
            <strong>False Positive Rate:</strong> {data.fpr?.toFixed(3)}
          </p>
          <p className="text-sm">
            <strong>Threshold:</strong> {data.threshold}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
      <div className="mr-8 flex min-w-[320px] max-w-[420px] flex-1 flex-col justify-start">
        <H2 className="pb-4">ROC Curve for Test Data</H2>
        <ul className="list-disc pl-6 text-base text-black">
          <li className="mb-4">
            A Receiver Operating Characteristic Curve (ROC) shows how well
            the model distinguishes between students who need support and those
            who do not.
          </li>
          <li className="mb-4">
            The closer the curve hugs the top-left corner, the better the
            model is at separating the two groups.
          </li>
          <li className="mb-4">
            The dashed line shows the accurate classification rate you would get from random guessing (50%). The solid line shows that your model performs better, correctly classifying students about <b>{aucPercentage}%</b> of the time.
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
                    const link = document.createElement('a');
                    link.href = apiUrl;
                    link.download = `${modelName}_model_card.pdf`;
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
      <div className="flex min-w-0 flex-1" style={{ height: 480 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 30, bottom: 70, left: 90 }}
            style={{ backgroundColor: 'transparent' }}
          >
            {/* Gray background only in plot area - no grid lines */}
            <CartesianGrid stroke="none" fill="#EEF2F6" />
            <XAxis
              dataKey="fpr"
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tick={{ fill: '#637381', fontSize: 14 }}
              tickLine={false}
              tickMargin={15}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              padding={{ left: 20, right: 20 }}
              label={{
                value: 'False Positive Rate',
                position: 'bottom',
                offset: 20,
                style: { fill: '#637381', fontSize: 16 },
              }}
            />
            <YAxis
              dataKey="tpr"
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              tick={{ fill: '#637381', fontSize: 14 }}
              tickLine={false}
              tickMargin={15}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              padding={{ top: 20, bottom: 20 }}
              label={{
                value: 'True Positive Rate',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
                style: { fill: '#637381', fontSize: 16, textAnchor: 'middle' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Diagonal reference line */}
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
              stroke="#999"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            {/* ROC Curve */}
            <Line
              type="stepAfter"
              dataKey="tpr"
              stroke="#F79122"
              strokeWidth={2.5}
              dot={{ r: 1, fill: '#F79122', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#F79122' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

RocCurve.propTypes = {
  model_run_id: PropTypes.string,
  modelName: PropTypes.string,
  inst_id: PropTypes.string,
};

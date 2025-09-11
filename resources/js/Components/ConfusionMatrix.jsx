import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function ConfusionMatrix({ model_run_id, modelName }) {
  const [cmData, setCmData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inst_id, setInstId] = useState(null);

  // Fetch confusion matrix data when model_run_id is available
  useEffect(() => {
    const fetchConfusionMatrix = async () => {
      if (!model_run_id) return;

      setLoading(true);
      setError(null);

      try {
        // Get the current user's institution ID
        const instResponse = await axios.get('/user-current-inst-api');
        if (instResponse.data && instResponse.data.length > 0) {
          const inst_id = instResponse.data[0];
          setInstId(inst_id);

          // Fetch confusion matrix data
          const response = await axios.get(
            `/institutions/${inst_id}/training/confusion_matrix/${model_run_id}`,
          );

          if (response.data) {
            setCmData(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching confusion matrix data:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
        });
        setError(
          `Failed to load confusion matrix data: ${error.response?.status || error.message}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfusionMatrix();
  }, [model_run_id]);

  // Show loading state
  if (loading) {
    return (
      <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            Loading confusion matrix data...
          </div>
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
  if (!cmData || cmData.length === 0) {
    return (
      <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
        <div className="flex w-full items-center justify-center py-8">
          <div className="text-lg text-gray-600">
            No confusion matrix data available
          </div>
        </div>
      </div>
    );
  }

  const cellInfo = [
    [
      {
        label: 'True negative',
        percent: (cmData[0].true_negative * 100).toFixed(0) + '%',
        desc: 'Of students with low support needs were <b>accurately classified</b> by the model',
        color: '#1796A5',
        text: '#ffffff',
      },
      {
        label: 'False positive',
        percent: (cmData[0].false_positive * 100).toFixed(0) + '%',
        desc: 'Of students with low support needs were <b>incorrectly classified</b> as high support need',
        color: '#7ED6E8',
        text: '#000000',
      },
    ],
    [
      {
        label: 'False negative',
        percent: (cmData[0].false_negative * 100).toFixed(0) + '%',
        desc: 'Of students with high support needs were <b>incorrectly classified</b> as low support need',
        color: '#7ED6E8',
        text: '#000000',
      },
      {
        label: 'True positive',
        percent: (cmData[0].true_positive * 100).toFixed(0) + '%',
        desc: 'Of students with high support needs were <b>accurately classified</b> by the model',
        color: '#1796A5',
        text: '#ffffff',
      },
    ],
  ];

  return (
    <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
      {/* Left: Title and description */}
      <div className="flex w-1/2 min-w-[260px] flex-col justify-start p-6">
        <h2 className="pb-4 text-2xl font-light">
          Confusion Matrix for Test Data
        </h2>
        <ul className="list-disc pl-6 text-base text-black">
          <li className="mb-3">
            A confusion matrix evaluates how well the model is performing.
          </li>
          <li className="mb-3">
            We compare the model&apos;s predictions to the actual outcomes and
            review correct vs. incorrect outputs.
          </li>
          <li>
            This confusion matrix shows the results for a subset of the original
            data you provided that was not used to train the model. More details
            on the test dataset are available in the{' '}
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
                className="cursor-pointer text-black underline hover:opacity-80"
              >
                model card
              </a>
            </b>
            .
          </li>
        </ul>
      </div>
      <div className="relative flex items-center">
        {/* Y-axis label */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-lg font-light text-black">
          True Label
        </div>
        {/* True label (top) */}
        <div className="absolute left-0 top-[22%] -translate-y-1/2 -rotate-90 whitespace-nowrap text-base font-light text-[#767676]">
          True
        </div>
        {/* False label (bottom) */}
        <div className="absolute bottom-[22%] left-0 translate-y-1/2 -rotate-90 whitespace-nowrap text-base font-light text-[#767676]">
          False
        </div>
        {/* Confusion matrix grid */}
        <div className="flex-2 ml-12 flex min-w-0 flex-col items-center justify-center">
          <div className="mb-2 text-lg font-semibold text-[#222]">
            Normalized Confusion Matrix
          </div>
          <div className="rounded-32 grid w-[520px] grid-cols-2 grid-rows-2 overflow-hidden bg-[#f7f8fa] bg-white">
            {cellInfo.flat().map((cell, idx) => (
              <div
                key={cell.label}
                className="relative flex flex-col items-center justify-center bg-[#1796A5] p-0"
                style={{
                  background: cell.color,
                  color: cell.text,
                  borderTopLeftRadius: idx === 0 ? 32 : 0,
                  borderTopRightRadius: idx === 1 ? 32 : 0,
                  borderBottomLeftRadius: idx === 2 ? 32 : 0,
                  borderBottomRightRadius: idx === 3 ? 32 : 0,
                }}
              >
                <div className="my-2 text-sm font-semibold">{cell.label}</div>
                <div className="font-[merriweather] text-7xl font-medium">
                  {cell.percent}
                </div>
                <div
                  className="mt-2 max-w-[220px] text-center"
                  dangerouslySetInnerHTML={{ __html: cell.desc }}
                />
              </div>
            ))}
          </div>
          {/* Axis labels */}
          <div className="mt-4 grid w-full grid-cols-3 text-base font-light text-[#767676]">
            <div className="col-span-1 mx-auto pl-10">False</div>
            <div className="col-span-1 mx-auto"></div>
            <div className="col-span-1 mx-auto pr-10">True</div>
          </div>
          <div className="mx-auto w-full text-center text-lg font-light text-black">
            Predicted Label
          </div>
        </div>
      </div>
    </div>
  );
}

ConfusionMatrix.propTypes = {
  model_run_id: PropTypes.string,
  modelName: PropTypes.string,
};

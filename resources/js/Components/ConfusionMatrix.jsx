import React from 'react';
import PropTypes from 'prop-types';

const cmData = [
  {
    true_positive: '0.8441011235955056',
    false_positive: '0.20485175202156333',
    true_negative: '0.7951482479784366',
    false_negative: '0.15589887640449437',
  },
];

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

export default function ConfusionMatrix() {
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
            We compare the model's predictions to the actual outcomes and review
            correct vs. incorrect outputs.
          </li>
          <li>
            This confusion matrix shows the results for a subset of the original
            data you provided that was not used to train the model. More details
            on the test dataset are available in the{' '}
            <b>
              <a href="#" className="text-black underline">
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
            {cellInfo.flat().map(cell => (
              <div
                key={cell.label}
                className="relative flex flex-col items-center justify-center bg-[#1796A5] p-0"
                style={{
                  background: cell.color,
                  color: cell.text,
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
};

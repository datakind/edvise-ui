import React from 'react';

const matrix = [
  [0.75, 0.25], // [TN, FP]
  [0.29, 0.71], // [FN, TP]
];

const cellInfo = [
  [
    {
      label: 'True negative',
      percent: '75%',
      desc: 'Of students with low support needs were <b>accurately classified</b> by the model',
      color: '#1796A5',
      text: '#ffffff',
    },
    {
      label: 'False positive',
      percent: '25%',
      desc: 'Of students with low support needs were <b>incorrectly classified</b> as high support need',
      color: '#7ED6E8',
      text: '#000000',
    },
  ],
  [
    {
      label: 'False negative',
      percent: '29%',
      desc: 'Of students with high support needs were <b>incorrectly classified</b> as low support need',
      color: '#7ED6E8',
      text: '#000000',
    },
    {
      label: 'True positive',
      percent: '71%',
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
      {/* Right: Confusion matrix grid */}
      <div className="flex-2 flex min-w-0 flex-col items-center justify-center">
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
              <div className="font-[playfair] text-7xl font-medium">
                {cell.percent}
              </div>
              <div
                className="mt-2 max-w-[220px] text-center"
                dangerouslySetInnerHTML={{ __html: cell.desc }}
              />
            </div>
          ))}
          {/* Axis labels */}
        </div>
      </div>
    </div>
  );
}

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
    },
    {
      label: 'False positive',
      percent: '25%',
      desc: 'Of students with low support needs were <b>incorrectly classified</b> as high support need',
      color: '#7ED6E8',
    },
  ],
  [
    {
      label: 'False negative',
      percent: '29%',
      desc: 'Of students with high support needs were <b>incorrectly classified</b> as low support need',
      color: '#7ED6E8',
    },
    {
      label: 'True positive',
      percent: '71%',
      desc: 'Of students with high support needs were <b>accurately classified</b> by the model',
      color: '#1796A5',
    },
  ],
];

export default function ConfusionMatrix() {
  return (
    <div className="mt-6 flex items-stretch rounded-3xl bg-white p-8 shadow">
      {/* Left: Title and description */}
      <div className="flex min-w-[260px] max-w-[340px] flex-col justify-center">
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
              <a href="#" className="text-blue-500 underline">
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
        <div className="rounded-32 grid h-[340px] w-[520px] grid-cols-2 grid-rows-2 overflow-hidden bg-[#f7f8fa]">
          {cellInfo.flat().map((cell, idx) => (
            <div
              key={cell.label}
              className="relative flex flex-col items-center justify-center bg-[#1796A5] p-0"
              style={{
                background: cell.color,
                borderTopLeftRadius: idx === 0 ? 32 : 0,
                borderTopRightRadius: idx === 1 ? 32 : 0,
                borderBottomLeftRadius: idx === 2 ? 32 : 0,
                borderBottomRightRadius: idx === 3 ? 32 : 0,
              }}
            >
              <div className="mb-2 text-lg font-semibold text-white">
                {cell.label}
              </div>
              <div className="text-7xl font-bold text-white">
                {cell.percent}
              </div>
              <div
                className="mt-2 max-w-[220px] text-center text-white"
                dangerouslySetInnerHTML={{ __html: cell.desc }}
              />
            </div>
          ))}
          {/* Axis labels */}
          <div className="absolute left-[-60px] top-[50%] -translate-y-1/2 rotate-[-90deg] text-2xl font-semibold text-[#222]">
            True Label
          </div>
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 10,
              fontSize: 18,
              color: '#222',
              fontWeight: 400,
              transform: 'rotate(-90deg)',
            }}
          >
            False
          </div>
          <div
            style={{
              position: 'absolute',
              left: 40,
              bottom: 10,
              fontSize: 18,
              color: '#222',
              fontWeight: 400,
              transform: 'rotate(-90deg)',
            }}
          >
            True
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 20,
              color: '#222',
              fontWeight: 500,
            }}
          >
            Predicted Label
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: 120,
              fontSize: 18,
              color: '#222',
              fontWeight: 400,
            }}
          >
            False
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              right: 120,
              fontSize: 18,
              color: '#222',
              fontWeight: 400,
            }}
          >
            True
          </div>
        </div>
      </div>
    </div>
  );
}

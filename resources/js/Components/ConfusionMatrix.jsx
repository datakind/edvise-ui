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
      <div
        style={{
          flex: 1,
          minWidth: 260,
          maxWidth: 340,
          marginRight: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <h2 className="text-4xl font-light">
          Confusion Matrix for
          <br />
          Test Data
        </h2>
        <ul
          style={{
            color: '#222',
            fontSize: 18,
            fontWeight: 400,
            marginLeft: 24,
            marginBottom: 0,
            paddingLeft: 0,
            listStyle: 'disc',
          }}
        >
          <li style={{ marginBottom: 12 }}>
            A confusion matrix evaluates how well the model is performing.
          </li>
          <li style={{ marginBottom: 12 }}>
            We compare the model's predictions to the actual outcomes and review
            correct vs. incorrect outputs.
          </li>
          <li>
            This confusion matrix shows the results for a subset of the original
            data you provided that was not used to train the model. More details
            on the test dataset are available in the{' '}
            <b>
              <a
                href="#"
                style={{
                  color: '#222',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                model card
              </a>
            </b>
            .
          </li>
        </ul>
      </div>
      {/* Right: Confusion matrix grid */}
      <div
        style={{
          flex: 2,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: '#222',
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Normalized Confusion Matrix
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            width: 520,
            height: 340,
            borderRadius: 32,
            overflow: 'hidden',
            position: 'relative',
            background: '#f7f8fa',
          }}
        >
          {cellInfo.flat().map((cell, idx) => (
            <div
              key={cell.label}
              style={{
                background: cell.color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                position: 'relative',
                borderTopLeftRadius: idx === 0 ? 32 : 0,
                borderTopRightRadius: idx === 1 ? 32 : 0,
                borderBottomLeftRadius: idx === 2 ? 32 : 0,
                borderBottomRightRadius: idx === 3 ? 32 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 2,
                }}
              >
                {cell.label}
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                {cell.percent}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#fff',
                  textAlign: 'center',
                  maxWidth: 220,
                  marginTop: 4,
                }}
                dangerouslySetInnerHTML={{ __html: cell.desc }}
              />
            </div>
          ))}
          {/* Axis labels */}
          <div
            style={{
              position: 'absolute',
              left: -60,
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontSize: 20,
              color: '#222',
              fontWeight: 500,
            }}
          >
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

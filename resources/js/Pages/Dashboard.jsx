import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import ModelRunHistory from '@/Components/ModelRunHistory';
import HeaderLabel from '@/Components/HeaderLabel';
import BigDangerAlert from '@/Components/BigDangerAlert';
import classNames from 'classnames';
Button;

import { ChartBarIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import Button from '@/Components/Landing/Button';

const histogramOptions = {
  title: 'Distribution of Support Scores',
  titleTextStyle: { fontSize: 18, bold: false },
  chartArea: { width: '80%', height: '70%' },
  legend: { position: 'none' },
  colors: ['#f79222'],
  hAxis: {
    viewWindow: { min: 0, max: 100 },
    buckets: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    format: '#', // Integer formatting
    title: 'Support Score',
  },
  vAxis: {
    title: 'Number of Students',
  },
  series: {
    0: {
      annotations: {
        style: 'none',
        textStyle: { color: 'black' },
      },
    },
  },
};

const processRiskScoreData = data => {
  const chartData = [['Student ID', 'Support Score']];
  for (const item of data) {
    chartData.push([item['Student ID'], item['Support Score'] * 100]);
  }
  return chartData;
};

export default function Dashboard({ modelname }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // These only need to be set once
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  const [runDatesToJobDict, setRunDatesToJobDict] = useState({});
  // These need to be set depending on the current run.
  const [currentRunId, setCurrentRunId] = useState('');
  const [currentRunCompleted, setCurrentRunCompleted] = useState(false); // Whether the current run has output and has completed.
  const [outputFilename, setOutputFilename] = useState('');
  const [outputApproved, setOutputApproved] = useState(false);
  const [data, setData] = useState([]); // the raw json data of the csv file
  const [shapImgBlob, setShapImgBlob] = useState(null); // the img blob

  useEffect(() => {
    const fetchModel = async () => {
      // Get list of models for a given institution
      try {
        const response = await axios.get('/models-api');
        let models = response.data;
        let model = null;
        if (models == null || models.length == 0) {
          // No models for this institution exist.
          setModelInfo(null);
          throw new Error('NO_MODELS');
        } else {
          if (modelname == null || modelname == '') {
            // No model specified, so we just pick one.
            model = models[0];
            setModelInfo(model);
          } else {
            // Find the specific model specified.
            let specifiedModel = models.filter(m => m.name == modelname);
            if (specifiedModel.length == 0) {
              // Specified model not found
              setModelInfo(null);
              throw new Error('Specified model ' + modelname + ' not found.');
            } else {
              model = specifiedModel[0];
              setModelInfo(model);
            }
          }
        }
        if (model != null) {
          const runs_response = await axios.get('/model/' + model.name);
          if (runs_response.data != null && runs_response.data.length != 0) {
            let run_results = runs_response.data;
            setRuns(run_results);
            var runDatesDict = {};

            for (var i in run_results) {
              runDatesDict[run_results[i].triggered_at] = run_results[i].run_id;
            }

            setRunDatesToJobDict(runDatesDict);
            if (runDatesDict == {}) {
              throw new Error('Could not find run times for ' + model.name);
            }
            if (currentRunId == '' && run_results.length >= 1) {
              // Set current run id to the first run (the returned runs are sorted by triggered time from most recent to least recent)
              // The current run id should only be empty on first page load.
              setCurrentRunId(run_results[0].run_id);
            }
            let csv_filename = run_results.find(
              r => r.run_id === currentRunId,
            )?.output_filename;
            setCurrentRunCompleted(
              run_results.find(r => r.run_id === currentRunId)?.completed,
            );
            setOutputFilename(csv_filename);
            setOutputApproved(
              run_results.find(r => r.run_id === currentRunId)?.output_valid,
            );
            if (csv_filename != null) {
              const file_response = await axios.get(
                '/output-file-json/' + csv_filename,
              );
              let shap_filename = csv_filename.replace(
                'inference_output.csv',
                'shap_chart.png',
              );
              // For the csv data used for histogram, store output as json instead of bytes.
              setData(file_response.data);
              // Create a URL for the Blob
              setShapImgBlob('/output-file-png/' + shap_filename);
            }
          } else {
            throw new Error('NO_RUNS');
          }
        }
      } catch (err) {
        if (
          err.response != null &&
          err.response.data != null &&
          err.response.data.error != null
        ) {
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [currentRunId]);

  const triggerDownload = () => {
    if (outputFilename != null && outputFilename != '') {
      return axios
        .get('/download-inf-data/' + outputFilename)
        .then(res => {
          if (res.data == 'local-url-fake-signed') {
            // This is the local testing case. Don't download as this is not a real file.
            return;
          }
          window.open(res.data, '_self');
        })
        .catch(err => {
          if (
            err.response != null &&
            err.response.data != null &&
            err.response.data.error != null
          ) {
            setError(Error(err.response.data.error));
          } else {
            setError(err);
          }
        });
    }
  };

  const chartData = processRiskScoreData(data);

  const applyDate = event => {
    event.preventDefault();
    if (event.target.elements.run_time.value == '') {
      return;
    }
    let run_id = runDatesToJobDict[event.target.elements.run_time.value];
    setCurrentRunId(run_id);
  };

  return (
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      )}
    >
      {
        <div
          className="mx-12 mb-12 flex w-full flex-col rounded-3xl bg-white p-8"
          id="main_area"
        >
          {loading ? (
            <div className="flex w-full justify-center">
              <Spinner mainMsg="Loading"></Spinner>
            </div>
          ) : error != null &&
            !(error.message == 'NO_MODELS' || error.message == 'NO_RUNS') ? (
            <BigDangerAlert
              mainMsg={'Error: ' + error.message}
              className="ml-24 mr-24 flex h-fit"
            ></BigDangerAlert>
          ) : (
            <div className="flex w-full flex-col items-center" id="main_area">
              <h1 className="text-center text-5xl font-light">Dashboard</h1>
              <div className="mt-4 text-center text-lg font-light">
                {modelInfo == null || modelInfo == {}
                  ? ''
                  : `Current model: ${modelInfo.name}`}
              </div>

              {error != null &&
              (error.message == 'NO_MODELS' || error.message == 'NO_RUNS') ? (
                <>
                  <div className="flex w-full flex-row justify-between pl-12 pr-12 pt-12">
                    <div className="flex flex-row items-center justify-center gap-x-2">
                      Run Time: <i>No run available yet.</i>
                    </div>
                  </div>
                  {error.message == 'NO_MODELS' ? (
                    <div className="ml-24 mr-24 mt-12 flex h-32 w-3/4 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500">
                      <div className="flex font-bold">
                        Your institution does not have a model yet.
                      </div>
                      <div className="flex">
                        Please contact Datakind to set up your model at&nbsp;
                        <a href="mailto:education@datakind.org?subject=SST%20Inquiry">
                          education@datakind.org
                        </a>
                        .
                      </div>
                    </div>
                  ) : (
                    <div className="my-12 ml-24 mr-24 flex h-32 w-3/4 flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-500">
                      <div className="flex font-bold">
                        This model does not have any predictions available yet.
                      </div>
                      <div className="flex">Click below to begin one.</div>
                      <a
                        href={route('run-inference')}
                        className="flex items-center justify-center rounded-full border border-[#f79222] bg-white px-3 py-2 text-[#f79222]"
                      >
                        Start Prediction
                      </a>
                    </div>
                  )}
                  <div className="mx-auto w-full max-w-[1057px]">
                    <ModelRunHistory runInfos={[]} />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-full flex-row justify-between pl-12 pr-12 pt-12">
                    <form
                      onSubmit={applyDate}
                      className="flex flex-row items-center justify-center gap-x-2"
                    >
                      <div className="flex">Run Time:</div>
                      <div className="flex">
                        {runDatesToJobDict == undefined ||
                        Object.keys(runDatesToJobDict).length == 0 ? (
                          <select
                            className="px-30 flex items-center justify-center rounded-lg border border-gray-200 bg-white py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
                            id="run_time"
                          >
                            <option disabled value="">
                              No runs exist
                            </option>
                          </select>
                        ) : (
                          <select
                            className="px-30 flex items-center justify-center rounded-lg border border-gray-200 bg-white py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
                            id="run_time"
                          >
                            {Object.keys(runDatesToJobDict).map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center rounded-full border border-[#f79222] bg-white px-3 py-2 text-[#f79222]"
                      >
                        Update View
                      </button>
                    </form>
                  </div>
                  <div className="mx-auto my-12 w-full max-w-[1057px] rounded-3xl bg-white p-8">
                    <ModelRunHistory runInfos={runs} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      }
    </AppLayout>
  );
}

function bytesToBase64(bytes) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    const blob = new Blob([bytes], { type: 'image/png' });
    reader.readAsDataURL(blob);
  });
}

function PrintableChart({ chartType, data, options, width, height }) {
  const [chartWrapper, setChartWrapper] = useState(null);

  const handleDownload = () => {
    if (chartWrapper) {
      const uri = chartWrapper.getChart().getImageURI();
      const link = document.createElement('a');
      link.href = uri;
      link.download = 'chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <Chart
        chartType={chartType}
        data={data}
        options={options}
        width={width}
        height={height}
        style={{ margin: '20px auto' }}
        getChartWrapper={wrapper => setChartWrapper(wrapper)}
      />
      {chartWrapper && (
        <a
          onClick={handleDownload}
          className="cursor-pointer text-xs"
          style={{
            position: 'absolute',
            top: '34px',
            right: '16px',
          }}
        >
          Download Chart
        </a>
      )}
    </div>
  );
}

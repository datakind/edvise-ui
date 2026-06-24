import axios from 'axios';
import { route } from 'ziggy-js';
import React, { useEffect, useState } from 'react';
import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import { formatModelName } from '@/utils/stringUtils';

export default function ModelRunHistory({ modelname }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // These only need to be set once
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  // These need to be set depending on the current run.
  const [currentRunId, setCurrentRunId] = useState('');

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
            if (currentRunId == '' && run_results.length >= 1) {
              // Set current run id to the first run (the returned runs are sorted by triggered time from most recent to least recent)
              // The current run id should only be empty on first page load.
              setCurrentRunId(run_results[0].run_id);
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

  return (
    <AppLayout title="Model Results">
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
            <Alert
              variant="danger"
              mainMsg={'Error: ' + error.message}
            />
          ) : (
            <div
              className="flex w-full flex-col items-center"
              id="main_content"
            >
              <h1>Model Run History</h1>
              <div className="mt-4 text-center text-lg font-light">
                {modelInfo == null || modelInfo == {}
                  ? ''
                  : `Current model: ${formatModelName(modelInfo.name)}`}
              </div>

              {error != null &&
              (error.message == 'NO_MODELS' || error.message == 'NO_RUNS') ? (
                <>
                  {error.message == 'NO_MODELS' ? (
                    <div className="mt-12 mr-24 ml-24 flex h-32 w-3/4 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500">
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
                    <div className="my-12 mr-24 ml-24 flex h-32 w-3/4 flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-500">
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
                </>
              ) : (
                <></>
              )}

              <div className="mx-auto w-full max-w-[1057px]">
                {runs.length > 0 && (
                  <div className="mt-8 flex w-full justify-center">
                    <table
                      className="w-full table-auto rounded-lg bg-white text-left shadow-md"
                      id="model-history-table"
                    >
                      <thead>
                        <tr className="border-b border-gray-300 bg-gray-50 text-xs leading-normal font-medium tracking-[0.6px] text-gray-500 uppercase">
                          <th scope="col" className="p-4 px-6">
                            DATE
                          </th>
                          <th scope="col" className="p-4 px-6">
                            USER
                          </th>
                          <th scope="col" className="p-4 px-6">
                            BATCH
                          </th>
                          <th scope="col" className="p-4 px-6">
                            RESULTS
                          </th>
                          <th scope="col" className="p-4 px-6">
                            RESULTS .CSV
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {runs.map(run => (
                          <tr
                            className="border-b border-gray-300 text-sm leading-5 font-normal text-gray-700"
                            key={run.run_id}
                          >
                            <td className="p-4 px-6">{run.triggered_at}</td>
                            <td className="p-4 px-6">{run.created_by}</td>
                            <td className="p-4 px-6 font-medium">
                              {run.batch_name}
                            </td>
                            <td className="p-4 px-6">
                              {run.completed ? (
                                <a
                                  href={route('model-results-overview', [
                                    run.run_id,
                                    modelInfo?.name || '',
                                  ])}
                                  aria-label={`View model results for run on ${run.triggered_at}`}
                                >
                                  View
                                </a>
                              ) : (
                                'Pending'
                              )}
                            </td>
                            <td className="p-4 px-6">
                              {run.completed ? (
                                <a
                                  href={run.output_file_link}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label={`Download model results for run on ${run.triggered_at}`}
                                >
                                  Download
                                </a>
                              ) : (
                                'Pending'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      }
    </AppLayout>
  );
}

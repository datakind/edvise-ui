import axios from 'axios';
import { route } from 'ziggy-js';
import React, { useEffect, useState } from 'react';
import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import { formatModelName } from '@/utils/stringUtils';
import PageHeading from '@/Components/PageHeading';

export default function ModelRunHistory({ modelname }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // These only need to be set once
  const [modelInfo, setModelInfo] = useState({});
  const [runs, setRuns] = useState([]);
  const [runDatesToJobDict, setRunDatesToJobDict] = useState({});
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

  const applyDate = event => {
    event.preventDefault();
    if (event.target.elements.run_time.value == '') {
      return;
    }
    let run_id = runDatesToJobDict[event.target.elements.run_time.value];
    setCurrentRunId(run_id);
  };

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
              className="mr-24 ml-24 flex h-fit"
            />
          ) : (
            <div
              className="flex w-full flex-col items-center"
              id="main_content"
            >
              <PageHeading>Model Results</PageHeading>
              <div className="mt-4 text-center text-lg font-light">
                {modelInfo == null || modelInfo == {}
                  ? ''
                  : `Current model: ${formatModelName(modelInfo.name)}`}
              </div>

              {error != null &&
              (error.message == 'NO_MODELS' || error.message == 'NO_RUNS') ? (
                <>
                  <div className="flex w-full flex-row justify-between pt-12 pr-12 pl-12">
                    <div className="flex flex-row items-center justify-center gap-x-2">
                      Run Time: <i>No run available yet.</i>
                    </div>
                  </div>
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

              <div className="mx-auto my-12 w-full max-w-[1057px]">
                <h2 className="text-center text-3xl font-light">
                  Model Run History
                </h2>
                {runs.length === 0 ? (
                  <div className="flex">
                    <i>No run available yet.</i>
                  </div>
                ) : (
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

import axios from 'axios';
import { route } from 'ziggy-js';
import React, { useEffect, useState } from 'react';
import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import ModelRunHistory from '@/Components/ModelRunHistory';
import Alert from '@/Components/Alert';
import { formatModelName } from '@/utils/stringUtils';
import PageHeading from '@/Components/PageHeading';

export default function Dashboard({ modelname }) {
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
    <AppLayout
      title="Dashboard"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
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
              <PageHeading>Dashboard</PageHeading>
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
                  <div className="mx-auto w-full max-w-[1057px]">
                    <ModelRunHistory
                      runInfos={[]}
                      modelName={modelInfo?.name || ''}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-full flex-row justify-between pt-12 pr-12 pl-12">
                    <form
                      onSubmit={applyDate}
                      className="flex flex-row items-center justify-center gap-x-2"
                    >
                      <div className="flex">Run Time:</div>
                      <div className="flex">
                        {runDatesToJobDict == undefined ||
                        Object.keys(runDatesToJobDict).length == 0 ? (
                          <select
                            className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-30 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
                            id="run_time"
                          >
                            <option disabled value="">
                              No runs exist
                            </option>
                          </select>
                        ) : (
                          <select
                            className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-30 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
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
                    <ModelRunHistory
                      runInfos={runs}
                      modelName={modelInfo?.name || ''}
                    />
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

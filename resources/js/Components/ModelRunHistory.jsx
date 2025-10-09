import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Access route function from window object
const route = window.route;

const ModelRunHistory = ({ runInfos, modelName }) => {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [err, setErr] = useState(null);

  console.log('ModelRunHistory - Model Name:', modelName);

  useEffect(() => {
    let runvars = runInfos;
    try {
      if (runvars != undefined && runvars != []) {
        let vals = runvars.map(run => ({
          date: run.triggered_at,
          user: run.created_by,
          batch: run.batch_name,
          outputFile: run.completed ? run.output_filename : 'Pending',
          approved: run.output_valid,
          outputLink: run.completed ? run.output_file_link : null,
          run_id: run.run_id,
        }));
        setDataToDisplay(vals);
      } else {
        setDataToDisplay([]);
      }
    } catch (err) {
      setErr(err);
    }
  }, [runInfos]);

  const createViewLink = run => {
    return route('model-results-overview', [run.run_id, modelName]);
  };

  return (
    <div className="full flex flex-col">
      <div className="flex w-full justify-center">
        <div className="flex flex-row gap-x-3 text-center text-3xl font-light">
          Model Run History
        </div>
      </div>
      {dataToDisplay.length == 0 ? (
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
              <tr className="border-b border-gray-300 bg-gray-50 text-xs font-medium uppercase leading-normal tracking-[0.6px] text-gray-500">
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
              {err != null ? (
                <tr
                  className="border-b border-gray-300 text-sm font-normal leading-5 text-gray-700"
                  key="error"
                >
                  {err.response.data}
                </tr>
              ) : (
                dataToDisplay.map(run => (
                  <tr
                    className="border-b border-gray-300 text-sm font-normal leading-5 text-gray-700"
                    key={run.date}
                  >
                    <td className="p-4 px-6">{run.date}</td>
                    <td className="p-4 px-6">{run.user}</td>
                    <td className="p-4 px-6 font-medium">{run.batch}</td>
                    <td className="p-4 px-6">
                      {run.outputFile == 'Pending' ? (
                        <>Pending</>
                      ) : (
                        <a href={createViewLink(run)}>View</a>
                      )}
                    </td>
                    <td className="p-4 px-6">
                      {run.outputFile == 'Pending' ? (
                        <>Pending</>
                      ) : (
                        <a
                          href={run.outputLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

ModelRunHistory.propTypes = {
  runInfos: PropTypes.arrayOf(
    PropTypes.shape({
      triggered_at: PropTypes.string,
      created_by: PropTypes.string,
      batch_name: PropTypes.string,
      completed: PropTypes.bool,
      output_filename: PropTypes.string,
      output_valid: PropTypes.bool,
      output_file_link: PropTypes.string,
      run_id: PropTypes.string,
    }),
  ),
  modelName: PropTypes.string,
};

export default ModelRunHistory;

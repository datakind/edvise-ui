import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

// Access route function from window object
const route = window.route;

const ModelRunHistory = props => {
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let runvars = props.runInfos;
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
  }, [props]);

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
                <th className="p-4 px-6">DATE</th>
                <th className="p-4 px-6">USER</th>
                <th className="p-4 px-6">BATCH</th>
                <th className="p-4 px-6">RESULTS</th>
                <th className="p-4 px-6">RESULTS .CSV</th>
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
                dataToDisplay.map((run, index) => (
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
                        <a href={route('model-results-overview', run.run_id)}>
                          View
                        </a>
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

export default ModelRunHistory;

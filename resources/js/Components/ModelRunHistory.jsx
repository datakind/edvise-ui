import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

const ModelRunHistory = (props) => {
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [err, setErr] = useState(null);

    useEffect(() => {
        let runvars = props.runInfos;
        try {
            if (runvars != undefined) {
                let vals = runvars.map((run) => (
                {"date": run.triggered_at, 
                "user": run.created_by, 
                "batch": run.batch_name, 
                "outputFile": run.output_valid ? run.output_filename : "Pending", 
                "approved": run.output_valid,
                "outputLink" : run.output_valid ? run.output_file_link : null}));
                setDataToDisplay(vals);
            } else {
                setDataToDisplay([]);
            }
        } catch (err) {
            setErr(err);
        }
    }, [props]);

    return (

<div className='w-full flex pt-16 pb-12 flex-col'>
<div className='flex'>
    <h3 className="text-lg font-semibold mb-2 flex flex-row gap-x-3">
    <ArrowUturnLeftIcon aria-hidden="true" className="size-6 shrink-0"/> Model Run History</h3>
    </div>
    <div className='flex'>
  <table className='min-w-[60%] max-w-[90%] table-auto text-left rounded-lg bg-white shadow-md' id="model-history-table">
    <thead>
      <tr className='bg-gray-50 border-b border-gray-300 text-gray-500 text-xs font-medium leading-normal tracking-[0.6px] uppercase'>
        <th className='p-4 px-6'>DATE</th>
        <th className='p-4 px-6'>USER</th>
        <th className='p-4 px-6'>BATCH</th>
        <th className='p-4 px-6'>OUTPUT FILE</th>
      </tr>
    </thead>

    <tbody>
      {err != null ? (<tr className='border-b border-gray-300 text-gray-700 text-sm font-normal leading-5' key="error">{err.response.data}</tr>) : 
      dataToDisplay.map((run, index) => (
        <tr className='border-b border-gray-300 text-gray-700 text-sm font-normal leading-5' key={run.date}>
          <td className='p-4 px-6'>{run.date}</td>
          <td className='p-4 px-6'>{run.user}</td>
          <td className='p-4 px-6 font-medium'>{run.batch}</td>
          <td className='p-4 px-6'>{run.outputFile == "Pending" ? (<>Pending</>) : (<a href={run.outputLink}>Download</a>)}</td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>
</div>

    );
};

export default ModelRunHistory;

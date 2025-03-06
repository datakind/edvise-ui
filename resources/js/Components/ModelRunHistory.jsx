import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';

const ModelRunHistory = (props) => {
    const [dataToDisplay, setDataToDisplay] = useState([]);
    useEffect(() => {
        let runvars = props.runInfos;
        try {
            if (runvars != undefined) {
                let vals = runvars.map((run) => ({"date": convertDateToReadable(run.triggered_at), 
                "user": getUserName(run.created_by), "batch": run.batch_name, "outputFile": run.completed? run.output_filename : "Pending", "approved": run.output_valid }));
                setDataToDisplay(vals);
            } else {
                setDataToDisplay([]);

            }
        } catch (err) {
            console.log(JSON.stringify(err));
        /*if (err.response != null && err.response.data != null && err.response.data.error != null) {          
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }*/
        } finally {
        //setLoading(false);
        }

    }, [props]);

// TODO: dedup with the version of this in Dashboard.jsx
  function convertDateToReadable(date_str) {
    // Convert date to readable string.
    // The strings are of type "2025-02-25T19:48:43"
    const firstParse = date_str.split("T");
    const date_val = firstParse[0].split("-");
    const time_val = firstParse[1];
    // We want the result to look like 2/24/2025 19:48:43
    let result = date_val[1] + "/"+date_val[2] + "/" + date_val[0]+" "+ time_val;
    return result;
  }
    function getUserName(user_uuid) {
    return "Temp Placeholder";
  }

    return (
        <div className="mt-8 pb-12">
            <h3 className="text-lg font-semibold mb-2 flex flex-row gap-x-3"><ArrowUturnLeftIcon aria-hidden="true" className="size-6 shrink-0"/> Model Run History</h3> {/* Heading remains */}
            <div className="flex overflow-hidden flex-wrap items-start self-stretch w-full text-sm font-medium leading-none text-gray-700 bg-white rounded-lg shadow max-md:mt-10">
                <div className="flex flex-col grow shrink min-w-[240px] w-[257px]">
                    <TableHeader title="DATE" />
                    {dataToDisplay.map((run, index) => (
                        <React.Fragment key={index}>
                            <TableCell>{run.date}</TableCell>
                            {index !== dataToDisplay.length - 1 && <TableDivider />}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex flex-col grow shrink text-base leading-none text-gray-700 min-w-[240px] w-[222px]">
                    <TableHeader title="USER" />
                    {dataToDisplay.map((run, index) => (
                        <React.Fragment key={index}>
                            <TableCell>
                                <div className="flex gap-4 items-center">
                                    <div className="self-stretch my-auto">{run.user}</div>
                                </div>
                            </TableCell>
                            {index !== dataToDisplay.length - 1 && <TableDivider />}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex flex-col grow shrink whitespace-nowrap w-[183px]">
                    <TableHeader title="BATCH" />
                    {dataToDisplay.map((run, index) => (
                        <React.Fragment key={index}>
                            <TableCell>{run.batch}</TableCell>
                            {index !== dataToDisplay.length - 1 && <TableDivider />}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex flex-col grow shrink min-w-[240px] w-[211px]">
                    <TableHeader title="OUTPUT FILE" />
                    {dataToDisplay.map((run, index) => (
                        <React.Fragment key={index}>
                            <TableCell>
                                <div className={classNames(
            run.outputFile == "Pending" ? 'text-black' : 'text-indigo-600',
            'pr-0 w-[26px]',
          )} >{run.outputFile}</div>
                            </TableCell>
                            {index !== dataToDisplay.length - 1 && <TableDivider />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

function TableHeader({ title }) {
    return (
        <div className="flex flex-col w-full text-xs tracking-wide text-gray-500 uppercase whitespace-nowrap">
            <div className="gap-2.5 self-stretch px-6 py-3 bg-gray-50 max-md:px-5">
                {title}
            </div>
            <div className="z-10 shrink-0 h-px bg-gray-200 border border border-solid" />
        </div>
    );
}

function TableCell({ children }) {
    return (
        <div className="flex flex-col justify-center items-start px-6 py-7 max-w-full min-h-[72px] w-[325px] max-md:px-5">
            {children}
        </div>
    );
}

function TableDivider() {
    return <div className="w-full bg-gray-200 border border border-solid min-h-[1px]" />;
}

export default ModelRunHistory;

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
                                <div className='pr-0 w-[26px]'>
                                {run.outputFile == "Pending" ? (<>Pending</>) :
                                 (<a href={run.outputLink}>Download</a>)}</div>
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

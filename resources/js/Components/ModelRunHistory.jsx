import React from 'react';
import { usePage } from '@inertiajs/react';

const ModelRunHistory = () => {
    const { modelRunHistory } = usePage().props;

    const sampleModelRunHistory = [
        // Only for test purposes
        {
            date: '01/02/2024 9:30 AM',
            user: 'Jane Cooper',
            batch: 'Batch234',
            outputFile: '20240201_results.csv',
        },
        {
            date: '09/17/2023 11:30 AM',
            user: 'James Smith',
            batch: 'Batch123',
            outputFile: '20230917_results.csv',
        },
    ];

    const dataToDisplay = modelRunHistory || sampleModelRunHistory;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Model Run History</h3> {/* Heading remains */}
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
                <div className="flex flex-col grow shrink text-indigo-600 min-w-[240px] w-[211px]">
                    <TableHeader title="OUTPUT FILE" />
                    {dataToDisplay.map((run, index) => (
                        <React.Fragment key={index}>
                            <TableCell>
                                <div className="pr-0 w-[26px]">{run.outputFile}</div>
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
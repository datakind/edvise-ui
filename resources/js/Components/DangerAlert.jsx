import React from 'react';
import {
XCircleIcon,
} from '@heroicons/react/24/solid';

export default function DangerAlert({ errDict, className }) {
    if (errDict == undefined || Object.keys(errDict).length == 0) {
        return null;
    }

    return (<div className={className}>
      <div className="rounded-lg shadow-md bg-red-50 pt-4 pb-4 pl-6 pr-6">
  <div className="flex">
    <XCircleIcon aria-hidden="true" className="shrink-0 inline-block align-middle size-5 shrink-0 text-red-400" />
    <div className="ml-3">
      <h3 className="text-sm font-medium text-red-800">There were errors with your submission</h3>
      <div className="mt-2 text-sm text-red-700">
        <ul role="list" className="list-disc space-y-1 pl-5">
        { Object.entries(errDict).map(([k,v]) => (
          <li key={k}>{k}: {v}</li>
        ))}
        </ul>
      </div>
    </div>
  </div>
</div>
    </div>);
}
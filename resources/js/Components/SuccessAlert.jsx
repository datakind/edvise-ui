import React from 'react';
import {
CheckCircleIcon,
} from '@heroicons/react/24/solid';

export default function SuccessAlert({ errDict, className }) {
  if (errDict !== undefined && Object.keys(errDict).length !== 0) {
        return null;
    }
    return (<div className={className}>
      <div className="pt-4 pb-4 pr-6 pl-6 shadow-md rounded-lg bg-green-50">
  <div className="flex">
      <CheckCircleIcon aria-hidden="true" className="shrink-0 inline-block align-middle size-5 text-green-400" />
    <div className="ml-3">
      <p className="text-sm font-medium text-green-800">Submission can be uploaded!</p>
    </div>
  </div>
</div>
    </div>);
}
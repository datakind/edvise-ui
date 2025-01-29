import React from 'react';
import classNames from 'classnames';

export default function ProgressBar({ progressMsg, amt, className }) {
  let widthVar = "w-0";
  if (amt !== "") {
    widthVar = "w-"+amt;
  }
    return (
<div className={className}>
  <div className="flex flex-col items-center font-medium w-full gap-y-6 pr-6 pl-6">
  <h3 className="text-md font-semibold text-black">{progressMsg}</h3>
    <div className="w-full bg-gray-300 rounded-full h-2.5">
      <div className={classNames('bg-gray-600 h-2.5 rounded-full '+widthVar)}></div>
    </div>
  </div>
</div>);
}

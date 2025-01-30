import React from 'react';
import classNames from 'classnames';

export default function Spinner({ mainMsg,className }) {
    if (mainMsg == undefined || mainMsg == "") {
        return null;
    }

    return (
      <div className={classNames(className,
                            "flex w-full flex-row justify-center items-center gap-x-6",
                          )}>
<span className="flex inline-block align-[-0.125em] text-lg">{mainMsg}</span>
    <div
  className="flex text-gray-700 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
  role="status">
</div>
        </div>);
}




import React from 'react';
import classNames from 'classnames';

export default function LoadingDots({ mainMsg, className }) {
  if (mainMsg == undefined || mainMsg == '') {
    return null;
  }

  return (
    <div className={classNames(className, 'flex w-full')}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg font-semibold">{mainMsg}</span>
        <div className="size-6 h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.2s]"></div>
        <div className="size-6 h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.1s]"></div>
        <div className="size-6 h-2 w-2 animate-bounce rounded-full bg-black"></div>
      </div>
    </div>
  );
}

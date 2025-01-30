import React from 'react';
import classNames from 'classnames';

export default function LoadingDots({ mainMsg,className }) {
    if (mainMsg == undefined || mainMsg == "") {
        return null;
    }

    return (
      <div className={classNames(className,
                            "flex w-full",
                          )}>
         <div className='flex space-x-2 justify-center items-center'>
        <span className='text-lg font-semibold'>{mainMsg}</span>
    <div className='size-6 h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.2s]'></div>
    <div className='size-6 h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.1s]'></div>
    <div className='size-6 h-2 w-2 bg-black rounded-full animate-bounce'></div>
</div>
        </div>);
}




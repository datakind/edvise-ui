import classNames from 'classnames';
import React from 'react';
export default function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700',
        props.className,
      )}
    >
      {children}
    </button>
  );
}

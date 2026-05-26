import classNames from 'classnames';
import React from 'react';
export default function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={classNames(
        'inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-25',
        props.className,
      )}
    >
      {children}
    </button>
  );
}

import React from 'react';
import classNames from 'classnames';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HeaderLabel({
  className,
  iconObj,
  majorTitle,
  minorTitle,
}) {
  return (
    <div
      className={classNames(
        className,
        'flex flex-row w-full items-begin gap-x-2 text-left text-lg font-bold text-[#637381]',
      )}
    >
      {iconObj} {majorTitle}{' '}
      {minorTitle == "" ? (<></>) : (<><ArrowRightIcon aria-hidden="true" className="size-6 shrink-0" />{' '}<span className="text-black">{minorTitle}</span></>) }
    </div>
  );
}

import React from 'react';
import classNames from 'classnames';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

const VARIANTS = {
  danger: {
    Icon: XCircleIcon,
    border: 'border-red',
    surface: 'bg-red-50',
    iconWrap: 'bg-red',
    title: 'text-red-900',
    item: 'text-red-800',
  },
  warning: {
    Icon: ExclamationTriangleIcon,
    border: 'border-amber-500',
    surface: 'bg-amber-50',
    iconWrap: 'bg-amber-500',
    title: 'text-amber-900',
    item: 'text-amber-800',
  },
  info: {
    Icon: InformationCircleIcon,
    border: 'border-sky-500',
    surface: 'bg-sky-50',
    iconWrap: 'bg-sky-500',
    title: 'text-sky-900',
    item: 'text-sky-800',
  },
  success: {
    Icon: CheckCircleIcon,
    border: 'border-green-600',
    surface: 'bg-green-50',
    iconWrap: 'bg-green-600',
    title: 'text-green-900',
    item: 'text-green-800',
  },
};

export default function Alert({
  variant = 'info',
  mainMsg,
  msgDict,
  excludeValue,
  className,
}) {
  if (mainMsg == undefined || mainMsg == '') {
    return null;
  }

  const v = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = v.Icon;

  return (
    <div
      className={classNames(
        className,
        'flex w-full rounded-lg border-l-[6px] px-7 py-8 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] md:p-9',
        v.border,
        v.surface,
      )}
    >
      <div
        className={classNames(
          'mr-5 flex h-[34px] w-full max-w-[34px] items-center justify-center rounded-lg',
          v.iconWrap,
        )}
      >
        <Icon className="size-[18px] text-white" aria-hidden />
      </div>
      <div className="flex h-fit w-full flex-col">
        <h5 className={classNames('mb-3 text-lg font-semibold', v.title)}>
          {mainMsg}
        </h5>
        <ul className="list-inside list-disc">
          {msgDict !== undefined && Object.keys(msgDict).length !== 0
            ? Object.entries(msgDict).map(([k, val]) =>
                val !== excludeValue ? (
                  <li
                    className={classNames('text-base leading-relaxed', v.item)}
                    key={k}
                  >
                    <span className="font-semibold">{k}:</span> {val}
                  </li>
                ) : null,
              )
            : null}
        </ul>
      </div>
    </div>
  );
}

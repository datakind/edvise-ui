import React from 'react';
import classNames from 'classnames';

/**
 * @param {string} [progressMsg] — line above the bar
 * @param {number|null|undefined} [percent] — 0–100 when determinate; ignored when indeterminate
 * @param {boolean} [indeterminate] — pulse bar (e.g. server-side validation)
 * @param {string} [className]
 */
export default function ProgressBar({
  progressMsg,
  percent,
  className,
  indeterminate,
}) {
  const fillPct =
    indeterminate || percent == null
      ? null
      : Math.min(100, Math.max(0, Number(percent)));

  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center gap-y-3 px-6 font-medium">
        {progressMsg ? (
          <h3 className="text-md text-center text-black">{progressMsg}</h3>
        ) : null}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-300">
          {fillPct != null ? (
            <div
              className={classNames(
                'h-2.5 rounded-full bg-[#f79222] transition-[width] duration-150 ease-out',
              )}
              style={{ width: `${fillPct}%` }}
            />
          ) : (
            <div className="h-2.5 w-2/5 max-w-full animate-pulse rounded-full bg-[#f79222]" />
          )}
        </div>
      </div>
    </div>
  );
}

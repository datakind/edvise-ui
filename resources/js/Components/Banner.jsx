import React from 'react';
import classNames from 'classnames';

export default function Banner({ children, className }) {
  return (
    <aside className={classNames('banner', className)} aria-label="Notice">
      {children}
    </aside>
  );
}

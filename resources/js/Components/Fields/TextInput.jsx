import classNames from 'classnames';
import React, { forwardRef } from 'react';
const TextInput = forwardRef((props, ref) => (
  <input
    {...props}
    ref={ref}
    className={classNames(
      'rounded-full border-gray-300 shadow-sm focus:border-[#F79122] focus:ring-[#F79122]',
      props.className,
    )}
  />
));
export default TextInput;

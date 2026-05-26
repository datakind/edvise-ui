import classNames from 'classnames';
import React, { forwardRef } from 'react';
const TextInput = forwardRef(function TextInput(props, ref) {
  return <input {...props} ref={ref} className={classNames(props.className)} />;
});
export default TextInput;

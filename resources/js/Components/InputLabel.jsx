import React from 'react';
export default function InputLabel({ value, htmlFor, children }) {
  return (
    <label
      className="block text-sm font-medium text-gray-700"
      htmlFor={htmlFor}
    >
      {value || children}
    </label>
  );
}

import React, { useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const DropdownButton = ({
  getSelectedNames,
  selectedVariables,
  dropdownOpen,
  setDropdownOpen,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscapeKey = event => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);
  return (
    <button
      className={`flex min-h-[36px] w-full items-center justify-between gap-2 rounded-full p-2 px-4 text-left ${selectedVariables ? 'bg-gray-300' : 'bg-gray-100'}`}
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {selectedVariables ? (
        getSelectedNames()
      ) : (
        <span className="italic">None selected</span>
      )}
      <ChevronDownIcon className="text-gray h-4 w-4 shrink-0" />
    </button>
  );
};

export default DropdownButton;

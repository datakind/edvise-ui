import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

export default function TableColumnSelection({
  rowsPerPage,
  setRowsPerPage,
  selectedColumns,
  setSelectedColumns,
  dictionary,
}) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [rowsDropdownVisible, setRowsDropdownVisible] = useState(false);
  const columnsDropdownRef = useRef(null);
  const rowsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        columnsDropdownRef.current &&
        !columnsDropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
      if (
        rowsDropdownRef.current &&
        !rowsDropdownRef.current.contains(event.target)
      ) {
        setRowsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRowsPerPageChange = value => {
    setRowsPerPage(value);
    setRowsDropdownVisible(false);
  };

  const handleColumnSelection = e => {
    const value = e.target.value;
    setSelectedColumns(prev =>
      prev.includes(value)
        ? prev.filter(col => col !== value)
        : [...prev, value],
    );
  };

  return (
    <div className="flex">
      <div className="relative z-12 mb-4" ref={columnsDropdownRef}>
        <button
          onClick={() => setDropdownVisible(!dropdownVisible)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700"
        >
          Select Columns
          <ChevronDownIcon className="ml-1 inline h-5 w-5" />
        </button>

        {dropdownVisible && (
          <div className="absolute left-0 z-30 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            {Object.keys(dictionary[0] || {})
              .filter(key => !['id', 'created_at', 'updated_at'].includes(key)) // Exclude specific columns
              .map(key => {
                const formattedKey = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, char => char.toUpperCase()); // Replace underscores and capitalize
                return (
                  <label key={key} className="block px-4 py-2 text-sm">
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedColumns.includes(key)}
                      onChange={handleColumnSelection}
                      className="mr-2"
                    />
                    {formattedKey}
                  </label>
                );
              })}
          </div>
        )}
      </div>

      <div className="relative z-12 mb-4 ml-4" ref={rowsDropdownRef}>
        <button
          onClick={() => setRowsDropdownVisible(!rowsDropdownVisible)}
          className="rounded-lg bg-gray-200 px-3 py-2 text-gray-700"
        >
          Rows: {rowsPerPage === 9999 ? 'All' : rowsPerPage}
          <ChevronDownIcon className="ml-1 inline h-5 w-5" />
        </button>

        {rowsDropdownVisible && (
          <div className="absolute left-0 z-30 mt-2 w-24 rounded-lg border border-gray-200 bg-white shadow-lg">
            {[10, 25, 50, 100, 9999].map(value => (
              <button
                key={value}
                onClick={() => handleRowsPerPageChange(value)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
              >
                {value === 9999 ? 'All' : value}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

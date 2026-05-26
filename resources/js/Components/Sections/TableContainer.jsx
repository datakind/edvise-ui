import React, { useRef, useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

export default function TableContainer({
  dictionary,
  selectedColumns,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
}) {
  const tableContainerRef = useRef(null);
  const [originalColumnOrder, setOriginalColumnOrder] = useState([]);

  useEffect(() => {
    if (dictionary.length > 0 && originalColumnOrder.length === 0) {
      setOriginalColumnOrder(Object.keys(dictionary[0]));
    }
  }, [dictionary, originalColumnOrder]);

  const handleScrollLeft = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({
        left: -tableContainerRef.current.offsetWidth / selectedColumns.length,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({
        left: tableContainerRef.current.offsetWidth / selectedColumns.length,
        behavior: 'smooth',
      });
    }
  };

  const tableWidth = tableContainerRef.current?.scrollWidth || 0;
  const containerWidth = tableContainerRef.current?.clientWidth || 0;
  const shouldShowScrollArrows = tableWidth > containerWidth;

  const formatColumnHeader = key => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleContentRendering = content => {
    const isLink = typeof content === 'string' && content.startsWith('http');
    const isVisibility =
      (typeof content === 'string' && content === 'Public') ||
      content === 'Private';
    return isLink ? (
      <a href={content} target="_self" className="text-blue-600 underline">
        {content}
      </a>
    ) : isVisibility ? (
      content === 'Public' ? (
        <GlobeAltIcon className="h-8 w-8 text-gray-500" />
      ) : (
        <LockClosedIcon className="h-8 w-8 text-gray-500" />
      )
    ) : (
      content
    );
  };

  return (
    <div className="relative z-0 mx-auto px-12">
      <div
        ref={tableContainerRef}
        className="overflow-x-auto rounded-lg border-2 border-gray-300 bg-white"
      >
        <table className="min-w-full table-fixed bg-white">
          <thead>
            <tr>
              {originalColumnOrder.map(
                key =>
                  selectedColumns.includes(key) && (
                    <th
                      key={key}
                      className="relative cursor-pointer border-b border-gray-200 p-4 text-left text-sm"
                      onClick={() => {
                        setSortColumn(key);
                        setSortDirection(prev =>
                          prev === 'asc' ? 'desc' : 'asc',
                        );
                      }}
                    >
                      {formatColumnHeader(key)}
                      <ChevronDownIcon
                        className={`absolute top-1/2 right-2 inline h-4 w-4 -translate-y-1/2 transform ${sortColumn === key ? 'block' : 'hidden'} ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                      />
                    </th>
                  ),
              )}
            </tr>
          </thead>
          <tbody>
            {dictionary.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {originalColumnOrder.map(
                  col =>
                    selectedColumns.includes(col) && (
                      <td
                        key={col}
                        className={`overflow-x-scroll border-b border-gray-200 px-4 py-1 text-sm ${col === 'description' ? 'min-w-[30rem]' : 'w-[15rem] max-w-[15rem] min-w-[15rem]'} ${col === 'visibility' ? 'w-[5rem] max-w-[5rem] min-w-[5rem] text-center' : ''}`}
                      >
                        {handleContentRendering(row[col])}
                      </td>
                    ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shouldShowScrollArrows && (
        <>
          <div className="fixed top-1/2 left-2 mt-12">
            <button
              onClick={handleScrollLeft}
              className="rounded-full bg-gray-200 p-2"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="fixed top-1/2 right-2 mt-12">
            <button
              onClick={handleScrollRight}
              className="rounded-full bg-gray-200 p-2"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

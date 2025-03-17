import AppLayout from '@/Layouts/AppLayout';
import HeaderLabel from '@/Components/HeaderLabel';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import SortIcon from '@/Components/Icons/SortIcon';
import React, { useState, useEffect } from 'react';

export default function ManageUploads() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const mockUpload1 = {
    id: 'Id1',
    batch: 'Batch1',
    files: ['FileA', 'FileB'],
    modified_by: 'Jane Doe',
    date_modified: '01/02/2024 9:30 AM',
    status: 'In progress',
  };

  const mockUpload2 = {
    id: 'Id2',
    batch: 'Batch2',
    files: ['Very very long file name FileX', 'Long file name FileY'],
    modified_by: 'John Doe',
    date_modified: '11/10/2024 7:30 AM',
    status: 'In progress',
  };

  useEffect(() => {
    // To Do: Please replace by call to the backend API but keep the mock around for easy frontend testing. 
    // Use the mock JSON object for reference on the format of the response.
    const getUploadsData = async () => {
      try {
        const jsonResponse = [mockUpload1, mockUpload2];
        setData(jsonResponse);
        setLoading(false);
      }
      catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    getUploadsData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleSort = (column) => {
    sortData(column);
  };

  const sortData = (column) => {
    let sortedData = [...data]; 

    if (sortColumn === column && sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection('asc');
    }

    if (sortColumn === column) {
      sortedData.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    } else {
      setSortColumn(column);
      sortedData.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      });
    }
    setData(sortedData);
  };

  return (
    <AppLayout
      title="Manage Uploads"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Manage Uploads
        </h2>
      )}
    >
      <div className="w-full flex flex-col pl-12" id="main_area">
        <HeaderLabel
          iconObj={
            <PlusCircleIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Actions"
          minorTitle="Manage Uploads"
        ></HeaderLabel>
        <div className='w-full flex pt-16'>
          <table className='min-w-[60%] max-w-[90%] table-auto text-left rounded-lg bg-white shadow-md' id="uploads-table">
            <thead>
              <tr className='bg-gray-50 border-b border-gray-300 text-gray-500 text-xs font-medium leading-normal tracking-[0.6px] uppercase'>
                <th className='p-4 px-6'>
                  <button onClick={() => handleSort('batch')}>
                    <span className='inline-flex align-middle pr-2'>BATCH</span><SortIcon />
                  </button>
                </th>
                <th className='p-4 px-6'>
                  <button onClick={() => handleSort('files')}>
                    <span className='inline-flex align-middle pr-2'>FILES</span><SortIcon />
                  </button></th>
                <th className='p-4 px-6'><button onClick={() => handleSort('modified_by')}>
                  <span className='inline-flex align-middle pr-2'>MODIFIED BY</span><SortIcon />
                </button></th>
                <th className='p-4 px-6'><button onClick={() => handleSort('date_modified')}>
                  <span className='inline-flex align-middle pr-2'>DATE MODIFIED</span><SortIcon />
                </button></th>
                <th className='p-4 px-6'><button onClick={() => handleSort('date_modified')}>
                  <span className='inline-flex align-middle pr-2'>STATUS</span><SortIcon />
                </button></th>
              </tr>
            </thead>

            <tbody>
              {data.map((upload) => (
                <tr className='border-b border-gray-300 text-gray-700 text-sm font-normal leading-5' key={upload.id}>
                  <td className='p-4 px-6'>{upload.batch}</td>
                  <td className='p-4 px-6'><ul>
                    {upload.files.map((item, index) => (
                      <li key={index}>&#8226;&nbsp;{item}</li>
                    ))}
                  </ul></td>
                  <td className='p-4 px-6 font-medium'>{upload.modified_by}</td>
                  <td className='p-4 px-6 font-medium'>{upload.date_modified}</td>
                  <td className='p-4 px-6'>{upload.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
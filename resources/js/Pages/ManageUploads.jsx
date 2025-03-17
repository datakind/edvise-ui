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
    batch_id: 'Id1',
    inst_id: '12345',
    file_names_to_ids: { 'file1.txt': '123', 'file2.txt': '124' },
    name: 'Batch1',
    created_by: 'Jane Doe',
    completed: true,
    deleted: false,
    updated_at: '01/02/2024 09:30:20',
    created_at: '01/02/2024 09:30:20',
    updated_by: 'Jane Doe',
  };

  const mockUpload2 = {
    batch_id: 'Id1',
    inst_id: '12345',
    file_names_to_ids: {
      'Very very long file name FileX.txt': '123',
      'Long file name FileY.txt': '124',
    },
    name: 'Batch1',
    created_by: 'Jane Doe',
    completed: true,
    deleted: false,
    updated_at: '01/02/2024 09:30:20',
    created_at: '01/02/2024 09:30:20',
    updated_by: 'Jane Doe',
  };

  useEffect(() => {
    // To Do: Please replace by call to the backend API but keep the mock around for easy frontend testing.
    // Use the mock JSON object for reference on the format of the response.
    const getUploadsData = async () => {
      try {
        // Comment out the following lines when testing.
        const output = await axios.get('/view-uploaded-data');
        if (output != null) {
          setData(output.data.batches);
        }

        /* // Uncomment when testing
        const jsonResponse = [mockUpload1, mockUpload2];
        setData(jsonResponse);
        */
        setLoading(false);
      } catch (err) {
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
        <div className="w-full flex pt-16">
          <table
            className="min-w-[60%] max-w-[90%] table-auto text-left rounded-lg bg-white shadow-md"
            id="uploads-table"
          >
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
              </tr>
            </thead>

            <tbody>
              {data.map(upload =>
                upload.deleted ? (
                  <></>
                ) : (
                  <tr
                    className="border-b border-gray-300 text-gray-700 text-sm font-normal leading-5"
                    key={upload.batch_id}
                  >
                    <td className="p-4 px-6">{upload.name}</td>
                    <td className="p-4 px-6">
                      <ul>
                        {Object.entries(upload.file_names_to_ids).map(
                          ([k, v]) => (
                            <li key={k}>&#8226;&nbsp;{k}</li>
                          ),
                        )}
                      </ul>
                    </td>
                    <td className="p-4 px-6 font-medium">
                      {upload.updated_by}
                    </td>
                    <td className="p-4 px-6 font-medium">
                      {upload.updated_at}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

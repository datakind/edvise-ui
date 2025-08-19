import AppLayout from '@/Layouts/AppLayout';
import HeaderLabel from '@/Components/HeaderLabel';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import SortIcon from '@/Components/Icons/SortIcon';
import OverflowMenu from '@/Components/OverflowMenu';
import React, { useState, useEffect } from 'react';
import DialogModal from '@/Components/Modals/DialogModal';
import ActionSection from '@/Components/ActionSection';
import TextInput from '@/Components/Fields/TextInput';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';

export default function ManageUploads() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isChangeModalPrimaryBtnDisabled, setIsChangeModalPrimaryBtnDisabled] =
    useState(true);

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
    batch_id: 'Id2',
    inst_id: '12345',
    file_names_to_ids: {
      'Very very long file name FileX.txt': '123',
      'Long file name FileY.txt': '124',
    },
    name: 'Batch2',
    created_by: 'John Doe',
    completed: true,
    deleted: false,
    updated_at: '01/02/2024 09:30:20',
    created_at: '01/02/2024 09:30:20',
    updated_by: 'John Doe',
  };

  const actions = [
    { label: 'Change batch name', onClick: () => showChangeModal() },
    {
      label: 'Delete batch',
      onClick: () => console.log('Delete batch clicked'),
    },
  ];

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

  const handleSort = column => {
    sortData(column);
  };

  const sortData = column => {
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

  const showChangeModal = () => {
    setIsChangeModalOpen(true);
  };

  const enableChangeModalPrimaryBtn = () => {
    setIsChangeModalPrimaryBtnDisabled(false);
  };

  const closeChangeModal = () => {
    setIsChangeModalOpen(false);
    setIsChangeModalPrimaryBtnDisabled(true);
  };

  const changeBatchName = () => {
    //TODO: Make necessary backend calls to update the batch name.
    console.log('Updating batch name....');
    setIsChangeModalOpen(false);
  };

  if (isChangeModalOpen) {
    return (
      <ActionSection>
        <DialogModal isOpen={isChangeModalOpen} onClose={closeChangeModal}>
          <DialogModal.Content title={'Change batch name'}>
            <div className="mt-4">
              <TextInput
                className="mt-1 block w-3/4"
                placeholder="OldBatchName"
                onChange={() => enableChangeModalPrimaryBtn()}
              />
            </div>
          </DialogModal.Content>
          <DialogModal.Footer>
            <SecondaryButton
              style={{
                background: 'white',
                color: '#f79222',
                border: '1px solid #f79222',
                textTransform: 'none',
                fontFamily: 'Helvetica Neue',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '500',
                marginRight: '8px',
              }}
              onClick={closeChangeModal}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              style={{
                background: '#f79222',
                color: 'white',
                textTransform: 'none',
                fontFamily: 'Helvetica Neue',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '500',
                opacity: isChangeModalPrimaryBtnDisabled ? '0.5' : '1',
              }}
              disabled={isChangeModalPrimaryBtnDisabled}
              onClick={changeBatchName}
            >
              Update
            </PrimaryButton>
          </DialogModal.Footer>
        </DialogModal>
      </ActionSection>
    );
  }

  return (
    <AppLayout title="Manage Uploads">
      <div
        className="mx-12 mb-12 flex w-full flex-col rounded-3xl bg-white"
        id="main_area"
      >
        <h1 className="py-12 text-center text-5xl font-light">
          Manage Uploads
        </h1>
        <div className="mx-auto flex w-full justify-center">
          <table
            className="mx-6 w-[93%] table-auto rounded-lg bg-white text-left shadow-md"
            id="uploads-table"
          >
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 text-xs font-medium uppercase leading-normal tracking-[0.6px] text-gray-500">
                <th className="p-4 px-6">
                  <button onClick={() => handleSort('batch')}>
                    <span className="inline-flex pr-2 align-middle">BATCH</span>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 px-6">
                  <button onClick={() => handleSort('files')}>
                    <span className="inline-flex pr-2 align-middle">FILES</span>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 px-6">
                  <button onClick={() => handleSort('modified_by')}>
                    <span className="inline-flex pr-2 align-middle">
                      MODIFIED BY
                    </span>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 px-6">
                  <button onClick={() => handleSort('date_modified')}>
                    <span className="inline-flex pr-2 align-middle">
                      DATE MODIFIED
                    </span>
                    <SortIcon />
                  </button>
                </th>
                <th className="p-4 px-6">
                  <span className="inline-flex pr-2 align-middle">ACTIONS</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map(upload =>
                upload.deleted ? (
                  <></>
                ) : (
                  <tr
                    className="border-b border-gray-300 text-sm font-normal leading-5 text-gray-700"
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
                    <td className="p-4 px-6 font-medium">
                      <OverflowMenu items={actions} />
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

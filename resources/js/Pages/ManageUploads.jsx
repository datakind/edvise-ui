import AppLayout from '@/Layouts/AppLayout';
import SortIcon from '@/Components/Icons/SortIcon';
import OverflowMenu from '@/Components/OverflowMenu';
import React, { useState, useEffect } from 'react';
import DialogModal from '@/Components/Modals/DialogModal';
import ActionSection from '@/Components/ActionSection';
import TextInput from '@/Components/Fields/TextInput';
import SecondaryButton from '@/Components/Buttons/SecondaryButton';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function ManageUploads() {
  // Get inst_id from Inertia shared props (no API call needed!)
  const { inst_id } = usePage().props;
  console.log('ManageUploads - Institution ID from shared props:', inst_id);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [isChangeModalPrimaryBtnDisabled, setIsChangeModalPrimaryBtnDisabled] =
    useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [batchToChange, setBatchToChange] = useState(null);
  const [newBatchName, setNewBatchName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const actions = [
    { label: 'Change batch name', onClick: upload => showChangeModal(upload) },
    {
      label: 'Delete batch',
      onClick: batch => showDeleteModal(batch),
    },
  ];

  const getUploadsData = async () => {
    try {
      // Comment out the following lines when testing.
      const output = await axios.get('/view-uploaded-data');
      if (output != null) {
        // Sort by created_at in descending order (newest first)
        const sortedBatches = output.data.batches.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Descending order
        });
        setData(sortedBatches);
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

  useEffect(() => {
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

  const showChangeModal = upload => {
    setBatchToChange(upload);
    setNewBatchName(upload?.name || '');
    setIsChangeModalOpen(true);
  };

  const enableChangeModalPrimaryBtn = () => {
    setIsChangeModalPrimaryBtnDisabled(false);
  };

  const changeBatchName = async () => {
    if (!batchToChange || !inst_id || !newBatchName.trim()) {
      console.error('Missing required data for batch name change');
      return;
    }

    try {
      const requestBody = {
        name: newBatchName.trim(),
        batch_disabled: batchToChange.batch_disabled || false,
        file_ids: Object.values(batchToChange.file_names_to_ids || {}),
        file_names: Object.keys(batchToChange.file_names_to_ids || {}),
        completed: batchToChange.completed || false,
        deleted: batchToChange.deleted || false,
      };

      console.log('Changing batch name with request body:', requestBody);

      const response = await axios.patch(
        `/institutions/${inst_id}/batch/${batchToChange.batch_id}`,
        requestBody,
      );

      console.log('Batch name change response:', response.data);

      // Refresh data from server instead of updating local state
      await getUploadsData();

      // Close modal and reset state
      closeChangeModal();
    } catch (error) {
      console.error('Error changing batch name:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const closeChangeModal = () => {
    setIsChangeModalOpen(false);
    setIsChangeModalPrimaryBtnDisabled(true);
    setBatchToChange(null);
    setNewBatchName('');
  };

  const showDeleteModal = batch => {
    setBatchToDelete(batch);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBatchToDelete(null);
  };

  const deleteBatch = async () => {
    if (!batchToDelete || !inst_id) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/batch/${batchToDelete.batch_id}`);
      console.log('Batch deleted successfully:', response.data);

      // Remove the deleted batch from the data
      setData(prevData =>
        prevData.filter(batch => batch.batch_id !== batchToDelete.batch_id),
      );

      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting batch:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  if (isChangeModalOpen) {
    return (
      <ActionSection>
        <DialogModal isOpen={isChangeModalOpen} onClose={closeChangeModal}>
          <DialogModal.Content title={'Change batch name'}>
            <div className="mt-4">
              <TextInput
                className="mt-1 block w-3/4"
                value={newBatchName}
                onChange={e => {
                  setNewBatchName(e.target.value);
                  enableChangeModalPrimaryBtn();
                }}
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

  if (isDeleteModalOpen) {
    return (
      <ActionSection>
        <DialogModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <DialogModal.Content title={'Delete Batch'}>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the batch &ldquo;
                {batchToDelete?.name}&rdquo;? This action cannot be undone and
                will permanently remove all associated files.
              </p>
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
              onClick={closeDeleteModal}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              style={{
                background: '#dc2626',
                color: 'white',
                textTransform: 'none',
                fontFamily: 'Helvetica Neue',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '500',
                opacity: isDeleting ? '0.5' : '1',
              }}
              disabled={isDeleting}
              onClick={deleteBatch}
            >
              {isDeleting ? 'Deleting...' : 'Delete Batch'}
            </PrimaryButton>
          </DialogModal.Footer>
        </DialogModal>
      </ActionSection>
    );
  }

  return (
    <AppLayout title="Manage Uploads">
      <div
        className="mx-12 mb-12 rounded-3xl bg-white pb-6"
        id="main_area"
      >
        <h1 className="py-12 text-center text-5xl font-light">
          Manage Uploads
        </h1>
        <div className="overflow-x-auto px-6">
          <table
            className="w-full table-auto text-left"
            id="uploads-table"
          >
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 text-xs font-medium uppercase leading-normal tracking-[0.6px] text-gray-500">
                <th scope="col" className="p-4 px-6">
                  <button onClick={() => handleSort('batch')}>
                    <span className="inline-flex pr-2 align-middle">BATCH</span>
                    <SortIcon />
                  </button>
                </th>
                <th scope="col" className="p-4 px-6">
                  <button onClick={() => handleSort('files')}>
                    <span className="inline-flex pr-2 align-middle">FILES</span>
                    <SortIcon />
                  </button>
                </th>
                <th scope="col" className="p-4 px-6">
                  <button onClick={() => handleSort('modified_by')}>
                    <span className="inline-flex pr-2 align-middle">
                      MODIFIED BY
                    </span>
                    <SortIcon />
                  </button>
                </th>
                <th scope="col" className="p-4 px-6">
                  <button onClick={() => handleSort('date_modified')}>
                    <span className="inline-flex pr-2 align-middle">
                      DATE MODIFIED
                    </span>
                    <SortIcon />
                  </button>
                </th>
                <th scope="col" className="p-4 px-6">
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
                        {Object.entries(upload.file_names_to_ids).map(([k]) => (
                          <li key={k}>&#8226;&nbsp;{k}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 px-6 font-medium">
                      {upload.updated_by}
                    </td>
                    <td className="p-4 px-6 font-medium">
                      {upload.updated_at}
                    </td>
                    <td className="p-4 px-6 font-medium">
                      <OverflowMenu
                        items={actions.map(action => ({
                          ...action,
                          onClick: () => action.onClick(upload),
                        }))}
                      />
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

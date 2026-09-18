import axios from 'axios';
import { route } from 'ziggy-js';
import React, { useEffect, useState } from 'react';
import Spinner from '@/Components/Spinner';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import SortIcon from '@/Components/Icons/SortIcon';
import { formatModelName } from '@/utils/stringUtils';

export default function ArchivedModels() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('/models-api');
        setModels((response.data || []).filter(model => model.archived));
      } catch (err) {
        if (err.response?.data?.error) {
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleSort = column => {
    setSortDirection(
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc',
    );
    setSortColumn(column);
  };

  // archived_at is an ISO timestamp, so a string compare keeps chronological order.
  const sortedModels = sortColumn
    ? [...models].sort((a, b) => {
        const compare = String(a[sortColumn] ?? '').localeCompare(
          String(b[sortColumn] ?? ''),
        );
        return sortDirection === 'asc' ? compare : -compare;
      })
    : models;

  return (
    <AppLayout title="Archived Models">
      <div
        className="mx-12 mb-12 flex w-full flex-col rounded-3xl bg-white p-8"
        id="main_area"
      >
        {loading ? (
          <div className="flex w-full justify-center">
            <Spinner mainMsg="Loading"></Spinner>
          </div>
        ) : error != null ? (
          <Alert variant="danger" mainMsg={'Error: ' + error.message} />
        ) : (
          <div className="flex w-full flex-col items-center" id="main_content">
            <h1>Archived Models</h1>

            <div className="mx-auto mt-8 w-full max-w-[641px]">
              {models.length > 0 ? (
                <table
                  className="edvise-table edvise-table--card overflow-hidden"
                  id="archived-models-table"
                >
                  <thead>
                    <tr>
                      <th scope="col">
                        <button onClick={() => handleSort('name')}>
                          <span className="inline-flex pr-2 align-middle">
                            Name
                          </span>
                          <SortIcon />
                        </button>
                      </th>
                      <th scope="col">
                        <button onClick={() => handleSort('archived_at')}>
                          <span className="inline-flex pr-2 align-middle">
                            Date Archived
                          </span>
                          <SortIcon />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedModels.map(model => {
                      const [date, time] = String(
                        model.archived_at ?? '',
                      ).split('T');
                      const [year, month, day] = date.split('-');

                      return (
                        <tr key={model.m_id || model.name}>
                          <td>
                            <a
                              href={route(
                                'model-run-history.modelname',
                                model.name,
                              )}
                            >
                              {formatModelName(model.name)}
                            </a>
                          </td>
                          <td>
                            {year && day
                              ? `${month}/${day}/${year} ${time ?? ''}`.trim()
                              : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-500">
                  <div className="flex font-bold">
                    This institution does not have any archived models.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

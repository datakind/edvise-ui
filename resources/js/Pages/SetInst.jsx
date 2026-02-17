import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {
  DocumentDuplicateIcon,
  TrashIcon,
  DocumentIcon,
  CheckIcon,
  XMarkIcon,
  PlusCircleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import Steppers from '@/Components/Steppers';
import classNames from 'classnames';
import ProgressBar from '@/Components/ProgressBar';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import ErrorAlert from '@/Components/ErrorAlert';
import HeaderLabel from '@/Components/HeaderLabel';
import Spinner from '@/Components/Spinner';

export default function SetInstitution() {
  const { inst_id, message } = usePage().props;

  const [resultList, setResultList] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentInstId, setCurrentInstId] = useState(inst_id || '');
  const [selectedInstId, setSelectedInstId] = useState(inst_id || '');
  const [hideSetInstError, setHideSetInstError] = useState(false);

  useEffect(() => {
    // Fetch all institutions
    axios
      .get('/view-all-institutions-api')
      .then(res => {
        let resultingVar = {};
        res.data.forEach(b => (resultingVar[b.name] = b.inst_id));
        setResultList(resultingVar);
        setLoading(false);
      })
      .catch(err => {
        setError(JSON.stringify(err.message));
        setLoading(false);
      });
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    const inst = selectedInstId;
    const resultArea = document.getElementById('result_area');

    if (!inst || inst === '') {
      resultArea.innerHTML = '<span class="text-red-600 font-semibold">Error: Please select an institution</span>';
      return;
    }

    resultArea.innerHTML = '<span class="text-gray-600">Setting institution...</span>';

    return axios
      .post('/set-inst-api/' + inst)
      .then(res => {
        const institutionName = Object.entries(resultList).find(([name, id]) => id === inst)?.[0] || 'Unknown';
        setCurrentInstId(inst); // Update current institution after successful change
        resultArea.innerHTML = `<span class="text-green-600 font-semibold">✓ Successfully set institution to: ${institutionName}</span>`;
        setHideSetInstError(true);
      })
      .catch(e => {
        resultArea.innerHTML = `<span class="text-red-600 font-semibold">Error: ${e.message || e}</span>`;
      });
  };

  // The title in AppLayout needs to match the nav bar label.
  return (
    <AppLayout
      title="Set Institution"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          SetInst
        </h2>
      )}
    >
      <div className="flex w-full flex-col items-center" id="main_area">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Act as Institution"
        ></HeaderLabel>

        {message && !hideSetInstError && (
          <div className="mt-6 w-full max-w-2xl">
            <ErrorAlert
              mainMsg={`Error: ${message} Select an institution below to proceed.`}
            />
          </div>
        )}

        {error && (
          <div className="mt-8 w-full max-w-2xl rounded-lg bg-red-100 p-4 text-center text-red-700">
            <p className="font-semibold">Error loading institutions:</p>
            <p>{error}</p>
          </div>
        )}

        <form
          className="w-full max-w-full pl-36 pr-36 pt-24"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col">
            <div className="-mx-3 mb-6 flex justify-center">
              <div className="mb-6 w-full px-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                  Select Institution
                </label>
                <div className="relative">
                  <select
                    className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ backgroundImage: 'none' }}
                    name="instid"
                    value={selectedInstId}
                    onChange={(e) => setSelectedInstId(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">
                      {loading ? 'Loading institutions...' : 'Choose an institution...'}
                    </option>
                    {Object.entries(resultList)
                      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
                      .map(([name, inst_id]) => (
                        <option key={inst_id} value={inst_id}>
                          {name}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs italic text-gray-600">
                  Select the institution for the current Datakinder to use.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="mb-4 w-1/3 items-center justify-center rounded-lg bg-[#f79222] px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Set Institution
            </button>
          </div>
        </form>
        <div className="flex" id="result_area"></div>
      </div>
    </AppLayout>
  );
}

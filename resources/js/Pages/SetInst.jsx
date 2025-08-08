import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
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
import BigDangerAlert from '@/Components/BigDangerAlert';
import HeaderLabel from '@/Components/HeaderLabel';
import Spinner from '@/Components/Spinner';

export default function SetInstitution() {
  const [resultList, setResultList] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get('/view-all-institutions-api')
      .then(res => {
        let resultingVar = {};
        res.data.forEach(b => (resultingVar[b.name] = b.inst_id));
        setResultList(resultingVar);
      })
      .catch(err => {
        setError(JSON.stringify(err.message));
      });
  }, []);

  const handleSubmit = event => {
    event.preventDefault();
    let inst = event.target.elements.instid.value;
    if (inst == undefined) {
      document.getElementById('result_area').innerHTML =
        'Error: field is empty';
    }
    return axios
      .post('/set-inst-api/' + inst)
      .then(res => {
        document.getElementById('result_area').innerHTML = 'Done';
      })
      .catch(e => {
        document.getElementById('result_area').innerHTML = e;
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

        <div className="flex py-12">
          <div className="mx-auto flex flex-col items-center justify-center">
            <label className="mb-2 text-lg font-bold uppercase text-black">
              All institutions registered in the SST:
            </label>
            <ul>
              {error}
              {Object.entries(resultList).map(([name, inst_id]) => {
                return (
                  <li key={inst_id}>
                    {name} : {inst_id}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <form
          className="w-full max-w-full pl-36 pr-36 pt-24"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col">
            <div className="-mx-3 mb-6 flex justify-center">
              <div className="mb-6 w-full px-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                  The institution ID for the current Datakinder to use.
                </label>

                <input
                  className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                  name="instid"
                  type="text"
                  placeholder="Copy institution id here."
                ></input>
                <p className="text-xs italic text-gray-600">
                  Input the institution ID (e.g.
                  "f42c1c43f1f947bb85cf703bc3449c77") without quotes.
                </p>
              </div>
            </div>
            <div className="-mx-3 mb-6 flex hidden">
              <div className="mb-6 w-full px-3 md:mb-0 md:w-1/3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                  Institution
                </label>
                <div className="relative">
                  <select
                    className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                    id="grid-state"
                  >
                    <option>
                      Placeholder. Under development - Don't use this
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="mb-4 w-1/3 items-center justify-center rounded-lg bg-[#f79222] px-3 py-2 text-white"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="flex" id="result_area"></div>
      </div>
    </AppLayout>
  );
}

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
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          SetInst
        </h2>
      )}
    >
      <div className="w-full flex flex-col items-center" id="main_area">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Act as Institution"
        ></HeaderLabel>

        <div className="py-12 flex">
          <div className="flex flex-col mx-auto justify-center items-center">
            <label className="uppercase text-black text-lg font-bold mb-2">
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
            <div className="flex -mx-3 mb-6 justify-center">
              <div className="w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  The institution ID for the current Datakinder to use.
                </label>

                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  name="instid"
                  type="text"
                  placeholder="Copy institution id here."
                ></input>
                <p className="text-gray-600 text-xs italic">
                  Input the institution ID (e.g.
                  "f42c1c43f1f947bb85cf703bc3449c77") without quotes.
                </p>
              </div>
            </div>
            <div className="flex -mx-3 mb-6 hidden">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Institution
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
              className="bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
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

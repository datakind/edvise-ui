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

export default function AddDatakinders() {
  const handleSubmit = event => {
    event.preventDefault();
    let inst = event.target.elements.instid.value;
    if (inst == undefined) {
      document.getElementById('result_area').innerHTML =
        'Error: field is empty';
    }
    document.getElementById('result_area').innerHTML =
      'Placeholder. This page does not currently do anything.';

    /*return axios.post('/set-inst-api/'+inst).then(res => {
        document.getElementById("result_area").innerHTML = "Done";
    }).catch(e => {
        document.getElementById("result_area").innerHTML = e;
});*/
  };
  // The title in AppLayout needs to match the nav bar label.
  return (
    <AppLayout
      title="Add Datakinders"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          AddDk
        </h2>
      )}
    >
      <div className="w-full flex flex-col items-center" id="main_area">
        <h1 className="text-2xl font-bold pb-12">
          {' '}
          Add emails for accounts that should have access type DATAKINDER
        </h1>
        <form className="w-full max-w-full pl-36 pr-36" onSubmit={handleSubmit}>
          <div id="form_contents" className="flex flex-col">
            <div id="add_one_user" className="flex -mx-3 mb-2">
              <div className="w-1/2 px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="0-email"
                >
                  User email
                </label>
                <input
                  name="user-0"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="email"
                  placeholder="j.smith@datakind.org"
                ></input>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="flex bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
          >
            Submit
          </button>
        </form>
        <div className="flex" id="result_area"></div>
      </div>
    </AppLayout>
  );
}

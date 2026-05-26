import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';

const SCHOOL_TYPES = [
  { value: 'pdp', label: 'PDP' },
  { value: 'edvise', label: 'Edvise' },
  { value: 'legacy', label: 'Legacy' },
];

export default function CreateInst() {
  const [schoolType, setSchoolType] = useState('');
  const [addUserCounter, setAddUserCounter] = useState(0);

  const incrementCounter = () => {
    setAddUserCounter(c => c + 1);
  };

  const renderFullEmailList = () => {
    const arrOfAllAddedEmailSlots = Array.from(Array(addUserCounter).keys());
    return (
      <div>
        {arrOfAllAddedEmailSlots.map(id => (
          <div key={id} id="one_user" className="flex">
            <div className="w-1/2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                id="access"
              >
                Access Type
              </label>
              <div className="relative">
                <select
                  name={id + '-access'}
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option>MODEL_OWNER</option>
                  <option>VIEWER</option>
                </select>
              </div>
            </div>
            <div className="w-1/2 px-3 mb-6">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                id="email"
              >
                User email
              </label>
              <input
                name={id + '-email'}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="email"
                placeholder="j.smith@inst1.edu"
              ></input>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (
      event.target.elements.inst_name.value == null ||
      event.target.elements.inst_name.value == ''
    ) {
      document.getElementById('result_area').innerHTML =
        'Error: Institution name is required.';
      return;
    }
    if (!schoolType) {
      document.getElementById('result_area').innerHTML =
        'Error: Select exactly one of PDP, Edvise, or Legacy.';
      return;
    }
    if (schoolType === 'pdp') {
      const raw = event.target.elements.pdp_id?.value?.trim() ?? '';
      if (!raw) {
        document.getElementById('result_area').innerHTML =
          'Error: PDP Institution ID is required when PDP is selected.';
        return;
      }
    }
    var emailDict = {};
    var accessDict = {};
    Array.from(event.target.elements).forEach(input => {
      if (input.name.endsWith('-access') || input.name.endsWith('-email')) {
        let idx = Array.from(input.name)[0];
        if (input.name.endsWith('-access')) {
          accessDict[idx] = input.value;
        } else {
          emailDict[idx] = input.value;
        }
      }
    });

    var constructedEmailDict = {};
    for (const [key, value] of Object.entries(emailDict)) {
      if (value != null && value != '') {
        constructedEmailDict[value] = accessDict[key];
      }
    }
    const pdpChecked = schoolType === 'pdp';
    const payload = {
      name: event.target.elements.inst_name.value,
      state: event.target.elements.state.value,
      allowed_emails:
        Object.keys(constructedEmailDict).length === 0
          ? null
          : constructedEmailDict,
      is_pdp: pdpChecked,
      pdp_id: pdpChecked
        ? (event.target.elements.pdp_id?.value || null)
        : null,
    };
    if (schoolType === 'edvise') payload.is_edvise = true;
    if (schoolType === 'legacy') payload.is_legacy = true;
    return axios({
      method: 'post',
      url: '/create-inst-api',
      data: payload,
    })
      .then(res => {
        document.getElementById('result_area').innerHTML =
          'Done. Created new institution with ID: ' +
          JSON.stringify(res.data.inst_id);
      })
      .catch(e => {
        let err = '';
        if (e.response) {
          err = JSON.stringify(e.response.data.error);
        } else {
          err = JSON.stringify(e);
        }
        document.getElementById('result_area').innerHTML = 'Error: ' + err;
      });
  };

  return (
    <AppLayout
      title="Create Institution"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Create Institution
        </h2>
      )}
    >
      <div className="flex w-full flex-col items-center">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Create New Institution"
        ></HeaderLabel>
        <form
          className="w-full max-w-full pl-36 pr-36 pt-24"
          onSubmit={handleSubmit}
          onReset={() => setSchoolType('')}
        >
          <div id="form_contents" className="flex flex-col gap-y-6">
            <div className="flex flex-row w-full gap-x-6">
              <div className="flex flex-col w-2/3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="inst_name"
                >
                  Institution Name
                </label>
                <input
                  name="inst_name"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder="College/University Name"
                ></input>
                <p className="text-gray-700 text-xs italic">Required field.</p>
              </div>
              <div className="flex flex-col w-1/3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="state"
                >
                  State
                </label>
                <div className="relative">
                  <select
                    name="state"
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option defaultValue></option>
                    <option>AK</option>
                    <option>AL</option>
                    <option>AR</option>
                    <option>AZ</option>
                    <option>CA</option>
                    <option>CO</option>
                    <option>CT</option>
                    <option>DE</option>
                    <option>FL</option>
                    <option>GA</option>
                    <option>HI</option>
                    <option>IA</option>
                    <option>ID</option>
                    <option>IL</option>
                    <option>IN</option>
                    <option>KS</option>
                    <option>KY</option>
                    <option>LA</option>
                    <option>MA</option>
                    <option>MD</option>
                    <option>ME</option>
                    <option>MI</option>
                    <option>MN</option>
                    <option>MO</option>
                    <option>MS</option>
                    <option>MT</option>
                    <option>NC</option>
                    <option>ND</option>
                    <option>NE</option>
                    <option>NH</option>
                    <option>NJ</option>
                    <option>NM</option>
                    <option>NV</option>
                    <option>NY</option>
                    <option>OH</option>
                    <option>OK</option>
                    <option>OR</option>
                    <option>PA</option>
                    <option>RI</option>
                    <option>SC</option>
                    <option>SD</option>
                    <option>TN</option>
                    <option>TX</option>
                    <option>UT</option>
                    <option>VA</option>
                    <option>VT</option>
                    <option>WA</option>
                    <option>WI</option>
                    <option>WV</option>
                    <option>WY</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full gap-x-6">
              <div className="flex flex-col w-1/2">
                <fieldset>
                  <legend className="text-base font-semibold text-gray-900">
                    Institution type
                  </legend>
                  <p className="mt-1 text-sm text-gray-600">
                    Choose exactly one. Required before submit.
                  </p>
                  <div className="mt-4 space-y-3 border-b border-t border-gray-200 py-3">
                    {SCHOOL_TYPES.map(({ value, label }) => (
                      <div key={value} className="flex gap-3 items-center">
                        <input
                          id={`school_type_${value}`}
                          name="school_type"
                          type="radio"
                          value={value}
                          checked={schoolType === value}
                          onChange={() => setSchoolType(value)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label
                          htmlFor={`school_type_${value}`}
                          className="text-sm font-medium text-gray-900"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col w-1/2">
                {schoolType === 'pdp' ? (
                  <>
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      id="pdp_id"
                    >
                      PDP Institution ID
                    </label>
                    <input
                      name="pdp_id"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      type="text"
                    ></input>
                    <p className="text-gray-600 text-xs italic">
                      For PDP schools, please add the PDP_INST id of the
                      institution. Include any leading zeroes.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">
                    PDP Institution ID applies only when PDP is selected.
                  </p>
                )}
              </div>
            </div>
            <div id="mult_users" className="flex flex-col">
              {renderFullEmailList()}
            </div>
          </div>
          <div className="flex w-full justify-center">
            <button
              id="button_add_field"
              type="button"
              className="flex bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
              onClick={incrementCounter}
            >
              Add Another Email
            </button>
          </div>
          <div className="flex w-full justify-center gap-x-6 pt-12">
            <button type="reset" className="btn btn-secondary">
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        <div id="result_area" className="flex pb-24 pt-12"></div>
      </div>
    </AppLayout>
  );
}

import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';

const US_STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD',
  'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
  'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
];

export default function EditInst() {
  const [error, setError] = useState(null);
  const [addUserCounter, setAddUserCounter] = useState(1);
  const [schemas] = useState([
    { name: 'Custom', selected: false },
    { name: 'PDP', selected: false },
    { name: 'Edvise', selected: false },
    { name: 'Legacy', selected: false },
  ]);

  const removeItem = (itemId) => {
    const emailItem = document.getElementById(itemId);
    if (emailItem) {
      emailItem.remove();
    }
  };

  const incrementCounter = () => {
    setAddUserCounter(prev => prev + 1);
  };

  const resetForm = () => {
    setAddUserCounter(1);
    setError(null);
    schemas.forEach(schema => schema.selected = false);
    const form = document.getElementById('edit-institution-form');
    if (form) {
      form.reset();
    }
  };

  const renderFullEmailList = () => {
    const arrOfAllAddedEmailSlots = Array.from(
      Array(addUserCounter).keys(),
    ).slice(1);
    return (
      <div>
        {/* Default first row */}
        <div id="default_user" className="flex">
          <div className="w-1/2">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Access Type
            </label>
            <div className="relative">
              <select
                name="0-access"
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option>MODEL_OWNER</option>
                <option>VIEWER</option>
              </select>
            </div>
          </div>
          <div className="w-1/2 px-3 mb-6">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              User email
            </label>
            <input
              name="0-email"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="email"
              placeholder="j.smith@inst1.edu"
            />
          </div>
        </div>

        {/* Additional rows */}
        {arrOfAllAddedEmailSlots.map(id => (
          <div id="one_user" className="flex">
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const pdp = formData.get('PDP') === 'on';
    const edvise = formData.get('Edvise') === 'on';
    const legacy = formData.get('Legacy') === 'on';
    const schoolTypeCount = [pdp, edvise, legacy].filter(Boolean).length;
    if (schoolTypeCount > 1) {
      setError('Select at most one of PDP, Edvise, or Legacy.');
      return;
    }
    // API only updates fields that are sent; to clear a school type we must send null explicitly.
    // Omit edvise_id/legacy_id when that type is selected (no input to set; preserve existing).
    const payload = {
      name: formData.get('inst_name'),
      state: formData.get('state'),
      allowed_schemas: formData.get('Custom') ? ['UNKNOWN'] : null,
      allowed_emails: constructEmailDict(formData),
      is_pdp: pdp,
      pdp_id: pdp ? (formData.get('pdp_id') || null) : null,
      edvise_id: edvise ? undefined : null, // omit when Edvise so API keeps existing; null clears
      legacy_id: legacy ? undefined : null,  // omit when Legacy so API keeps existing; null clears
    };
    if (edvise) payload.is_edvise = true;
    if (legacy) payload.is_legacy = true;
    try {
      await axios.post('/edit-inst-api', payload);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <AppLayout
      title="Edit Institution"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Edit Institution
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
          minorTitle="Edit Institution [Do not use: Work in progress]"
        ></HeaderLabel>
        <form
          id="edit-institution-form"
          className="w-full max-w-full pl-36 pr-36 pt-24"
          onSubmit={handleSubmit}
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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white cursor-not-allowed"
                  type="text"
                  value="Placeholder for institution name"
                  disabled
                />
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
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full gap-x-6">
              <div className="flex flex-col w-1/2">
                <fieldset>
                  <legend className="text-base font-semibold text-gray-900">
                    Schemas accepted by this institution
                  </legend>
                  <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                    {schemas.map((schem, idx) => (
                      <div key={idx} className=" flex gap-3">
                        <div className="min-w-0 flex-1 text-sm/6 ">
                          <input
                            defaultChecked={schem.selected}
                            id={`${schem.name}`}
                            name={`${schem.name}`}
                            type="checkbox"
                            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600 indeterminate:border-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          />
                          <label
                            htmlFor={`${schem.name}`}
                            className="m-2 select-none font-medium text-gray-900"
                          >
                            {schem.name}
                          </label>
                        </div>
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-[:checked]:opacity-100"
                              />
                              <path
                                d="M3 7H11"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div className="flex flex-col w-1/2">
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
          <div className="flex w-full justify-center pt-12 gap-x-6">
            <button
              type="button"
              onClick={resetForm}
              className="flex bg-white text-[#f79222] border border-[#f79222] py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
            >
              Submit
            </button>
          </div>
        </form>
        {error && (
          <div className="text-red-500 mt-4">
            {error}
          </div>
        )}
        <div id="result_area" className="flex pb-24 pt-12"></div>
      </div>
    </AppLayout>
  );
}

import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import {
  Cog8ToothIcon,
} from '@heroicons/react/24/outline';



export default function CreateInst() {

  // Any update to this schemas list needs to be reflected in the handleSubmit() function call as a checkbox.
     const schemas = [
  { name: 'Custom', selected: false },
  { name: 'PDP', selected: false },
];

  const [addUserCounter, setAddUserCounter] = useState(0);

// TODO implement remove additional email fields
  const removeItem = itemId => {
    const emailItem = document.getElementById(itemId);
    emailItem.remove;
  };

 const incrementCounter = () => {
  const newId = addUserCounter +1;
  setAddUserCounter(newId);
 };

  const renderFullEmailList = () => {
    const arrOfAllAddedEmailSlots = Array.from(Array(addUserCounter).keys());
return (
  <div>
    {arrOfAllAddedEmailSlots.map((id) => (
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
                      name={id+"-access"}
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
                    name={id+"-email"}
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

  const handleSubmit = (event) => {
    event.preventDefault();
    let pdp = event.target.elements.PDP.checked;
    if (event.target.elements.inst_name.value == null || event.target.elements.inst_name.value == ""){
      document.getElementById('result_area').innerHTML = 'Error: Institution name is required.';
      return;
    }
    // We currently only have custom for potential other schemas. NOte that the shema passed to the API call must match the corresponding backend schema enum value.
    let other_schemas = event.target.elements.Custom.checked ? ['UNKNOWN'] : null;
    var emailDict = {};
    var accessDict = {};
Array.from(event.target.elements).forEach((input) => {
  if (input.name.endsWith("-access") || input.name.endsWith("-email")) {
    let idx = Array.from(input.name)[0];
    if (input.name.endsWith("-access")) {
      accessDict[idx] = input.value;
    } else {
      emailDict[idx] = input.value;
  }
}
});

var constructedEmailDict = {};
for (const [key, value] of Object.entries(emailDict)) {
  if (value != null && value != "") {
    constructedEmailDict[value] = accessDict[key];
  }
}
    return axios({
      method: 'post',
      url: '/create-inst-api',
      data: {
        name: event.target.elements.inst_name.value,
        state: event.target.elements.state.value,
        allowed_schemas: other_schemas,
        allowed_emails: constructedEmailDict.length == 0 ? null : constructedEmailDict,
        is_pdp: pdp,
        pdp_id: event.target.elements.pdp_id.value,
      },
    })
      .then(res => {
        document.getElementById('result_area').innerHTML = 'Done. Created new institution with ID: '+ JSON.stringify(res.data.inst_id);
      })
      .catch(e => {
        let err = "";
        if( e.response ){
          err = JSON.stringify(e.response.data.error); 
        } else {
          err = JSON.stringify(e) ;
        }
        document.getElementById('result_area').innerHTML =
          'Error: ' + err;
      });
  };

  // TODO check if the user is a datakinder, otherwise show an error page.
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
        <form className="w-full max-w-full pl-36 pr-36 pt-24" onSubmit={handleSubmit}>
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
      <legend className="text-base font-semibold text-gray-900">Schemas accepted by this institution</legend>
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
              <label htmlFor={`${schem.name}`} className="m-2 select-none font-medium text-gray-900">
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
                  type="number" min="1" max="10000000"
                ></input>
                <p className="text-gray-600 text-xs italic">
                  For PDP schools, please add the PDP_INST id of the institution.
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
            type="reset"
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
        <div id="result_area" className="flex pb-24 pt-12"></div>
      </div>
    </AppLayout>
  );
}

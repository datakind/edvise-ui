import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';

// Can be used to create new models or enable webapp access to existing models only created in databricks.
export default function CreateModel() {
  const schemas = [
    { name: 'Custom', selected: false },
    { name: 'PDP', selected: false },
  ];
  const handleSubmit = event => {
    event.preventDefault();
    let schemaConfig = [];
    if (event.target.elements.PDP.checked) {
      schemaConfig.push([
        { schema_type: 'STUDENT', optional: false, multiple_allowed: false },
        { schema_type: 'SEMESTER', optional: true, multiple_allowed: false },
        { schema_type: 'COURSE', optional: false, multiple_allowed: false },
      ]);
    }
    if (event.target.elements.Custom.checked) {
      schemaConfig.push([
        { schema_type: 'UNKNOWN', optional: false, multiple_allowed: true },
      ]);
    }
    let validBool = event.target.elements.valid.value == 'Valid';
    return axios({
      method: 'post',
      url: '/create-model',
      data: {
        name: event.target.elements.model_name.value,
        vers_id: event.target.elements.vers_id.value,
        valid: validBool,
        schema_configs: schemaConfig,
      },
    })
      .then(res => {
        document.getElementById('result_area').innerHTML = 'Done';
      })
      .catch(e => {
        if (e.response) {
          document.getElementById('result_area').innerHTML =
            'Error ' + JSON.stringify(e.response.data.error);
        } else {
          document.getElementById('result_area').innerHTML = JSON.stringify(e);
        }
      });
  };

  return (
    <AppLayout
      title="Create Model"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Create Model
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
          minorTitle="Create Model"
        ></HeaderLabel>
        <form
          className="w-full max-w-full pl-36 pr-36 pt-24"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col gap-y-6">
            <div className="flex w-full flex-row gap-x-6">
              <div className="flex w-full flex-col">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  id="model_name"
                >
                  Model Name
                </label>
                <input
                  name="model_name"
                  className="mb-3 block w-full appearance-none rounded border border-red-500 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                  type="text"
                  placeholder="Model Name (corresponding to the Databricks model name)"
                ></input>
                <p className="text-xs italic text-red-500">Required field.</p>
              </div>
            </div>
            <div className="flex w-1/2 flex-col">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                id="vers_id"
              >
                Version ID
              </label>
              <input
                name="vers_id"
                className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                type="number"
                min="0"
                max="10"
                defaultValue="0"
              ></input>
              <p className="text-xs italic text-gray-600">
                Version ID of the model. Use zero for initial version.
              </p>
            </div>
            <div className="flex w-1/2 flex-row items-center gap-x-3">
              <input
                type="radio"
                id="valid"
                name="model_valid"
                defaultValue="Valid"
              ></input>
              <label htmlFor="valid">
                Model is "valid" (i.e. ready for use).
              </label>
            </div>
            <div className="flex w-full flex-row gap-x-6">
              <div className="flex w-1/2 flex-col">
                <fieldset>
                  <legend className="text-base font-semibold text-gray-900">
                    Batch schema configs accepted by this model
                  </legend>
                  <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                    {schemas.map((schem, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="min-w-0 flex-1 text-sm/6">
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
            </div>
          </div>
          <div className="flex w-full justify-center gap-x-6 pt-12">
            <button
              type="reset"
              className="mb-4 flex w-1/3 items-center justify-center rounded-lg border border-[#f79222] bg-white px-3 py-2 text-[#f79222]"
            >
              Reset
            </button>
            <button
              type="submit"
              className="mb-4 flex w-1/3 items-center justify-center rounded-lg bg-[#f79222] px-3 py-2 text-white"
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

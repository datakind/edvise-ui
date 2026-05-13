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
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
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
          className="w-full max-w-full pt-24 pr-36 pl-36"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col gap-y-6">
            <div className="flex w-full flex-row gap-x-6">
              <div className="flex w-full flex-col">
                <label
                  className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
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
            <div className="flex w-1/2 flex-row items-center gap-x-3">
              <input
                type="radio"
                id="valid"
                name="model_valid"
                defaultValue="Valid"
                defaultChecked={true}
              ></input>
              <label htmlFor="valid">
                Model is "valid" (i.e. ready for use).
              </label>
            </div>
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
        <div id="result_area" className="flex pt-12 pb-24"></div>
      </div>
    </AppLayout>
  );
}

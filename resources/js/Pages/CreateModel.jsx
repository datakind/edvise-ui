import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';

// Can be used to create new models or enable webapp access to existing models only created in databricks.
export default function CreateModel() {
  const [nameError, setNameError] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    setNameError('');
    const form = event.currentTarget;
    const input = form.elements.model_name;
    if (!input.checkValidity()) {
      setNameError(input.validationMessage);
      input.focus();
      return;
    }
    return axios({
      method: 'post',
      url: '/create-model',
      data: {
        name: input.value,
      },
    })
      .then(() => {
        setNameError('');
        document.getElementById('result_area').innerHTML = 'Done';
      })
      .catch(e => {
        // Laravel puts FastAPI `detail` in `error`; it is usually a string but can be an array (e.g. validation).
        const raw = e.response?.data?.error;
        const msg =
          typeof raw === 'string'
            ? raw
            : Array.isArray(raw)
              ? raw
                  .map(item =>
                    typeof item === 'string'
                      ? item
                      : (item?.msg ?? JSON.stringify(item)),
                  )
                  .join(' ')
              : raw != null
                ? String(raw)
                : '';
        if (msg) {
          setNameError(msg);
        }
        document.getElementById('result_area').innerHTML = e.response
          ? `Error ${JSON.stringify(e.response.data)}`
          : JSON.stringify(e);
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
          noValidate
          onReset={() => setNameError('')}
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col">
            <label htmlFor="model_name">Model Name</label>
            <input
              id="model_name"
              name="model_name"
              type="text"
              className={nameError ? 'error' : ''}
              placeholder="Model Name (corresponding to the Databricks model name)"
              required
              autoComplete="off"
              pattern="[A-Za-z0-9_ -]*"
              title="Letters, numbers, spaces, hyphens, and underscores only"
              aria-invalid={nameError ? true : undefined}
              aria-describedby={nameError ? 'model_name-error' : undefined}
              onInput={() => setNameError('')}
            />
            {nameError ? (
              <p
                id="model_name-error"
                role="alert"
                className="text-danger mt-2 text-sm"
              >
                {nameError}
              </p>
            ) : null}
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

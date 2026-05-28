import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import HeaderLabel from '@/Components/HeaderLabel';

// TODO enable adding multiple datakinders at once.
export default function AddDatakinders() {
  const handleSubmit = event => {
    event.preventDefault();
    let usrs = [];
    if (
      event.target.elements.user.value == undefined ||
      event.target.elements.user.value == ''
    ) {
      document.getElementById('result_area').innerHTML =
        'Error: field is empty';
      return;
    }
    usrs.push(event.target.elements.user.value);
    return axios({
      method: 'post',
      url: '/add-dk-api',
      data: {
        emails: usrs,
      },
    })
      .then(() => {
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
  // The title in AppLayout needs to match the nav bar label.
  return (
    <AppLayout
      title="Add Datakinders"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          AddDk
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
          minorTitle="Add Datakinders"
        ></HeaderLabel>
        <form
          className="w-full max-w-full pt-24 pr-36 pl-36"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col">
            <div id="add_one_user" className="-mx-3 mb-2 flex">
              <div className="w-full">
                <label
                  className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                  id="0-email"
                >
                  Account Email
                </label>
                <input
                  name="user"
                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                  type="email"
                  placeholder="j.smith@datakind.org"
                ></input>
                <p className="text-xs text-gray-600 italic">
                  Add an email of an existing account which you want to grant
                  Datakinder access.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        <div className="flex" id="result_area"></div>
      </div>
    </AppLayout>
  );
}

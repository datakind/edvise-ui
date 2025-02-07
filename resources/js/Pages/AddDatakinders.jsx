import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

// TODO show user does not exist error message if the email does not exist in the user table.
export default function AddDatakinders() {
  const handleSubmit = event => {
    event.preventDefault();
    let usrs = [];
    if (event.target.elements.user.value == undefined || event.target.elements.user.value == "") {
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
    }).then(res => {
        document.getElementById("result_area").innerHTML = "Done";
    }).catch(e => {
        if( e.response ){
            document.getElementById("result_area").innerHTML = "Error " + JSON.stringify(e.response.data.error); 
          } else {
            document.getElementById("result_area").innerHTML =  JSON.stringify(e) ;
          }
});
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
                  name="user"
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

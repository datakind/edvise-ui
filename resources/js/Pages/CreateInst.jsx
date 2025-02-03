import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function CreateInst() {
  const removeItem = itemId => {
    const emailItem = document.getElementById(itemId);
    emailItem.remove;
  };

  const addField = () => {
    const multUsers = document.getElementById('mult_users');
    const newId = 'placeholder';
    multUsers.innerHTML =
      multUsers.innerHTML +
      '<div className="flex id="' +
      newId +
      '" -mx-3 mb-2">' +
      '<div className="w-1/2 px-3 mb-6">' +
      '<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="' +
      newId +
      '-access">Access Type</label>' +
      '<div className="relative">' +
      '<select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="' +
      newId +
      '-access">' +
      '<option>Institution Researcher</option>' +
      '</select>' +
      '</div>' +
      '</div>' +
      '<div className="w-1/2 px-3 mb-6">' +
      '<label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="' +
      newId +
      '-email">User email</label>' +
      '<input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="' +
      newId +
      '-email" type="email" placeholder="j.smith@inst1.edu"></input>' +
      '</div>' +
      '</div>';
  };

  const handleSubmit = event => {
    event.preventDefault();
    let pdp = false;
    if (event.target.elements.type.value == 'PDP') {
      pdp = true;
    }
    return axios({
      method: 'post',
      url: '/create-inst-api',
      data: {
        name: event.target.elements.inst_name.value,
        description: event.target.elements.description.value,
        state: event.target.elements.state.value,
        is_pdp: pdp,
      },
    })
      .then(res => {
        document.getElementById('result_area').innerHTML = 'Done. Response: '+ JSON.stringify(res);
      })
      .catch(e => {
        let err = "";
        if( e.response ){
          err = e.response.data.error; 
        } else {
          err = JSON.stringify(e) ;
        }
        document.getElementById('result_area').innerHTML =
          'There was an error: ' + err;
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
        <h1 className="text-2xl font-bold pb-12">Create New Institution </h1>

        <form className="w-full max-w-full pl-36 pr-36" onSubmit={handleSubmit}>
          <div id="form_contents" className="flex flex-col">
            <div className="flex -mx-3 mb-6 justify-center">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="inst_name"
                >
                  Institution Name
                </label>
                <input
                  name="inst_name"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder="College/University Name"
                ></input>
                <p className="text-red-500 text-xs italic">Required field.</p>
              </div>
            </div>
            <div className="flex -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="description"
                >
                  Description
                </label>
                <input
                  name="description"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="text"
                ></input>
                <p className="text-gray-600 text-xs italic">
                  Optionally add a description of the institution.
                </p>
              </div>
            </div>
            <div className="flex -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  id="file_type"
                >
                  Expected File Types
                </label>
                <div className="relative">
                  <select
                    name="type"
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  >
                    <option>PDP</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex -mx-3 mb-6">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
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
            <div id="mult_users" className="flex flex-col gap-x-3">
              <div id="add_one_user" className="flex -mx-3 mb-2">
                <div className="w-1/2 px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    id="0-access"
                  >
                    Access Type
                  </label>
                  <div className="relative">
                    <select
                      name="user_type-0"
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option>Institution Researcher</option>
                    </select>
                  </div>
                </div>
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
                    placeholder="j.smith@inst1.edu"
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <button
            id="button_add_field"
            className="flex bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
            onClick={addField}
          >
            Add Another Email
          </button>

          <button
            type="submit"
            className="flex bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3"
          >
            Submit
          </button>
        </form>
        <div id="result_area" className="flex pb-24"></div>
      </div>
    </AppLayout>
  );
}

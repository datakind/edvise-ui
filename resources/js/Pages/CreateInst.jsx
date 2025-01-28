import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CreateInst() {

    const removeItem = (itemId) => {
        const emailItem = document.getElementById(itemId);
        emailItem.remove;        
    }

    const addField = () => {
        const multUsers = document.getElementById('mult_users');
        const newId = "placeholder";
        multUsers.innerHTML = multUsers.innerHTML + 
        '<div class="flex id="'+newId+'" -mx-3 mb-2">'
    +'<div class="w-1/2 px-3 mb-6">'
      +'<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="'+newId+'-access">Access Type</label>'
      +'<div class="relative">'
        +'<select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="'+newId+'-access">'
          +'<option>Institution Researcher</option>'
        +'</select>'
      +'</div>'
    +'</div>'
    +'<div class="w-1/2 px-3 mb-6">'
      +'<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="'+newId+'-email">User email</label>'
      +'<input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="'+newId+'-email" type="email" placeholder="j.smith@inst1.edu"></input>'
    +'</div>'
  +'</div>';
    }

    const submitForm = () => {
        // TODO populate
        const multUsers = document.getElementById('mult_users').getElementsByTagName('div');
    }

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
                            <h1 className="text-2xl font-bold pb-12">        Create New Institution </h1>


<form class="w-full max-w-full pl-36 pr-36">

<div id="form_contents" className="flex flex-col">

  <div class="flex -mx-3 mb-6 justify-center">
    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
        Institution Name
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="College/University Name"></input>
      <p class="text-red-500 text-xs italic">Required field.</p>
    </div>
  </div>
  <div class="flex -mx-3 mb-6">
    <div class="w-full px-3">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
        Description
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="text"></input>
      <p class="text-gray-600 text-xs italic">Optionally add a description of the institution.</p>
    </div>
  </div>
<div class="flex -mx-3 mb-6">
  <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
        Expected File Types
      </label>
      <div class="relative">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>PDP</option>
          <option>Custom</option>
        </select>
      </div>
    </div>
      </div>
  



<div id="mult_users" className="flex flex-col gap-x-3">

  <div id="add_one_user" class="flex -mx-3 mb-2">
    <div class="w-1/2 px-3 mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="0-access">
        Access Type
      </label>
      <div class="relative">
        <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="0-access">
          <option>Institution Researcher</option>
        </select>
      </div>
    </div>
    <div class="w-1/2 px-3 mb-6">
      <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="0-email">
        User email
      </label>
      <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="0-email" type="email" placeholder="j.smith@inst1.edu"></input>
    </div>
  
  </div>



</div>
</div>
</form>

      <button id="button_add_field" className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3" onClick={addField}>Add Another Email</button> 

      <button id="button_submit" className="bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center w-1/3" onClick={submitForm}>Submit</button>

</div>
        </AppLayout>
    );
}

import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import FormSection from '@/Components/Sections/FormSection';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';

const CreateTeamForm = ({ auth }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const createTeam = e => {
    e.preventDefault();
    post(route('teams.store'), {
      errorBag: 'createTeam',
      preserveScroll: true,
    });
  };

  return (
    <FormSection onSubmit={createTeam}>
      <div className="title">Team Details</div>

      <div className="description">
        Create a new team to collaborate with others on projects.
      </div>

      <div className="form">
        <div className="col-span-6">
          <InputLabel value="Team Owner" />

          <div className="mt-2 flex items-center">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={auth.user.profile_photo_url}
              alt={auth.user.name}
            />

            <div className="ms-4 leading-tight">
              <div className="text-gray-900 dark:text-white">
                {auth.user.name}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {auth.user.email}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-6 sm:col-span-4">
          <InputLabel htmlFor="name" value="Team Name" />
          <TextInput
            id="name"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            type="text"
            className="mt-1 block w-full"
            autoFocus
          />
          <InputError message={errors.name} className="mt-2" />
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={processing}>
          Create
        </button>
      </div>
    </FormSection>
  );
};

export default CreateTeamForm;

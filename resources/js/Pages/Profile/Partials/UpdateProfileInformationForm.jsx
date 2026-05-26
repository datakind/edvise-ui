import { Link, useForm } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useState } from 'react';
import ActionMessage from '@/Components/Modals/ActionMessage';
import FormSection from '@/Components/Sections/FormSection';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import TextInput from '@/Components/Fields/TextInput';
import useTypedPage from '@/Hooks/useTypedPage';
export default function UpdateProfileInformationForm({ user }) {
  const form = useForm({
    _method: 'PUT',
    name: user.name,
    email: user.email,
    photo: null,
  });
  const page = useTypedPage();
  const [verificationLinkSent, setVerificationLinkSent] = useState(false);
  function updateProfileInformation() {
    form.post(route('user-profile-information.update'), {
      errorBag: 'updateProfileInformation',
      preserveScroll: true,
      onSuccess: () => clearPhotoFileInput(),
    });
  }
  function clearPhotoFileInput() {
    form.setData('photo', null);
  }
  return (
    <FormSection
      onSubmit={updateProfileInformation}
      title={'Profile Information'}
      description={`Update your account's profile information and email address.`}
      renderActions={() => (
        <>
          <ActionMessage on={form.recentlySuccessful} className="mr-3">
            Saved.
          </ActionMessage>

          <button
            type="submit"
            className={classNames('btn btn-primary', {
              'opacity-25': form.processing,
            })}
            disabled={form.processing}
          >
            Save
          </button>
        </>
      )}
    >
      {/* <!-- Name --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="name" value="Name" />
        <TextInput
          id="name"
          type="text"
          className="mt-1 block w-full"
          value={form.data.name}
          onChange={e => form.setData('name', e.currentTarget.value)}
          autoComplete="name"
        />
        <InputError message={form.errors.name} className="mt-2" />
      </div>

      {/* <!-- Email --> */}
      <div className="col-span-6 sm:col-span-4">
        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          className="mt-1 block w-full"
          value={form.data.email}
          onChange={e => form.setData('email', e.currentTarget.value)}
        />
        <InputError message={form.errors.email} className="mt-2" />

        {page.props.jetstream.hasEmailVerification &&
        user.email_verified_at === null ? (
          <div>
            <p className="text-sm mt-2">
              Your email address is unverified.
              <Link
                href={route('verification.send')}
                method="post"
                as="button"
                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={e => {
                  e.preventDefault();
                  setVerificationLinkSent(true);
                }}
              >
                Click here to re-send the verification email.
              </Link>
            </p>
            {verificationLinkSent && (
              <div className="mt-2 font-medium text-sm text-green-600">
                A new verification link has been sent to your email address.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </FormSection>
  );
}

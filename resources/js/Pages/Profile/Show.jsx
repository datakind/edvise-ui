import React from 'react';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import LogoutOtherBrowserSessions from '@/Pages/Profile/Partials/LogoutOtherBrowserSessionsForm';
import TwoFactorAuthenticationForm from '@/Pages/Profile/Partials/TwoFactorAuthenticationForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import useTypedPage from '@/Hooks/useTypedPage';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ sessions, confirmsTwoFactorAuthentication }) {
  const page = useTypedPage();
  return (
    <AppLayout
      title="Profile"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Profile
        </h2>
      )}
    >
      <div className="flex w-full flex-col p-4">
        {page.props.jetstream.canUpdateProfileInformation ? (
          <div className="flex border-solid border-gray-900 p-6">
            <UpdateProfileInformationForm user={page.props.auth.user} />
          </div>
        ) : null}

        {page.props.jetstream.canUpdatePassword ? (
          <div className="flex border-solid border-gray-900 p-6">
            <UpdatePasswordForm />
          </div>
        ) : null}

        {page.props.jetstream.canManageTwoFactorAuthentication ? (
          <div className="flex border-solid border-gray-900 p-6">
            <TwoFactorAuthenticationForm
              requiresConfirmation={confirmsTwoFactorAuthentication}
            />
          </div>
        ) : null}

        <div className="flex border-solid border-gray-900 p-6">
          <LogoutOtherBrowserSessions sessions={sessions} />
        </div>

        {page.props.jetstream.hasAccountDeletionFeatures ? (
          <div className="flex border-solid border-gray-900 p-6">
            <DeleteUserForm />
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}

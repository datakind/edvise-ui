import { useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticationCard from '@/Components/Modals/AuthenticationCard';
import InputLabel from '@/Components/Fields/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Fields/TextInput';
import InputError from '@/Components/Modals/InputError';
import AppLayout from '@/Layouts/AppLayout';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function TwoFactorChallenge() {
  const [recovery, setRecovery] = useState(false);
  const form = useForm({
    code: '',
    recovery_code: '',
  });
  const recoveryCodeRef = useRef(null);
  const codeRef = useRef(null);
  function toggleRecovery(e) {
    e.preventDefault();
    const isRecovery = !recovery;
    setRecovery(isRecovery);
    setTimeout(() => {
      if (isRecovery) {
        recoveryCodeRef.current?.focus();
        form.setData('code', '');
      } else {
        codeRef.current?.focus();
        form.setData('recovery_code', '');
      }
    }, 100);
  }
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('two-factor.login'));
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="Two-Factor Confirmation" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Edvise Logo"
          />
          <div className="mb-4 text-sm text-gray-600">
            {recovery
              ? 'Please confirm access to your account by entering one of your emergency recovery codes.'
              : 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'}
          </div>

          <form onSubmit={onSubmit}>
            {recovery ? (
              <div>
                <InputLabel htmlFor="recovery_code">Recovery Code</InputLabel>
                <TextInput
                  id="recovery_code"
                  type="text"
                  className="mt-1 block w-full"
                  value={form.data.recovery_code}
                  onChange={e =>
                    form.setData('recovery_code', e.currentTarget.value)
                  }
                  ref={recoveryCodeRef}
                  autoComplete="one-time-code"
                />
                <InputError
                  className="mt-2"
                  message={form.errors.recovery_code}
                />
              </div>
            ) : (
              <div>
                <InputLabel htmlFor="code">Code</InputLabel>
                <TextInput
                  id="code"
                  type="text"
                  inputMode="numeric"
                  className="mt-1 block w-full"
                  value={form.data.code}
                  onChange={e => form.setData('code', e.currentTarget.value)}
                  autoFocus
                  autoComplete="one-time-code"
                  ref={codeRef}
                />
                <InputError className="mt-2" message={form.errors.code} />
              </div>
            )}

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                className="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900"
                onClick={toggleRecovery}
              >
                {recovery
                  ? 'Use an authentication code'
                  : 'Use a recovery code'}
              </button>

              <Button
                type="submit"
                className={classNames('ml-4', {
                  'opacity-25': form.processing,
                })}
                disabled={form.processing}
              >
                Log in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

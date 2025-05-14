import { Link, useForm, Head } from '@inertiajs/react';
import classNames from 'classnames';
import React from 'react';
import { router } from '@inertiajs/react';
import AuthenticationCard from '@/Components/Modals/AuthenticationCard';
import Checkbox from '@/Components/Fields/Checkbox';
import InputLabel from '@/Components/Fields/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Fields/TextInput';
import InputError from '@/Components/Modals/InputError';
import AppLayout from '@/Layouts/AppLayout';
import NewLayout from '@/Layouts/NewLayout';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';
import Button from '@/Components/Landing/Button';

export default function Login({ canResetPassword, status }) {
  const form = useForm({
    email: '',
    password: '',
    remember: '',
  });
  function onSubmit(e) {
    e.preventDefault();
    form.post(route('login'), {
      onFinish: () => form.reset('password'),
    });
  }
  return (
    <AuthLayout>
      <div className="layout:box-container landing-rounded-lg relative mx-auto w-3/4 bg-white pb-20 sm:pb-44">
        <div className="mx-auto -mb-12 mt-12 w-full max-w-2xl p-4">
          <Head title="login" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/deemia-logo.svg"
            alt="Student Success Tool Logo"
          />

          <div className="pb-8 text-2xl">Welcome! Log in to get started:</div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div>
              <InputLabel htmlFor="email">Email</InputLabel>
              <TextInput
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={form.data.email}
                onChange={e => form.setData('email', e.currentTarget.value)}
                required
                autoFocus
              />
              <InputError className="mt-2" message={form.errors.email} />
            </div>

            <div className="mt-4">
              <InputLabel htmlFor="password">Password</InputLabel>
              <TextInput
                id="password"
                type="password"
                className="mt-1 block w-full"
                value={form.data.password}
                onChange={e => form.setData('password', e.currentTarget.value)}
                required
                autoComplete="current-password"
              />
              <InputError className="mt-2" message={form.errors.password} />
            </div>

            <div className="mt-4"></div>

            <div className="mt-4 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              {canResetPassword && (
                <div>
                  <label className="flex items-center">
                    <Checkbox
                      name="remember"
                      checked={form.data.remember === 'on'}
                      onChange={e =>
                        form.setData(
                          'remember',
                          e.currentTarget.checked ? 'on' : '',
                        )
                      }
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end">
                <Link
                  href={route('password.request')}
                  className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Forgot your password?
                </Link>

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
            </div>
          </form>
          <div className="mt-8 grid grid-cols-5 gap-4">
            <div className="col-span-2 pt-2">
              <hr></hr>
            </div>
            <div className="text-center text-sm text-gray-600">or</div>
            <div className="col-span-2 pt-2">
              <hr></hr>
            </div>
          </div>
          <div className="mt-12 flex flex-col space-y-4">
            <a
              href="/auth/google"
              className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-100"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google Logo"
                className="mr-2 h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Sign in with Google
              </span>
            </a>
            <a
              href="/auth/azure"
              className="flex w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-100"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png"
                alt="Microsoft Logo"
                className="mr-2 h-5 w-5"
              />
              <span className="text-sm font-medium text-gray-700">
                Sign in with Microsoft
              </span>
            </a>
          </div>
          <div className="text-center">
            <AuthFooter />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

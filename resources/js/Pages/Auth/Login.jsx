import { Link, useForm, Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import React from 'react';
import Checkbox from '@/Components/Fields/Checkbox';
import InputError from '@/Components/Modals/InputError';
import AuthLayout from '@/Layouts/AuthLayout';
import AuthFooter from '@/Components/AuthFooter';

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
        <div className="mx-auto mt-12 -mb-12 w-full max-w-2xl p-4">
          <Head title="login" />
          <img
            className="w-1/3 pb-12"
            src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
            alt="Edvise Logo"
          />

          <h1 className="mb-6 text-2xl">Welcome! Log in to get started:</h1>

          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>New users:</strong> You need an invite code to register.
              <Link
                href={route('invite.validation')}
                className="ml-1 underline hover:text-blue-600"
              >
                Enter your invite code here
              </Link>
            </p>
          </div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-1"
                value={form.data.email}
                onChange={e => form.setData('email', e.currentTarget.value)}
                required
                autoFocus
                autoComplete="email"
              />
              <InputError className="mt-2" message={form.errors.email} />
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1"
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
                  className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Forgot your password?
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary ml-4"
                  disabled={form.processing}
                >
                  Log in
                </button>
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
                src="/microsoft-logo.svg"
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

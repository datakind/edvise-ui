import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/Modals/InputError';
import InputLabel from '@/Components/Fields/InputLabel';
import PrimaryButton from '@/Components/Buttons/PrimaryButton';
import TextInput from '@/Components/Fields/TextInput';
import axios from 'axios';

export default function Invites({ invites }) {
  const {
    data,
    setData,
    post,
    delete: destroy,
    processing,
    errors,
    reset,
  } = useForm({
    email: '',
    role: 'MODEL_OWNER',
    institution_id: '',
    expires_in_days: 30,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [institutions, setInstitutions] = useState({});
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  useEffect(() => {
    // Fetch all institutions when component mounts
    setLoadingInstitutions(true);
    axios
      .get('/view-all-institutions-api')
      .then(res => {
        let institutionMap = {};
        res.data.forEach(inst => (institutionMap[inst.name] = inst.inst_id));
        setInstitutions(institutionMap);
        setLoadingInstitutions(false);
      })
      .catch(err => {
        console.error('Error fetching institutions:', err);
        setLoadingInstitutions(false);
      });
  }, []);

  const submit = e => {
    e.preventDefault();
    post(route('admin.invites.create'), {
      onSuccess: () => {
        reset();
        setShowCreateForm(false);
      },
    });
  };

  // Hidden until email functionality is implemented
  // const resendInvite = inviteId => {
  //   post(route('admin.invites.resend', inviteId));
  // };

  const deleteInvite = inviteId => {
    if (confirm('Are you sure you want to delete this invite?')) {
      destroy(route('admin.invites.delete', inviteId));
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString();
  };

  const copyInviteCode = (inviteId, inviteCode) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(inviteCode)
        .then(() => {
          setCopiedId(inviteId);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          alert('Failed to copy to clipboard');
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedId(inviteId);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const getStatusBadge = invite => {
    if (invite.is_used) {
      return (
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          Used
        </span>
      );
    }
    if (new Date(invite.expires_at) < new Date()) {
      return (
        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
          Expired
        </span>
      );
    }
    return (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
        Active
      </span>
    );
  };

  return (
    <>
      <Head title="Manage Invites" />
      <AppLayout>
        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="overflow-hidden bg-white p-6 shadow-xl sm:rounded-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Manage Invites
                </h2>
                <PrimaryButton
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {showCreateForm ? 'Cancel' : 'Create New Invite'}
                </PrimaryButton>
              </div>

              {showCreateForm && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Create New Invite
                  </h3>
                  <form onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                          id="email"
                          type="email"
                          className="mt-1 block w-full"
                          value={data.email}
                          onChange={e => setData('email', e.target.value)}
                          required
                        />
                        <InputError message={errors.email} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                          id="role"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          value={data.role}
                          onChange={e => setData('role', e.target.value)}
                        >
                          <option value="MODEL_OWNER">Model Owner</option>
                          <option value="DATAKINDER">Datakinder</option>
                        </select>
                        <InputError message={errors.role} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel
                          htmlFor="institution_id"
                          value="Institution (Optional)"
                        />
                        <select
                          id="institution_id"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          value={data.institution_id}
                          onChange={e =>
                            setData('institution_id', e.target.value)
                          }
                          disabled={loadingInstitutions}
                        >
                          <option value="">
                            {loadingInstitutions
                              ? 'Loading institutions...'
                              : 'Select an institution (optional)'}
                          </option>
                          {Object.entries(institutions)
                            .sort(([nameA], [nameB]) =>
                              nameA.localeCompare(nameB),
                            )
                            .map(([name, inst_id]) => (
                              <option key={inst_id} value={inst_id}>
                                {name}
                              </option>
                            ))}
                        </select>
                        <InputError
                          message={errors.institution_id}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <InputLabel
                          htmlFor="expires_in_days"
                          value="Expires In (Days)"
                        />
                        <TextInput
                          id="expires_in_days"
                          type="number"
                          min="1"
                          max="30"
                          className="mt-1 block w-full"
                          value={data.expires_in_days}
                          onChange={e =>
                            setData('expires_in_days', e.target.value)
                          }
                        />
                        <InputError
                          message={errors.expires_in_days}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <PrimaryButton type="submit" disabled={processing}>
                        Create Invite
                      </PrimaryButton>
                    </div>
                  </form>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Invite Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Expires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {invites.data.map(invite => (
                      <tr key={invite.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <div className="flex flex-col gap-1">
                            <div>{invite.email}</div>
                            {invite.institution_id && (
                              <div className="text-xs font-normal text-gray-400">
                                {Object.entries(institutions).find(
                                  ([, id]) => id === invite.institution_id,
                                )?.[0] || invite.institution_id}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <div className="relative inline-block">
                            <button
                              onClick={() =>
                                copyInviteCode(invite.id, invite.invite_code)
                              }
                              className={`group flex items-center gap-2 rounded px-2 py-1 transition-colors ${
                                copiedId === invite.id
                                  ? 'bg-green-100'
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              title={
                                copiedId === invite.id
                                  ? 'Copied!'
                                  : 'Click to copy'
                              }
                            >
                              <code className="text-xs">
                                {invite.invite_code}
                              </code>
                              {copiedId === invite.id ? (
                                <svg
                                  className="h-4 w-4 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-4 w-4 text-gray-400 group-hover:text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <span className="capitalize">{invite.role}</span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {getStatusBadge(invite)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(invite.expires_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(invite.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            {/* Hidden until email functionality is implemented */}
                            {/* {!invite.is_used &&
                              new Date(invite.expires_at) > new Date() && (
                                <button
                                  onClick={() => resendInvite(invite.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  Resend
                                </button>
                              )} */}
                            {!invite.is_used && (
                              <button
                                onClick={() => deleteInvite(invite.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {invites.data.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No invites found.
                </div>
              )}
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
}

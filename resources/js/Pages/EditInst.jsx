import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';

const US_STATES = [
  'AK',
  'AL',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];

const SCHOOL_TYPES = [
  { value: 'pdp', label: 'PDP' },
  { value: 'edvise', label: 'Edvise' },
  { value: 'legacy', label: 'Legacy' },
];

function schoolTypeFromInst(inst) {
  if (!inst) return '';
  if (inst.pdp_id) return 'pdp';
  if (inst.edvise_id) return 'edvise';
  if (inst.legacy_id) return 'legacy';
  return '';
}

export default function EditInst() {
  const { inst_id: pageInstId } = usePage().props;

  const [error, setError] = useState(null);
  const [addUserCounter, setAddUserCounter] = useState(1);
  const [inst, setInst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [schoolType, setSchoolType] = useState('');
  const [formGeneration, setFormGeneration] = useState(0);

  const loadInstitution = useCallback(() => {
    if (!pageInstId) {
      setLoadError('Set an institution before editing.');
      setLoading(false);
      setInst(null);
      return;
    }
    setLoading(true);
    setLoadError(null);
    return axios
      .get('/current-institution-api')
      .then(res => {
        setInst(res.data);
        setSchoolType(schoolTypeFromInst(res.data));
        setError(null);
      })
      .catch(err => {
        setInst(null);
        setLoadError(
          err.response?.data?.error ??
            err.message ??
            'Failed to load institution.',
        );
      })
      .finally(() => setLoading(false));
  }, [pageInstId]);

  useEffect(() => {
    loadInstitution();
  }, [loadInstitution]);

  const incrementCounter = () => {
    setAddUserCounter(prev => prev + 1);
  };

  const resetForm = () => {
    setAddUserCounter(1);
    setError(null);
    setFormGeneration(g => g + 1);
    if (inst) {
      setSchoolType(schoolTypeFromInst(inst));
    }
  };

  const renderFullEmailList = () => {
    const arrOfAllAddedEmailSlots = Array.from(
      Array(addUserCounter).keys(),
    ).slice(1);
    return (
      <div>
        <div id="default_user" className="flex">
          <div className="w-1/2">
            <label className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase">
              Access Type
            </label>
            <div className="relative">
              <select
                name="0-access"
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              >
                <option>MODEL_OWNER</option>
                <option>VIEWER</option>
              </select>
            </div>
          </div>
          <div className="mb-6 w-1/2 px-3">
            <label className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase">
              User email
            </label>
            <input
              name="0-email"
              className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
              type="email"
              placeholder="j.smith@inst1.edu"
            />
          </div>
        </div>

        {arrOfAllAddedEmailSlots.map(id => (
          <div key={id} id="one_user" className="flex">
            <div className="w-1/2">
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase">
                Access Type
              </label>
              <div className="relative">
                <select
                  name={`${id}-access`}
                  className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                >
                  <option>MODEL_OWNER</option>
                  <option>VIEWER</option>
                </select>
              </div>
            </div>
            <div className="mb-6 w-1/2 px-3">
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase">
                User email
              </label>
              <input
                name={`${id}-email`}
                className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                type="email"
                placeholder="j.smith@inst1.edu"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const type = schoolType || formData.get('school_type');
    if (!type) {
      setError('Select exactly one of PDP, Edvise, or Legacy.');
      return;
    }
    if (type === 'pdp') {
      const pid = (formData.get('pdp_id') || '').trim();
      if (!pid) {
        setError('PDP Institution ID is required when PDP is selected.');
        return;
      }
    }

    var emailDict = {};
    var accessDict = {};
    Array.from(event.target.elements).forEach(input => {
      if (input.name.endsWith('-access') || input.name.endsWith('-email')) {
        let idx = Array.from(input.name)[0];
        if (input.name.endsWith('-access')) {
          accessDict[idx] = input.value;
        } else {
          emailDict[idx] = input.value;
        }
      }
    });
    var constructedEmailDict = {};
    for (const [key, value] of Object.entries(emailDict)) {
      if (value != null && value != '') {
        constructedEmailDict[value] = accessDict[key];
      }
    }

    const payload = {
      name: formData.get('inst_name'),
      state: formData.get('state') || null,
      allowed_emails:
        Object.keys(constructedEmailDict).length === 0
          ? null
          : constructedEmailDict,
    };

    if (type === 'pdp') {
      payload.is_pdp = true;
      payload.pdp_id = (formData.get('pdp_id') || '').trim();
      payload.edvise_id = null;
      payload.legacy_id = null;
    } else if (type === 'edvise') {
      payload.is_edvise = true;
      payload.pdp_id = null;
      payload.legacy_id = null;
      const eid = (formData.get('edvise_id') || '').trim();
      if (eid) {
        payload.edvise_id = eid;
      }
    } else if (type === 'legacy') {
      payload.is_legacy = true;
      payload.pdp_id = null;
      payload.edvise_id = null;
      const lid = (formData.get('legacy_id') || '').trim();
      if (lid) {
        payload.legacy_id = lid;
      }
    }

    try {
      await axios.post('/edit-inst-api', payload);
      setError(null);
      await loadInstitution();
      setFormGeneration(g => g + 1);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <AppLayout
      title="Edit Institution"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          Edit Institution
        </h2>
      )}
    >
      <div className="flex w-full flex-col items-center">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Edit Institution [Do not use: Work in progress]"
        />
        {loading && <p className="mt-8 text-gray-600">Loading institution…</p>}
        {!loading && loadError && (
          <div className="mt-8 max-w-lg text-center text-red-600">
            <p>{loadError}</p>
            {!pageInstId && (
              <Link
                href="/set-inst"
                className="mt-4 inline-block text-blue-600 underline"
              >
                Set institution
              </Link>
            )}
          </div>
        )}
        {!loading && !loadError && inst && (
          <form
            id="edit-institution-form"
            key={`${inst.inst_id}-${formGeneration}`}
            className="w-full max-w-full pt-24 pr-36 pl-36"
            onSubmit={handleSubmit}
          >
            <div id="form_contents" className="flex flex-col gap-y-6">
              <div className="flex w-full flex-row gap-x-6">
                <div className="flex w-2/3 flex-col">
                  <label
                    className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                    htmlFor="edit_inst_name"
                  >
                    Institution Name
                  </label>
                  <input
                    id="edit_inst_name"
                    name="inst_name"
                    className="mb-3 block w-full cursor-not-allowed appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
                    type="text"
                    defaultValue={inst.name}
                    readOnly
                  />
                </div>
                <div className="flex w-1/3 flex-col">
                  <label
                    className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                    htmlFor="edit_state"
                  >
                    State
                  </label>
                  <div className="relative">
                    <select
                      id="edit_state"
                      name="state"
                      className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                      defaultValue={inst.state ?? ''}
                    >
                      <option value=""> </option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row gap-x-6">
                <div className="flex w-1/2 flex-col">
                  <fieldset>
                    <legend className="text-base font-semibold text-gray-900">
                      Institution type
                    </legend>
                    <p className="mt-1 text-sm text-gray-600">
                      Choose exactly one.
                    </p>
                    <div className="mt-4 space-y-3 border-t border-b border-gray-200 py-3">
                      {SCHOOL_TYPES.map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-3">
                          <input
                            id={`edit_school_type_${value}`}
                            name="school_type"
                            type="radio"
                            value={value}
                            checked={schoolType === value}
                            onChange={() => setSchoolType(value)}
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                          <label
                            htmlFor={`edit_school_type_${value}`}
                            className="text-sm font-medium text-gray-900"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
                <div className="flex w-1/2 flex-col gap-4">
                  {schoolType === 'pdp' && (
                    <div>
                      <label
                        className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                        htmlFor="edit_pdp_id"
                      >
                        PDP Institution ID
                      </label>
                      <input
                        id="edit_pdp_id"
                        name="pdp_id"
                        key={`pdp-${formGeneration}`}
                        defaultValue={inst.pdp_id ?? ''}
                        className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        type="text"
                      />
                      <p className="text-xs text-gray-600 italic">
                        For PDP schools, please add the PDP_INST id of the
                        institution. Include any leading zeroes.
                      </p>
                    </div>
                  )}
                  {schoolType === 'edvise' && (
                    <div>
                      <label
                        className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                        htmlFor="edit_edvise_id"
                      >
                        Edvise ID (optional)
                      </label>
                      <input
                        id="edit_edvise_id"
                        name="edvise_id"
                        key={`edvise-${formGeneration}`}
                        defaultValue={inst.edvise_id ?? ''}
                        className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        type="text"
                      />
                      <p className="text-xs text-gray-600 italic">
                        Leave blank to keep the current Edvise id, or set when
                        switching to Edvise to choose a specific id.
                      </p>
                    </div>
                  )}
                  {schoolType === 'legacy' && (
                    <div>
                      <label
                        className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase"
                        htmlFor="edit_legacy_id"
                      >
                        Legacy ID (optional)
                      </label>
                      <input
                        id="edit_legacy_id"
                        name="legacy_id"
                        key={`legacy-${formGeneration}`}
                        defaultValue={inst.legacy_id ?? ''}
                        className="mb-3 block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                        type="text"
                      />
                      <p className="text-xs text-gray-600 italic">
                        Leave blank to keep the current Legacy id, or set when
                        switching to Legacy to choose a specific id.
                      </p>
                    </div>
                  )}
                  {schoolType === '' && (
                    <p className="text-sm text-gray-600">
                      Select a type to edit identifiers.
                    </p>
                  )}
                </div>
              </div>
              <div id="mult_users" className="flex flex-col">
                {renderFullEmailList()}
              </div>
            </div>
            <div className="flex w-full justify-center">
              <button
                id="button_add_field"
                type="button"
                className="mb-4 flex w-1/3 items-center justify-center rounded-lg bg-gray-200 px-3 py-2 text-gray-700"
                onClick={incrementCounter}
              >
                Add Another Email
              </button>
            </div>
            <div className="flex w-full justify-center gap-x-6 pt-12">
              <button
                type="button"
                onClick={resetForm}
                className="mb-4 flex w-1/3 items-center justify-center rounded-lg border border-[#f79222] bg-white px-3 py-2 text-[#f79222]"
              >
                Reset
              </button>
              <button
                type="submit"
                className="mb-4 flex w-1/3 items-center justify-center rounded-lg bg-[#f79222] px-3 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </form>
        )}
        {error && (
          <div className="mt-4 max-w-2xl px-6 text-center text-red-500">
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}
        <div id="result_area" className="flex pt-12 pb-24"></div>
      </div>
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import Alert from '@/Components/Alert';
import HeaderLabel from '@/Components/HeaderLabel';

function institutionType(inst) {
  return (
    (inst?.pdp_id && 'PDP') ||
    (inst?.edvise_id && 'Edvise') ||
    (inst?.legacy_id && 'Legacy') ||
    (inst?.genai_id && 'GenAI') ||
    null
  );
}

export default function SetInstitution() {
  const { institution, set_inst_required_message } = usePage().props;

  const [institutions, setInstitutions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInstId, setSelectedInstId] = useState(
    institution?.inst_id ?? '',
  );
  const [setInstSuccess, setSetInstSuccess] = useState(null);
  const [settingInst, setSettingInst] = useState(false);
  const [setInstSubmitError, setSetInstSubmitError] = useState(null);

  useEffect(() => {
    const next = institution?.inst_id ?? '';
    setSelectedInstId(next);
  }, [institution?.inst_id]);

  useEffect(() => {
    axios
      .get('/view-all-institutions-api')
      .then(res => {
        setInstitutions(
          [...res.data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setLoading(false);
      })
      .catch(err => {
        setError(JSON.stringify(err.message));
        setLoading(false);
      });
  }, []);

  const selected = institutions.find(i => i.inst_id === selectedInstId);
  const selectedType = institutionType(selected);

  const handleSubmit = event => {
    event.preventDefault();
    const inst = selectedInstId;

    setSetInstSuccess(null);
    if (!inst || inst === '') {
      setSetInstSubmitError('Please select an institution');
      return;
    }

    setSetInstSubmitError(null);
    setSettingInst(true);
    return axios
      .post('/set-inst-api/' + inst)
      .then(() => {
        setSettingInst(false);
        setSetInstSuccess(
          `Successfully set institution to: ${selected?.name || 'Unknown'}`,
        );
        router.reload({
          only: ['institution', 'user', 'set_inst_required_message'],
        });
      })
      .catch(e => {
        setSettingInst(false);
        setSetInstSubmitError(e.message || String(e));
      });
  };

  return (
    <AppLayout
      title="Set Institution"
      renderHeader={() => (
        <h2 className="text-xl leading-tight font-semibold text-gray-800">
          SetInst
        </h2>
      )}
    >
      <div className="flex w-full flex-col items-center" id="main_area">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Act as Institution"
        ></HeaderLabel>

        {!institution?.inst_id && (
          <div className="mt-6 w-full max-w-2xl">
            <Alert
              variant="warning"
              mainMsg={`${set_inst_required_message} Select an institution below to proceed.`}
            />
          </div>
        )}

        {error && (
          <div className="mt-8 w-full max-w-2xl rounded-lg bg-red-100 p-4 text-center text-red-700">
            <p className="font-semibold">Error loading institutions:</p>
            <p>{error}</p>
          </div>
        )}

        <form
          className="w-full max-w-full pt-24 pr-36 pl-36"
          onSubmit={handleSubmit}
        >
          <div id="form_contents" className="flex flex-col">
            <div className="-mx-3 mb-6 flex justify-center">
              <div className="mb-6 w-full px-3">
                <label className="mb-2 block text-xs font-bold tracking-wide text-gray-700 uppercase">
                  Select Institution
                </label>
                <Listbox
                  value={selectedInstId}
                  onChange={id => {
                    setSelectedInstId(id);
                    setSetInstSubmitError(null);
                  }}
                  disabled={loading}
                >
                  <div className="relative">
                    <ListboxButton className="block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 pr-8 text-left leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50">
                      {selected ? (
                        <span className="flex items-baseline gap-2 truncate">
                          <span>{selected.name}</span>
                          {selectedType && (
                            <span className="text-xs text-gray-500">
                              {selectedType}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {loading
                            ? 'Loading institutions...'
                            : 'Choose an institution...'}
                        </span>
                      )}
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </span>
                    </ListboxButton>
                    <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg focus:outline-none">
                      {institutions.map(inst => {
                        const type = institutionType(inst);
                        return (
                          <ListboxOption
                            key={inst.inst_id}
                            value={inst.inst_id}
                            className="cursor-pointer px-4 py-2 text-gray-700 data-focus:bg-gray-100 data-selected:bg-gray-100"
                          >
                            <span className="flex items-baseline gap-2">
                              <span>{inst.name}</span>
                              {type && (
                                <span className="text-xs text-gray-500">
                                  {type}
                                </span>
                              )}
                            </span>
                          </ListboxOption>
                        );
                      })}
                    </ListboxOptions>
                  </div>
                </Listbox>
                <p className="mt-2 text-xs text-gray-600 italic">
                  Select the institution for the current Datakinder to use.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || settingInst}
              className="btn btn-primary"
            >
              Set Institution
            </button>
          </div>
        </form>
        {settingInst && (
          <div className="mt-4 flex w-full max-w-2xl justify-center text-gray-600">
            Setting institution...
          </div>
        )}
        {setInstSubmitError && (
          <div className="mt-4 flex w-full max-w-2xl justify-center">
            <span className="font-semibold text-red-600">
              Error: {setInstSubmitError}
            </span>
          </div>
        )}
        {setInstSuccess && (
          <div className="mt-6 w-full max-w-2xl">
            <Alert variant="success" mainMsg={setInstSuccess} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

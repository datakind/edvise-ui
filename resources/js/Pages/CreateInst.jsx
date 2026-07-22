import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import HeaderLabel from '@/Components/HeaderLabel';
import Alert from '@/Components/Alert';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';

const SCHOOL_TYPES = [
  { value: 'pdp', label: 'PDP' },
  { value: 'edvise', label: 'Edvise' },
  { value: 'legacy', label: 'Legacy' },
  { value: 'genai', label: 'GenAI' },
];

export default function CreateInst() {
  const [schoolType, setSchoolType] = useState('');
  const [addUserCounter, setAddUserCounter] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const incrementCounter = () => {
    setAddUserCounter(c => c + 1);
  };

  const renderFullEmailList = () => {
    const arrOfAllAddedEmailSlots = Array.from(Array(addUserCounter).keys());
    return (
      <div>
        {arrOfAllAddedEmailSlots.map(id => (
          <div key={id} id="one_user" className="flex">
            <div className="w-1/2">
              <label className="form-label" id="access">
                Access Type
              </label>
              <select name={id + '-access'}>
                <option>MODEL_OWNER</option>
                <option>VIEWER</option>
              </select>
            </div>
            <div className="mb-6 w-1/2 px-3">
              <label className="form-label" id="email">
                User email
              </label>
              <input
                name={id + '-email'}
                type="email"
                placeholder="j.smith@inst1.edu"
              ></input>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    event.target.classList.add('was-validated');
    if (!event.target.checkValidity()) {
      event.target.querySelector(':invalid')?.focus();
      return;
    }
    if (schoolType === 'pdp') {
      const raw = event.target.elements.pdp_id?.value?.trim() ?? '';
      if (!raw) {
        document.getElementById('result_area').innerHTML =
          'Error: PDP Institution ID is required when PDP is selected.';
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
      name: event.target.elements.inst_name.value,
      state: event.target.elements.state.value,
      allowed_emails:
        Object.keys(constructedEmailDict).length === 0
          ? null
          : constructedEmailDict,
    };
    if (schoolType === 'pdp') {
      payload.is_pdp = true;
      payload.pdp_id = event.target.elements.pdp_id?.value?.trim() || null;
    } else if (schoolType === 'edvise') {
      payload.is_edvise = true;
    } else if (schoolType === 'legacy') {
      payload.is_legacy = true;
    } else if (schoolType === 'genai') {
      payload.is_genai = true;
    }
    setSubmitting(true);
    return axios({
      method: 'post',
      url: '/create-inst-api',
      data: payload,
    })
      .then(res => {
        setSubmitSuccess(
          `Created new institution with ID: ${res.data.inst_id}`,
        );
      })
      .catch(e => {
        const err = e.response?.data?.error ?? e.message ?? 'Request failed.';
        setSubmitError(typeof err === 'string' ? err : JSON.stringify(err));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <AppLayout title="Create Institution">
      <div className="flex w-full flex-col items-center">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <Cog8ToothIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Admin Actions"
          minorTitle="Create New Institution"
        ></HeaderLabel>
        <form
          className={`w-full max-w-full pt-24 pr-36 pl-36${submitting ? ' waiting' : ''}`}
          noValidate
          onSubmit={handleSubmit}
          onReset={event => {
            setSchoolType('');
            setSubmitError(null);
            setSubmitSuccess(null);
            setSubmitting(false);
            event.target.classList.remove('was-validated');
          }}
        >
          {submitting && (
            <div className="waiting-overlay">
              <div
                className="waiting-spinner"
                role="status"
                aria-label="Creating institution"
              ></div>
            </div>
          )}
          <div id="form_contents" className="flex flex-col gap-y-6">
            <div className="flex w-full flex-row gap-x-6">
              <div className="form-field flex w-2/3 flex-col">
                <label className="form-label" htmlFor="inst_name">
                  Institution Name
                </label>
                <input
                  id="inst_name"
                  name="inst_name"
                  type="text"
                  placeholder="College/University Name"
                  required
                  autoComplete="off"
                  aria-describedby="inst_name_error"
                ></input>
                <p id="inst_name_error" className="form-field-error">
                  <ExclamationCircleIcon
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  Please enter an institution name.
                </p>
              </div>
              <div className="flex w-1/3 flex-col">
                <label className="form-label" id="state">
                  State
                </label>
                <select name="state">
                  <option value="">&mdash;</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AS">American Samoa</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="GU">Guam</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="MP">Northern Mariana Islands</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VI">U.S. Virgin Islands</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>
            </div>
            <div className="flex w-full flex-row gap-x-6">
              <div className="form-field flex w-1/2 flex-col">
                <fieldset aria-describedby="school_type_error">
                  <legend className="text-base font-semibold text-gray-900">
                    Institution type
                  </legend>
                  <p className="form-hint mt-1">
                    Choose exactly one. Required before submit.
                  </p>
                  <div className="mt-4 space-y-3 border-t border-b border-gray-200 py-3">
                    {SCHOOL_TYPES.map(({ value, label }, index) => (
                      <div key={value} className="flex items-center gap-3">
                        <input
                          id={`school_type_${value}`}
                          name="school_type"
                          type="radio"
                          value={value}
                          checked={schoolType === value}
                          onChange={() => setSchoolType(value)}
                          required={index === 0}
                        />
                        <label
                          htmlFor={`school_type_${value}`}
                          className="text-sm font-medium text-gray-900"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <p id="school_type_error" className="form-field-error">
                  <ExclamationCircleIcon
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  Please select an institution type.
                </p>
              </div>
              <div className="flex w-1/2 flex-col">
                {schoolType === 'pdp' ? (
                  <>
                    <label className="form-label" id="pdp_id">
                      PDP Institution ID
                    </label>
                    <input name="pdp_id" className="mb-3" type="text"></input>
                    <p className="form-hint">
                      For PDP schools, please add the PDP_INST id of the
                      institution. Include any leading zeroes.
                    </p>
                  </>
                ) : (
                  <></>
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
              type="reset"
              className="btn btn-secondary"
              disabled={submitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
        {submitSuccess && (
          <div className="flex w-full px-36 pt-12 pb-24">
            <Alert variant="success" mainMsg={submitSuccess} />
          </div>
        )}
        {submitError && (
          <div className="flex w-full px-36 pt-12 pb-24">
            <Alert variant="danger" mainMsg={submitError} />
          </div>
        )}
        <div id="result_area" className="flex"></div>
      </div>
    </AppLayout>
  );
}

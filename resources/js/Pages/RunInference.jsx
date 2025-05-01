import React, { useState, ChangeEvent, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import Steppers from '@/Components/Steppers';
import HeaderLabel from '@/Components/HeaderLabel';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import BigDangerAlert from '@/Components/BigDangerAlert';

export default function RunInference() {
  const [currentStep, setCurrentStep] = useState(1);
  const [triggeredRun, setTriggeredRun] = useState(false);
  const [result, setResult] = useState('');
  const steps = [{ label: 'Start Prediction', step: 1 }];

  const [batchList, setBatchList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    axios
      .get('/models-api')
      .then(res => {
        setModelsList(res.data);
      })
      .catch(err => {
        if (
          err.response != null &&
          err.response.data != null &&
          err.response.data.error != null
        ) {
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get('/view-uploaded-data')
      .then(res => {
        setBatchList(res.data.batches);
      })
      .catch(err => {
        if (
          err.response != null &&
          err.response.data != null &&
          err.response.data.error != null
        ) {
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
      });
  }, []);

  const triggerInference = event => {
    event.preventDefault();
    // TODO: enable some way to indicate if it is pdp or not? is that required.
    if (event.target.elements.batch_name.value == '') {
      setError('No batch set.');
      return;
    }
    if (event.target.elements.model_name.value == '') {
      setError('No model set.');
      return;
    }
    axios({
      method: 'post',
      url: '/run-inference/' + event.target.elements.model_name.value,
      data: {
        batch_name: event.target.elements.batch_name.value,
        is_pdp: true,
      },
    })
      .then(res => {
        setResult('Run ID: ' + res.data.run_id);
        setTriggeredRun(true);
      })
      .catch(err => {
        if (
          err.response != null &&
          err.response.data != null &&
          err.response.data.error != null
        ) {
          setError(Error(err.response.data.error));
        } else {
          setError(err);
        }
        setTriggeredRun(true);
      });
    return;
  };

  const renderResults = (result, error) => {
    let msg = 'Prediction initiated!';
    if (result == null || result == '') {
      msg = '[ERROR] Prediction request failed with: ' + error;
      return (
        <div className="flex px-36">
          <BigDangerAlert mainMsg={msg}></BigDangerAlert>
        </div>
      );
    }
    msg = msg + result;
    return (
      <div className="flex px-36">
        <BigSuccessAlert
          mainMsg={msg}
          msgDetails="You will get an email notifying you of the new dashboard results, once they're ready."
        ></BigSuccessAlert>
      </div>
    );
  };

  const renderPredictionParamInputs = currentStep => {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex">
          For the most up-to-date Student Success Tool predictions we recommend
          starting a new prediction for each semester.
        </div>
        <div className="flex pb-6">
          Select the model and batch that you would like to run a prediction on.
        </div>
        <form onSubmit={triggerInference}>
          <div className="flex justify-center py-3 font-bold">
            Step 1: Please select an existing batch or import new data.
          </div>
          <div className="flex w-full flex-row justify-center gap-x-6">
            {batchList == undefined || batchList.length == 0 ? (
              <select
                className="mb-4 flex w-1/2 rounded-lg border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
                id="batch_name"
              >
                <option disabled value="">
                  No batches exist
                </option>
              </select>
            ) : (
              <select
                className="mb-4 flex w-1/2 rounded-lg border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
                id="batch_name"
              >
                {batchList.map(b => (
                  <option>{b.name}</option>
                ))}
              </select>
            )}
            <span className="flex font-bold text-black">or</span>
            <Link
              href={route('file-upload')}
              as="button"
              className="mb-4 flex rounded-lg border border-[#f79222] bg-white px-6 py-2 font-semibold text-[#f79222]"
            >
              Upload Data
            </Link>
          </div>
          <div className="flex py-3 font-bold">
            Step 2: Please select a model.
          </div>
          {modelsList == undefined || modelsList.length == 0 ? (
            <select
              className="mb-4 flex w-full rounded-lg border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
              id="model_name"
            >
              <option disabled value="">
                No Models exist
              </option>
            </select>
          ) : (
            <select
              className="mb-4 flex w-full rounded-lg border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
              id="model_name"
            >
              {modelsList.map(m => (
                <option>{m.name}</option>
              ))}
            </select>
          )}
          <div className="flex w-full items-end justify-end pt-12">
            <button
              type="submit"
              className="mb-4 flex items-center justify-center rounded-lg bg-[#f79222] px-3 py-2 font-semibold text-white"
            >
              Generate Predictions
            </button>
          </div>
        </form>
      </div>
    );
  };
  // The title in AppLayout needs to match the nav bar label.
  return (
    <AppLayout
      title="Start Prediction"
      renderHeader={() => (
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Run Inference
        </h2>
      )}
    >
      <div className="flex w-full flex-col" id="main_area">
        <HeaderLabel
          className="pl-12"
          iconObj={
            <PlusCircleIcon aria-hidden="true" className="size-6 shrink-0" />
          }
          majorTitle="Actions"
          minorTitle="Start Prediction"
        ></HeaderLabel>
        <Steppers
          currentStep={currentStep}
          stepsDict={steps}
          className="pb-12 pt-32"
        />
        {triggeredRun
          ? renderResults(result, error)
          : renderPredictionParamInputs(currentStep)}
      </div>
    </AppLayout>
  );
}

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
        console.log(JSON.stringify(res.data.batches));
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
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex">
          For the most up-to-date SST predictions we recommend starting a new
          prediction for each semester.
        </div>
        <div className="flex pb-6">
          Select the model and batch that you would like to run a prediction on.
        </div>
        <form onSubmit={triggerInference}>
          <div className="flex py-3 font-bold justify-center">
            Step 1: Please select an existing batch or import new data.
          </div>
          <div className="flex flex-row gap-x-6 w-full justify-center">
            {batchList == undefined || batchList.length == 0 ? (
              <select
                className="flex bg-white border border-gray-200 text-gray-700 py-2 px-6 mb-4 w-1/2 rounded-lg focus:outline-none focus:border-gray-500"
                id="batch_name"
              >
                <option disabled value="">
                  No batches exist
                </option>
              </select>
            ) : (
              <select
                className="flex bg-white border border-gray-200 text-gray-700 py-2 px-6 mb-4 w-1/2 rounded-lg focus:outline-none focus:border-gray-500"
                id="batch_name"
              >
                {batchList.map(b => (
                  <option>{b.name}</option>
                ))}
              </select>
            )}
            <span className="text-black font-bold flex">or</span>
            <Link
              href={route('file-upload')}
              as="button"
              className="flex border border-[#f79222] text-[#f79222] bg-white font-semibold py-2 px-6 mb-4 rounded-lg"
            >
              Upload Data
            </Link>
          </div>
          <div className="flex py-3 font-bold">
            Step 2: Please select a model.
          </div>
          {modelsList == undefined || modelsList.length == 0 ? (
            <select
              className="flex bg-white border border-gray-200 text-gray-700 py-2 px-6 mb-4 w-full rounded-lg focus:outline-none focus:border-gray-500"
              id="model_name"
            >
              <option disabled value="">
                No Models exist
              </option>
            </select>
          ) : (
            <select
              className="flex bg-white border border-gray-200 text-gray-700 py-2 px-6 mb-4 w-full rounded-lg focus:outline-none focus:border-gray-500"
              id="model_name"
            >
              {modelsList.map(m => (
                <option>{m.name}</option>
              ))}
            </select>
          )}
          <div className="flex w-full justify-end items-end pt-12">
            <button
              type="submit"
              className="flex bg-[#f79222] text-white py-2 px-3 rounded-lg mb-4 justify-center items-center font-semibold rounded-lg"
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
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Run Inference
        </h2>
      )}
    >
      <div className="w-full flex flex-col" id="main_area">
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
          className="pt-32 pb-12"
        />
        {triggeredRun
          ? renderResults(result, error)
          : renderPredictionParamInputs(currentStep)}
      </div>
    </AppLayout>
  );
}

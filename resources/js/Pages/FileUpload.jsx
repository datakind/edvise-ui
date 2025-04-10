import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import {
  DocumentDuplicateIcon,
  TrashIcon,
  DocumentIcon,
  CheckIcon,
  XMarkIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import Steppers from '@/Components/Steppers';
import classNames from 'classnames';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import BigDangerAlert from '@/Components/BigDangerAlert';
import HeaderLabel from '@/Components/HeaderLabel';
import Spinner from '@/Components/Spinner';
import { set } from 'lodash';

export default function FileUpload() {
  // TODO: Change the state structure to handle multiple file status
  // TODO: Use buttons where static onclick changes are happenings and links otherwise.
  const [fileStatus, setFileStatus] = useState({});
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [batchCreationResult, setBatchCreationResult] = useState('');
  const [startPrediction, setStartPrediction] = useState(false);
  const [validationResults, setValidationResults] = useState({});
  const [batchName, setBatchName] = useState('');
  const [modelsList, setModelsList] = useState([]);
  const [predictionResults, setPredictionResults] = useState(null);

  useEffect(() => {
    axios
      .get('/models-api')
      .then(res => {
        setModelsList(res.data);
      })
      .catch(err => {
        // TODO bubble out these errors
        console.log('error with model fetch');
      });
  }, []);

  const steps = [
    { label: 'Upload data', step: 1 },
    { label: 'Data validation', step: 2 },
    { label: 'Save', step: 3 },
    { label: 'Start prediction', step: 4 },
  ];

  const renderProcessing = () => {
    return (
      <div className="flex justify-center w-full">
        <Spinner mainMsg="Validation in progress"></Spinner>
      </div>
    );
  };

  const renderPredictionResults = () => {
    if (predictionResults == null) {
      return <></>;
    }
    if (predictionResults['error']) {
      let msg =
        '[ERROR] Prediction trigger failed: ' + predictionResults['error'];
      return (
        <div className="flex flex-col pr-24 pl-24">
          <BigDangerAlert mainMsg={msg}></BigDangerAlert>
        </div>
      );
    }
    return (
      <div className="flex flex-col pr-24 pl-24 gap-y-24">
        <BigSuccessAlert
          mainMsg="Prediction initiated!"
          msgDetails={
            "You will get an email notifying you of the new dashboard results, once they're ready. " +
            predictionResults['ok']
          }
        ></BigSuccessAlert>
      </div>
    );
  };

  const renderBatchCreationResults = (batchCreationResult, startPrediction) => {
    if (batchCreationResult == '') {
      return <></>;
    }
    if (batchCreationResult !== 'ok') {
      let msg = '[ERROR] Batch creation failed: ' + batchCreationResult;
      return (
        <div className="flex flex-col pr-24 pl-24">
          <BigDangerAlert mainMsg={msg}></BigDangerAlert>
          <div className="flex flex-row justify-between w-full items-end pt-48">
            <Link
              href={route('file-upload')}
              className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
            >
              Upload Data
            </Link>
          </div>
        </div>
      );
    }
    if (!startPrediction) {
      return (
        <div className="flex flex-col pr-24 pl-24 gap-y-24">
          <BigSuccessAlert mainMsg="Batch creation successful!"></BigSuccessAlert>
          <div className="flex justify-end w-full items-end">
            <button
              id="button_content"
              onClick={() => setCurrentStep(4)}
              className={classNames(
                'opacity-100',
                'px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4 justify-center flex',
              )}
            >
              Start Prediction
            </button>
          </div>
        </div>
      );
    }
    setCurrentStep(4);
    return <></>;
  };

  const renderValidationResults = validationResults => {
    if (
      validationResults == undefined ||
      Object.keys(validationResults).length == 0
    ) {
      return <></>;
    }
    if (Object.values(validationResults).find(element => element !== 'ok')) {
      return (
        <div className="flex flex-col pr-24 pl-24">
          <BigDangerAlert
            mainMsg="[ERROR] The following files must be re-uploaded"
            msgDict={validationResults}
            excludeValue="ok"
          ></BigDangerAlert>
          <div className="flex flex-row justify-between w-full items-end pt-48">
            <Link
              href={route('file-upload')}
              className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
            >
              Back
            </Link>

            <Link
              href={route('file-upload')}
              as="button"
              disabled={true}
              className="opacity-50 px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
            >
              Next
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col pr-24 pl-24">
        <BigSuccessAlert
          mainMsg="Data validation successful!"
          msgDetails="Your data has been successfully validated. You can now proceed to name the folder and confirm the upload."
        ></BigSuccessAlert>
        <div className="flex flex-row justify-between w-full items-end pt-48">
          <Link
            href={route('file-upload')}
            className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
          >
            Back
          </Link>
          <button
            className="opacity-100 px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
            onClick={() => setCurrentStep(3)}
          >
            Next
          </button>
        </div>{' '}
      </div>
    );
  };

  function validationButtonDisable(disabled) {
    return (
      <div className="flex w-full justify-end items-end">
        <button
          id="button_content"
          onClick={triggerUpload}
          disabled={disabled}
          className={classNames(
            disabled ? 'opacity-50' : 'opacity-100',
            'px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4',
          )}
        >
          Run Validation
        </button>
      </div>
    );
  }

  function validationButton(files, fileStatus) {
    if (files == undefined || fileStatus == undefined) {
      return true;
    }
    const disableButton =
      constructErrMessage(fileStatus) !== '' || files.length == 0;

    return validationButtonDisable(disableButton);
  }

  const renderUpload = (files, fileStatus) => {
    return (
      <div>
        <div className="flex items-center justify-center">
          Please upload both course-level and student semester files to generate
          predictions.
        </div>
        <div className="flex items-center justify-center w-full">
          Data can be uploaded to train a model or start an inference run for
          new dashboard results.
        </div>
        <div className="flex items-center justify-center w-full items-center justify-center w-full pr-24 pl-24 pt-12">
          <label
            id="drop-zone"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
            onDragOver={dragOverImageChange}
            onDragLeave={dragLeaveChange}
            onDrop={dropHandle}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-y-2">
              <DocumentDuplicateIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-gray-500"
              />
              <p className="mb-2 text-md text-black font-semibold">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV (less than 1 GB)</p>
              <input
                id="dropzone-file-input"
                type="file"
                className="hidden"
                onChange={fileSelectedHandler}
                accept=".csv"
                multiple="True"
              />
            </div>
          </label>
        </div>
        <div className="flex py-12 w-full mx-auto pl-24 pr-24">
          {files == undefined || files.length == 0 ? (
            validationButtonDisable(true)
          ) : (
            <ul
              className="flex flex-col gap-y-1 justify-stretch items-stretch font-semibold text-gray-600 w-full"
              id="files-show"
            >
              <div className="flex justify-center pb-6">
                <SuccessAlert
                  className="flex"
                  errDict={fileStatus}
                  mainMsg="Submission can be uploaded!"
                ></SuccessAlert>
                <DangerAlert
                  className="flex"
                  errDict={fileStatus}
                  mainMsg="There were errors with your submission:"
                ></DangerAlert>
              </div>
              {files.map((f, idx) => (
                <li className="flex-col" key={f.name + idx}>
                  <div className="flex justify-between w-full">
                    <div className="flex">
                      {' '}
                      {fileStatus[f.name] == undefined ? (
                        <CheckIcon
                          aria-hidden="true"
                          className="inline-block align-middle size-5 shrink-0 text-green-400 font-bold"
                        />
                      ) : (
                        <XMarkIcon
                          aria-hidden="true"
                          className="inline-block align-middle size-5 shrink-0 text-red-500 font-bold"
                        />
                      )}{' '}
                      <DocumentIcon
                        aria-hidden="true"
                        className="inline-block align-middle size-5 shrink-0"
                      />
                      {f.name}
                    </div>{' '}
                    <button onClick={() => remove(f.name)}>
                      <TrashIcon
                        aria-hidden="true"
                        className="flex inline-block align-middle size-5 shrink-0"
                      />
                    </button>
                  </div>
                  <hr className="flex h-[2px] my-2 bg-gray-300 w-full border-0"></hr>
                </li>
              ))}
              {validationButton(files, fileStatus)}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const MAX_FILE_BYTES = 1000 * 1024 * 1024; // limit 1 GB

  const resetUploader = () => {
    setFileStatus({});
    setFiles([]);
  };

  const fileSelectedHandler = event => {
    fileHandler(event.target.files);
  };

  const remove = filename => {
    if (files.length == 0) {
      return;
    }
    let newArr = [];
    for (let item of files) {
      if (item.name !== filename) {
        newArr.push(item);
      }
    }
    setFiles(newArr);

    if (
      Object.keys(fileStatus).length != 0 &&
      fileStatus[filename] != undefined
    ) {
      let newDict = {};
      for (const [key, value] of Object.entries(fileStatus)) {
        if (key !== filename) {
          newDict[key] = value;
        }
      }
      setFileStatus(newDict);
    }
  };

  function constructErrMessage(errDict) {
    if (Object.keys(errDict).length == 0) {
      return '';
    }
    let errMsg = 'Error: ';
    for (const [key, value] of Object.entries(errDict)) {
      errMsg = errMsg + ' [' + key + '] ' + value + '\n';
    }
    return errMsg;
  }

  const fileHandler = filesArg => {
    if (filesArg) {
      let allFiles = Array.from(filesArg);
      let fileErrors = {};
      allFiles = allFiles.concat(files);

      // Check for duplicate names
      for (let i in allFiles) {
        for (let j in allFiles) {
          if (
            i !== j &&
            allFiles[i].name === allFiles[j].name &&
            fileErrors[allFiles[i].name] == undefined
          ) {
            fileErrors[allFiles[i].name] = 'File names must be unique.';
          }
        }
      }
      for (const file of allFiles) {
        if (file.size > MAX_FILE_BYTES) {
          fileErrors[file.name] = 'File size exceeds 1 GB';
        }
        if (file.type != 'text/csv' && file.type != '.csv') {
          fileErrors[file.name] = 'CSV required.';
        }
        if (file == undefined || file.size == 0) {
          fileErrors[file.name] = 'Empty file.';
        }
        if (file.name.length == 0 || file.name.length > 999) {
          fileErrors[file.name] = 'File name too long.';
        }
      }
      if (Object.keys(fileStatus).length != 0) {
        setFileStatus(
          [fileStatus, fileErrors].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) {
              r[k] = o[k];
            });
            return r;
          }, {}),
        );
      } else {
        setFileStatus(fileErrors);
      }
      setFiles(allFiles);
    }
  };

  // Pass in startPrediction as a bool.
  const createBatch = startPred => {
    setBatchCreationResult('');
    let batchConstructed = batchName;
    if (batchConstructed == '') {
      let currDate = new Date();
      // Months start at 0 so we have to add one.
      let currMonth = currDate.getMonth() + 1;
      let dayString =
        currDate.getFullYear() + '-' + currMonth + '-' + currDate.getDate();
      batchConstructed = 'Batch_' + dayString + '_' + Date.now();
    }
    // Get the files that were just successfully uploaded.
    let batchFileNames = [];
    for (const [key, value] of Object.entries(validationResults)) {
      if (value == 'ok') {
        batchFileNames.push(key);
      }
    }
    return axios({
      method: 'post',
      url: '/create-batch',
      data: {
        name: batchConstructed,
        // batch_disabled: event.target.elements.inst_name.value,
        file_names: batchFileNames,
      },
    })
      .then(res => {
        setBatchName(batchConstructed);
        setBatchCreationResult('ok');
        setStartPrediction(startPred);
      })
      .catch(e => {
        let err = '';
        if (e.response) {
          err = e.response.data.error;
        } else {
          err = JSON.stringify(e);
        }
        setBatchCreationResult('Error: ' + err);
        setStartPrediction(startPred);
      });
  };

  // Show file info (for the + Add File feature)
  // TODO delete?
  const viewData = () => {
    return axios
      .get('/view-uploaded-data')
      .then(res => {
        // TODO populate
      })
      .catch(e => {
        let err = '';
        if (e.response) {
          err = e.response.data.error;
        } else {
          err = JSON.stringify(e);
        }
      });
  };

  // Frontend prepends timestamp, manually uploaded files on the backend won't include that.
  const triggerUpload = () => {
    if (Object.keys(fileStatus).length != 0 || files.length == 0) {
      return;
    }

    setCurrentStep(2);
    setProcessing(true);
    // Clear validation status
    //setValidationResults({});
    let localValidationResults = {};

    const config = {
      headers: {
        'Content-Type': 'text/csv',
      },
    };
    Promise.allSettled(
      files.map(file => {
        var filenameConstructed = Date.now() + '_' + file.name;
        return axios
          .post('/file-upload-api/' + filenameConstructed)
          .then(res => {
            // Fun fact! If the file object is null or undefined, the Content-Type header gets auto-dropped by the browser.
            // GCS signed URLs require the headers to match the ones used at URL generation time.

            if (res.data == 'local-url-fake-signed') {
              // This is the local test case, simply validate as true as we're mocking out this data.
              localValidationResults[filenameConstructed] = 'ok';
              return;
            }
            return axios
              .put(res.data, file, config)
              .then(res1 => {
                return axios
                  .post('/file-validate-api/' + filenameConstructed)
                  .then(res2 => {
                    localValidationResults[filenameConstructed] = 'ok';
                    return;
                  })
                  .catch(e => {
                    if (e.response) {
                      localValidationResults[filenameConstructed] =
                        '[Validation] ' + e.response.data.error;
                    } else {
                      localValidationResults[filenameConstructed] =
                        '[Validation] ' + JSON.stringify(e);
                    }
                  });
              })
              .catch(e => {
                if (e.response) {
                  localValidationResults[filenameConstructed] =
                    '[Upload] ' + e.response.data.error;
                } else {
                  localValidationResults[filenameConstructed] =
                    '[Upload] ' + JSON.stringify(e);
                }
              });
          })
          .catch(e => {
            if (e.response) {
              localValidationResults[filenameConstructed] =
                '[Upload URL retrieval] ' + e.response.data.error;
            } else {
              localValidationResults[filenameConstructed] =
                '[Upload URL retrieval] ' + JSON.stringify(e);
            }
          });
      }),
    ).then(() => {
      setValidationResults(localValidationResults);
      setProcessing(false);
      return;
    });
  };

  const renderSaveBatch = () => {
    steps[2].label = 'Save batch';
    return (
      <div className="flex flex-col px-48 pt-12">
        <div className="mb-6">
          <label
            htmlFor="batchName"
            className="block text-md font-medium text-gray-700"
          >
            Optional: Give your batch a meaningful name.
          </label>
          <input
            type="text"
            name="batchName"
            id="batchName"
            className="mt-1 p-2 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f79222]"
            value={batchName}
            onChange={e => setBatchName(e.target.value)}
            placeholder="Inference Run 2024 Fall Cohort 1"
          />
          <p className="mt-2 text-sm text-gray-500">
            If left blank, we will give it a default name (ie.
            Batch_YYYYMMDD_TIMESTAMP)
          </p>
        </div>
        <div className="flex flex-row justify-between w-full items-end pt-24">
          <Link
            href={route('file-upload')}
            className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4 -ml-24"
          >
            Back
          </Link>
          <div className="flex -mr-24">
            <button
              className="px-6 bg-white text-[#f79222] border border-[#f79222] font-semibold py-2 px-3 rounded-lg mb-4 mr-4"
              onClick={() => {
                // Also start the prediction so set it to true.
                createBatch(true);
              }}
            >
              Save and start prediction
            </button>
            <button
              className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
              onClick={() => {
                // We don't start the prediction so set it to false.
                createBatch(false);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const triggerPredictions = event => {
    event.preventDefault();
    // TODO: enable some way to indicate if it is pdp or not? is that required.
    if (batchName == '') {
      let res = {};
      res['error'] = 'No batch set.';
      setPredictionResults(res);
      return;
    }
    if (event.target.elements.model_name.value == '') {
      let res = {};
      res['error'] = 'No model set.';
      setPredictionResults(res);
      return;
    }
    axios({
      method: 'post',
      url: '/run-inference/' + event.target.elements.model_name.value,
      data: {
        batch_name: batchName,
        is_pdp: true,
      },
    })
      .then(res => {
        let result = {};
        result['ok'] = 'Run ID: ' + res.data.run_id;
        setPredictionResults(result);
      })
      .catch(err => {
        let res = {};
        res['error'] = JSON.stringify(err);
        setPredictionResults(res);
      });
    return;
  };

  const renderStartPrediction = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex">
          For the most up-to-date SST predictions we recommend starting a new
          prediction for each semester.
        </div>
        <div className="flex pb-6">
          Select the model that you would like to run a prediction on.
        </div>
        <form onSubmit={triggerPredictions}>
          <div className="flex py-3 font-bold">Please select a model.</div>
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

  const dragOverImageChange = event => {
    const dropZone = document.getElementById('drop-zone');
    event.preventDefault();
    dropZone.className = dropZone.className.replace(
      /(?:^|\s)border-gray-300(?!\S)/g,
      ' border-gray-600 ',
    );
  };

  const dragLeaveChange = event => {
    const dropZone = document.getElementById('drop-zone');
    event.preventDefault();
    dropZone.className = dropZone.className.replace(
      /(?:^|\s)border-gray-600(?!\S)/g,
      ' border-gray-300 ',
    );
  };

  const dropHandle = event => {
    const dropZone = document.getElementById('drop-zone');
    event.preventDefault();
    dropZone.className = dropZone.className.replace(
      /(?:^|\s)border-gray-600(?!\S)/g,
      ' border-gray-300 ',
    );
    fileHandler(event.dataTransfer.files);
  };
  // The title in AppLayout needs to match the nav bar label.
  return (
    <AppLayout
      title="Upload Data"
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          FileUpload
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
          minorTitle="Upload Data"
        ></HeaderLabel>
        <Steppers
          currentStep={currentStep}
          stepsDict={steps}
          className="pt-32 pb-12"
        />

        {currentStep === 1
          ? renderUpload(files, fileStatus)
          : currentStep === 2
            ? processing
              ? renderProcessing()
              : renderValidationResults(validationResults)
            : currentStep === 3
              ? batchCreationResult !== ''
                ? renderBatchCreationResults(
                    batchCreationResult,
                    startPrediction,
                  )
                : renderSaveBatch()
              : currentStep === 4
                ? predictionResults != null
                  ? renderPredictionResults()
                  : renderStartPrediction()
                : null}
      </div>
    </AppLayout>
  );
}

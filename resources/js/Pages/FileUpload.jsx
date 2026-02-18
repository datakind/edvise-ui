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
import ErrorAlert from '@/Components/ErrorAlert';
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
      <div className="flex w-full justify-center">
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
        <div className="flex flex-col pl-24 pr-24">
          <ErrorAlert mainMsg={msg}></ErrorAlert>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-y-24 pl-24 pr-24">
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
        <div className="flex flex-col pl-24 pr-24">
          <ErrorAlert mainMsg={msg}></ErrorAlert>
          <div className="flex w-full flex-row items-end justify-between pt-48">
            <Link
              href={route('file-upload')}
              className="mb-4 rounded-lg bg-[#f79222] px-3 px-6 py-2 font-semibold text-white"
            >
              Upload Data
            </Link>
          </div>
        </div>
      );
    }
    if (!startPrediction) {
      return (
        <div className="flex flex-col gap-y-24 pl-24 pr-24">
          <BigSuccessAlert mainMsg="Batch creation successful!"></BigSuccessAlert>
          <div className="flex w-full items-end justify-end">
            <button
              id="button_content"
              onClick={() => setCurrentStep(4)}
              className={classNames(
                'opacity-100',
                'mb-4 flex justify-center rounded-full bg-[#f79222] px-3 px-6 py-2 text-black',
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
        <div className="flex flex-col pl-24 pr-24">
          <ErrorAlert
            mainMsg="[ERROR] The following files must be re-uploaded"
            msgDict={validationResults}
            excludeValue="ok"
          ></ErrorAlert>
          <div className="flex w-full flex-row items-end justify-between pt-48">
            <Link
              href={route('file-upload')}
              className="mb-4 rounded-full bg-[#f79222] px-3 px-6 py-2 text-black"
            >
              Back
            </Link>

            <Link
              href={route('file-upload')}
              as="button"
              disabled={true}
              className="mb-4 rounded-full bg-[#f79222] px-3 px-6 py-2 text-black opacity-50"
            >
              Next
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col pl-24 pr-24">
        <BigSuccessAlert
          mainMsg="Data validation successful!"
          msgDetails="Your data has been successfully validated. You can now proceed to name the folder and confirm the upload."
        ></BigSuccessAlert>
        <div className="flex w-full flex-row items-end justify-between pt-48">
          <Link
            href={route('file-upload')}
            className="mb-4 rounded-full bg-gray-300 px-3 px-6 py-2 text-black"
          >
            Back
          </Link>
          <button
            className="mb-4 rounded-full bg-[#f79222] px-3 px-6 py-2 text-black opacity-100"
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
      <div className="flex w-full items-end justify-end">
        <button
          id="button_content"
          onClick={triggerUpload}
          disabled={disabled}
          className={classNames(
            disabled ? 'opacity-50' : 'opacity-100',
            'mb-4 rounded-full bg-[#f79222] px-3 px-6 py-2 text-black',
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
      <div className="text-[#4F4F4F]">
        <div className="flex items-center justify-center">
          Please upload both course-level and student semester files to generate
          predictions.
        </div>
        <div className="flex w-full items-center justify-center">
          Data can be uploaded to train a model or start an inference run for
          new dashboard results.
        </div>
        <div className="flex w-full items-center justify-center pl-24 pr-24 pt-12">
          <label
            id="drop-zone"
            className="flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#f79222] bg-gray-50 hover:bg-gray-100"
            onDragOver={dragOverImageChange}
            onDragLeave={dragLeaveChange}
            onDrop={dropHandle}
          >
            <div className="flex flex-col items-center justify-center gap-y-2 pb-6 pt-5">
              <DocumentDuplicateIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-gray-500"
              />
              <p className="text-md mb-2 font-semibold text-black">
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
            {files.map((f, idx) => (
              <li className="list-none flex-col" key={f.name + idx}>
                <div className="flex w-full justify-between">
                  <div className="my-3 flex rounded-full bg-[#F79222] px-3 py-1 text-black">
                    {' '}
                    {fileStatus[f.name] == undefined ? (
                      <div className="mr-2">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_961_15637)">
                            <path
                              d="M8.99998 0.506248C4.3031 0.506248 0.506226 4.30312 0.506226 9C0.506226 13.6969 4.3031 17.5219 8.99998 17.5219C13.6969 17.5219 17.5219 13.6969 17.5219 9C17.5219 4.30312 13.6969 0.506248 8.99998 0.506248ZM8.99998 16.2562C5.00623 16.2562 1.77185 12.9937 1.77185 9C1.77185 5.00625 5.00623 1.77187 8.99998 1.77187C12.9937 1.77187 16.2562 5.03437 16.2562 9.02812C16.2562 12.9937 12.9937 16.2562 8.99998 16.2562Z"
                              fill="black"
                            />
                            <path
                              d="M11.4187 6.38437L8.07183 9.64687L6.55308 8.15625C6.29996 7.90312 5.90621 7.93125 5.65308 8.15625C5.39996 8.40937 5.42808 8.80312 5.65308 9.05625L7.45308 10.8C7.62183 10.9687 7.84683 11.0531 8.07183 11.0531C8.29683 11.0531 8.52183 10.9687 8.69058 10.8L12.3187 7.3125C12.5718 7.05937 12.5718 6.66562 12.3187 6.4125C12.0656 6.15937 11.6718 6.15937 11.4187 6.38437Z"
                              fill="black"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_961_15637">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    ) : (
                      <XMarkIcon
                        aria-hidden="true"
                        className="inline-block size-5 shrink-0 align-middle font-bold text-red-500"
                      />
                    )}{' '}
                    <DocumentIcon
                      aria-hidden="true"
                      className="inline-block size-5 shrink-0 align-middle text-black"
                    />
                    {f.name}
                  </div>{' '}
                  <button onClick={() => remove(f.name)}>
                    <TrashIcon
                      aria-hidden="true"
                      className="inline-block flex size-5 shrink-0 align-middle"
                    />
                  </button>
                </div>
              </li>
            ))}
          </label>
        </div>
        <div className="mx-auto flex w-full py-12 pl-24 pr-24">
          {files == undefined || files.length == 0 ? (
            validationButtonDisable(true)
          ) : (
            <ul
              className="flex w-full flex-col items-stretch justify-stretch gap-y-1 font-semibold text-gray-600"
              id="files-show"
            >
              <div className="flex justify-center pb-6">
                <DangerAlert
                  className="flex"
                  errDict={fileStatus}
                  mainMsg="There were errors with your submission:"
                ></DangerAlert>
              </div>

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
            className="text-md block font-medium text-gray-700"
          >
            Optional: Give your batch a meaningful name.
          </label>
          <input
            type="text"
            name="batchName"
            id="batchName"
            className="mt-1 w-full rounded-full border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f79222]"
            value={batchName}
            onChange={e => setBatchName(e.target.value)}
            placeholder="Inference Run 2024 Fall Cohort 1"
          />
          <p className="mt-2 text-sm text-gray-500">
            If left blank, we will give it a default name (ie.
            Batch_YYYYMMDD_TIMESTAMP)
          </p>
        </div>
        <div className="flex w-full flex-row items-end justify-between pt-24">
          <Link
            href={route('file-upload')}
            className="-ml-24 mb-4 rounded-full bg-gray-300 px-3 px-6 py-2 text-black"
          >
            Back
          </Link>
          <div className="-mr-24 flex">
            <button
              className="mb-4 mr-4 rounded-full border border-[#f79222] bg-white px-3 px-6 py-2 font-semibold text-[#f79222]"
              onClick={() => {
                // Also start the prediction so set it to true.
                createBatch(true);
              }}
            >
              Save and start prediction
            </button>
            <button
              className="mb-4 rounded-full bg-[#f79222] px-3 px-6 py-2 text-black"
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
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex">
          For the most up-to-date SST predictions we recommend starting a new
          prediction for each semester.
        </div>
        <div className="flex pb-6">
          Select the model that you would like to run a prediction on.
        </div>
        <form onSubmit={triggerPredictions}>
          <div className="flex py-3 text-base font-light">
            Please select a model:
          </div>
          {modelsList == undefined || modelsList.length == 0 ? (
            <select
              className="mb-4 flex w-full rounded-full border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
              id="model_name"
            >
              <option disabled value="">
                No Models exist
              </option>
            </select>
          ) : (
            <select
              className="mb-4 flex w-full rounded-full border border-gray-200 bg-white px-6 py-2 text-gray-700 focus:border-gray-500 focus:outline-none"
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
              className="font-normaltext-black mb-4 flex items-center justify-center rounded-full bg-[#f79222] px-3 py-2"
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
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          FileUpload
        </h2>
      )}
    >
      <div
        className="mx-12 mb-12 flex w-full flex-col rounded-3xl bg-white p-8"
        id="main_area"
      >
        <div className="text-center text-5xl font-light">Upload Data</div>
        <Steppers
          currentStep={currentStep}
          stepsDict={steps}
          className="pb-12 pt-24"
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

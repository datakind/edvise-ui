import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
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
import ProgressBar from '@/Components/ProgressBar';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import BigDangerAlert from '@/Components/BigDangerAlert';
import HeaderLabel from '@/Components/HeaderLabel';
import Spinner from '@/Components/Spinner';

export default function FileUpload() {
  // Change the state structure to handle multiple file status
  const [fileStatus, setFileStatus] = useState({});
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const [validationResults, setValidationResults] = useState({});

  const steps = [
    { label: 'Upload data', step: 1 },
    { label: 'Data validation', step: 2 },
    { label: 'Save', step: 3 },
  ];

  const renderProcessing = () => {
    return (
      <div className="flex justify-center w-full">
        <Spinner mainMsg="Validation in progress"></Spinner>
      </div>
    );
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
              as="button"
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
            as="button"
            className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
          >
            Back
          </Link>

          <Link
            href={route('file-upload')}
            as="button"
            className="opacity-100 px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4"
          >
            Next
          </Link>
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

  // TODO reset to 1GB after dev: Currently 5MB for testing error case.
  const MAX_FILE_BYTES = 5 * 1024 * 1024; // 1000 * 1024 * 1024; // limit 1 GB

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

  // Frontend prepends timestamp, manually uploaded files on the backend don't include that.
  const createBatch = () => {};
  // Frontend prepends timestamp, manually uploaded files on the backend don't include that.
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
                    localValidationResults[filenameConstructed] =
                      '[Validation] ' + e;
                  });
              })
              .catch(e => {
                localValidationResults[filenameConstructed] = '[Upload] ' + e;
              });
          })
          .catch(e => {
            localValidationResults[filenameConstructed] =
              '[Upload URL retrieval] ' + e;
          });
      }),
    ).then(() => {
      setValidationResults(localValidationResults);
      setProcessing(false);
      return;
    });
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

        {currentStep == 1
          ? renderUpload(files, fileStatus)
          : processing
            ? renderProcessing()
            : renderValidationResults(validationResults)}
      </div>
    </AppLayout>
  );
}

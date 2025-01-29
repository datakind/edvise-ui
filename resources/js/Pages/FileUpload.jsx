import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import {
  DocumentDuplicateIcon,
  TrashIcon,
  DocumentIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import Steppers from '@/Components/Steppers';
import classNames from 'classnames';
import ProgressBar from '@/Components/ProgressBar';
import BigSuccessAlert from '@/Components/BigSuccessAlert';
import BigDangerAlert from '@/Components/BigDangerAlert';

/*
scratch:

        newArr.forEach((i) => {
                    console.log("aaaaaaaaaaaaaaaa:"+i.name);

                });
*/


/*export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ validationResults }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}

*/
export default function FileUpload() {

    // Change the state structure to handle multiple file status
    const [fileStatus, setFileStatus] = useState();
    const [validationResults, setValidationResults] = useState();
    const [files, setFiles] = useState();
    const [processing, setProcessing] = useState(false);
    const [processingAmt, setProcessingAmt] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        console.log("ENTER USEEFFECT");
        console.log("UNDEF?"+ JSON.stringify(validationResults));

        // If we're updating validationResults to nonempty value, processing has completed.
        if(validationResults !== undefined && Object.keys(validationResults).length !== 0) {
            setCurrentStep(3);
            setProcessing(false);
            console.log("SETTING PROCESSING TO FALSE");
            console.log(JSON.stringify(validationResults));
        }
    }, [validationResults]);


    // TODO reset to 1GB after dev: Currently 5MB for testing error case.
    const MAX_FILE_BYTES = 5 * 1024 * 1024; // 1000 * 1024 * 1024; // limit 1 GB

    const resetUploader = () => {
        setFileStatus({});
        setFiles([]);
    };

    const fileSelectedHandler = (event) => {
        fileHandler(event.target.files);
}

    const remove = (filename) => {
        if (files == undefined) {
            return;
        }
        let newArr = [];
        for (let item of files) {
            if (item.name !== filename){
                newArr.push(item);
            }
        }
        setFiles(newArr);

        if(fileStatus != undefined && fileStatus[filename] != undefined) {
            let newDict = {};
            for (const [key, value] of Object.entries(fileStatus)) {
                if (key !== filename) {
                    newDict[key] = value;
                }
            }
            setFileStatus(newDict);
        }
    }

    const constructErrMessage = (errDict) => {
    if (errDict == undefined || Object.keys(errDict).length == 0) {
        return "";
    }
    let errMsg = "Error: ";
    for (const [key, value] of Object.entries(errDict)) {
        errMsg = errMsg + " ["+key+"] "+ value + "\n";
    }
    return errMsg;
    }


const fileHandler = (filesArg) => {
        if (filesArg) {
            let allFiles = Array.from(filesArg);
            let fileErrors = {};
            if (files !== undefined && allFiles !== undefined) {
                allFiles = allFiles.concat(files);

            }

            // Check for duplicate names
            for (let i in allFiles) {
                for (let j in allFiles) {
                    if (i !== j && allFiles[i].name === allFiles[j].name && fileErrors[allFiles[i].name] == undefined) {
                        fileErrors[allFiles[i].name] = "File names must be unique.";
                    }
                }
            }

            for (const file of allFiles) {
                if (file.size > MAX_FILE_BYTES) {
                    fileErrors[file.name] = "File size exceeds 1 GB";
                }
                if (file.type != 'text/csv' && file.type != '.csv') {
                    fileErrors[file.name] = "CSV required.";
                }
                if (file == undefined || file.size == 0) {
                    fileErrors[file.name] = "Empty file.";
                }
            }
        if (fileStatus !== undefined) {
            setFileStatus([fileStatus, fileErrors].reduce(function (r, o) {
            Object.keys(o).forEach(function (k) { r[k] = o[k]; });
            return r;
            }, {}));
        } else {
            setFileStatus(fileErrors);
        }
        setFiles(allFiles);

        }
    }

// Frontend prepends timestamp, manually uploaded files on the backend don't include that.
    const createBatch = () => {
        
}
// Frontend prepends timestamp, manually uploaded files on the backend don't include that.
    const triggerUpload = () => {
        if ( fileStatus != undefined && Object.keys(fileStatus).length != 0){
            return;
        }
        if (files == undefined || files.length == 0) {
            return;
        }

        setCurrentStep(2);
        // use files.length to get a good interval for progress bar progression

        // Clear validation status
        //setValidationResults({});
        let localValidationResults = {};

        const config = {
            headers: {
                "Content-Type": "text/csv", 
            }
        }

        setProcessing(true);
        setProcessingAmt("");
        Promise.allSettled(files.map((file) => {
            var filenameConstructed = Date.now() + '_' + file.name;
            return axios.post('/file-upload-api/'+'14c81c50935e41518561c2fc3bdabc0f'+ '/' + filenameConstructed).then(res => {
                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa*"+JSON.stringify(res));

                // Fun fact! If the file object is null or undefined, the Content-Type header gets auto-dropped by the browser.
                // GCS signed URLs require the headers to match the ones used at URL generation time.
                axios.put(res.data, file, config).then(res1 => {
                                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6");

                    axios.post('/file-validate-api/'+'14c81c50935e41518561c2fc3bdabc0f'+ '/' + filenameConstructed).then(res2 => {
                        localValidationResults[filenameConstructed]="ok";
                                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa5");

                    }).catch(e => {
                                    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4" + e);

                            localValidationResults[filenameConstructed] = "[Validation] " + e;
                    });

                }).catch(e => {
                                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa3" + e);

                    localValidationResults[filenameConstructed] = "[Upload] " +e;
        });
            }).catch(e => {
                            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa2");

                localValidationResults[filenameConstructed] = "[Upload URL retrieval] " + e;
        });
        })).then(() => {
            console.log("HELLLLLLLOO")
            setValidationResults(localValidationResults);
        });
        
    }

    const dragOverImageChange = (event) => {
        const dropZone = document.getElementById('drop-zone');
        event.preventDefault();
        dropZone.className = dropZone.className.replace( /(?:^|\s)border-gray-300(?!\S)/g , ' border-gray-600 ' );    
    }

    const dragLeaveChange = (event) => {
        const dropZone = document.getElementById('drop-zone');
        event.preventDefault();
        dropZone.className = dropZone.className.replace( /(?:^|\s)border-gray-600(?!\S)/g , ' border-gray-300 ' );
    }

    const dropHandle = (event) => {
        const dropZone = document.getElementById('drop-zone');
        event.preventDefault();
        dropZone.className = dropZone.className.replace( /(?:^|\s)border-gray-600(?!\S)/g , ' border-gray-300 ' );
        fileHandler(event.dataTransfer.files);
    }
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
        <Steppers currentStep={currentStep} />

{(validationResults !== undefined && Object.keys(validationResults).length !== 0) ? 
( <div className="flex pr-24 pl-24">
{(Object.values(validationResults).find((element) => element !== "ok")) ? (
    <div>
    <BigDangerAlert mainMsg="[ERROR] The following files must be re-uploaded" msgDict={validationResults} excludeValue="ok"></BigDangerAlert>
    <div className="flex justify-end items-end pt-48">
        <button id="button_content" onClick={createBatch} disabled={true} className="opacity-50 px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4">Next</button>
    </div> </div>
    ) : (
      <div>
    <BigSuccessAlert mainMsg="OK" msgDetails="hellohello"></BigSuccessAlert>
    <div className="flex justify-end items-end pt-48">
        <button id="button_content" onClick={createBatch} className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4">Next</button>
    </div> </div>

    )}
    
   </div> )
:
(

processing ? (
<ProgressBar className="flex" progressMsg="Validation in progress......" amt="1/2"></ProgressBar>
) : 

(<div>
    <div className="flex items-center justify-center">Please upload both course-level and student semester files to generate predictions.</div>
    <div className="flex items-center justify-center w-full">Data can be uploaded to train a model or start an inference run for new dashboard results.</div>
    <div className="flex items-center justify-center w-full items-center justify-center w-full pr-24 pl-24 pt-12">
        <label id="drop-zone" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300" onDragOver={dragOverImageChange} onDragLeave={dragLeaveChange} onDrop={dropHandle}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-y-2">
                <DocumentDuplicateIcon aria-hidden="true" className="size-6 shrink-0 text-gray-500" />
                <p className="mb-2 text-md text-black font-semibold">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">CSV (less than 1 GB)</p>
                <input id="dropzone-file-input" type="file" className="hidden" onChange={fileSelectedHandler} accept=".csv" multiple="True"/>
            </div>
        </label>
    </div> 
    <div className="flex py-12 w-full mx-auto pl-24">

        {(files == undefined || files.length == 0)? (<></>) : 
            (
        <ul className="flex flex-col gap-y-1 justify-stretch items-stretch font-semibold text-gray-600 w-full pr-24" id="files-show">
        <div className="flex justify-center pb-6"><SuccessAlert className="flex" errDict={fileStatus} mainMsg="Submission can be uploaded!"></SuccessAlert><DangerAlert className="flex" errDict={fileStatus} mainMsg="There were errors with your submission:"></DangerAlert></div>
                {files.map((f, idx) => (
        <li className="flex-col" key={f.name+idx}>
        <div className="flex justify-between w-full">
         <div className="flex"> {(fileStatus[f.name] == undefined) ? (<CheckIcon aria-hidden="true" className="inline-block align-middle size-5 shrink-0 text-green-400 font-bold" />) : (<XMarkIcon aria-hidden="true" className="inline-block align-middle size-5 shrink-0 text-red-500 font-bold" />)} <DocumentIcon aria-hidden="true" className="inline-block align-middle size-5 shrink-0" /> 
        {f.name}</div> <button onClick={() => remove(f.name)}><TrashIcon aria-hidden="true" className="flex inline-block align-middle size-5 shrink-0" /></button>
        </div>
        <hr className="flex h-[2px] my-2 bg-gray-300 w-full border-0"></hr>
        </li>
        ))}
        </ul>
                )}

    </div>
    <div className="flex justify-end items-end pr-24">
        <button id="button_content" onClick={triggerUpload} disabled={(constructErrMessage(fileStatus) == "" && files !== undefined && files.length !== 0) ? "" : true} className={classNames((constructErrMessage(fileStatus) == "" && files !== undefined && files.length !== 0) ? 'opacity-100' : 'opacity-50', 'px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4')}>Run Validation</button>
    </div>
    </div>
)


    )}
</div>

</AppLayout>
);}

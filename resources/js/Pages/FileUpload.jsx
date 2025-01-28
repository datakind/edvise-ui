import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import {
CheckCircleIcon,
XCircleIcon,
} from '@heroicons/react/24/solid';
import {
DocumentDuplicateIcon,
TrashIcon,
DocumentIcon,
CheckIcon,
XMarkIcon,
} from '@heroicons/react/24/outline';
import DangerAlert from '@/Components/DangerAlert';
import SuccessAlert from '@/Components/SuccessAlert';
import classNames from 'classnames';

export default function FileUpload() {

    // Change the state structure to handle multiple file status
    const [fileStatus, setFileStatus] = useState();
    const [files, setFiles] = useState();
    const [processing, setProcessing] = useState(false);

    const MAX_FILE_BYTES = 0; //1000 * 1024 * 1024; // limit 1 GB

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
        resetUploader(); // reset the uploader
        if (filesArg) {
            let filesLocal = Array.from(filesArg);
            let fileErrors = {};

            // Check for duplicate names
            if ((new Set(filesLocal)).size !== filesLocal.length) {
                fileErrors["General"] = "File names should be unique.";
            }

            for (const file of filesLocal) {
                if (file.size > MAX_FILE_BYTES) {
                    fileErrors[file.name] = "File size exceeds 1 GB";
                }
                if (file.type != 'text/csv' && file.type != '.csv') {
                    fileErrors[file.name] = "CSV required.";
                }
            }
            setFileStatus(fileErrors);
            setFiles(filesLocal);

        }
    }

// Frontend prepends timestamp, manually uploaded files on the backend don't include that.
    const triggerUpload = () => {
        if ( fileStatus != undefined && Object.keys(fileStatus).length != 0){
            return;
        }
        if (files == undefined || files.length == 0) {
            return;
        }
        setProcessing(true);
        // const sleep = ms => new Promise(r => setTimeout(r, 20000));
        //setProcessing(false);
        /*files.forEach(file => {
            var filenameConstructed = Date.now() + '_' + file.name;
            const config = {
                headers: {
                    "Content-Type": "text/csv", 
                }
            }
            const output = axios.post('/file-upload-api/'+'14c81c50935e41518561c2fc3bdabc0f'+ '/' + filenameConstructed).then(res => {
                // Fun fact! If the file object is null or undefined, the Content-Type header gets auto-dropped by the browser.
                // GCS signed URLs require the headers to match the ones used at URL generation time.
                axios.put(res.data, file, config).then(res1 => {
                    document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>Validating " + file.name + " as " + filenameConstructed;
                    document.getElementById("button_content").innerHTML = "Validating...";

                    axios.post('/file-validate-api/'+'14c81c50935e41518561c2fc3bdabc0f'+ '/' + filenameConstructed).then(res2 => {
                        document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>Submitted: " + file.name + " as " + filenameConstructed;

                        document.getElementById("button_content").innerHTML = "Submit Files";
                    }).catch(e => {
                            document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>ERROR validating: " + file.name + " - " + e;
                            document.getElementById("button_content").innerHTML = "Submit Files";

                    });

                }).catch(err => {
                document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>ERROR: " + file.name + " - " + err;
                document.getElementById("button_content").innerHTML = "Submit Files";

        });
            }).catch(err => {
                document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>ERROR: " + file.name + " - " + err;
                document.getElementById("button_content").innerHTML = "Submit Files";
        });
        });*/
        
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
{processing ? (
<div>
    <div className="flex items-center justify-center">Validation in progress...</div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 ">
  <div className="bg-gray-600 h-2.5 rounded-full"></div>
</div> 
</div>) : 

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
                {files.map((f) => (
        <li className="flex-col" key= {f.name}>
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
    <div id="result_area" className="flex"> </div>
    <div className="flex justify-end items-end pr-24">
        <button id="button_content" onClick={triggerUpload} disabled={(constructErrMessage(fileStatus) == "" && files !== undefined && files.length !== 0) ? "" : true} className={classNames((constructErrMessage(fileStatus) == "" && files !== undefined && files.length !== 0) ? 'opacity-100' : 'opacity-50', 'px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4')}>Run Validation</button>
    </div>
    </div>
)

}
</div>

</AppLayout>
);}

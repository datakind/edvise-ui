import React, { useState, ChangeEvent, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';


export default function FileUpload() {

    // Change the state structure to handle multiple file status
    const [fileStatus, setFileStatus] = useState();
    const [files, setFiles] = useState()

    const MAX_FILE_BYTES = 5000 * 1024 * 1024; // limit 5 GB

    const resetUploader = () => {
        setFileStatus({});
        setFiles([]);
        document.getElementById("files-show").innerHTML = "";
        document.getElementById("result_area").innerHTML = "";
    };

    const fileSelectedHandler = (event) => {
        resetUploader(); // reset the uploader

        if (event.target.files) {
            let filesLocal = Array.from(event.target.files);
            let isValid = true; // Flag to check if all files are valid
            let fileErrors = {};


            // Check for duplicate names
            if ((new Set(filesLocal)).size !== filesLocal.length) {
                isValid = false;
                fileErrors["General"] = "Duplicate file names detected. File names should be unique.";
            }

            for (const file of filesLocal) {
                if (file.size > MAX_FILE_BYTES) {
                    fileErrors[file.name] = "File size cannot exceed 5 GB";
                    isValid = false;
                }
                if (file.type != 'text/csv' && file.type != '.csv') {
                    fileErrors[file.name] = "File type not accepted. Only CSV accepted.";
                    isValid = false;
                }
            }
            if (!isValid) {
                for (const [key, value] of Object.entries(fileErrors)) {
                document.getElementById("files-show").innerHTML = document.getElementById("files-show").innerHTML + "<br>ERROR: " + key + " - " + value;
                }
                document.getElementById("files-show").innerHTML = document.getElementById("files-show").innerHTML + "<br>Please retry.";
                setFileStatus(fileErrors);

            } else {
                setFiles(filesLocal);
                document.getElementById("files-show").appendChild(document.createTextNode("Files to validate and upload (you will be email notified when files are validated or failed for successfully submitted files):"));

                var ulElem = document.createElement("UL");
                for (const f of filesLocal) {
                    var item = document.createElement("LI");
                    item.appendChild(document.createTextNode(f.name));
                    ulElem.appendChild(item);
                }
                document.getElementById("files-show").appendChild(ulElem);
            }
        }
    }

// Frontend prepends timestamp, manually uploaded files on the backend don't include that.
    const triggerUpload = () => {
        if ( fileStatus != undefined && Object.keys(fileStatus).length != 0){
            document.getElementById("result_area").innerHTML = "Submit disallowed until all errors resolved.";
            return;
        }
        if (files == undefined || files.length == 0) {
            document.getElementById("result_area").innerHTML = "Please upload at least one file.";
            return;
        }
        files.forEach(file => {
            var filenameConstructed = Date.now() + '_' + file.name;
            const config = {
                headers: {
                    "Content-Type": file.type, 
                }
            }
            const output = axios.post('/file-upload-api/'+'6488bd0c3715468fae3837bdd6e89199'+ '/' + filenameConstructed).then(res => {
                axios.put(res.data, file.data, config).then(res1 => {
                      document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>Submitted: " + file.name + " as " + filenameConstructed;
                }).catch(err => {
                document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>ERROR: " + file.name + " - " + err;
        });
            }).catch(err => {
                document.getElementById("result_area").innerHTML = document.getElementById("result_area").innerHTML + "<br>ERROR: " + file.name + " - " + err;
        });
        });
        
    }

    return (
        <AppLayout
            title="FileUpload"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    FileUpload
                </h2>
            )}
        >

<div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
            <p className="text-xs text-gray-500 dark:text-gray-400">csv (MAX. 5GB)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={fileSelectedHandler} accept=".csv" multiple="True"/>
    </label>
</div> 

<div className="py-12">
                <div id="files-show" className="max-w-7xl mx-auto sm:px-6 lg:px-8">                
                    </div>
            </div>


            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <button id="button_content"
                        onClick={triggerUpload}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4"
                    >
                        Submit Files
                    </button>
                    <div id="result_area"> 
                    </div>

                    </div>
            </div>

        </AppLayout>
    );
}

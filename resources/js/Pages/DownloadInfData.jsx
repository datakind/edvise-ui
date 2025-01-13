import React, { useState, ChangeEvent, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

// Skeleton for the download inf data page.
export default function DownloadInfData() {

// csv as 2d matrix
const tableCreate = (parsedValues) => {
  const tbl = document.createElement('table');
  tbl.style.width = '100px';
  tbl.style.border = '1px solid black';

    // one less than length bc of how newline split adds one more to the list.
    for (let i = 0; i < parsedValues.length-1; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < parsedValues[0].length; j++) {
            const td = tr.insertCell();
            td.appendChild(document.createTextNode(parsedValues[i][j]));
            td.style.border = '1px solid black';
        }
    }
  return tbl;
}

    const triggerDownload = () => {
        document.getElementById("result_area").innerHTML = "";

        var filename = document.getElementById("filename").value;
        if (filename == undefined || filename == "") {
            document.getElementById("result_area").innerHTML = "Please add a valid filename";
            return;
        }

        const output = axios.get('/download-inf-data/'+'6488bd0c3715468fae3837bdd6e89199'+ '/' + filename).then(res => {
                window.open(res.data, '_self');
            }).catch(err => {
                document.getElementById("result_area").innerHTML = "3"+filename + " url:"  + err;
        });

    }

    const loadView = () => {
         document.getElementById("result_area").innerHTML = "";
         document.getElementById("table_area").innerHTML = "";

        var filename = document.getElementById("filename").value;
        if (filename == undefined || filename == "") {
            document.getElementById("result_area").innerHTML = "Please add a valid filename";
            return;
        }
        const output = axios.get('/download-inf-data/'+'6488bd0c3715468fae3837bdd6e89199'+ '/' + filename).then(res => {

    fetch(res.data).then(res1 => {
        res1.text().then(res2 => {
            const lines = res2.split(/\r\n|\r|\n/);
            const outcome = lines.map((line) => line.split(","));
        document.getElementById("result_area").innerHTML = filename + " in table format:";

            document.getElementById("table_area").appendChild(tableCreate(outcome));

        }).catch(err1 => {
            document.getElementById("result_area").innerHTML = filename + ": "  + err1;
        });
    }).catch(err2 => {
        document.getElementById("result_area").innerHTML = filename + ": "  + err2;
    });

            }).catch(err => {
                document.getElementById("result_area").innerHTML = filename + " url:"  + err;
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <p id="info">
                    Type in the filename you want to download below.
                    A sample file you can download: sample_output.csv
                    </p>
                     <input type="text" id="filename" name="filename"/>
                    <button id="button_content"
                        onClick={triggerDownload}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4"
                    >
                        Download
                    </button>                     <button id="button_content"
                        onClick={loadView}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4"
                    >
                        Show Data
                    </button>
                    <div id="result_area">
                    </div>
                    <div id="table_area">
                    </div>
                    </div>
            </div>

        </AppLayout>
    );
}


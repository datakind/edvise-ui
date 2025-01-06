import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';


export default function FileUpload() {

    const makeUploadApiCall = () => {
        // The following just demonstrates printing out result from the API call.
        const output = axios.get(route('post.file-upload-api'))
            .then(res => {
                document.getElementById("button_content").innerHTML = res.data[0].name;
            })
            .catch(err => console.log(err));

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
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                    FILE UPLOAD: 
                    <button id="button_content"
                        onClick={makeUploadApiCall}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4"
                    >
                        BUTTON TEXT HERE
                    </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

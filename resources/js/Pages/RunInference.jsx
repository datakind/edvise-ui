import React, { useState, ChangeEvent, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

// Skeleton for the inference run trigger.
export default function RunInference() {

    const triggerInference = () => {
        document.getElementById("result_area").innerHTML = "Creating inference run...";
        // ADD DATABRICKS WEBHOOK CALL HERE
    }

    return (
        <AppLayout
            title="Run Inference"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Run Inference
                </h2>
            )}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div id="info_area">
                    Triggers an inference run for the one sample model we have.
                    </div>
                    <button id="button_content"
                        onClick={triggerInference}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg mb-4"
                    >
                        Run Inference
                    </button>
                    <div id="result_area">
                    </div>
                    </div>
            </div>

        </AppLayout>
    );
}
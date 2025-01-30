import React, { useState, ChangeEvent, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import Steppers from '@/Components/Steppers';
import HeaderLabel from '@/Components/HeaderLabel';
import {
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

export default function RunInference() {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { label: 'Start Prediction', step: 1 }
    ];

    const triggerInference = () => {
        document.getElementById("result_area").innerHTML = "Creating inference run...";
        // ADD DATABRICKS WEBHOOK CALL HERE
    }
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
    <HeaderLabel className="pl-12" iconObj={<PlusCircleIcon aria-hidden="true" className="size-6 shrink-0" />} majorTitle="Actions" minorTitle="Start Prediction"></HeaderLabel>
        <Steppers currentStep={currentStep} stepsDict={steps} className="pt-32 pb-12" />
                <div className="flex flex-col items-center justify-center w-full">
        <div className="flex">For the most up-to-date SST predictions we recommend starting a new prediction for each semester.</div>
    <div className="flex pb-6">Select the model and batch that you would like to run a prediction on.</div>
    <div className="flex py-3 font-bold">Step 1: Please select an existing batch or import new data.</div>
<div className="flex flex-row gap-x-6 w-full justify-center">
        <select className="flex bg-white border border-gray-200 text-gray-700 py-2 px-6 mb-4 w-1/4 rounded-lg focus:outline-none focus:border-gray-500" id="batch-id">
          <option>Batch 1</option>
          <option>Batch 2</option>
        </select>
        <span className="text-black font-bold flex">or</span>
        <Link
            href={route('file-upload')}
            as="button"
            className="flex border border-[#f79222] text-[#f79222] bg-white font-semibold py-2 px-6 mb-4 rounded-lg">
             Upload Data
        </Link>
</div>
    <div className="flex py-3 font-bold">Step 2: Please select a model.</div>
    <select className="flex bg-white border border-gray-200 text-gray-700 w-1/2 py-2 px-6 mb-4 rounded-lg focus:outline-none focus:border-gray-500" id="model-id">
          <option>Model 1</option>
          <option>Model 2</option>
    </select>
<div className="flex w-full justify-end items-end pr-48 pt-12">
        <button id="button_content" onClick={triggerInference}  
        className="px-6 bg-[#f79222] text-white font-semibold py-2 px-3 rounded-lg mb-4">Generate Predictions</button>
    </div>
            </div>
</div>
        </AppLayout>
    );
}
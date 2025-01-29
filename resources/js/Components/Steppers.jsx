import React from 'react';

const Steppers = ({ currentStep }) => {
    const steps = [
        { label: 'Upload data', step: 1 },
        { label: 'Data validation', step: 2 },
        { label: 'Save', step: 3 },
    ];

    return (
        <div className="flex justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center mx-12 relative">
                    <div
                        className={`rounded-full w-10 h-10 flex items-center justify-center border-2 
                            ${currentStep === step.step ? 'border-[#f79222] text-black font-bold' : 'border-gray-400 text-gray-600'}`}
                    >
                        {step.step}
                    </div>
                    <span className={`text-base font-medium text-center mt-2 ${currentStep >= step.step ? 'text-black' : 'text-gray-600'}`}>
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div className={`h-[2px] w-20 absolute top-1/2 -translate-y-1/2 left-[calc(50%+5.5rem)] -translate-x-1/2 bg-gray-400`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Steppers;
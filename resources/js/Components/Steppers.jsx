import React from 'react';

const Steppers = ({ currentStep }) => {
    const steps = [
        { label: 'Upload data', step: 1 },
        { label: 'Data validation', step: 2 },
        { label: 'Save', step: 3 },
    ];

    return (
        <div className="flex justify-center pt-24 pb-24">
            {steps.map((step, index) => (
                <div key={step.step} className="flex flex-col items-center mx-12 relative">
                    <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center border-2 
                            ${currentStep === step.step ? 'border-[#f79222] text-[#f79222] font-bold' : 'border-gray-300 bg-gray-300 text-black'}`}
                    >
                        {step.step}
                    </div>
                    <span className="text-base font-medium text-semibold text-center mt-2 text-black">
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div className="h-[2px] w-20 absolute top-1/2 -translate-y-1/2 left-[calc(50%+6rem)] -translate-x-1/2 bg-gray-300"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Steppers;
import React from 'react';
import classNames from 'classnames';

// Pass in the steps and styling so this can be used for multiple pages.
const Steppers = ({ currentStep, stepsDict, className }) => {
  if (stepsDict == undefined) {
    return;
  }
  return (
    <div className={classNames(className, 'flex justify-center')}>
      {stepsDict.map((step, index) => (
        <div
          key={step.step}
          className="relative mx-12 flex flex-col items-center"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${currentStep === step.step ? 'border-[#f79222] bg-[#f79222] font-bold text-black' : 'border-gray-300 bg-gray-300 text-black'}`}
          >
            {step.step}
          </div>
          <span className="text-semibold mt-2 text-center text-base font-medium text-black">
            {step.label}
          </span>
          {index < stepsDict.length - 1 && (
            <div className="absolute left-[calc(50%+6rem)] top-1/2 h-[2px] w-20 -translate-x-1/2 -translate-y-1/2 bg-gray-300"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Steppers;

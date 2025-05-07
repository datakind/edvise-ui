import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogPanel } from '@headlessui/react';
import DemoForm from '@/Components/Landing/DemoForm';

export default function DemoFormModal({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="data-lenis-prevent font-landing-primary pointer-events-auto relative z-50"
      data-lenis-prevent
    >
      <div className="landing-modal fixed inset-0 flex w-screen items-center justify-center bg-black/70 p-4">
        <DialogPanel className="layout:max-width landing-rounded-md relative w-full !overflow-y-auto bg-white py-8 sm:py-12">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black p-2 transition-colors duration-200 hover:bg-[#1E343F] focus:outline-[var(--landing-color-orange)]"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <title>Close</title>
              <path
                d="M15.5452 1.72754L9.51685 7.75488L15.5452 13.7832L14.1311 15.1973L8.10278 9.16895L2.07544 15.1973L0.661377 13.7832L6.68872 7.75488L0.661377 1.72754L2.07544 0.313477L8.10278 6.34082L14.1311 0.313477L15.5452 1.72754Z"
                fill="white"
              />
            </svg>
          </button>
          <div className="layout:grid relative z-30">
            <div className="col-span-full mb-12 sm:col-span-6">
              <p className="type:section-label mb-12">Request demo</p>
              <p className="type:section-title">
                How to get started with Student Success Tool
              </p>
            </div>
            <div className="col-span-full sm:col-span-9 sm:col-start-10">
              <DemoForm formId="modal-form" onSuccess={() => setOpen(false)} />
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

DemoFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

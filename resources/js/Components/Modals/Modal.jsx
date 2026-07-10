import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

export default function Modal({ isOpen, onClose, maxWidth = '2xl', children }) {
  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[maxWidth];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={classNames(
            'w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl',
            maxWidthClass,
          )}
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

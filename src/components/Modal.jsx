import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      {/* Modal panel */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
            {/* Header */}
            <div className="bg-white px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white px-4 py-5 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 
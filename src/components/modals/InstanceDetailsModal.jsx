import React from 'react';

const InstanceDetailsModal = ({ isOpen, onClose, instance, onCreateAlarm }) => {
  if (!isOpen) return null;

  const isRunning = instance.status.toLowerCase() === 'running';

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Instance Details
                </h3>
                
                {/* Pre-flight Checks */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Pre-flight Checks</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">AWSCloudWatchIAMPolicy</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      <span className="text-gray-700">AWSSSMMangedInstance</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alarms */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Alarms</h4>
                  <div className="space-y-2">
                    {instance.alarms.map((alarm, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                      >
                        <span className="text-gray-700">{alarm.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          alarm.status === 'OK'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {alarm.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {isRunning ? (
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  onCreateAlarm(instance.instanceId);
                  onClose();
                }}
              >
                Create Alarm
              </button>
            ) : (
              <div className="w-full sm:w-auto mb-3 sm:mb-0 sm:mr-3">
                <div className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md text-gray-500 text-sm">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Instance must be running to create alarms
                </div>
              </div>
            )}
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstanceDetailsModal; 
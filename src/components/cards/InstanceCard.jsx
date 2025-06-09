import React, { useState } from 'react';
import InstanceDetailsModal from '../modals/InstanceDetailsModal';

const InstanceCard = ({ instance, onCreateAlarm }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'stopped':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <>
      <div 
        className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-lg text-gray-900">{instance.instanceId}</h4>
            <div className="flex items-center space-x-2">
              <p className={`text-sm ${getStatusColor(instance.status)}`}>
                Status: {instance.status}
              </p>
              {instance.status.toLowerCase() === 'running' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Can Create Alarm
                </span>
              )}
            </div>
          </div>
          <div className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <InstanceDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        instance={instance}
        onCreateAlarm={onCreateAlarm}
      />
    </>
  );
};

export default InstanceCard; 
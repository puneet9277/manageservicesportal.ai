import React, { useState } from 'react';
import InstanceDetailsModal from '../modals/InstanceDetailsModal';

const InstanceCard = ({ instance, onCreateAlarm }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-lg text-gray-900">{instance.instanceId}</h4>
            <p className={`text-sm ${
              instance.status === 'running'
                ? 'text-green-600'
                : instance.status === 'pending'
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}>
              Status: {instance.status}
            </p>
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
import React from 'react';

const InstanceCard = ({ instance, onCreateAlarm }) => (
  <div className="border rounded-xl p-6 bg-white shadow-md flex flex-col h-full">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
      <button
        onClick={() => onCreateAlarm(instance.instanceId)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
      >
        Create Alarm
      </button>
    </div>
    {/* Alarms */}
    <div className="mt-4">
      <div className="flex justify-end mb-2">
        <h5 className="text-sm font-semibold">Alarms</h5>
      </div>
      <div className="space-y-2">
        {instance.alarms.map((alarm, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm"
          >
            <span>{alarm.name}</span>
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
);

export default InstanceCard; 
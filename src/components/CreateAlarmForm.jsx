import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CreateAlarmForm = () => {
  const navigate = useNavigate();
  const { instanceId } = useParams();
  const [formData, setFormData] = useState({
    alarmName: '',
    metric: 'CPUUtilization',
    threshold: '',
    operator: 'GreaterThanThreshold',
    period: '300',
    evaluationPeriods: '2',
  });

  const metrics = [
    'CPUUtilization',
    'DiskReadOps',
    'DiskWriteOps',
    'NetworkIn',
    'NetworkOut',
    'MemoryUtilization',
  ];

  const operators = [
    { value: 'GreaterThanThreshold', label: 'Greater than' },
    { value: 'LessThanThreshold', label: 'Less than' },
    { value: 'GreaterThanOrEqualToThreshold', label: 'Greater than or equal to' },
    { value: 'LessThanOrEqualToThreshold', label: 'Less than or equal to' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement actual AWS CloudWatch alarm creation
    console.log('Creating alarm for instance:', instanceId, formData);
    navigate('/aws-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">Create CloudWatch Alarm</h2>
                <p className="text-sm text-gray-600 mb-8">
                  Instance ID: {instanceId}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Alarm Name
                    </label>
                    <input
                      type="text"
                      name="alarmName"
                      value={formData.alarmName}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Metric
                    </label>
                    <select
                      name="metric"
                      value={formData.metric}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {metrics.map((metric) => (
                        <option key={metric} value={metric}>
                          {metric}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Threshold
                    </label>
                    <input
                      type="number"
                      name="threshold"
                      value={formData.threshold}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Operator
                    </label>
                    <select
                      name="operator"
                      value={formData.operator}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Period (seconds)
                    </label>
                    <select
                      name="period"
                      value={formData.period}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="900">15 minutes</option>
                      <option value="3600">1 hour</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Evaluation Periods
                    </label>
                    <input
                      type="number"
                      name="evaluationPeriods"
                      value={formData.evaluationPeriods}
                      onChange={handleChange}
                      required
                      min="1"
                      max="10"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/aws-dashboard')}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Create Alarm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlarmForm; 
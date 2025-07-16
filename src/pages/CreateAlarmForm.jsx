import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import servletLogo from '../assets/servlet.png';

const CreateAlarmForm = () => {
  const navigate = useNavigate();
  const { instanceId } = useParams();
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    alarmName: '',
    metric: 'CPUUtilization',
    threshold: '',
    operator: 'GreaterThanThreshold',
    period: '300',
    evaluationPeriods: '2',
  });

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);
  }, []);

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
    setShowContent(false);
    setTimeout(() => {
      navigate('/aws-dashboard');
    }, 300);
  };

  const handleBack = () => {
    setShowContent(false);
    setTimeout(() => {
      navigate('/aws-dashboard');
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative min-h-screen flex flex-col">
        {/* Top Bar with Logo and Navigation */}
        <div className="bg-white bg-opacity-90 shadow-sm backdrop-blur-sm w-full">
          <div className="w-full px-8">
            <div className="h-20 flex items-center justify-between relative">
              {/* Company Logo */}
              <div className="transform transition-transform duration-300 hover:scale-110">
                <img
                  src={servletLogo}
                  alt="Servlet Logo"
                  className="h-12 w-auto filter drop-shadow-lg"
                />
              </div>

              {/* Page Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
                Create Alarm
              </h2>

              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-8 transform transition-all duration-300 hover:shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-gray-600 mb-8">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </span>
                  <span className="text-lg">Instance ID: <span className="font-mono font-medium">{instanceId}</span></span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alarm Name
                      </label>
                      <input
                        type="text"
                        name="alarmName"
                        value={formData.alarmName}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter alarm name"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metric
                      </label>
                      <select
                        name="metric"
                        value={formData.metric}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {metrics.map((metric) => (
                          <option key={metric} value={metric}>
                            {metric}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Threshold
                      </label>
                      <input
                        type="number"
                        name="threshold"
                        value={formData.threshold}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter threshold value"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operator
                      </label>
                      <select
                        name="operator"
                        value={formData.operator}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Period
                      </label>
                      <select
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="60">1 minute</option>
                        <option value="300">5 minutes</option>
                        <option value="900">15 minutes</option>
                        <option value="3600">1 hour</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="block w-full px-4 py-3 rounded-xl border-gray-300 bg-gray-50 focus:bg-white transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter number of periods"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
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
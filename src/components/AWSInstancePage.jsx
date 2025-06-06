import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AWSInstancePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instanceId: '',
    region: '',
  });
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  const regions = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'eu-west-1',
    'eu-central-1',
    'ap-southeast-1',
    'ap-southeast-2',
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement actual AWS API call
    // Simulated data for demonstration
    setTimeout(() => {
      setInstances([
        {
          instanceId: 'i-1234567890abcdef0',
          status: 'running',
          alarms: [
            { name: 'CPU Usage High', status: 'OK' },
            { name: 'Memory Usage', status: 'ALARM' },
          ],
        },
        {
          instanceId: 'i-0987654321fedcba0',
          status: 'stopped',
          alarms: [
            { name: 'Disk Usage', status: 'OK' },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCreateAlarm = (instanceId) => {
    navigate(`/create-alarm/${instanceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl md:max-w-4xl mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">AWS Instance Manager</h2>
                
                {/* Instance Search Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Instance ID
                    </label>
                    <input
                      type="text"
                      name="instanceId"
                      value={formData.instanceId}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="i-1234567890abcdef0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Region
                    </label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a region</option>
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Search Instances'}
                  </button>
                </form>

                {/* Instances List */}
                {instances.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Instances</h3>
                    <div className="space-y-4">
                      {instances.map((instance) => (
                        <div
                          key={instance.instanceId}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold">{instance.instanceId}</h4>
                              <p className={`text-sm ${
                                instance.status === 'running'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}>
                                Status: {instance.status}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCreateAlarm(instance.instanceId)}
                              className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                            >
                              Create Alarm
                            </button>
                          </div>
                          
                          {/* Alarms */}
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold mb-2">Alarms</h5>
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSInstancePage; 
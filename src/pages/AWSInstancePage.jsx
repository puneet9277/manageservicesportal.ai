import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { awsInstances } from '../constants/awsInstances';
import InstanceCard from '../components/cards/InstanceCard';

const AWSInstancePage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [stats, setStats] = useState({
    total: 0,
    running: 0,
    stopped: 0,
    pending: 0
  });

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);

    // Calculate statistics
    const newStats = awsInstances.reduce((acc, instance) => {
      acc.total++;
      acc[instance.status]++;
      return acc;
    }, { total: 0, running: 0, stopped: 0, pending: 0 });
    setStats(newStats);
  }, []);

  // Filter and sort instances
  const filteredInstances = awsInstances
    .filter(instance => {
      const matchesSearch = instance.instanceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || instance.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'id') return a.instanceId.localeCompare(b.instanceId);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const handleCreateAlarm = (instanceId) => {
    setShowContent(false);
    setTimeout(() => {
      navigate(`/create-alarm/${instanceId}`);
    }, 300);
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`${color} bg-opacity-10 rounded-full p-3`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative min-h-screen flex flex-col w-full">
        {/* Top Bar */}
        <div className="bg-white bg-opacity-90 shadow-sm backdrop-blur-sm w-full">
          <div className="w-full px-8">
            <div className="h-20 flex items-center justify-between relative">
              {/* Company Logo */}
              <div className="transform transition-transform duration-300 hover:scale-110">
                <img
                  src="/workmates-logo.svg"
                  alt="Cloud Workmates"
                  className="h-12 w-auto filter drop-shadow-lg"
                />
              </div>

              {/* Page Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
                Manage Alarms
              </h2>

              {/* Back Button */}
              <button
                onClick={() => {
                  setShowContent(false);
                  setTimeout(() => navigate('/dashboard'), 300);
                }}
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
        <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Instances"
                value={stats.total}
                color="text-blue-600"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                }
              />
              <StatCard
                title="Running"
                value={stats.running}
                color="text-green-600"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />
              <StatCard
                title="Stopped"
                value={stats.stopped}
                color="text-red-600"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                color="text-yellow-600"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-4 shadow-md space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search instances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="pending">Pending</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="id">Sort by ID</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>

            {/* Instances Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstances.map((instance) => (
                <InstanceCard
                  key={instance.instanceId}
                  instance={instance}
                  onCreateAlarm={handleCreateAlarm}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredInstances.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No instances found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSInstancePage; 
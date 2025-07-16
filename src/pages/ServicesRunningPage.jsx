import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaServer, FaDatabase, FaAws, FaCode, FaPlay, FaStop, FaSync, FaExclamationCircle, FaCheckCircle, FaPauseCircle, FaQuestionCircle, FaChevronDown, FaChevronUp, FaCircle } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';

const STATUS_MAP = {
  running: { color: 'bg-green-100 text-green-700', dot: 'text-green-500', label: 'Running' },
  stopped: { color: 'bg-red-100 text-red-700', dot: 'text-red-500', label: 'Stopped' },
  error: { color: 'bg-red-100 text-red-700', dot: 'text-red-500', label: 'Error' },
  warning: { color: 'bg-yellow-100 text-yellow-700', dot: 'text-yellow-400', label: 'Warning' },
  starting: { color: 'bg-yellow-100 text-yellow-700', dot: 'text-yellow-400', label: 'Starting' },
  unknown: { color: 'bg-gray-100 text-gray-500', dot: 'text-gray-400', label: 'Unknown' },
};

const SERVICE_ICONS = {
  EC2: <FaServer className="text-indigo-500 w-7 h-7" />,
  Lambda: <FaCode className="text-yellow-500 w-7 h-7" />,
  RDS: <FaDatabase className="text-blue-500 w-7 h-7" />,
  S3: <FaAws className="text-orange-500 w-7 h-7" />,
};

const ServicesRunningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (location.state && location.state.lambdaResponse) {
      setData(location.state.lambdaResponse);
      setLoading(false);
    } else {
      setError('No data to display. Please go back and try again.');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 font-semibold mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { account_id, region, services } = data;
  // Flatten all services into a single array with type and correct name/id/status mapping
  const allServices = [
    ...(services.EC2Instances || []).map(s => ({
      ...s,
      type: 'EC2',
      name: s.InstanceId || 'Unnamed',
      id: s.InstanceId || 'Unnamed',
      status: s.State?.Name || 'running', // Default to running if missing
    })),
    ...(services.LambdaFunctions || []).map(s => ({
      ...s,
      type: 'Lambda',
      name: s.FunctionName || 'Unnamed',
      id: s.FunctionName || 'Unnamed',
      status: 'running', // Default to running
    })),
    ...(services.RDSInstances || []).map(s => ({
      ...s,
      type: 'RDS',
      name: s.DBInstanceIdentifier || 'Unnamed',
      id: s.DBInstanceIdentifier || 'Unnamed',
      status: s.DBInstanceStatus || 'running', // Default to running if missing
    })),
    ...(services.S3Buckets || []).map(s => ({
      ...s,
      type: 'S3',
      name: s.BucketName || 'Unnamed',
      id: s.BucketName || 'Unnamed',
      status: 'running', // Default to running
    })),
  ];

  // Search, filter, and sort
  const filtered = allServices.filter(s => {
    const matchesSearch = (s.name || s.id || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (s.status || 'unknown').toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sort === 'name') return (a.name || a.id || '').localeCompare(b.name || b.id || '');
    if (sort === 'status') return (a.status || '').localeCompare(b.status || '');
    if (sort === 'lastActivity') return (new Date(b.LastModified || b.CreationDate || 0)) - (new Date(a.LastModified || a.CreationDate || 0));
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-2 w-full">
      <div className="w-full max-w-full bg-white rounded-lg shadow-lg p-0">
        {/* Enhanced Professional Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-t-lg px-6 py-8 mb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <h2 className="text-4xl font-black text-indigo-900 tracking-tight mb-2 drop-shadow-sm">Running Services</h2>
              <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 font-semibold">
                <div className="flex items-center gap-1">
                  <span className="uppercase text-xs text-gray-400">Account</span>
                  <span className="font-mono text-indigo-700 text-lg">{account_id}</span>
                </div>
                <span className="hidden sm:inline-block text-gray-300 text-xl">|</span>
                <div className="flex items-center gap-1">
                  <span className="uppercase text-xs text-gray-400">Region</span>
                  <span className="font-mono text-indigo-700 text-lg">{region}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-white rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm mt-4 sm:mt-0"
              aria-label="Go back"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
        {/* Search and Sort Bar Only */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            aria-label="Search services"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            aria-label="Sort services"
          >
            <option value="name">Sort by Name</option>
            <option value="lastActivity">Sort by Last Activity</option>
          </select>
        </div>
        {/* Service Cards Vertical Stack */}
        {filtered.length === 0 ? (
          <div className="text-gray-500 italic text-center py-12">No services found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((service, idx) => (
              <ExpandableServiceCard
                key={service.id || service.name || idx}
                service={service}
                expanded={expandedIdx === idx}
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setExpandedIdx(expandedIdx === idx ? null : idx);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ExpandableServiceCard({ service, expanded, onClick, tabIndex, onKeyDown }) {
  const status = (service.status || 'unknown').toLowerCase();
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.unknown;
  const icon = SERVICE_ICONS[service.type] || <FaServer className="text-gray-400 w-7 h-7" />;
  // For status timestamp
  const lastActivity = service.LastModified || service.CreationDate || service.lastStarted || service.uptime || null;
  // For resource usage
  const cpu = service.cpuUsage;
  const mem = service.memoryUsage;
  // For description/purpose
  const description = service.Description || service.Purpose || '';
  // For configuration summary
  const configSummary = Object.entries(service)
    .filter(([k]) => !['name','id','type','status','Description','Purpose','cpuUsage','memoryUsage','LastModified','CreationDate','lastStarted','uptime'].includes(k))
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(', ');

  return (
    <div
      className={`bg-white rounded-lg shadow border transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none ${expanded ? 'scale-[1.02] shadow-lg border-indigo-300' : 'hover:scale-[1.01] hover:shadow-md'}`}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-expanded={expanded}
      aria-label={`Service card for ${service.name}`}
    >
      {/* Collapsed State */}
      <div className="flex items-center gap-3 p-4 select-none">
        {icon}
        <span className="font-semibold text-lg text-gray-900 truncate flex-1">{service.name}</span>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}> 
          <FaCircle className={`w-2 h-2 ${statusInfo.dot}`} />
          {statusInfo.label}
        </span>
        <span className="ml-2 text-gray-400">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {/* Expanded State */}
      <div
        className={`overflow-hidden transition-all duration-300 bg-gray-50 ${expanded ? 'max-h-[500px] py-4 px-6' : 'max-h-0 p-0'}`}
        style={{ pointerEvents: expanded ? 'auto' : 'none' }}
      >
        {expanded && (
          <div className="flex flex-col gap-4">
            {/* Service Information */}
            <div>
              <div className="font-bold text-lg mb-1">{service.name}</div>
              <div className="text-sm text-gray-600 mb-1">Type: <span className="font-mono">{service.type}</span></div>
              <div className="text-sm text-gray-600 mb-1">Status: Running</div>
              {lastActivity && <div className="text-sm text-gray-500 mb-1">Last Activity: {lastActivity}</div>}
              {description && <div className="text-sm text-gray-500 mb-1">{description}</div>}
            </div>
            {/* Resource Usage */}
            {(cpu !== undefined || mem !== undefined) && (
              <div className="flex flex-col gap-1">
                {cpu !== undefined && <ProgressBar label="CPU" value={cpu} color="bg-blue-500" />}
                {mem !== undefined && <ProgressBar label="Memory" value={mem} color="bg-purple-500" />}
              </div>
            )}
            {/* Action Buttons Section */}
            {/* Additional Details */}
            {configSummary && (
              <div className="text-xs text-gray-500 bg-gray-100 rounded p-2 mt-2">
                <span className="font-semibold">Configuration:</span> {configSummary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded">
        <div className={`${color} h-2 rounded`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color }) {
  const colorMap = {
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    red: 'bg-red-100 text-red-700 hover:bg-red-200',
    indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  };
  return (
    <button
      className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold shadow-sm transition ${colorMap[color]}`}
      title={label}
    >
      {icon} {label}
    </button>
  );
}

export default ServicesRunningPage; 
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaCheckCircle, FaPauseCircle, FaArrowLeft } from 'react-icons/fa';

const STATUS_MAP = {
  yes: { color: 'bg-green-100 text-green-700', dot: 'text-green-500', label: 'Logging' },
  no: { color: 'bg-yellow-100 text-yellow-700', dot: 'text-yellow-400', label: 'Not Logging' },
};

const CloudTrailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  useEffect(() => {
    if (location.state && location.state.lambdaResponse) {
      setData(location.state.lambdaResponse);
      setLoading(false);
      setTimeout(() => setShowContent(true), 100);
    } else {
      setError('No CloudTrail data to display. Please go back and try again.');
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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

  const { account_id, region, cloudtrails } = data;
  const events = cloudtrails || [];

  // Search and sort
  const filtered = events.filter(trail =>
    (trail.Name || '').toLowerCase().includes(search.toLowerCase()) ||
    (trail.HomeRegion || '').toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sort === 'name') return (a.Name || '').localeCompare(b.Name || '');
    if (sort === 'region') return (a.HomeRegion || '').localeCompare(b.HomeRegion || '');
    return 0;
  });

  return (
    <div className={`min-h-screen bg-gray-50 p-2 w-full transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-full bg-white rounded-lg shadow-lg p-0">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-t-lg px-6 py-8 mb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <h2 className="text-4xl font-black text-indigo-900 tracking-tight mb-2 drop-shadow-sm">CloudTrail Trails</h2>
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
            placeholder="Search trails..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            aria-label="Search trails"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
            aria-label="Sort trails"
          >
            <option value="name">Sort by Name</option>
            <option value="region">Sort by Region</option>
          </select>
        </div>
        {/* Trail Cards Vertical Stack */}
        {filtered.length === 0 ? (
          <div className="text-gray-500 italic text-center py-12">No CloudTrail trails found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {filtered.map((trail, idx) => (
              <ExpandableTrailCard
                key={trail.TrailARN || trail.Name || idx}
                trail={trail}
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

function ExpandableTrailCard({ trail, expanded, onClick, tabIndex, onKeyDown }) {
  const isLogging = trail.IsLogging ? 'yes' : 'no';
  const statusInfo = STATUS_MAP[isLogging] || STATUS_MAP.no;
  return (
    <div
      className={`bg-white rounded-lg shadow border transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none ${expanded ? 'scale-[1.02] shadow-lg border-indigo-300' : 'hover:scale-[1.01] hover:shadow-md'}`}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-expanded={expanded}
      aria-label={`Trail card for ${trail.Name}`}
    >
      {/* Collapsed State */}
      <div className="flex items-center gap-3 p-4 select-none">
        <span className="font-semibold text-lg text-gray-900 truncate flex-1">{trail.Name}</span>
        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusInfo.color}`}> 
          {isLogging === 'yes' ? <FaCheckCircle className="w-4 h-4 text-green-500" /> : <FaPauseCircle className="w-4 h-4 text-yellow-400" />}
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
            <div>
              <div className="font-bold text-lg mb-1">{trail.Name}</div>
              <div className="text-sm text-gray-600 mb-1">Status: <span className={`inline-flex items-center gap-1 ${statusInfo.color}`}>{statusInfo.label}</span></div>
              <div className="text-sm text-gray-600 mb-1">S3 Bucket: <span className="font-mono">{trail.S3BucketName || '-'}</span></div>
              <div className="text-sm text-gray-600 mb-1">Home Region: <span className="font-mono">{trail.HomeRegion || '-'}</span></div>
              <div className="text-sm text-gray-600 mb-1">Trail ARN: <span className="font-mono break-all">{trail.TrailARN || '-'}</span></div>
            </div>
            {/* Additional Details */}
            <div className="text-xs text-gray-500 bg-gray-100 rounded p-2 mt-2">
              <span className="font-semibold">Configuration:</span> {Object.entries(trail).filter(([k]) => !['Name','S3BucketName','IsLogging','HomeRegion','TrailARN'].includes(k)).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CloudTrailPage; 
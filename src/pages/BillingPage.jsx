import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { FaChevronDown, FaChevronUp, FaArrowLeft } from 'react-icons/fa';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#d0ed57', '#8dd1e1', '#d88884'];

const BILLING_CARDS = [
  { key: 'total', title: 'Total Cost' },
  { key: 'daily', title: 'Daily Breakdown' },
  { key: 'service', title: 'Service Breakdown' },
];

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [service, setService] = useState('All Services');
  const [region, setRegion] = useState('All Regions');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [billingData, setBillingData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.lambdaResponse) {
      setBillingData(location.state.lambdaResponse);
      setDataLoading(false);
    } else {
      setDataLoading(false);
    }
  }, [location.state]);

  // Filter helpers
  const filterDailyData = (data) => {
    let filtered = data;
    if (region !== 'All Regions') {
      // If region is part of daily data, filter here (not in your sample)
    }
    if (startDate) {
      filtered = filtered.filter(row => row.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(row => row.date <= endDate);
    }
    return filtered;
  };
  const filterServiceData = (data) => {
    if (service !== 'All Services') {
      return data.filter(row => row.service === service);
    }
    return data;
  };

  // Prepare chart data from backend
  let totalCost = 0;
  let dailyData = [];
  let serviceData = [];
  let account_id = '';
  let regionValue = '';
  if (billingData) {
    totalCost = parseFloat(billingData.total_cost_usd || 0);
    account_id = billingData.account_id || '';
    regionValue = billingData.region || '';
    if (billingData.daily_costs) {
      dailyData = filterDailyData(billingData.daily_costs).map(row => ({
        date: row.date,
        cost: parseFloat(row.amount_usd)
      }));
    }
    if (billingData.service_breakdown) {
      serviceData = filterServiceData(billingData.service_breakdown).map(row => ({
        name: row.service,
        value: parseFloat(row.amount_usd)
      }));
    }
  }

  // Get unique services and regions for filter dropdowns
  const serviceOptions = billingData && billingData.service_breakdown
    ? ['All Services', ...Array.from(new Set(billingData.service_breakdown.map(row => row.service)))]
    : ['All Services'];
  const regionOptions = billingData && billingData.region
    ? ['All Regions', billingData.region]
    : ['All Regions'];

  return (
    <div className={`min-h-screen bg-gray-50 p-2 w-full`}>
      <div className="w-full max-w-full bg-white rounded-lg shadow-lg p-0">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-t-lg px-6 py-8 mb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <h2 className="text-4xl font-black text-indigo-900 tracking-tight mb-2 drop-shadow-sm">Billing Summary</h2>
              <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 font-semibold">
                <div className="flex items-center gap-1">
                  <span className="uppercase text-xs text-gray-400">Account</span>
                  <span className="font-mono text-indigo-700 text-lg">{account_id}</span>
                </div>
                <span className="hidden sm:inline-block text-gray-300 text-xl">|</span>
                <div className="flex items-center gap-1">
                  <span className="uppercase text-xs text-gray-400">Region</span>
                  <span className="font-mono text-indigo-700 text-lg">{regionValue}</span>
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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="flex flex-col">
            <label htmlFor="service" className="mb-1 text-gray-700">Service:</label>
            <select
              id="service"
              value={service}
              onChange={e => setService(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {serviceOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="region" className="mb-1 text-gray-700">Region:</label>
            <select
              id="region"
              value={region}
              onChange={e => setRegion(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {regionOptions.map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="start-date" className="mb-1 text-gray-700">Start Date:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="mb-1 text-gray-700">End Date:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* Billing Cards Vertical Stack */}
        <div className="flex flex-col gap-6">
          {BILLING_CARDS.map((card, idx) => (
            <ExpandableBillingCard
              key={card.key}
              card={card}
              expanded={expandedIdx === idx}
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') setExpandedIdx(expandedIdx === idx ? null : idx);
              }}
              dataLoading={dataLoading}
              totalCost={totalCost}
              dailyData={dailyData}
              serviceData={serviceData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function ExpandableBillingCard({ card, expanded, onClick, tabIndex, onKeyDown, dataLoading, totalCost, dailyData, serviceData }) {
  return (
    <div
      className={`bg-white rounded-lg shadow border transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500 focus:outline-none focus-visible:z-10 ${expanded ? 'scale-[1.02] shadow-lg border-indigo-300' : 'hover:scale-[1.01] hover:shadow-md'}`}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-expanded={expanded}
      aria-label={`Billing card for ${card.title}`}
    >
      {/* Collapsed State */}
      <div className="flex items-center gap-3 p-4 select-none">
        <span className="font-semibold text-lg text-gray-900 truncate flex-1">{card.title}</span>
        <span className="ml-2 text-gray-400">{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {/* Expanded State */}
      <div
        className={`overflow-hidden transition-all duration-300 bg-gray-50 ${expanded ? 'max-h-[700px] py-4 px-6' : 'max-h-0 p-0'}`}
        style={{ pointerEvents: expanded ? 'auto' : 'none' }}
      >
        {expanded && (
          <div className="flex flex-col gap-4">
            {card.key === 'total' && (
              <div>
                <div className="font-bold text-lg mb-1">Total Cost</div>
                {dataLoading ? (
                  <div className="h-12 w-1/2 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <p className="text-4xl font-bold text-indigo-700">${totalCost.toLocaleString()}</p>
                )}
              </div>
            )}
            {card.key === 'daily' && (
              <div>
                <div className="font-bold text-lg mb-1">Daily Cost Trend</div>
                {dataLoading ? (
                  <div className="h-64 bg-gray-200 animate-pulse rounded" />
                ) : dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cost" stroke="#6366f1" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500 italic">No daily cost data available.</div>
                )}
              </div>
            )}
            {card.key === 'service' && (
              <div>
                <div className="font-bold text-lg mb-1">Cost by Service</div>
                {dataLoading ? (
                  <div className="h-64 bg-gray-200 animate-pulse rounded" />
                ) : serviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#6366f1"
                        label
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500 italic">No service breakdown data available.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BillingPage; 
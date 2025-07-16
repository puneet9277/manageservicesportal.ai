import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#d0ed57', '#8dd1e1', '#d88884'];

const BillingPage = () => {
  const location = useLocation();
  const [service, setService] = useState('All Services');
  const [region, setRegion] = useState('All Regions');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('total');
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
  if (billingData) {
    totalCost = parseFloat(billingData.total_cost_usd || 0);
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

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar / Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 font-bold text-lg">Billing Dashboard</div>
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Overview</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Cost Explorer</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Usage Reports</li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 w-full p-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">AWS Billing</h1>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
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
        {/* Tabs for summary views */}
        <div className="border-b border-gray-300">
          <nav role="tablist" aria-label="Billing Summary Tabs" className="-mb-px flex space-x-8">
            <button
              role="tab"
              aria-selected={activeTab === 'total'}
              onClick={() => handleTabChange('total')}
              className={`pb-2 text-sm font-medium ${
                activeTab === 'total' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Total Cost
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'daily'}
              onClick={() => handleTabChange('daily')}
              className={`pb-2 text-sm font-medium ${
                activeTab === 'daily' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Daily Breakdown
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'service'}
              onClick={() => handleTabChange('service')}
              className={`pb-2 text-sm font-medium ${
                activeTab === 'service' ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Service Breakdown
            </button>
          </nav>
        </div>
        {/* Content for each tab */}
        <div className="mt-6">
          {/* Total Cost Tab */}
          {activeTab === 'total' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Total Cost</h2>
              {dataLoading ? (
                <div className="h-12 w-1/2 bg-gray-200 animate-pulse rounded" />
              ) : billingData ? (
                <p className="text-4xl font-bold text-indigo-700">${totalCost.toLocaleString()}</p>
              ) : (
                <div className="text-gray-500 italic">No billing data available.</div>
              )}
            </div>
          )}
          {/* Daily Breakdown Tab */}
          {activeTab === 'daily' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Cost Trend</h2>
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
          {/* Service Breakdown Tab */}
          {activeTab === 'service' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cost by Service</h2>
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
      </main>
    </div>
  );
};

export default BillingPage; 
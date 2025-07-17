import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LabelList
} from 'recharts';
import { FaChevronDown, FaChevronUp, FaArrowLeft, FaFilePdf, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import Modal from '../components/modals/Modal';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#d0ed57', '#8dd1e1', '#d88884'];

const BILLING_CARDS = [
  { key: 'total', title: 'Total Cost' },
  { key: 'daily', title: 'Daily Breakdown' },
  { key: 'service', title: 'Service Breakdown' },
  { key: 'usage', title: 'Usage Type Breakdown' },
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsModalData, setDetailsModalData] = useState(null);

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
  let usageTypeData = [];
  let anomalyDetected = false;
  let billingPdfUrl = '';
  let pastInvoices = [];
  let projectedCost = 0;
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
    usageTypeData = billingData.usage_type_breakdown || [];
    anomalyDetected = billingData.anomaly_detected;
    billingPdfUrl = billingData.billing_pdf_report_url;
    pastInvoices = billingData.past_invoices || [];
    projectedCost = parseFloat(billingData.projected_monthly_cost_usd || 0);
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
        {/* Anomaly Banner */}
        {anomalyDetected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded flex items-center gap-3">
            <span className="font-bold">Anomaly Detected:</span> Unusual billing activity detected for this account. Please review your usage.
          </div>
        )}
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
              className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-white rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm mt-4 sm:mt-0"
              aria-label="Go back"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
        {/* Invoice Download Buttons */}
        <div className="flex flex-wrap gap-4 mb-6 px-6">
          {billingPdfUrl && (
            <a href={billingPdfUrl} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 font-semibold transition">Download Current Invoice (PDF)</a>
          )}
          {pastInvoices.map((inv, idx) => (
            <a key={inv.url} href={inv.url} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-indigo-700 px-4 py-2 rounded shadow hover:bg-indigo-100 font-semibold transition">{inv.month} Invoice</a>
          ))}
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 px-6">
          <div className="flex flex-col">
            <label htmlFor="service" className="mb-1 text-gray-700">Service:</label>
            <select
              id="service"
              value={service}
              onChange={e => setService(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="mb-1 text-gray-700">End Date:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        {/* Summary Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 px-6">
          {/* Total Cost Card */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-700">Total Cost</span>
              <FaInfoCircle className="text-gray-400" title="Total AWS spend to date for this billing period." />
            </div>
            <span className="text-3xl font-black text-indigo-700">${totalCost.toLocaleString()}</span>
            <div className="w-full mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Actual</span>
                <span>Forecast</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1 relative">
                <div
                  className="h-2 bg-purple-500 rounded-full transition-all"
                  style={{ width: `${Math.min((totalCost / (projectedCost || 1)) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-indigo-700 font-semibold">${totalCost.toLocaleString()}</span>
                <span className="text-purple-700 font-semibold">${projectedCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
          {/* Projected Cost Card */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-700">Projected Cost</span>
              <FaInfoCircle className="text-gray-400" title="Estimated total AWS spend for the full month." />
            </div>
            <span className="text-3xl font-black text-purple-700">${projectedCost.toLocaleString()}</span>
            <span className="text-xs text-gray-500 mt-2">Based on current usage trends</span>
          </div>
          {/* Anomaly Status Card */}
          <div className={`rounded-lg shadow p-4 flex flex-col items-start border ${anomalyDetected ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-200'}`}> 
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-700">Anomaly Status</span>
              <FaInfoCircle className="text-gray-400" title="AWS cost anomaly detection status." />
            </div>
            <div className="flex items-center gap-2">
              {anomalyDetected ? (
                <>
                  <FaExclamationTriangle className="text-red-500" title="Anomaly Detected" />
                  <span className="text-red-700 font-bold">Detected</span>
                </>
              ) : (
                <span className="text-green-700 font-bold">Normal</span>
              )}
            </div>
            {anomalyDetected && <span className="text-xs text-red-500 mt-2">Unusual billing activity detected</span>}
          </div>
          {/* Invoice Download Card */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-gray-700">Invoices</span>
              <FaInfoCircle className="text-gray-400" title="Download your AWS billing invoices as PDF." />
            </div>
            {billingPdfUrl && (
              <a href={billingPdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded shadow hover:bg-indigo-700 font-semibold transition text-sm mb-2">
                <FaFilePdf className="text-white" /> Current Invoice
              </a>
            )}
            {pastInvoices.map((inv, idx) => (
              <a key={inv.url} href={inv.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-gray-200 text-indigo-700 px-3 py-1.5 rounded shadow hover:bg-indigo-100 font-semibold transition text-sm mb-1">
                <FaFilePdf className="text-indigo-700" /> {inv.month} Invoice
              </a>
            ))}
          </div>
        </div>
        {/* Billing Cards Vertical Stack */}
        <div className="flex flex-col gap-6 px-6">
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
              projectedCost={projectedCost}
              dailyData={dailyData}
              serviceData={serviceData}
              usageTypeData={usageTypeData}
              billingData={billingData}
              setShowDetailsModal={setShowDetailsModal}
              setDetailsModalData={setDetailsModalData}
            />
          ))}
        </div>
        {/* Full Details Modal */}
        <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Full Billing Data">
          <div className="max-h-[70vh] overflow-auto text-xs bg-gray-50 p-4 rounded">
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(detailsModalData, null, 2)}</pre>
          </div>
        </Modal>
      </div>
    </div>
  );
};

function ExpandableBillingCard({ card, expanded, onClick, tabIndex, onKeyDown, dataLoading, totalCost, projectedCost, dailyData, serviceData, usageTypeData, billingData, setShowDetailsModal, setDetailsModalData }) {
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
        className={`overflow-hidden transition-all duration-300 bg-gray-50 ${expanded ? 'max-h-[900px] py-4 px-6' : 'max-h-0 p-0'}`}
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
                  <>
                    <p className="text-4xl font-bold text-indigo-700">${totalCost.toLocaleString()}</p>
                    <div className="text-gray-600 mt-2">Projected Monthly Cost: <span className="font-semibold text-purple-700">${projectedCost.toLocaleString()}</span></div>
                  </>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold transition"
                  onClick={e => { e.stopPropagation(); setShowDetailsModal(true); setDetailsModalData(billingData); }}
                >View Full Details</button>
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
                {/* Scrollable Table for Daily Costs */}
                {dailyData.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-auto rounded border border-gray-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Date</th>
                          <th className="px-2 py-1 text-left">Amount (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyData.map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1 font-mono">{row.date}</td>
                            <td className="px-2 py-1 font-mono">${row.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold transition"
                  onClick={e => { e.stopPropagation(); setShowDetailsModal(true); setDetailsModalData(billingData); }}
                >View Full Details</button>
              </div>
            )}
            {card.key === 'service' && (
              <div>
                <div className="font-bold text-lg mb-1">Cost by Service</div>
                {dataLoading ? (
                  <div className="h-64 bg-gray-200 animate-pulse rounded" />
                ) : serviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={40 + serviceData.length * 32}>
                    <BarChart
                      data={serviceData}
                      layout="vertical"
                      margin={{ top: 10, right: 40, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} label={{ value: 'Cost (USD)', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fontWeight: 600, width: 140 }}
                        width={160}
                        label={{ value: 'Service', angle: -90, position: 'insideLeft', offset: 10 }}
                        interval={0}
                        tickFormatter={name => name.length > 18 ? name.slice(0, 16) + '…' : name}
                      />
                      <Tooltip formatter={v => `$${v}`} />
                      <Bar dataKey="value" name="Cost (USD)" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-bar-${index}`} fill="#6366f1" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-gray-500 italic">No service breakdown data available.</div>
                )}
                {/* Scrollable Table for Service Breakdown */}
                {serviceData.length > 0 && (
                  <div className="mt-4 max-h-48 overflow-auto rounded border border-gray-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Service</th>
                          <th className="px-2 py-1 text-left">Amount (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceData.map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1 font-mono">{row.name}</td>
                            <td className="px-2 py-1 font-mono">${row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {serviceData.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                      <FaInfoCircle className="text-gray-400" title="Top 3 services by spend." /> Top 3 Services
                    </div>
                    <ul className="mt-1 ml-1 list-disc list-inside text-xs text-indigo-800">
                      {serviceData.slice(0, 3).map((row, i) => (
                        <li key={row.name} className="font-bold">{row.name} <span className="text-indigo-600 font-normal">${row.value}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold transition"
                  onClick={e => { e.stopPropagation(); setShowDetailsModal(true); setDetailsModalData(billingData); }}
                >View Full Details</button>
              </div>
            )}
            {card.key === 'usage' && (
              <div>
                <div className="font-bold text-lg mb-1">Usage Type Breakdown</div>
                {dataLoading ? (
                  <div className="h-64 bg-gray-200 animate-pulse rounded" />
                ) : usageTypeData.length > 0 ? (
                  <div className="max-h-64 overflow-auto rounded border border-gray-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-2 py-1 text-left">Usage Type</th>
                          <th className="px-2 py-1 text-left">Amount (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usageTypeData.map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2 py-1 font-mono">{row.usage_type}</td>
                            <td className="px-2 py-1 font-mono">${row.amount_usd}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No usage type breakdown data available.</div>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold transition"
                  onClick={e => { e.stopPropagation(); setShowDetailsModal(true); setDetailsModalData(billingData); }}
                >View Full Details</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BillingPage; 

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BillingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (location.state && location.state.lambdaResponse) {
      setData(location.state.lambdaResponse);
      setLoading(false);
      setTimeout(() => setShowContent(true), 100);
    } else {
      setError('No billing data to display. Please go back and try again.');
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

  const { account_id, region, total_cost_usd, projected_monthly_cost_usd, anomaly_detected, daily_costs, service_breakdown, usage_type_breakdown, message } = data;

  return (
    <div className={`min-h-screen bg-gray-50 p-6 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back
        </button>
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-2">Billing Overview</h2>
          <div className="mb-2 text-gray-600">{message}</div>
          <div className="mb-4 text-gray-600">Account: <span className="font-mono">{account_id}</span> | Region: <span className="font-mono">{region}</span></div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Total Cost (USD)</h3>
                <div className="text-2xl font-bold text-green-600">{total_cost_usd ? `$${parseFloat(total_cost_usd).toFixed(2)}` : 'N/A'}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Projected Monthly Cost (USD)</h3>
                <div className="text-2xl font-bold text-blue-600">{projected_monthly_cost_usd ? `$${parseFloat(projected_monthly_cost_usd).toFixed(2)}` : 'N/A'}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Anomaly Detected</h3>
                <div className={`text-lg font-bold ${anomaly_detected ? 'text-red-600' : 'text-green-600'}`}>{anomaly_detected ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Daily Costs</h3>
              {daily_costs && daily_costs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {daily_costs.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2 font-mono">{row.date}</td>
                          <td className="px-4 py-2 font-mono">${parseFloat(row.amount).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 italic">No daily cost data.</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Service Breakdown</h3>
              {service_breakdown && service_breakdown.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Service</th>
                        <th className="px-4 py-2 text-left">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {service_breakdown.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2 font-mono">{row.service}</td>
                          <td className="px-4 py-2 font-mono">${parseFloat(row.amount).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 italic">No service breakdown data.</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Usage Type Breakdown</h3>
              {usage_type_breakdown && usage_type_breakdown.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Usage Type</th>
                        <th className="px-4 py-2 text-left">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usage_type_breakdown.map((row, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2 font-mono">{row.usage_type}</td>
                          <td className="px-4 py-2 font-mono">${parseFloat(row.amount).toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 italic">No usage type breakdown data.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage; 
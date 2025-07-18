import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CloudWatchTrailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (location.state && location.state.lambdaResponse) {
      setData(location.state.lambdaResponse);
      setLoading(false);
      setTimeout(() => setShowContent(true), 100);
    } else {
      setError('No CloudWatch log data to display. Please go back and try again.');
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

  // Use 'logGroups' as the log events array
  const { account_id, region, logGroups } = data;
  const logEvents = logGroups || [];
  console.log('CloudWatch log groups:', logEvents);

  return (
    <div className={`min-h-screen bg-gray-50 p-6 transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold mb-2">CloudWatch Log Groups</h2>
        <div className="mb-4 text-gray-600">Account: <span className="font-mono">{account_id}</span> | Region: <span className="font-mono">{region}</span></div>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Log Groups</h3>
            {logEvents && logEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Log Group Name</th>
                      <th className="px-4 py-2 text-left">Creation Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logEvents.map((log, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2 font-mono break-all">{log.logGroupName || '-'}</td>
                        <td className="px-4 py-2 font-mono">{log.creationTime ? new Date(log.creationTime).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 italic">No log groups found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudWatchTrailPage; 
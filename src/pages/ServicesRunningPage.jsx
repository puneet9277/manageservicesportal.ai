import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ServicesRunningPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold mb-2">Services Running</h2>
        <div className="mb-4 text-gray-600">Account: <span className="font-mono">{account_id}</span> | Region: <span className="font-mono">{region}</span></div>
        <div className="space-y-6">
          <ServiceList title="EC2 Instances" items={services.EC2Instances} emptyMsg="No EC2 instances running." />
          <ServiceList title="Lambda Functions" items={services.LambdaFunctions} emptyMsg="No Lambda functions running." />
          <ServiceList title="RDS Instances" items={services.RDSInstances} emptyMsg="No RDS instances running." />
          <ServiceList title="S3 Buckets" items={services.S3Buckets} emptyMsg="No S3 buckets found." />
        </div>
      </div>
    </div>
  );
};

const ServiceList = ({ title, items, emptyMsg }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {items && items.length > 0 ? (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="font-mono text-gray-800">{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    ) : (
      <div className="text-gray-500 italic">{emptyMsg}</div>
    )}
  </div>
);

export default ServicesRunningPage; 
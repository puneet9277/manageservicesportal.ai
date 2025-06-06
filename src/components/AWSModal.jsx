import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AWSModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showRegionSelect, setShowRegionSelect] = useState(false);
  const [error, setError] = useState('');

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)' },
    { id: 'us-east-2', name: 'US East (Ohio)' },
    { id: 'us-west-1', name: 'US West (N. California)' },
    { id: 'us-west-2', name: 'US West (Oregon)' },
    { id: 'eu-west-1', name: 'EU (Ireland)' },
    { id: 'eu-central-1', name: 'EU (Frankfurt)' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
    { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' }
  ];

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleCustomerIdChange = (e) => {
    const value = e.target.value;
    setCustomerId(value);
    setError('');
    
    // Show region select only when customer ID is valid
    if (value.length === 12) {
      setShowRegionSelect(true);
    } else {
      setShowRegionSelect(false);
      setSelectedRegion('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (customerId.length === 12 && selectedRegion) {
      setIsLoading(true);
      setError('');
      
      try {
        console.log('Logging in:', { customerId, selectedRegion });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Animate out
        setShowContent(false);
        setTimeout(() => {
          onClose();
          navigate('/aws-learning');
        }, 300);
      } catch (error) {
        setError('Failed to log in. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Please enter a valid 12-digit Customer ID and select a region');
    }
  };

  return (
    <div className={`transition-all duration-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer ID Input */}
        <div className="relative group">
          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">
            Customer ID
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="customerId"
              value={customerId}
              onChange={handleCustomerIdChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-300 ease-in-out transform group-hover:scale-[1.01]"
              placeholder="Enter 12-digit Customer ID"
              maxLength={12}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {customerId.length === 12 && (
                <svg className="h-5 w-5 text-green-500 animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">Must be exactly 12 digits</p>
          {customerId && customerId.length !== 12 && (
            <p className="mt-1 text-xs text-red-500">
              Customer ID must be exactly 12 digits (currently: {customerId.length})
            </p>
          )}
        </div>

        {/* Region Selection - Only shown after valid customer ID */}
        <div className={`transition-all duration-500 transform ${showRegionSelect ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
          <div className="relative group">
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">
              Region
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-md transition-all duration-300 ease-in-out transform group-hover:scale-[1.01]"
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 animate-shake">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setShowContent(false);
              setTimeout(onClose, 300);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !customerId || !selectedRegion}
            className="relative px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Login</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AWSModal; 
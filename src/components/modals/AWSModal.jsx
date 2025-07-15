import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { invokeAwsService } from '../../utils/awsApi';

const AWSModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showRegionSelect, setShowRegionSelect] = useState(false);
  const [error, setError] = useState('');
  const [validationStatus, setValidationStatus] = useState({
    customerId: null,
    region: null
  });
  const [formStage, setFormStage] = useState(1);

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', flag: '🇺🇸' },
    { id: 'us-east-2', name: 'US East (Ohio)', flag: '🇺🇸' },
    { id: 'us-west-1', name: 'US West (N. California)', flag: '🇺🇸' },
    { id: 'us-west-2', name: 'US West (Oregon)', flag: '🇺🇸' },
    { id: 'eu-west-1', name: 'EU (Ireland)', flag: '🇮🇪' },
    { id: 'eu-central-1', name: 'EU (Frankfurt)', flag: '🇩🇪' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
    { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)', flag: '🇦🇺' }
  ];

  useEffect(() => {
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const validateCustomerId = (value) => {
    const isValid = value.length === 12;
    setValidationStatus(prev => ({
      ...prev,
      customerId: isValid ? 'valid' : value.length > 0 ? 'invalid' : null
    }));
    return isValid;
  };

  const handleCustomerIdChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
    setCustomerId(value);
    setError('');
    
    const isValid = validateCustomerId(value);
    if (isValid && formStage === 1) {
      setTimeout(() => {
        setFormStage(2);
        setShowRegionSelect(true);
      }, 300);
    } else if (!isValid && formStage === 2) {
      setFormStage(1);
      setShowRegionSelect(false);
      setSelectedRegion('');
    }
  };

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setValidationStatus(prev => ({
      ...prev,
      region: e.target.value ? 'valid' : null
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (customerId.length === 12 && selectedRegion) {
      setIsLoading(true);
      setError('');
      try {
        // Call the main Lambda API
        const response = await invokeAwsService({
          accountId: customerId,
          region: selectedRegion,
          service: null // No service at this stage
        });
        if (response && !response.error) {
          setShowContent(false);
          setTimeout(() => {
            onClose();
            navigate('/aws-learning');
          }, 300);
        } else {
          setError(response.error || 'Failed to log in. Please try again.');
          setIsLoading(false);
        }
      } catch (error) {
        setError('Failed to log in. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Please enter a valid 12-digit Customer ID and select a region');
    }
  };

  const getInputBorderColor = (status) => {
    switch (status) {
      case 'valid':
        return 'border-green-500 ring-green-200';
      case 'invalid':
        return 'border-red-500 ring-red-200';
      default:
        return 'border-gray-300 focus:ring-indigo-200';
    }
  };

  return (
    <div 
      className={`transition-all duration-500 transform ${
        showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Indicator */}
        <div className="relative mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${formStage >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              Customer ID
            </span>
            <span className={`text-sm font-medium ${formStage >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              Region
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ${
                formStage === 1 ? 'w-1/2' : formStage === 2 ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        </div>

        {/* Customer ID Input */}
        <div className="relative group">
          <label 
            htmlFor="customerId" 
            className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              validationStatus.customerId === 'valid' ? 'text-green-600' :
              validationStatus.customerId === 'invalid' ? 'text-red-600' :
              'text-gray-700 group-hover:text-indigo-600'
            }`}
          >
            Customer ID
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="customerId"
              value={customerId}
              onChange={handleCustomerIdChange}
              className={`appearance-none block w-full px-3 py-2 border ${
                getInputBorderColor(validationStatus.customerId)
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all duration-300 ease-in-out transform group-hover:scale-[1.01]`}
              placeholder="Enter 12-digit Customer ID"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {validationStatus.customerId === 'valid' && (
                <svg className="h-5 w-5 text-green-500 animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {validationStatus.customerId === 'invalid' && (
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <p className={`mt-1 text-xs ${
            validationStatus.customerId === 'valid' ? 'text-green-600' :
            validationStatus.customerId === 'invalid' ? 'text-red-600' :
            'text-gray-500'
          }`}>
            {validationStatus.customerId === 'valid' ? '✓ Valid Customer ID' :
             validationStatus.customerId === 'invalid' ? `${12 - customerId.length} more digits required` :
             'Must be exactly 12 digits'}
          </p>
        </div>

        {/* Region Selection */}
        <div className={`transition-all duration-500 transform ${
          showRegionSelect ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}>
          <div className="relative group">
            <label 
              htmlFor="region" 
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                validationStatus.region === 'valid' ? 'text-green-600' : 'text-gray-700 group-hover:text-indigo-600'
              }`}
            >
              Region
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={handleRegionChange}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                getInputBorderColor(validationStatus.region)
              } focus:outline-none focus:ring-2 sm:text-sm rounded-md transition-all duration-300 ease-in-out transform group-hover:scale-[1.01] ${
                selectedRegion ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              <option value="">Select a region</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.flag} {region.name}
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

        {/* Action Buttons */}
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
            className={`relative px-6 py-2 text-white rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${
              isLoading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            }`}
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
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { awsServices } from '../constants/awsServices';
import ServiceCard from '../components/cards/ServiceCard';

const AWSLearningDashboard = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const filteredServices = awsServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleServiceClick = () => {
    navigate('/aws-dashboard');
  };

  const handleBack = () => {
    setShowContent(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 animate-gradient-shift"></div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Top Bar with Logo and Navigation */}
        <div className="bg-white bg-opacity-90 shadow-sm backdrop-blur-sm w-full">
          <div className="w-full px-8">
            <div className="h-20 flex items-center justify-between relative">
              {/* Company Logo */}
              <div className="transform transition-transform duration-300 hover:scale-110">
                <img
                  src="/workmates-logo.svg"
                  alt="Cloud Workmates"
                  className="h-12 w-auto filter drop-shadow-lg"
                />
              </div>

              {/* Page Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent absolute left-1/2 transform -translate-x-1/2">
                AWS Learning Hub
              </h2>

              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow w-full px-2 sm:px-4 md:px-8 py-4 sm:py-8 md:py-12">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 relative group">
            <input
              type="text"
              placeholder="Search services, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white bg-opacity-90 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 transform group-hover:scale-[1.02]"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Services Grid */}
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className={`transform transition-all duration-500 ${
                    showContent
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ServiceCard service={service} onClick={handleServiceClick} showContent={showContent} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSLearningDashboard; 
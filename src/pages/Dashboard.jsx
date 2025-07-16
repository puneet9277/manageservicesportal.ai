import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/modals/Modal';
import AWSModal from '../components/modals/AWSModal';
import ProfileModal from '../components/modals/ProfileModal';
import Button from '../components/buttons/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [showAWSModal, setShowAWSModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    loginCount: 0,
    awsLoginCount: 0,
    totalActions: 0
  });
  const [showContent, setShowContent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mock user data - replace with actual data from your backend
  const userData = {
    username: "John Doe",
    email: "john.doe@cloudworkmates.com",
    lastLogin: new Date(),
    statistics: {
      loginCount: 75,
      awsLoginCount: 45,
      totalActions: 120
    },
    recentLogs: [
      {
        type: 'info',
        message: 'Successfully logged into AWS account',
        timestamp: new Date()
      },
      {
        type: 'warning',
        message: 'Multiple login attempts detected',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        type: 'error',
        message: 'Failed to fetch CloudWatch metrics',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        type: 'info',
        message: 'Updated alarm thresholds',
        timestamp: new Date(Date.now() - 14400000)
      }
    ],
    recentAwsAccounts: [
      {
        accountName: "Production Environment",
        accountId: "123456789012",
        region: "us-west-2",
        lastAccessed: new Date(Date.now() - 1800000)
      },
      {
        accountName: "Development Environment",
        accountId: "098765432109",
        region: "us-east-1",
        lastAccessed: new Date(Date.now() - 3600000)
      },
      {
        accountName: "Staging Environment",
        accountId: "456789012345",
        region: "eu-west-1",
        lastAccessed: new Date(Date.now() - 7200000)
      }
    ]
  };

  useEffect(() => {
    // Show content with delay for entrance animation
    setTimeout(() => setShowContent(true), 100);

    // Animate statistics
    setIsLoading(true);
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    const startAnimation = () => {
      let currentStep = 0;

      const timer = setInterval(() => {
        if (currentStep === steps) {
          clearInterval(timer);
          setAnimatedStats({
            loginCount: userData.statistics.loginCount,
            awsLoginCount: userData.statistics.awsLoginCount,
            totalActions: userData.statistics.totalActions
          });
          setIsLoading(false);
          return;
        }

        setAnimatedStats({
          loginCount: Math.round((userData.statistics.loginCount * currentStep) / steps),
          awsLoginCount: Math.round((userData.statistics.awsLoginCount * currentStep) / steps),
          totalActions: Math.round((userData.statistics.totalActions * currentStep) / steps)
        });

        currentStep++;
      }, interval);
    };

    setTimeout(startAnimation, 500);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    setShowProfileModal(true);
    setDropdownOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    setShowContent(false);
    setDropdownOpen(false);
    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  const getLogTypeColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-l-4 border-red-400';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      default:
        return 'bg-blue-50 border-l-4 border-blue-400';
    }
  };

  const StatCircle = ({ value, maxValue, title, color, isLoading }) => (
    <div className="relative group">
      <div className="flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
        <svg className={`transform -rotate-90 w-48 h-48 transition-all duration-500 ${isLoading ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
          <circle
            className="text-gray-200"
            strokeWidth="12"
            stroke="currentColor"
            fill="transparent"
            r="84"
            cx="96"
            cy="96"
          />
          <circle
            className={`${color} transition-all duration-700 ease-out`}
            strokeWidth="12"
            strokeDasharray={527.79}
            strokeDashoffset={isLoading ? 527.79 : (527.79 - (527.79 * value) / maxValue)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="84"
            cx="96"
            cy="96"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-base font-medium text-gray-500 mb-2">{title}</span>
          <span className={`text-3xl font-bold transition-all duration-300 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>{value}</span>
        </div>
      </div>
      {/* Hover tooltip */}
      <div className="opacity-0 group-hover:opacity-100 absolute bg-gray-900 text-white px-4 py-2 rounded-lg -bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-300 text-sm whitespace-nowrap">
        {title}: {value} {title === 'Total Actions' ? 'performed' : 'recorded'}
      </div>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 animate-gradient-shift"></div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userData={userData}
        />

        {/* Header - Responsive Flex Layout */}
        <div className="bg-white bg-opacity-90 shadow-sm backdrop-blur-sm w-full relative z-[100]">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 relative">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/workmates-logo.svg"
                alt="Cloud Workmates"
                className="h-10 w-auto filter drop-shadow-lg"
              />
            </div>
            {/* Welcome Message */}
            <h2 className="flex-1 text-center text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mx-2 truncate">
              Customer Dashboard
            </h2>
            {/* Dropdown */}
            <div className="flex-shrink-0 ml-2 relative" ref={dropdownRef}>
              <Button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full z-[9999] bg-white border border-gray-200 rounded-md shadow-lg animate-fadeIn min-w-[12rem] w-72 max-w-sm">
                  <button
                    onClick={handleProfile}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-grow w-full px-2 sm:px-4 md:px-8 py-2 sm:py-4 md:py-6 relative z-10">
          <div className="max-w-[1600px] mx-auto">
            {/* Usage Statistics */}
            <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-10 mb-6 transform transition-all duration-300 hover:shadow-xl">
              <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Usage Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
                <StatCircle
                  value={animatedStats.loginCount}
                  maxValue={100}
                  title="Total Logins"
                  color="text-blue-500 hover:text-blue-600"
                  isLoading={isLoading}
                />
                <StatCircle
                  value={animatedStats.awsLoginCount}
                  maxValue={100}
                  title="AWS Logins"
                  color="text-green-500 hover:text-green-600"
                  isLoading={isLoading}
                />
                <StatCircle
                  value={animatedStats.totalActions}
                  maxValue={200}
                  title="Total Actions"
                  color="text-purple-500 hover:text-purple-600"
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* System Activity Log */}
              <div className="col-span-1">
                <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      System Activity Log
                    </h3>
                    <Button
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center group"
                      onClick={() => setShowAllLogs(!showAllLogs)}
                    >
                      View All
                      <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {userData.recentLogs.slice(0, 3).map((log, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg transform transition-all duration-300 hover:scale-[1.02] ${getLogTypeColor(log.type)}`}
                      >
                        <p className="font-medium">{log.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transform transition-all duration-200 hover:translate-x-1">
                      Show 1 more log
                    </button>
                  </div>
                </div>
              </div>

              {/* Recently Accessed AWS Accounts */}
              <div className="col-span-1">
                <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Recently Accessed AWS Accounts
                    </h3>
                    <Button
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center group"
                      onClick={() => setShowAllAccounts(!showAllAccounts)}
                    >
                      View All
                      <svg className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {userData.recentAwsAccounts.slice(0, 2).map((account, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-indigo-200"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{account.accountName}</h4>
                            <p className="text-sm text-gray-600 mt-1">Account ID: {account.accountId}</p>
                            <p className="text-sm text-gray-600">Region: {account.region}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Last accessed</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatDate(account.lastAccessed)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transform transition-all duration-200 hover:translate-x-1">
                      Show 1 more account
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Quick Actions */}
              <div className="col-span-1">
                {/* AWS Service Card */}
                <div className="bg-white bg-opacity-90 rounded-lg shadow-lg border border-gray-200 p-6 mb-6 transform transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    AWS Customer Management
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Manage your AWS customer accounts</p>
                  <Button
                    onClick={() => setShowAWSModal(true)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    Manage Customer
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login to Customer Account
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch Customer Region
                    </button>
                    <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-300 transform hover:scale-[1.02] flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Login History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AWS Modal */}
      <Modal 
        isOpen={showAWSModal}
        onClose={() => setShowAWSModal(false)} 
        title="AWS Customer Login"
      >
        <AWSModal onClose={() => setShowAWSModal(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard; 
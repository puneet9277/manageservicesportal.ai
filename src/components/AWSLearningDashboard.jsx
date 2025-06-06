import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AWSLearningDashboard = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 'ec2',
      name: 'Amazon EC2',
      description: 'Virtual Servers in the Cloud',
      icon: '🖥️',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'from-orange-600 to-red-600',
      topics: [
        'Instance Types & Families',
        'Auto Scaling Groups',
        'Load Balancing',
        'Security Groups & Network ACLs',
        'Storage Options (EBS)',
        'Instance Lifecycle'
      ]
    },
    {
      id: 's3',
      name: 'Amazon S3',
      description: 'Scalable Storage in the Cloud',
      icon: '📦',
      color: 'from-green-500 to-teal-500',
      hoverColor: 'from-green-600 to-teal-600',
      topics: [
        'Bucket Management',
        'Object Lifecycle',
        'Storage Classes',
        'Access Control & Policies',
        'Versioning',
        'Data Encryption'
      ]
    },
    {
      id: 'rds',
      name: 'Amazon RDS',
      description: 'Managed Relational Database Service',
      icon: '🗄️',
      color: 'from-blue-500 to-indigo-500',
      hoverColor: 'from-blue-600 to-indigo-600',
      topics: [
        'Database Engines',
        'Instance Management',
        'Backup & Recovery',
        'Multi-AZ Deployment',
        'Read Replicas',
        'Performance Insights'
      ]
    },
    {
      id: 'lambda',
      name: 'AWS Lambda',
      description: 'Serverless Computing',
      icon: 'λ',
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'from-yellow-600 to-orange-600',
      topics: [
        'Function Development',
        'Event Sources',
        'Execution Environment',
        'Monitoring & Logging',
        'Security & Permissions',
        'Best Practices'
      ]
    },
    {
      id: 'cloudwatch',
      name: 'Amazon CloudWatch',
      description: 'Monitoring & Observability',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'from-purple-600 to-pink-600',
      topics: [
        'Metrics & Dimensions',
        'Alarms Configuration',
        'Logs Insights',
        'Dashboards',
        'Events & EventBridge',
        'Container Insights'
      ]
    },
    {
      id: 'iam',
      name: 'AWS IAM',
      description: 'Identity & Access Management',
      icon: '🔐',
      color: 'from-red-500 to-pink-500',
      hoverColor: 'from-red-600 to-pink-600',
      topics: [
        'Users & Groups',
        'Roles & Policies',
        'Permission Management',
        'Security Best Practices',
        'Access Keys',
        'Identity Federation'
      ]
    }
  ];

  useEffect(() => {
    // Animate content on mount
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleServiceClick = (service) => {
    setSelectedService(service);
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
        <div className="flex-grow w-full px-8 py-12">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <button
                    onClick={() => handleServiceClick(service)}
                    className={`w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">{service.icon}</span>
                        <svg className="w-6 h-6 text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                        {service.description}
                      </p>
                      <div className="space-y-2">
                        {service.topics.slice(0, 3).map((topic, i) => (
                          <div
                            key={i}
                            className="flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300"
                          >
                            <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {topic}
                          </div>
                        ))}
                        {service.topics.length > 3 && (
                          <p className="text-sm text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300">
                            +{service.topics.length - 3} more topics
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-scaleIn">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <span className="text-4xl mr-4">{selectedService.icon}</span>
                    {selectedService.name}
                  </h3>
                  <p className="text-gray-600 mt-2">{selectedService.description}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Topics */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Learning Topics</h4>
                  <div className="space-y-4">
                    {selectedService.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 bg-gray-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                        style={{ transitionDelay: `${index * 50}ms` }}
                      >
                        <svg className="w-5 h-5 mr-3 text-indigo-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Learning Resources</h4>
                  <div className="space-y-4">
                    <a
                      href="#"
                      className="block p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className="flex items-center text-indigo-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Documentation
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Official AWS documentation and user guides
                      </p>
                    </a>
                    <a
                      href="#"
                      className="block p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Video Tutorials
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Step-by-step video guides and walkthroughs
                      </p>
                    </a>
                    <a
                      href="#"
                      className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className="flex items-center text-orange-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Hands-on Labs
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Interactive practice environments and exercises
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AWSLearningDashboard; 
import React from 'react';

const ServiceCard = ({ service, onClick, showContent, index }) => (
  <div
    className={`transform transition-all duration-500 ${
      showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <button
      onClick={() => onClick(service)}
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
);

export default ServiceCard; 
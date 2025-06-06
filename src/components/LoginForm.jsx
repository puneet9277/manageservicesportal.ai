import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Animate welcome message
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullEmail = `${formData.email}@cloudworkmates.com`;
    if (!formData.email) {
      setError('Please enter your username');
      return;
    }
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/dashboard');
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute right-20 top-20 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute left-20 bottom-20 w-44 h-44 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-md w-full space-y-8 relative">
          <div className={`transition-all duration-700 transform ${showWelcome ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your cloud infrastructure monitoring dashboard
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">
                  Username
                </label>
                <div className="flex rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300 ease-in-out transform group-hover:scale-[1.01]"
                    placeholder="Enter your username"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <span className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200">
                    @cloudworkmates.com
                  </span>
                </div>
              </div>

              <div className="relative mt-4 group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 transition-colors group-hover:text-indigo-600">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:z-10 sm:text-sm transition-all duration-300 ease-in-out transform group-hover:scale-[1.01]"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center group">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-transform duration-200 ease-in-out transform group-hover:scale-110"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer group-hover:text-indigo-600 transition-colors">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-all duration-200 hover:underline transform hover:scale-105 inline-block"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-white group-hover:animate-bounce" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Logo and Design */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
        <div className="relative z-10 flex flex-col items-center max-w-3xl px-8 w-full">
          <img
            src="/workmates-logo.svg"
            alt="Workmates"
            className="w-full max-w-2xl mb-16 transform hover:scale-105 transition-transform duration-300 filter drop-shadow-xl"
          />
          <div className="space-y-6 text-center mt-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Cloud Infrastructure Monitoring
            </h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Streamlined alarm management and monitoring for AWS infrastructure
              </p>
              <div className="grid grid-cols-1 gap-3 text-left text-gray-600">
                <span className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Real-time AWS Instance Monitoring
                </span>
                <span className="flex items-center transform hover:translate-x-2 transition-transform duration-200">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  CloudWatch Alarm Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 
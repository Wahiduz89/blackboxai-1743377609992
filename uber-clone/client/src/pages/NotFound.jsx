import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="text-6xl font-bold text-uber-blue mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center"
          >
            <i className="fas fa-home mr-2"></i>
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center"
          >
            <i className="fas fa-tachometer-alt mr-2"></i>
            Go to Dashboard
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="mt-12 text-gray-400">
        <div className="flex items-center space-x-8">
          <i className="fas fa-car text-6xl transform -rotate-45"></i>
          <i className="fas fa-map-marker-alt text-6xl animate-bounce"></i>
          <i className="fas fa-road text-6xl"></i>
        </div>
      </div>

      {/* Help section */}
      <div className="mt-12 text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Need Help?
        </h2>
        <p className="text-gray-600">
          Contact our support team or check our help center.
        </p>
        <div className="mt-4 space-x-4">
          <a
            href="#"
            className="text-uber-blue hover:text-blue-700 font-medium inline-flex items-center"
          >
            <i className="fas fa-headset mr-2"></i>
            Contact Support
          </a>
          <a
            href="#"
            className="text-uber-blue hover:text-blue-700 font-medium inline-flex items-center"
          >
            <i className="fas fa-question-circle mr-2"></i>
            Help Center
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
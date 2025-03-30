import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'rider', // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Multi-step form

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });

      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-6">
          <span className="text-3xl font-bold text-uber-black">UBER</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-uber-blue hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-uber sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 1 ? 'bg-uber-blue text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Basic Info</span>
              </div>
              <div className="flex-1 mx-4 border-t border-gray-300"></div>
              <div className="flex items-center">
                <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  step >= 2 ? 'bg-uber-blue text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">Security</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="form-label">
                    I want to
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'rider' }))}
                      className={`py-3 px-4 text-sm font-medium rounded-md ${
                        formData.role === 'rider'
                          ? 'bg-uber-blue text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <i className="fas fa-user mr-2"></i>
                      Book Rides
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: 'driver' }))}
                      className={`py-3 px-4 text-sm font-medium rounded-md ${
                        formData.role === 'driver'
                          ? 'bg-uber-blue text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <i className="fas fa-car mr-2"></i>
                      Drive
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary relative"
                  >
                    {loading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="loading-spinner"></div>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn-secondary flex justify-center items-center"
              >
                <i className="fab fa-google mr-2"></i>
                Google
              </button>
              <button
                type="button"
                className="btn-secondary flex justify-center items-center"
              >
                <i className="fab fa-facebook mr-2"></i>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-6 text-xs text-center text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-uber-blue hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-uber-blue hover:text-blue-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
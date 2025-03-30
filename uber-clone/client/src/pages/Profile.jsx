import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || '',
    phoneNumber: user.phoneNumber || '',
    profileImage: user.profileImage || '',
    vehicleDetails: user.vehicleDetails || {
      type: '',
      model: '',
      number: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vehicle.')) {
      const vehicleField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicleDetails: {
          ...prev.vehicleDetails,
          [vehicleField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-uber overflow-hidden">
            {/* Profile Header */}
            <div className="p-6 sm:p-8 bg-uber-blue text-white">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={user.profileImage || 'https://via.placeholder.com/100'}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white text-uber-blue rounded-full p-2 shadow-lg">
                      <i className="fas fa-camera"></i>
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-blue-100">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </p>
                  {user.role === 'driver' && (
                    <div className="mt-2 flex items-center">
                      <i className="fas fa-star text-yellow-400 mr-1"></i>
                      <span>{user.rating?.toFixed(1) || '5.0'}</span>
                      <span className="mx-2">•</span>
                      <span>{user.totalRides || 0} rides</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-end">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn-secondary"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="loading-spinner mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="input-field"
                    disabled
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="form-label">Account Type</label>
                  <input
                    type="text"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    className="input-field"
                    disabled
                  />
                </div>
              </div>

              {/* Driver-specific Information */}
              {user.role === 'driver' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label">Vehicle Type</label>
                      <select
                        name="vehicle.type"
                        value={formData.vehicleDetails.type}
                        onChange={handleChange}
                        className="input-field"
                        disabled={!isEditing}
                      >
                        <option value="">Select type</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Vehicle Model</label>
                      <input
                        type="text"
                        name="vehicle.model"
                        value={formData.vehicleDetails.model}
                        onChange={handleChange}
                        className="input-field"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="form-label">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicle.number"
                        value={formData.vehicleDetails.number}
                        onChange={handleChange}
                        className="input-field"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section for Drivers */}
              {user.role === 'driver' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Driver's License</label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          {user.documents?.license ? (
                            <img
                              src={user.documents.license}
                              alt="License"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <i className="fas fa-id-card"></i>
                            </div>
                          )}
                        </span>
                        {isEditing && (
                          <button
                            type="button"
                            className="ml-4 btn-secondary"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Insurance</label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-lg overflow-hidden bg-gray-100">
                          {user.documents?.insurance ? (
                            <img
                              src={user.documents.insurance}
                              alt="Insurance"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <i className="fas fa-file-alt"></i>
                            </div>
                          )}
                        </span>
                        {isEditing && (
                          <button
                            type="button"
                            className="ml-4 btn-secondary"
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-t">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">
                        Receive email updates about your rides
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" defaultChecked />
                        <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">
                        Receive text messages about your rides
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" defaultChecked />
                        <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                        <div className="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                      </div>
                    </label>
                  </div>

                  {user.role === 'driver' && (
                    <div className="flex items-center justify-between py-3 border-t">
                      <div>
                        <h4 className="font-medium">Available for Rides</h4>
                        <p className="text-sm text-gray-600">
                          Toggle your availability to accept new rides
                        </p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={user.isAvailable}
                            onChange={() => {}}
                          />
                          <div className={`w-10 h-6 rounded-full shadow-inner ${
                            user.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                          }`}></div>
                          <div className={`dot absolute w-4 h-4 bg-white rounded-full shadow transition transform ${
                            user.isAvailable ? 'translate-x-4' : '-translate-x-1'
                          } -top-1`}></div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="p-6 sm:p-8 bg-red-50 mt-6">
              <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <button className="text-red-600 hover:text-red-700 font-medium">
                  Deactivate Account
                </button>
                <p className="text-sm text-red-600">
                  Once you deactivate your account, it cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
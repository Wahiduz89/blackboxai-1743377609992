import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ridesResponse, statsResponse] = await Promise.all([
          axios.get('/rides/history?limit=5'),
          user.role === 'driver' ? axios.get('/users/stats') : null
        ]);

        setRides(ridesResponse.data.data.rides);
        if (statsResponse) {
          setStats(statsResponse.data.data);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.role]);

  const RiderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover bg-uber-blue text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Book a Ride</h3>
              <p className="text-blue-100">Get picked up within minutes</p>
            </div>
            <i className="fas fa-taxi text-4xl text-blue-200"></i>
          </div>
          <button className="mt-4 w-full bg-white text-uber-blue py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
            Request Now
          </button>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Schedule</h3>
              <p className="text-gray-600">Plan your future rides</p>
            </div>
            <i className="fas fa-calendar text-4xl text-gray-400"></i>
          </div>
          <button className="mt-4 w-full btn-secondary">
            Schedule a Ride
          </button>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Saved Places</h3>
              <p className="text-gray-600">Quick access to your locations</p>
            </div>
            <i className="fas fa-map-marker-alt text-4xl text-gray-400"></i>
          </div>
          <button className="mt-4 w-full btn-secondary">
            Manage Places
          </button>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Rides</h2>
        {rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl text-gray-400">
                    <i className="fas fa-car"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">{ride.destination.address}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${ride.fare.amount}</p>
                  <p className="text-sm text-gray-600">{ride.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No recent rides</p>
        )}
      </div>
    </div>
  );

  const DriverDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-green-50">
          <h3 className="text-sm font-medium text-green-600">Today's Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-green-900">
            ${stats?.todayEarnings || '0.00'}
          </p>
          <p className="mt-1 text-sm text-green-600">
            From {stats?.todayRides || 0} rides
          </p>
        </div>

        <div className="card bg-blue-50">
          <h3 className="text-sm font-medium text-blue-600">Total Rides</h3>
          <p className="mt-2 text-3xl font-bold text-blue-900">
            {stats?.totalRides || 0}
          </p>
          <p className="mt-1 text-sm text-blue-600">
            Lifetime rides
          </p>
        </div>

        <div className="card bg-purple-50">
          <h3 className="text-sm font-medium text-purple-600">Rating</h3>
          <p className="mt-2 text-3xl font-bold text-purple-900">
            {user.rating?.toFixed(1) || '5.0'}
          </p>
          <p className="mt-1 text-sm text-purple-600">
            Based on {stats?.totalRatings || 0} ratings
          </p>
        </div>

        <div className="card bg-orange-50">
          <h3 className="text-sm font-medium text-orange-600">Hours Online</h3>
          <p className="mt-2 text-3xl font-bold text-orange-900">
            {stats?.hoursOnline || '0'}h
          </p>
          <p className="mt-1 text-sm text-orange-600">
            Today's activity
          </p>
        </div>
      </div>

      {/* Driver Status */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Driver Status</h2>
            <p className="text-gray-600">
              {user.isAvailable ? 'You are online and accepting rides' : 'You are offline'}
            </p>
          </div>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={user.isAvailable} />
              <div className={`w-14 h-7 rounded-full transition-colors ${
                user.isAvailable ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform ${
                user.isAvailable ? 'translate-x-7' : ''
              }`}></div>
            </div>
          </label>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Rides</h2>
        {rides.length > 0 ? (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl text-gray-400">
                    <i className="fas fa-route"></i>
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {ride.pickup.address} → {ride.destination.address}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${ride.fare.amount}</p>
                  <p className="text-sm text-gray-600">{ride.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No recent rides</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uber-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="text-gray-600">
            {user.role === 'rider' 
              ? 'Book a ride or view your ride history'
              : 'Manage your rides and track your earnings'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Active Ride Alert */}
        {activeRide && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-car-side text-yellow-400 text-2xl"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Active Ride
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Status: {activeRide.status}</p>
                  <p>Destination: {activeRide.destination.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render dashboard based on user role */}
        {user.role === 'rider' ? <RiderDashboard /> : <DriverDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
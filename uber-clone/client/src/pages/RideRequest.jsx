import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';

const libraries = ['places'];

const RideRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [rideData, setRideData] = useState({
    pickup: {
      address: '',
      location: { coordinates: [] }
    },
    destination: {
      address: '',
      location: { coordinates: [] }
    },
    rideType: 'economy',
    paymentMethod: 'card',
    fare: null,
    distance: null,
    duration: null
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const center = { lat: 37.7749, lng: -122.4194 }; // San Francisco as default

  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (rideData.pickup.location.coordinates.length && rideData.destination.location.coordinates.length) {
      calculateRoute();
    }
  }, [rideData.pickup, rideData.destination]);

  const calculateRoute = async () => {
    if (!rideData.pickup.location.coordinates.length || !rideData.destination.location.coordinates.length) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: new window.google.maps.LatLng(
          rideData.pickup.location.coordinates[1],
          rideData.pickup.location.coordinates[0]
        ),
        destination: new window.google.maps.LatLng(
          rideData.destination.location.coordinates[1],
          rideData.destination.location.coordinates[0]
        ),
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      setRideData(prev => ({
        ...prev,
        distance: {
          text: result.routes[0].legs[0].distance.text,
          value: result.routes[0].legs[0].distance.value
        },
        duration: {
          text: result.routes[0].legs[0].duration.text,
          value: result.routes[0].legs[0].duration.value
        }
      }));

      // Calculate fare
      const baseFare = {
        economy: 2.0,
        premium: 3.0,
        luxury: 4.0
      };

      const distanceInKm = result.routes[0].legs[0].distance.value / 1000;
      const fare = (distanceInKm * baseFare[rideData.rideType]).toFixed(2);
      
      setRideData(prev => ({
        ...prev,
        fare: {
          amount: parseFloat(fare),
          currency: 'USD',
          surgeMultiplier: 1.0
        }
      }));
    } catch (err) {
      setError('Failed to calculate route');
    }
  };

  const handleLocationSelect = async (type, address) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ address });
      
      if (result.results[0]) {
        const { lat, lng } = result.results[0].geometry.location;
        setRideData(prev => ({
          ...prev,
          [type]: {
            address,
            location: {
              coordinates: [lng(), lat()]
            }
          }
        }));
      }
    } catch (err) {
      setError('Failed to get location coordinates');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/rides/request', rideData);
      navigate('/dashboard', { 
        state: { message: 'Ride requested successfully!' }
      });
    } catch (err) {
      setError('Failed to request ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uber-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">Request a Ride</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Step 1: Location Selection */}
            <div className={`card ${step === 1 ? '' : 'opacity-50'}`}>
              <h2 className="text-lg font-semibold mb-4">1. Select Locations</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Pickup Location</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter pickup address"
                    value={rideData.pickup.address}
                    onChange={(e) => handleLocationSelect('pickup', e.target.value)}
                    disabled={step !== 1}
                  />
                </div>
                <div>
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter destination address"
                    value={rideData.destination.address}
                    onChange={(e) => handleLocationSelect('destination', e.target.value)}
                    disabled={step !== 1}
                  />
                </div>
                {step === 1 && (
                  <button
                    className="btn-primary w-full"
                    onClick={() => setStep(2)}
                    disabled={!rideData.pickup.address || !rideData.destination.address}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>

            {/* Step 2: Ride Type Selection */}
            <div className={`card ${step === 2 ? '' : 'opacity-50'}`}>
              <h2 className="text-lg font-semibold mb-4">2. Choose Ride Type</h2>
              <div className="grid grid-cols-3 gap-4">
                {['economy', 'premium', 'luxury'].map((type) => (
                  <button
                    key={type}
                    className={`p-4 rounded-lg border-2 ${
                      rideData.rideType === type
                        ? 'border-uber-blue bg-blue-50'
                        : 'border-gray-200'
                    } ${step !== 2 ? 'cursor-not-allowed' : ''}`}
                    onClick={() => setRideData(prev => ({ ...prev, rideType: type }))}
                    disabled={step !== 2}
                  >
                    <div className="text-center">
                      <i className={`fas fa-car text-2xl ${
                        rideData.rideType === type ? 'text-uber-blue' : 'text-gray-400'
                      }`}></i>
                      <p className="mt-2 capitalize">{type}</p>
                    </div>
                  </button>
                ))}
              </div>
              {step === 2 && (
                <button
                  className="btn-primary w-full mt-4"
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              )}
            </div>

            {/* Step 3: Payment and Confirmation */}
            <div className={`card ${step === 3 ? '' : 'opacity-50'}`}>
              <h2 className="text-lg font-semibold mb-4">3. Confirm and Pay</h2>
              {rideData.fare && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span>Distance</span>
                      <span>{rideData.distance?.text}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Duration</span>
                      <span>{rideData.duration?.text}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Fare</span>
                      <span>${rideData.fare.amount}</span>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Payment Method</label>
                    <select
                      className="input-field"
                      value={rideData.paymentMethod}
                      onChange={(e) => setRideData(prev => ({
                        ...prev,
                        paymentMethod: e.target.value
                      }))}
                      disabled={step !== 3}
                    >
                      <option value="card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>

                  {step === 3 && (
                    <button
                      className="btn-primary w-full"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="loading-spinner mr-2"></div>
                          Requesting Ride...
                        </div>
                      ) : (
                        'Confirm Request'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="h-[600px] rounded-lg overflow-hidden shadow-uber">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={13}
              onLoad={onMapLoad}
            >
              {rideData.pickup.location.coordinates.length && (
                <Marker
                  position={{
                    lat: rideData.pickup.location.coordinates[1],
                    lng: rideData.pickup.location.coordinates[0]
                  }}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                  }}
                />
              )}
              
              {rideData.destination.location.coordinates.length && (
                <Marker
                  position={{
                    lat: rideData.destination.location.coordinates[1],
                    lng: rideData.destination.location.coordinates[0]
                  }}
                  icon={{
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  }}
                />
              )}

              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequest;

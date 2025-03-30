import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'fa-location-dot',
      title: 'Easy Booking',
      description: 'Book a ride with just a few taps and get picked up by a nearby driver'
    },
    {
      icon: 'fa-clock',
      title: 'Real-time Tracking',
      description: 'Know exactly when your driver will arrive with live GPS tracking'
    },
    {
      icon: 'fa-shield',
      title: 'Safe Rides',
      description: 'All drivers are thoroughly vetted and rides are monitored for your safety'
    },
    {
      icon: 'fa-credit-card',
      title: 'Cashless Payment',
      description: 'Pay seamlessly through the app with multiple payment options'
    }
  ];

  const rideTypes = [
    {
      name: 'Economy',
      icon: 'fa-car',
      description: 'Affordable rides for everyday use',
      price: 'From $10'
    },
    {
      name: 'Premium',
      icon: 'fa-car-side',
      description: 'Luxury vehicles for special occasions',
      price: 'From $25'
    },
    {
      name: 'XL',
      icon: 'fa-van-shuttle',
      description: 'Spacious rides for groups',
      price: 'From $35'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-uber-black text-white">
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="container-custom relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in">
              Your Ride, Your Way
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              Book a ride in minutes and travel with comfort and style. Available 24/7 for your convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              {isAuthenticated ? (
                <Link to="/request-ride" className="btn-primary text-lg">
                  Request a Ride
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg">
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg">
                    Learn More
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-uber-blue text-white mb-4">
                  <i className={`fas ${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ride Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Ride
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rideTypes.map((type, index) => (
              <div 
                key={type.name}
                className="card card-hover p-8 text-center"
              >
                <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-uber-blue/10 text-uber-blue mb-6">
                  <i className={`fas ${type.icon} text-3xl`}></i>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{type.name}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <p className="text-uber-blue font-semibold">{type.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-uber-blue text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join millions of riders and drivers who trust us for their daily commute.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#" className="btn bg-white text-uber-blue hover:bg-gray-100">
              <i className="fab fa-apple text-xl mr-2"></i>
              Download on iOS
            </a>
            <a href="#" className="btn bg-white text-uber-blue hover:bg-gray-100">
              <i className="fab fa-google-play text-xl mr-2"></i>
              Download on Android
            </a>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Safety is Our Priority
              </h2>
              <p className="text-gray-600 mb-8">
                We've implemented comprehensive safety measures to ensure every ride is secure and comfortable. From driver verification to real-time trip monitoring, we've got you covered.
              </p>
              <ul className="space-y-4">
                {[
                  'Driver background checks',
                  '24/7 customer support',
                  'Real-time trip sharing',
                  'Emergency assistance button'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <i className="fas fa-check-circle text-uber-green mr-3"></i>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Safety First"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-uber-blue text-white p-6 rounded-lg shadow-xl">
                <div className="text-4xl font-bold mb-2">100K+</div>
                <div className="text-sm">Verified Drivers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
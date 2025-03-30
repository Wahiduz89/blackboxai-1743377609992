const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickup: {
    address: {
      type: String,
      required: [true, 'Please provide pickup address']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: [true, 'Please provide pickup coordinates']
      }
    }
  },
  destination: {
    address: {
      type: String,
      required: [true, 'Please provide destination address']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: [true, 'Please provide destination coordinates']
      }
    }
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arrived', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  rideType: {
    type: String,
    enum: ['economy', 'premium', 'luxury'],
    required: true
  },
  fare: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    surgeMultiplier: {
      type: Number,
      default: 1.0
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: String
  },
  distance: {
    value: Number,  // in meters
    text: String    // formatted string (e.g., "5.2 km")
  },
  duration: {
    value: Number,  // in seconds
    text: String    // formatted string (e.g., "15 mins")
  },
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: {
      type: [[Number]],  // Array of coordinates representing the route
      default: []
    }
  },
  rating: {
    rider: {
      value: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    },
    driver: {
      value: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String
    }
  },
  cancelReason: {
    by: {
      type: String,
      enum: ['rider', 'driver', 'system']
    },
    reason: String
  },
  timestamps: {
    requested: Date,
    accepted: Date,
    arrived: Date,
    started: Date,
    completed: Date,
    cancelled: Date
  }
}, {
  timestamps: true
});

// Create indexes for location-based queries
rideSchema.index({ 'pickup.location': '2dsphere' });
rideSchema.index({ 'destination.location': '2dsphere' });

// Create indexes for common queries
rideSchema.index({ rider: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ status: 1, 'timestamps.requested': -1 });

// Pre-save middleware to set timestamp based on status
rideSchema.pre('save', function(next) {
  const now = new Date();
  if (this.isModified('status')) {
    this.timestamps[this.status] = now;
  }
  if (this.isNew) {
    this.timestamps.requested = now;
  }
  next();
});

// Method to calculate fare
rideSchema.methods.calculateFare = function() {
  const baseRate = 2.0;  // Base rate per kilometer
  const minimumFare = 5.0;
  const distanceInKm = this.distance.value / 1000;
  
  let calculatedFare = (baseRate * distanceInKm * this.fare.surgeMultiplier);
  calculatedFare = Math.max(calculatedFare, minimumFare);
  
  return parseFloat(calculatedFare.toFixed(2));
};

// Virtual for ride duration in minutes
rideSchema.virtual('durationInMinutes').get(function() {
  return Math.round(this.duration.value / 60);
});

module.exports = mongoose.model('Ride', rideSchema);
const Ride = require('../models/Ride');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');

// @desc    Request a new ride
// @route   POST /api/rides/request
// @access  Private (Riders only)
const requestRide = asyncHandler(async (req, res) => {
  const {
    pickup,
    destination,
    rideType,
    paymentMethod,
    distance,
    duration
  } = req.body;

  // Calculate initial fare
  const baseFare = {
    economy: 2.0,
    premium: 3.0,
    luxury: 4.0
  };

  const fare = {
    amount: (distance.value / 1000) * baseFare[rideType],
    currency: 'USD',
    surgeMultiplier: 1.0 // This could be calculated based on demand
  };

  const ride = await Ride.create({
    rider: req.user.id,
    pickup,
    destination,
    rideType,
    payment: {
      method: paymentMethod
    },
    distance,
    duration,
    fare
  });

  // Find nearby drivers
  const nearbyDrivers = await User.find({
    role: 'driver',
    isAvailable: true,
    'currentLocation': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickup.location.coordinates
        },
        $maxDistance: 5000 // 5km radius
      }
    }
  }).limit(5);

  logger.info(`New ride requested by user: ${req.user.id}`);
  res.status(201).json({
    success: true,
    data: {
      ride,
      availableDrivers: nearbyDrivers.length
    }
  });
});

// @desc    Accept a ride (for drivers)
// @route   PUT /api/rides/:id/accept
// @access  Private (Drivers only)
const acceptRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    res.status(404);
    throw new Error('Ride not found');
  }

  if (ride.status !== 'requested') {
    res.status(400);
    throw new Error('Ride is no longer available');
  }

  ride.driver = req.user.id;
  ride.status = 'accepted';
  await ride.save();

  // Update driver availability
  await User.findByIdAndUpdate(req.user.id, { isAvailable: false });

  logger.info(`Ride ${ride._id} accepted by driver: ${req.user.id}`);
  res.json({
    success: true,
    data: ride
  });
});

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private
const updateRideStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    res.status(404);
    throw new Error('Ride not found');
  }

  // Validate status transition
  const validTransitions = {
    accepted: ['arrived'],
    arrived: ['started'],
    started: ['completed'],
    requested: ['cancelled'],
    accepted: ['cancelled'],
    arrived: ['cancelled']
  };

  if (!validTransitions[ride.status].includes(status)) {
    res.status(400);
    throw new Error('Invalid status transition');
  }

  ride.status = status;

  // Handle ride completion
  if (status === 'completed') {
    // Update driver availability
    await User.findByIdAndUpdate(ride.driver, { isAvailable: true });
    
    // Update ride counts
    await User.findByIdAndUpdate(ride.rider, { $inc: { totalRides: 1 } });
    await User.findByIdAndUpdate(ride.driver, { $inc: { totalRides: 1 } });
  }

  await ride.save();

  logger.info(`Ride ${ride._id} status updated to: ${status}`);
  res.json({
    success: true,
    data: ride
  });
});

// @desc    Get user's ride history
// @route   GET /api/rides/history
// @access  Private
const getRideHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  let query = {};
  
  if (req.user.role === 'rider') {
    query.rider = req.user.id;
  } else if (req.user.role === 'driver') {
    query.driver = req.user.id;
  }

  const rides = await Ride.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('rider', 'name profileImage')
    .populate('driver', 'name profileImage vehicleDetails');

  const total = await Ride.countDocuments(query);

  res.json({
    success: true,
    data: {
      rides,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

// @desc    Rate a completed ride
// @route   POST /api/rides/:id/rate
// @access  Private
const rateRide = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    res.status(404);
    throw new Error('Ride not found');
  }

  if (ride.status !== 'completed') {
    res.status(400);
    throw new Error('Can only rate completed rides');
  }

  const ratingObj = {
    value: rating,
    comment
  };

  if (req.user.role === 'rider') {
    ride.rating.driver = ratingObj;
    // Update driver's average rating
    const driverRides = await Ride.find({
      driver: ride.driver,
      'rating.driver.value': { $exists: true }
    });
    
    const avgRating = driverRides.reduce((acc, curr) => 
      acc + curr.rating.driver.value, 0) / driverRides.length;
    
    await User.findByIdAndUpdate(ride.driver, { rating: avgRating });
  } else {
    ride.rating.rider = ratingObj;
    // Update rider's average rating
    const riderRides = await Ride.find({
      rider: ride.rider,
      'rating.rider.value': { $exists: true }
    });
    
    const avgRating = riderRides.reduce((acc, curr) => 
      acc + curr.rating.rider.value, 0) / riderRides.length;
    
    await User.findByIdAndUpdate(ride.rider, { rating: avgRating });
  }

  await ride.save();

  logger.info(`Ride ${ride._id} rated by ${req.user.role}: ${rating}`);
  res.json({
    success: true,
    data: ride
  });
});

module.exports = {
  requestRide,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  rateRide
};
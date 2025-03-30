const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phoneNumber,
    profileImage,
    vehicleDetails,
    isAvailable
  } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update fields if provided
  if (name) user.name = name;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (profileImage) user.profileImage = profileImage;
  if (typeof isAvailable === 'boolean' && user.role === 'driver') {
    user.isAvailable = isAvailable;
  }
  
  // Update vehicle details for drivers
  if (vehicleDetails && user.role === 'driver') {
    user.vehicleDetails = {
      ...user.vehicleDetails,
      ...vehicleDetails
    };
  }

  const updatedUser = await user.save();

  logger.info(`Profile updated for user: ${user._id}`);
  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Update driver location
// @route   PUT /api/users/location
// @access  Private (Drivers only)
const updateLocation = asyncHandler(async (req, res) => {
  const { coordinates } = req.body;

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    res.status(400);
    throw new Error('Please provide valid coordinates [longitude, latitude]');
  }

  if (req.user.role !== 'driver') {
    res.status(403);
    throw new Error('Only drivers can update location');
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      currentLocation: {
        type: 'Point',
        coordinates
      }
    },
    { new: true }
  );

  logger.info(`Location updated for driver: ${user._id}`);
  res.json({
    success: true,
    data: {
      location: user.currentLocation
    }
  });
});

// @desc    Get nearby drivers
// @route   GET /api/users/drivers/nearby
// @access  Private (Riders only)
const getNearbyDrivers = asyncHandler(async (req, res) => {
  const { longitude, latitude, radius = 5000 } = req.query; // radius in meters, default 5km

  if (!longitude || !latitude) {
    res.status(400);
    throw new Error('Please provide location coordinates');
  }

  if (req.user.role !== 'rider') {
    res.status(403);
    throw new Error('Only riders can search for nearby drivers');
  }

  const drivers = await User.find({
    role: 'driver',
    isAvailable: true,
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius)
      }
    }
  }).select('name profileImage vehicleDetails rating currentLocation');

  res.json({
    success: true,
    data: {
      count: drivers.length,
      drivers
    }
  });
});

// @desc    Upload user documents (for drivers)
// @route   PUT /api/users/documents
// @access  Private (Drivers only)
const uploadDocuments = asyncHandler(async (req, res) => {
  const { license, insurance } = req.body;

  if (!license || !insurance) {
    res.status(400);
    throw new Error('Please provide all required documents');
  }

  if (req.user.role !== 'driver') {
    res.status(403);
    throw new Error('Only drivers can upload documents');
  }

  const user = await User.findById(req.user.id);

  user.documents = {
    license,
    insurance
  };
  user.isVerified = false; // Reset verification status for admin review

  await user.save();

  logger.info(`Documents uploaded for driver: ${user._id}`);
  res.json({
    success: true,
    message: 'Documents uploaded successfully, pending verification',
    data: {
      documents: user.documents,
      isVerified: user.isVerified
    }
  });
});

// @desc    Get driver statistics
// @route   GET /api/users/stats
// @access  Private (Drivers only)
const getDriverStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'driver') {
    res.status(403);
    throw new Error('Only drivers can access statistics');
  }

  const stats = await Ride.aggregate([
    {
      $match: {
        driver: req.user._id,
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRides: { $sum: 1 },
        totalEarnings: { $sum: '$fare.amount' },
        averageRating: { $avg: '$rating.driver.value' },
        totalDistance: { $sum: '$distance.value' }
      }
    }
  ]);

  res.json({
    success: true,
    data: stats[0] || {
      totalRides: 0,
      totalEarnings: 0,
      averageRating: 0,
      totalDistance: 0
    }
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updateLocation,
  getNearbyDrivers,
  uploadDocuments,
  getDriverStats
};
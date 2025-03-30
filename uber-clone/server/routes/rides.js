const express = require('express');
const router = express.Router();
const {
  requestRide,
  acceptRide,
  updateRideStatus,
  getRideHistory,
  rateRide
} = require('../controllers/rideController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Routes for both riders and drivers
router.get('/history', getRideHistory);
router.post('/:id/rate', rateRide);

// Rider-specific routes
router.post('/request', authorize('rider'), requestRide);

// Driver-specific routes
router.put('/:id/accept', authorize('driver'), acceptRide);

// Route for updating ride status (both riders and drivers can update status)
router.put('/:id/status', updateRideStatus);

// Additional route for getting active ride (if any)
router.get('/active', (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for getting ride details
router.get('/:id', (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for cancelling a ride
router.put('/:id/cancel', (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for getting estimated fare
router.post('/estimate', (req, res) => {
  // This will be implemented in the controller
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
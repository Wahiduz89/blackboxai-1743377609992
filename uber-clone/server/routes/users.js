const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateLocation,
  getNearbyDrivers,
  uploadDocuments,
  getDriverStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Routes for all users
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Driver-specific routes
router.put('/location', authorize('driver'), updateLocation);
router.put('/documents', authorize('driver'), uploadDocuments);
router.get('/stats', authorize('driver'), getDriverStats);

// Rider-specific routes
router.get('/drivers/nearby', authorize('rider'), getNearbyDrivers);

// Additional routes that will be implemented later
router.get('/earnings', authorize('driver'), (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/schedule', authorize('driver'), (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.get('/notifications', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

router.put('/preferences', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for getting user's payment methods
router.get('/payment-methods', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for adding a payment method
router.post('/payment-methods', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Route for updating notification settings
router.put('/notification-settings', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;
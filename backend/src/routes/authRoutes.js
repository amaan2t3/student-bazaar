import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);

// Protected User Endpoints
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

// Testing Role-Protected Endpoint for Verification
router.get('/seller-only', protect, restrictTo('seller', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Authorized: Access granted to seller dashboard resource.',
    user: req.user
  });
});

router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Authorized: Access granted to admin portal resource.',
    user: req.user
  });
});

export default router;

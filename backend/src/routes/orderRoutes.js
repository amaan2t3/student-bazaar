import express from 'express';
import { 
  checkout, 
  getMyPurchases, 
  generateSecureDownloadUrl 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order Checkout & Purchases
router.post('/checkout', protect, checkout);
router.get('/my-purchases', protect, getMyPurchases);

// Secure Signed Downloads
router.get('/downloads/:projectId', protect, generateSecureDownloadUrl);

export default router;

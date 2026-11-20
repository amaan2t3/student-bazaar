import express from 'express';
import { 
  createCustomRequest, 
  getMyCustomRequests, 
  getOpenRequestsFeed, 
  getSingleCustomRequest, 
  getAdminCustomRequestsQueue, 
  moderateCustomRequest 
} from '../controllers/customRequestController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Buyer Actions
router.post('/', protect, createCustomRequest);
router.get('/my-requests', protect, getMyCustomRequests);

// Seller Opportunities Feed
router.get('/feed', protect, restrictTo('seller', 'admin'), getOpenRequestsFeed);
router.get('/:id', protect, getSingleCustomRequest);

// Admin Moderation Queue
router.get('/admin/moderation', protect, restrictTo('admin'), getAdminCustomRequestsQueue);
router.put('/admin/:id/moderate', protect, restrictTo('admin'), moderateCustomRequest);

export default router;

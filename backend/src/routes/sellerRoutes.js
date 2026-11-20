import express from 'express';
import { 
  applyToBecomeSeller, 
  getMyApplication, 
  getAdminApplications, 
  reviewApplication 
} from '../controllers/sellerController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Buyer Application Endpoints
router.post('/apply', protect, applyToBecomeSeller);
router.get('/my-application', protect, getMyApplication);

// Admin Moderation Endpoints
router.get('/admin/applications', protect, restrictTo('admin'), getAdminApplications);
router.put('/admin/applications/:id/review', protect, restrictTo('admin'), reviewApplication);

export default router;

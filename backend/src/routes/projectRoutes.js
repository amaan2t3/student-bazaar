import express from 'express';
import { 
  getProjects, 
  getProjectBySlug, 
  createProject, 
  getSellerProjects, 
  getAdminModerationQueue, 
  moderateProject 
} from '../controllers/projectController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Catalog Endpoints
router.get('/', getProjects);
router.get('/detail/:slug', getProjectBySlug);

// Seller Project Management
router.post('/', protect, restrictTo('seller', 'admin'), createProject);
router.get('/seller/my-projects', protect, restrictTo('seller', 'admin'), getSellerProjects);

// Admin Moderation Queue
router.get('/admin/moderation', protect, restrictTo('admin'), getAdminModerationQueue);
router.put('/admin/:id/moderate', protect, restrictTo('admin'), moderateProject);

export default router;

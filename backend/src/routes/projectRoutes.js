import express from 'express';
import { 
  getProjects, 
  getProjectBySlug, 
  createProject, 
  getSellerProjects, 
  getAdminModerationQueue, 
  getAdminProjectById,
  moderateProject,
  updateAdminProject,
  deleteAdminProject
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
router.get('/admin/:id', protect, restrictTo('admin'), getAdminProjectById);
router.put('/admin/:id', protect, restrictTo('admin'), updateAdminProject);
router.delete('/admin/:id', protect, restrictTo('admin'), deleteAdminProject);
router.put('/admin/:id/moderate', protect, restrictTo('admin'), moderateProject);

export default router;

import express from 'express';
import {
  getTeamMembers,
  getAdminTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} from '../controllers/teamController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getTeamMembers);

// Admin routes
router.get('/admin/all', protect, restrictTo('admin'), getAdminTeamMembers);
router.post('/admin', protect, restrictTo('admin'), createTeamMember);
router.put('/admin/:id', protect, restrictTo('admin'), updateTeamMember);
router.delete('/admin/:id', protect, restrictTo('admin'), deleteTeamMember);

export default router;

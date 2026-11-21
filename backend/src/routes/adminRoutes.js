import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-stats', protect, restrictTo('admin'), getDashboardStats);

export default router;

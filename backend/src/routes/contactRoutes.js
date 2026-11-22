import express from 'express';
import {
  submitContactMessage,
  getContactSettings,
  getAdminContactMessages,
  getAdminContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
  updateContactSettings
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/messages', submitContactMessage);
router.get('/info', getContactSettings);

// Admin routes
router.get('/admin/messages', protect, restrictTo('admin'), getAdminContactMessages);
router.get('/admin/messages/:id', protect, restrictTo('admin'), getAdminContactMessageById);
router.patch('/admin/messages/:id', protect, restrictTo('admin'), updateContactMessageStatus);
router.delete('/admin/messages/:id', protect, restrictTo('admin'), deleteContactMessage);
router.get('/admin/settings', protect, restrictTo('admin'), getContactSettings);
router.put('/admin/settings', protect, restrictTo('admin'), updateContactSettings);

export default router;

import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, sendTestNotification, subscribe } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.post('/test', protect, sendTestNotification);
router.post('/subscribe', protect, subscribe);
router.put('/mark-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;

import express from 'express';
import { registerCustomer, adminLogin, getMe, customerLogin, googleAuth, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/register-customer', registerCustomer);
router.post('/customer-login', customerLogin);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
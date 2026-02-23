import express from 'express';
import { upload, uploadImage, deleteImage, listImages } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only: upload new image to Drive
router.post('/image', protect, adminOnly, upload.single('image'), uploadImage);

// Admin-only: delete image from Drive
router.delete('/image/:fileId', protect, adminOnly, deleteImage);

// Admin-only: list all images in the Drive folder (for image browser)
router.get('/images', protect, adminOnly, listImages);

export default router;
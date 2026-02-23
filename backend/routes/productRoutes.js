import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getWrappers, getFreshFlowers } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/wrappers', getWrappers);
router.get('/fresh-flowers', getFreshFlowers);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
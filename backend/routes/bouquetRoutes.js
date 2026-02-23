import express from 'express';
import { getWrappers, getFreshFlowers } from '../controllers/productController.js';

const router = express.Router();

// These are convenience routes for the bouquet builder page
router.get('/flowers', getFreshFlowers);
router.get('/wrappers', getWrappers);

export default router;
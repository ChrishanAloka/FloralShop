import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get configuration
router.get('/', async (req, res) => {
    try {
        const dbSettings = await Settings.findOne({ key: 'currency' });

        const config = {
            currencyCode: dbSettings?.value?.code || process.env.CURRENCY_CODE || 'USD',
            currencySymbol: dbSettings?.value?.symbol || process.env.CURRENCY_SYMBOL || '$'
        };

        res.json(config);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching config' });
    }
});

// Admin: Update configuration
router.put('/', protect, adminOnly, async (req, res) => {
    try {
        const { currencyCode, currencySymbol } = req.body;

        if (!currencyCode || !currencySymbol) {
            return res.status(400).json({ message: 'Currency code and symbol are required' });
        }

        const updated = await Settings.findOneAndUpdate(
            { key: 'currency' },
            { value: { code: currencyCode, symbol: currencySymbol } },
            { upsert: true, new: true }
        );

        res.json({
            message: 'Settings updated successfully',
            currencyCode: updated.value.code,
            currencySymbol: updated.value.symbol
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating config' });
    }
});

export default router;

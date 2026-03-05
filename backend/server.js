import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import bouquetRoutes from './routes/bouquetRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import configRoutes from './routes/configRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import cron from 'node-cron';
import { sendUnreadReminders } from './controllers/notificationController.js';

dotenv.config();

const app = express();

// Allow requests from local dev and the deployed Netlify frontend.
// Set CLIENT_URL in your backend .env to your Netlify site URL.
// Multiple origins supported (comma-separated in CLIENT_URL).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bouquets', bouquetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/config', configRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🌸 Server on port ${process.env.PORT || 5000}`);

      // Initialize Cron Job: Every 5 minutes to remind users of unread notifications
      cron.schedule('*/5 * * * *', () => {
        console.log(`[${new Date().toLocaleTimeString()}] Running 5-minute unread notification reminder...`);
        sendUnreadReminders();
      });
    });
  })
  .catch(err => { console.error('❌ DB error:', err); process.exit(1); });
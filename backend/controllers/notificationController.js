import Notification from '../models/Notification.js';
import User from '../models/User.js';
import webpush from 'web-push';
import dotenv from 'dotenv';
dotenv.config();

// Setup Web Push
webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Helper: Send Push to a User
const sendPush = async (userId, payload) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) return;

        const pushData = JSON.stringify(payload);

        // Send to all registered devices for this user
        const results = await Promise.allSettled(
            user.pushSubscriptions.map(sub =>
                webpush.sendNotification(sub, pushData).catch(err => {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        // Subscription expired or no longer valid
                        return { expired: true, endpoint: sub.endpoint };
                    }
                    console.error('Push error:', err);
                })
            )
        );

        // Cleanup expired subscriptions
        const expiredEndpoints = results
            .filter(r => r.value?.expired)
            .map(r => r.value.endpoint);

        if (expiredEndpoints.length > 0) {
            await User.findByIdAndUpdate(userId, {
                $pull: { pushSubscriptions: { endpoint: { $in: expiredEndpoints } } }
            });
        }
    } catch (err) {
        console.error('SendPush failed:', err);
    }
};

// Helper: Create for specific user
export const createNotification = async ({ recipient, title, message, type, link }) => {
    try {
        const notif = await Notification.create({ recipient, title, message, type, link });

        // Trigger real-time push
        await sendPush(recipient, {
            title,
            body: message,
            data: { url: link || '/' }
        });

        return notif;
    } catch (err) {
        console.error('Notify Error:', err);
    }
};

// Helper: Notify all admins
export const notifyAdmins = async ({ title, message, type, link }) => {
    try {
        const admins = await User.find({ role: 'admin' }, '_id');
        const notifications = admins.map(a => ({ recipient: a._id, title, message, type, link }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (err) {
        console.error('Notify Admins Error:', err);
    }
};

// Helper: Notify everyone (Admins + Customers)
export const notifyAll = async ({ title, message, type, link }) => {
    try {
        const users = await User.find({}, '_id');
        const notifications = users.map(u => ({ recipient: u._id, title, message, type, link }));
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }
    } catch (err) {
        console.error('Notify All Error:', err);
    }
};

// API: Get notifications (paginated)
export const getMyNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments({ recipient: req.user._id });
        const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

        res.json({
            notifications,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                totalItems: total,
                unreadCount
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// API: Mark one as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// API: Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// API: Send test notification
export const sendTestNotification = async (req, res) => {
    try {
        const testNotif = await createNotification({
            recipient: req.user._id,
            title: "Test Notification 🔔",
            message: "This is a test notification to verify your device connection. It's working!",
            type: 'status',
            link: '/shop'
        });
        res.json(testNotif);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// API: Subscribe to Push
export const subscribe = async (req, res) => {
    try {
        const { subscription } = req.body;
        if (!subscription) return res.status(400).json({ message: 'No subscription provided' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add if not exists
        const exists = user.pushSubscriptions.find(s => s.endpoint === subscription.endpoint);
        if (!exists) {
            user.pushSubscriptions.push(subscription);
            await user.save();
        }

        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

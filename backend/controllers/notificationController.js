import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Helper: Create for specific user
export const createNotification = async ({ recipient, title, message, type, link }) => {
    try {
        return await Notification.create({ recipient, title, message, type, link });
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

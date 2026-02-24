import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['order', 'product', 'system', 'status'],
        default: 'system'
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

// Index for faster queries on recipient and read status
notificationSchema.index({ recipient: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

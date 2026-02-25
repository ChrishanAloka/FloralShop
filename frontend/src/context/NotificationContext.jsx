import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext();

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, total: 1, totalItems: 0 });

    const [activePage, setActivePage] = useState(1);

    const [pushEnabled, setPushEnabled] = useState(() => localStorage.getItem('pushEnabled') === 'true');
    const lastPushTimeRef = useRef(0);

    const togglePush = async () => {
        if (!window.Notification) {
            alert("Push notifications are not supported in this browser.");
            return;
        }

        if (!pushEnabled) {
            const perm = await window.Notification.requestPermission();
            if (perm === 'granted') {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    const subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
                    });

                    // Send subscription to backend
                    await api.post('/notifications/subscribe', { subscription });

                    setPushEnabled(true);
                    localStorage.setItem('pushEnabled', 'true');

                    new window.Notification("Push Notifications Active! 🌸", {
                        body: "You'll now get real-time updates even when the app is closed.",
                        icon: '/logo.png'
                    });
                } catch (err) {
                    console.error('Subscription failed:', err);
                    alert("Failed to register for push notifications. Make sure you are using a secure connection (HTTPS).");
                }
            } else {
                alert("Please enable notification permissions in your browser settings.");
            }
        } else {
            setPushEnabled(false);
            localStorage.setItem('pushEnabled', 'false');
        }
    };

    const fetchNotifications = useCallback(async (page = 1) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await api.get(`/notifications?page=${page}&limit=10`);
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.pagination.unreadCount);
            setPagination(res.data.pagination);
            setActivePage(page);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchNotifications(activePage);
            // We now rely on Server-side Push for immediate alerts,
            // so we can slow down the polling significantly just for the UI count.
            const interval = setInterval(() => fetchNotifications(activePage), 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
            setActivePage(1);
        }
    }, [user, activePage, fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/mark-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const sendTestNotification = async () => {
        try {
            await api.post('/notifications/test');
            // We don't need to do anything here, the poller will pick it up
        } catch (err) {
            console.error('Failed to send test notification:', err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            pagination,
            pushEnabled,
            togglePush,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            sendTestNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};

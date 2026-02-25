import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext();

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
                setPushEnabled(true);
                localStorage.setItem('pushEnabled', 'true');
                new window.Notification("Notifications Enabled!", {
                    body: "You will now receive updates.",
                    icon: '/logo.png'
                });
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
            const interval = setInterval(async () => {
                try {
                    // Always refresh unread count, but only update the list if on page 1
                    // This prevents jarring jumps when reading history but keeps the bell updated
                    const res = await api.get(`/notifications?page=${activePage}&limit=10`);
                    setUnreadCount(res.data.pagination.unreadCount);
                    if (activePage === 1) {
                        setNotifications(res.data.notifications);
                    }
                    setPagination(res.data.pagination);

                    // Push notifications logic
                    if (pushEnabled && window.Notification && window.Notification.permission === 'granted' && res.data.pagination.unreadCount > 0) {
                        const now = Date.now();
                        if (now - lastPushTimeRef.current > 30000) { // every 30 seconds push unread
                            res.data.notifications.filter(n => !n.isRead).forEach(n => {
                                new window.Notification(n.title, {
                                    body: n.message,
                                    icon: '/logo.png',
                                    tag: n._id // keeps it from duplicating visually if already showing
                                });
                            });
                            lastPushTimeRef.current = now;
                        }
                    }

                } catch (err) {
                    console.error('Polling error:', err);
                }
            }, 10000);
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

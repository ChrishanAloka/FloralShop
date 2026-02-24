import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, total: 1, totalItems: 0 });

    // Track current active page to prevent poller from resetting user to Page 1
    const [activePage, setActivePage] = useState(1);

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
            // Polling every 10 seconds
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

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            pagination,
            fetchNotifications,
            markAsRead,
            markAllAsRead
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

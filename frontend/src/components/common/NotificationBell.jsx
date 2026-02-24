import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Icon } from './Icons';
import { formatDate } from '../../utils/helpers';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading, pushEnabled, togglePush } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (n) => {
        markAsRead(n._id);
        if (n.link) navigate(n.link);
        setIsOpen(false);
    };

    const latestNotifications = notifications.slice(0, 10);

    return (
        <div className="notification-bell-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                className="nav-icon-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{ position: 'relative', background: 'none', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <Icon.Bell size={22} color={unreadCount > 0 ? 'var(--rose)' : 'var(--text-mid)'} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'var(--rose)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 700,
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        padding: '0 4px',
                        lineHeight: 1
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="bloom-card notification-dropdown shadow-lg" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '10px',
                    width: '320px',
                    zIndex: 1100,
                    padding: 0,
                    overflow: 'hidden',
                    animation: 'fadeInScale 0.2s ease forwards',
                }}>
                    <div className="p-3 d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'var(--blush-light)', borderBottom: '1px solid var(--champagne)' }}>
                        <h6 className="mb-0" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Notifications</h6>
                        <div className="d-flex align-items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    style={{ background: 'none', border: 'none', color: 'var(--rose)', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                        <div className="w-100 mt-1 d-flex align-items-center justify-content-between">
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-mid)' }}>Push Notifications</span>
                            <button
                                onClick={togglePush}
                                className={`btn btn-sm ${pushEnabled ? 'btn-success' : 'btn-outline-primary'}`}
                                style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                            >
                                {pushEnabled ? 'Enabled' : 'Enable'}
                            </button>
                        </div>
                    </div>

                    <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {latestNotifications.length === 0 ? (
                            <div className="p-4 text-center">
                                <Icon.Bell size={32} color="var(--champagne)" />
                                <p className="mt-2 mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No notifications yet</p>
                            </div>
                        ) : (
                            latestNotifications.map(n => (
                                <div
                                    key={n._id}
                                    className={`notification-item p-3 ${!n.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                    style={{
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--champagne)',
                                        background: !n.isRead ? 'rgba(212,99,122,0.03)' : 'white',
                                        transition: 'all 0.2s',
                                        position: 'relative'
                                    }}
                                >
                                    <div className="d-flex gap-2 align-items-start">
                                        <div style={{ marginTop: '3px' }}>
                                            {n.type === 'order' && <Icon.Package size={14} color="var(--rose)" />}
                                            {n.type === 'status' && <Icon.Refresh size={14} color="#3d6b38" />}
                                            {n.type === 'product' && <Icon.Flower size={14} color="#d4637a" />}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div style={{ fontSize: '0.85rem', fontWeight: n.isRead ? 500 : 700, color: 'var(--text-dark)', lineHeight: 1.2 }}>
                                                {n.title}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)', marginTop: '2px' }}>
                                                {n.message}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '5px' }}>
                                                {formatDate(n.createdAt)}
                                            </div>
                                        </div>
                                        {!n.isRead && (
                                            <div style={{ width: '8px', height: '8px', background: 'var(--rose)', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }}></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div
                        className="p-2 text-center"
                        style={{ background: '#fcfcfc', borderTop: '1px solid var(--champagne)', cursor: 'pointer' }}
                        onClick={() => { navigate('/notifications'); setIsOpen(false); }}
                    >
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-mid)' }}>View All Notifications</span>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Icon } from '../components/common/Icons';
import { formatDate } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
    const { notifications, pagination, fetchNotifications, markAsRead, markAllAsRead, loading } = useNotifications();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications(page);
    }, [page, fetchNotifications]);

    const handleNotificationClick = (n) => {
        markAsRead(n._id);
        if (n.link) navigate(n.link);
    };

    return (
        <div className="container py-5" style={{ minHeight: '80vh', maxWidth: '800px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', margin: 0 }}>
                    Notifications
                </h2>
                <button
                    className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                    onClick={markAllAsRead}
                    style={{ padding: '0.4rem 1.2rem', fontWeight: 600 }}
                >
                    <Icon.Check size={16} color="var(--rose)" />
                    Mark All as Read
                </button>
            </div>

            <div className="bloom-card p-0 overflow-hidden">
                {notifications.length === 0 && !loading ? (
                    <div className="p-5 text-center">
                        <Icon.Bell size={64} color="var(--champagne)" />
                        <h4 className="mt-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-mid)' }}>No notifications yet</h4>
                        <p style={{ color: 'var(--text-light)' }}>Stay tuned for updates on your orders and new products!</p>
                    </div>
                ) : (
                    <>
                        <div className="notification-list">
                            {notifications.map(n => (
                                <div
                                    key={n._id}
                                    className={`p-4 border-bottom d-flex gap-3 align-items-start ${!n.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(n)}
                                    style={{
                                        cursor: 'pointer',
                                        background: !n.isRead ? 'rgba(212,99,122,0.03)' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: n.isRead ? 'var(--ivory)' : 'var(--blush-light)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        {n.type === 'order' && <Icon.Bag size={20} color="var(--rose)" />}
                                        {n.type === 'status' && <Icon.Refresh size={20} color="#3d6b38" />}
                                        {n.type === 'product' && <Icon.Flower size={20} color="#d4637a" />}
                                        {!['order', 'status', 'product'].includes(n.type) && <Icon.Bell size={20} color="var(--text-mid)" />}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="mb-1" style={{ fontWeight: n.isRead ? 600 : 800, color: 'var(--text-dark)' }}>{n.title}</h6>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{formatDate(n.createdAt)}</span>
                                        </div>
                                        <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--text-mid)' }}>{n.message}</p>
                                    </div>
                                    {!n.isRead && (
                                        <div style={{ width: '10px', height: '10px', background: 'var(--rose)', borderRadius: '50%', flexShrink: 0, marginTop: '5px' }}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.total > 1 && (
                            <div className="p-4 d-flex justify-content-center gap-2" style={{ background: '#fcfcfc' }}>
                                <button
                                    className="btn btn-sm btn-light"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </button>
                                <span className="d-flex align-items-center px-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                    Page {page} of {pagination.total}
                                </span>
                                <button
                                    className="btn btn-sm btn-light"
                                    disabled={page === pagination.total}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {loading && (
                <div className="text-center py-4">
                    <div className="petal-loader"></div>
                </div>
            )}
        </div>
    );
}

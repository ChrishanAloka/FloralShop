import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useConfig } from '../context/ConfigContext';
import { formatDate, ORDER_STEPS, STATUS_LABELS } from '../utils/helpers';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Icon } from '../components/common/Icons';
import { COUNTRY_CODES } from '../utils/countryCodes';
import api from '../services/api';

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status] || status}</span>;
}

function OrderTimeline({ status }) {
  const currentIdx = ORDER_STEPS.indexOf(status);
  return (
    <div className="order-timeline">
      {ORDER_STEPS.map((step, i) => (
        <span key={step} className={`timeline-step ${i < currentIdx ? 'done' : i === currentIdx ? 'current' : ''}`}>
          {STATUS_LABELS[step]}
        </span>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const { formatPrice } = useConfig();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '' });
  const [editCountryCode, setEditCountryCode] = useState('+94');
  const [updateLoading, setUpdateLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const phoneNum = user.phone || '';
      const matched = COUNTRY_CODES.find(c => phoneNum.startsWith(c.code));
      if (matched) {
        setEditForm({ name: user.name, phone: phoneNum.replace(matched.code, '') });
        setEditCountryCode(matched.code);
      } else {
        setEditForm({ name: user.name, phone: phoneNum });
      }

      const fetchOrders = () => {
        orderService.getMyOrders()
          .then(res => setOrders(res.data))
          .catch(() => { })
          .finally(() => setOrdersLoading(false));
      };

      fetchOrders();
      const interval = setInterval(fetchOrders, 10000); // Polling every 10 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const fullPhone = editForm.phone ? (editForm.phone.startsWith('+') ? editForm.phone : `${editCountryCode}${editForm.phone}`) : '';
      const res = await api.put('/auth/profile', { ...editForm, phone: fullPhone });
      loginWithToken(localStorage.getItem('token'), res.data.user);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="petal-loader" style={{ minHeight: '60vh' }}></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="py-4" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: 750 }}>

        {/* Profile header */}
        <div className="profile-header">
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--petal)' }}
                  />
                ) : (
                  <div style={{
                    width: 64, height: 64,
                    background: 'linear-gradient(135deg, var(--rose), var(--petal))',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', fontFamily: 'var(--font-display)', color: 'white', fontWeight: 700,
                  }}>
                    {user.name[0].toUpperCase()}
                  </div>
                )}
                {/* Google badge */}
                {user.avatar && (
                  <span
                    title="Signed in with Google"
                    style={{
                      position: 'absolute', bottom: -2, right: -2,
                      background: 'white', borderRadius: '50%', width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }}
                  >
                    <Icon.Google size={14} />
                  </span>
                )}
              </div>

              {/* User info */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', margin: '0 0 0.2rem' }}>{user.name}</h3>
                {user.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                    <Icon.Envelope size={14} color="var(--text-light)" />
                    {user.email}
                  </div>
                )}
                {user.phone ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                    <Icon.Phone size={14} color="var(--text-light)" />
                    {user.phone}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--rose)', fontSize: '0.82rem', fontWeight: 500 }}>
                    <Icon.Warning size={14} color="var(--rose)" />
                    Phone number missing
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex flex-column gap-2 align-items-end">
              {/* Profile Actions */}
              <div className="d-flex gap-2">
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1.1rem', borderRadius: '50px',
                      border: '1.5px solid var(--champagne)', background: 'white',
                      color: 'var(--text-dark)', fontSize: '0.85rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Icon.Edit size={16} />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1.1rem', borderRadius: '50px',
                    border: '1.5px solid #f8d7da', background: 'white',
                    color: 'var(--rose-deep)', fontSize: '0.85rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(212,99,122,0.1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--rose)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--rose-deep)'; e.currentTarget.style.borderColor = '#f8d7da'; }}
                >
                  <Icon.Logout size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {editing && (
            <div className="mt-4 p-4" style={{ background: 'var(--blush-light)', borderRadius: 'var(--radius)', border: '1px solid var(--champagne)' }}>
              <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.2rem' }}>Update Profile</h5>
              <form onSubmit={handleUpdateProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Name</label>
                    <input className="form-control" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ maxWidth: '85px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.8rem', paddingRight: 4, paddingLeft: 8 }}
                        value={editCountryCode}
                        onChange={e => setEditCountryCode(e.target.value)}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <input className="form-control" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="771234567" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
                    </div>
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary" type="submit" disabled={updateLoading}>
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn btn-light" type="button" onClick={() => setEditing(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Stats row */}
          <div className="mt-3 pt-3 d-flex gap-4" style={{ borderTop: '1px solid var(--champagne)' }}>
            {[
              { value: orders.length, label: 'Total Orders' },
              { value: orders.filter(o => o.status === 'delivered').length, label: 'Delivered' },
              { value: formatPrice(orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0)), label: 'Spent' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--rose)', fontWeight: 600, lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '0.1rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders list */}
        <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '1.3rem' }}>My Orders</h5>

        {ordersLoading ? (
          <div className="petal-loader"></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-light)' }}>
            {/* Empty state illustration */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.35 }}>
              <circle cx="40" cy="40" r="36" fill="#f5c6d0" />
              <path d="M28 28h24l-4 22H32L28 28z" fill="#d4637a" opacity=".5" />
              <circle cx="35" cy="56" r="4" fill="#d4637a" opacity=".5" />
              <circle cx="47" cy="56" r="4" fill="#d4637a" opacity=".5" />
            </svg>
            <p className="mt-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>No orders yet</p>
            <p style={{ fontSize: '0.85rem' }}>Your orders will appear here after checkout</p>
          </div>
        ) : orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon.Package size={16} color="var(--text-mid)" />
                  Order #{order._id.slice(-6).toUpperCase()}
                  {order.orderType === 'custom-bouquet' && (
                    <span style={{ fontSize: '0.7rem', background: 'var(--sage-light)', color: '#3d6b38', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      Custom
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Icon.Clock size={12} color="var(--text-light)" />
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <StatusBadge status={order.status} />
                <span style={{ color: 'var(--rose)', fontWeight: 700 }}>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="mt-2" style={{ fontSize: '0.82rem', color: 'var(--text-mid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {order.orderType === 'standard'
                  ? order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')
                  : `Custom bouquet: ${order.customBouquet?.flowers?.reduce((s, f) => s + f.quantity, 0)} stems + ${order.customBouquet?.wrapper?.name || 'wrapper'}`}
              </div>
              <Link to={`/invoice/${order._id}`} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', borderRadius: '20px', padding: '0.1rem 0.6rem' }}>
                <Icon.Download size={12} /> Invoice
              </Link>
            </div>

            {order.status !== 'cancelled' && <OrderTimeline status={order.status} />}

            {order.statusHistory?.length > 0 && order.statusHistory[order.statusHistory.length - 1].note && (
              <div className="mt-2 p-2 d-flex align-items-start gap-2" style={{ background: 'var(--blush-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-mid)' }}>
                <Icon.Chat size={14} color="var(--rose)" style={{ flexShrink: 0, marginTop: 1 }} />
                {order.statusHistory[order.statusHistory.length - 1].note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
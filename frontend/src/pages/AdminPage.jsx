import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import api from '../services/api';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import AdminSettings from '../components/admin/AdminSettings';
import { Icon } from '../components/common/Icons';
import Logo from '../assets/logo.png';

function DashboardHome() {
  const [stats, setStats] = useState(null);
  const { formatPrice } = useConfig();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="petal-loader"></div>;
  if (!stats) return null;

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: <Icon.Package size={22} color="#d4637a" />, bg: '#fff0f3' },
    { label: 'Pending', value: stats.pendingOrders, icon: <Icon.Clock size={22} color="#856404" />, bg: '#fff8e6' },
    { label: 'Products', value: stats.totalProducts, icon: <Icon.Flower size={22} color="#3d6b38" />, bg: '#f0fff4' },
    { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: <Icon.Gift size={22} color="#5b5fcf" />, bg: '#f0f4ff' },
  ];

  return (
    <div>
      <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1.5rem' }}>Dashboard Overview</h4>
      <div className="row g-3 mb-4">
        {statCards.map(s => (
          <div key={s.label} className="col-6 col-lg-3">
            <div className="stat-card">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--text-dark)' }}>Recent Orders</h5>
      <div className="bloom-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.85rem' }}>
            <thead style={{ background: 'var(--blush-light)' }}>
              <tr>
                <th className="py-3 ps-3" style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Order</th>
                <th className="py-3" style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Customer</th>
                <th className="py-3" style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Amount</th>
                <th className="py-3" style={{ color: 'var(--text-mid)', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="py-2 ps-3" style={{ fontWeight: 500 }}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="py-2">{o.customer?.name || o.customerName}</td>
                  <td className="py-2" style={{ color: 'var(--rose)', fontWeight: 600 }}>{formatPrice(o.totalAmount)}</td>
                  <td className="py-2"><span className={`status-badge status-${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <Icon.Grid size={17} />, end: true },
    { to: '/admin/orders', label: 'Orders', icon: <Icon.Package size={17} /> },
    { to: '/admin/products', label: 'Products', icon: <Icon.Flower size={17} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Icon.ShieldCheck size={17} /> },
  ];

  return (
    <div className="admin-sidebar d-flex flex-column" style={{ width: 220, minWidth: 220 }}>
      {/* Brand */}
      <div className="sidebar-brand d-flex align-items-center gap-2">
        <img src={Logo} alt="Bloom & Petal Logo" style={{ height: '24px', width: 'auto' }} />
        Bloom & Petal
      </div>

      {/* Admin user */}
      <div className="px-3 pb-3 mb-2" style={{ borderBottom: '1px solid rgba(245,198,208,0.15)' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,198,208,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.ShieldCheck size={16} color="var(--blush)" />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          {navItems.map(item => (
            <li key={item.to} className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to={item.to} end={item.end} onClick={onClose}>
                {item.icon}{item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(245,198,208,0.15)' }}>
        <button
          className="d-flex align-items-center gap-2 w-100"
          onClick={handleLogout}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.5rem 0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,99,122,0.25)'; e.currentTarget.style.color = 'var(--blush)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
        >
          <Icon.Logout size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="petal-loader" style={{ minHeight: '80vh' }}></div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="d-lg-none" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="d-none d-lg-flex" style={{ position: 'fixed', height: '100vh', zIndex: 1000, overflowY: 'auto' }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1001, overflowY: 'auto' }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="d-none d-lg-block" style={{ marginLeft: 220, flex: 1, background: 'var(--ivory)', padding: '1.5rem' }}>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>

      {/* Mobile content */}
      <div className="d-lg-none" style={{ flex: 1, padding: '1rem', paddingTop: '4.5rem' }}>
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 998,
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--text-dark)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Icon.Menu size={20} color="var(--blush)" />
        </button>
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
}
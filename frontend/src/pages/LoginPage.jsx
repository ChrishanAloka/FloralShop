import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/common/Icons';
import api from '../services/api';

export default function LoginPage() {
  const [mode, setMode] = useState('customer');
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = mode === 'admin' ? '/auth/admin-login' : '/auth/customer-login';
      const res = await api.post(endpoint, form);
      loginWithToken(res.data.token, res.data.user);
      navigate(mode === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true); setError('');
    try {
      const res = await api.post('/auth/google', { credential: credentialResponse.credential });
      loginWithToken(res.data.token, res.data.user);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally { setGoogleLoading(false); }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed.');
    setGoogleLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5"
      style={{ minHeight: '80vh', background: 'linear-gradient(135deg, var(--blush-light), var(--ivory))' }}>
      <div className="bloom-card p-4 p-md-5" style={{ width: '100%', maxWidth: 440 }}>

        {/* Header with floral SVG */}
        <div className="text-center mb-4">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: '0.6rem' }}>
            <circle cx="28" cy="28" r="28" fill="#fdeef2" />
            <circle cx="28" cy="28" r="10" fill="#d4637a" />
            <circle cx="28" cy="14" r="7" fill="#e8a0b0" />
            <circle cx="28" cy="42" r="7" fill="#e8a0b0" />
            <circle cx="14" cy="28" r="7" fill="#e8a0b0" />
            <circle cx="42" cy="28" r="7" fill="#e8a0b0" />
            <circle cx="18" cy="18" r="5.5" fill="#f5c6d0" />
            <circle cx="38" cy="18" r="5.5" fill="#f5c6d0" />
            <circle cx="18" cy="38" r="5.5" fill="#f5c6d0" />
            <circle cx="38" cy="38" r="5.5" fill="#f5c6d0" />
          </svg>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>Welcome Back</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Sign in to view your orders</p>
        </div>

        {/* Mode Tabs */}
        <div className="d-flex mb-4 p-1" style={{ background: 'var(--champagne)', borderRadius: '50px' }}>
          {[
            { id: 'customer', label: 'Customer', icon: <Icon.Person size={15} /> },
            { id: 'admin', label: 'Admin', icon: <Icon.ShieldCheck size={15} /> },
          ].map(m => (
            <button key={m.id} className="btn flex-fill d-flex align-items-center justify-content-center gap-2" style={{
              borderRadius: '50px', padding: '0.4rem', fontSize: '0.85rem', fontWeight: 600,
              background: mode === m.id ? 'var(--rose)' : 'transparent',
              color: mode === m.id ? 'white' : 'var(--text-mid)',
              border: 'none', transition: 'all 0.25s',
            }} onClick={() => { setMode(m.id); setError(''); }}>
              {m.icon}{m.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="d-flex align-items-center gap-2 mb-3 p-3" style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.85rem' }}>
            <Icon.Warning size={16} color="#991b1b" />
            {error}
          </div>
        )}

        {/* Google Sign-In — customers only */}
        {mode === 'customer' && (
          <>
            <div className="mb-3">
              {googleLoading ? (
                <div className="d-flex align-items-center justify-content-center gap-2 p-3" style={{ border: '1.5px solid var(--champagne)', borderRadius: 'var(--radius-sm)', background: 'var(--white)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></path>
                  </svg>
                  <span style={{ color: 'var(--text-mid)', fontSize: '0.88rem', fontWeight: 500 }}>Signing in with Google...</span>
                </div>
              ) : (
                <div>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    width="380"
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </div>
              )}
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ flex: 1, height: 1, background: 'var(--champagne)' }}></div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', fontWeight: 500, whiteSpace: 'nowrap' }}>or continue with phone</span>
              <div style={{ flex: 1, height: 1, background: 'var(--champagne)' }}></div>
            </div>
          </>
        )}

        {/* Phone / password form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                <Icon.Phone size={16} color="var(--petal)" />
              </span>
              <input className="form-control" type="tel" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 234 567 8900"
                style={{ borderLeft: 'none' }} />
            </div>
          </div>

          {mode === 'admin' && (
            <div className="mb-3">
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Password</label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                  <Icon.Lock size={16} color="var(--petal)" />
                </span>
                <input className="form-control" type="password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Admin password"
                  style={{ borderLeft: 'none' }} />
              </div>
            </div>
          )}

          {mode === 'customer' && (
            <div className="d-flex align-items-center gap-2 mb-3" style={{ padding: '0.6rem 0.8rem', background: 'var(--blush-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: 'var(--text-mid)' }}>
              <Icon.Info size={14} color="var(--petal)" style={{ flexShrink: 0 }} />
              Customers don't need a password — just your phone number.
            </div>
          )}

          <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></path>
                </svg>
                Signing in...
              </>
            ) : (
              <><Icon.SignIn size={17} color="white" />Sign In</>
            )}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
          New here? <Link to="/shop" style={{ color: 'var(--rose)', fontWeight: 500 }}>Browse our shop</Link> and create an account at checkout.
        </p>
      </div>
    </div>
  );
}
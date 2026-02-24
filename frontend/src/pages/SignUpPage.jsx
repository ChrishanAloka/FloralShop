import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/common/Icons';
import { COUNTRY_CODES } from '../utils/countryCodes';
import api from '../services/api';

export default function SignUpPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [countryCode, setCountryCode] = useState('+94');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginWithToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const fullPhone = form.phone ? (form.phone.startsWith('+') ? form.phone : `${countryCode}${form.phone}`) : '';
            const res = await api.post('/auth/register-customer', { ...form, phone: fullPhone });
            loginWithToken(res.data.token, res.data.user);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true); setError('');
        try {
            const res = await api.post('/auth/google', { credential: credentialResponse.credential });
            loginWithToken(res.data.token, res.data.user);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed. Please try again.');
        } finally { setGoogleLoading(false); }
    };

    const handleGoogleError = () => {
        setError('Google sign-up was cancelled or failed.');
        setGoogleLoading(false);
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-5"
            style={{ minHeight: '80vh', background: 'linear-gradient(135deg, var(--blush-light), var(--ivory))' }}>
            <div className="bloom-card p-4 p-md-5" style={{ width: '100%', maxWidth: 480 }}>

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
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>Create Account</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Join Bloom & Petal for a personalized experience</p>
                </div>

                {error && (
                    <div className="d-flex align-items-center gap-2 mb-3 p-3" style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.85rem' }}>
                        <Icon.Warning size={16} color="#991b1b" />
                        {error}
                    </div>
                )}

                {/* Google Sign-In */}
                <div className="mb-4">
                    {googleLoading ? (
                        <div className="d-flex align-items-center justify-content-center gap-2 p-3" style={{ border: '1.5px solid var(--champagne)', borderRadius: 'var(--radius-sm)', background: 'var(--white)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></path>
                            </svg>
                            <span style={{ color: 'var(--text-mid)', fontSize: '0.88rem', fontWeight: 500 }}>Starting Google sign-up...</span>
                        </div>
                    ) : (
                        <div className="w-100 d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signup_with"
                                shape="rectangular"
                                logo_alignment="left"
                            />
                        </div>
                    )}
                </div>

                <div className="d-flex align-items-center gap-2 mb-4">
                    <div style={{ flex: 1, height: 1, background: 'var(--champagne)' }}></div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', fontWeight: 500, whiteSpace: 'nowrap' }}>or register with email/phone</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--champagne)' }}></div>
                </div>

                {/* Registration form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                                <Icon.Person size={16} color="var(--petal)" />
                            </span>
                            <input className="form-control" type="text" required value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="Jane Doe"
                                style={{ borderLeft: 'none' }} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '85px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.8rem', paddingRight: 4, paddingLeft: 8 }}
                                    value={countryCode}
                                    onChange={e => setCountryCode(e.target.value)}
                                >
                                    {COUNTRY_CODES.map(c => (
                                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                                    ))}
                                </select>
                                <input className="form-control" type="tel" value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    placeholder="771234567"
                                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Address</label>
                            <div className="input-group">
                                <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                                    <Icon.Mail size={16} color="var(--petal)" />
                                </span>
                                <input className="form-control" type="email" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    style={{ borderLeft: 'none' }} />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Set Password</label>
                        <div className="input-group">
                            <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                                <Icon.Lock size={16} color="var(--petal)" />
                            </span>
                            <input className="form-control" type="password" required value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                placeholder="password"
                                style={{ borderLeft: 'none' }} />
                        </div>
                        <p className="mt-1" style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                            Use at least 8 characters for a secure account.
                        </p>
                    </div>

                    <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></path>
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            <><Icon.PersonAdd size={17} color="white" />Sign Up</>
                        )}
                    </button>
                </form>

                <p className="text-center mt-4" style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
}

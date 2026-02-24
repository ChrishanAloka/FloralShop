import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartSidebar from './CartSidebar';
import NotificationBell from './NotificationBell';
import { Icon } from './Icons';
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="floral-navbar">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100">

            {/* Brand */}
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ textDecoration: 'none' }}>
              <img src={Logo} alt="Bloom & Petal Logo" style={{ height: '36px', width: 'auto' }} />
              Bloom & Petal
            </Link>

            {/* Desktop nav links */}
            <ul className="navbar-nav d-none d-lg-flex flex-row me-auto ms-4 mb-0 gap-1">
              <li className="nav-item"><NavLink className="nav-link" to="/shop">Shop</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/custom-bouquet">Custom Bouquet</NavLink></li>
            </ul>

            {/* Right controls */}
            <div className="d-flex align-items-center gap-2">
              {user && <NotificationBell />}
              {/* Cart button */}
              <button
                className="nav-icon-btn position-relative"
                onClick={() => setShowCart(true)}
                aria-label="Open cart"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1.5px solid var(--champagne)',
                  background: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-mid)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--champagne)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
              >
                <Icon.BagHeart size={18} />
                {count > 0 && <span className="cart-badge">{count}</span>}
              </button>

              {/* User section */}
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  {/* Profile dropdown */}
                  <div className="dropdown" ref={userMenuRef}>
                    <button
                      className={`toggle border-0 ${userMenuOpen ? 'show' : ''}`}
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'var(--white)', border: '1.5px solid var(--champagne)',
                        borderRadius: '50px', padding: '0.3rem 0.9rem 0.3rem 0.4rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                        color: 'var(--text-dark)', fontSize: '0.85rem', fontWeight: 500,
                      }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--petal)' }} />
                      ) : (
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--rose), var(--petal))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>
                          {user.name[0].toUpperCase()}
                        </span>
                      )}
                      <span className="d-none d-sm-inline">{user.name.split(' ')[0]}</span>
                      <Icon.ChevronDown size={14} color="var(--text-light)" style={{ transform: userMenuOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                    </button>

                    <ul className={`dropdown-menu dropdown-menu-end shadow border-0 ${userMenuOpen ? 'show' : ''}`}
                      style={{
                        display: userMenuOpen ? 'block' : 'none',
                        minWidth: 210, borderRadius: 12, border: '1px solid var(--champagne)',
                        marginTop: 10, position: 'absolute', right: 0
                      }}>
                      <div className="p-3" style={{ borderBottom: '1px solid rgba(212,99,122,0.1)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user.name}</div>
                        {user.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>}
                      </div>

                      {isAdmin && (
                        <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/admin" onClick={() => setUserMenuOpen(false)}><Icon.ShieldCheck size={16} color="var(--text-mid)" />Admin Panel</Link></li>
                      )}
                      <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile" onClick={() => setUserMenuOpen(false)}><Icon.Person size={16} color="var(--text-mid)" />My Profile</Link></li>

                      <li><hr className="dropdown-divider my-1" style={{ opacity: 0.1 }} /></li>

                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => { setUserMenuOpen(false); handleLogout(); }} style={{ color: 'var(--rose-deep)' }}>
                          <Icon.Logout size={16} color="var(--rose-deep)" />
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>

                </div>
              ) : (
                <Link
                  to="/login"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'linear-gradient(135deg, var(--rose), var(--rose-deep))',
                    color: 'white', borderRadius: '50px',
                    padding: '0.45rem 1.1rem', fontSize: '0.85rem', fontWeight: 600,
                    textDecoration: 'none', transition: 'all 0.2s',
                    boxShadow: '0 3px 10px rgba(212,99,122,0.25)',
                  }}
                >
                  <Icon.SignIn size={16} color="white" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="d-lg-none"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ width: 38, height: 38, borderRadius: '50%', border: '1.5px solid var(--champagne)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-mid)' }}
              >
                {menuOpen ? <Icon.X size={18} /> : <Icon.Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="d-lg-none py-3 mt-2" style={{ borderTop: '1px solid var(--champagne)' }}>
              <div className="d-flex flex-column gap-1">
                <NavLink className="nav-link" to="/shop" onClick={() => setMenuOpen(false)}>Shop</NavLink>
                <NavLink className="nav-link" to="/custom-bouquet" onClick={() => setMenuOpen(false)}>Custom Bouquet</NavLink>
                {user && (
                  <NavLink className="nav-link" to="/profile" onClick={() => setMenuOpen(false)}>My Profile</NavLink>
                )}
                {user && (
                  <button
                    className="nav-link text-start border-0 bg-transparent d-flex align-items-center gap-2 mt-1"
                    style={{ color: 'var(--rose)', fontWeight: 600, padding: '0.4rem 0.8rem' }}
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                  >
                    <Icon.Logout size={16} color="var(--rose)" />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartSidebar show={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import CartSidebar from './CartSidebar';
import { Icon } from './Icons';
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle border-0"
                      data-bs-toggle="dropdown"
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
                      <Icon.ChevronDown size={14} color="var(--text-light)" />
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end shadow" style={{ minWidth: 210, borderRadius: 12, border: '1px solid var(--champagne)', marginTop: 6 }}>
                      <li className="px-3 py-2" style={{ borderBottom: '1px solid var(--champagne)' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>{user.name}</div>
                        {user.email && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{user.email}</div>}
                        {user.phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{user.phone}</div>}
                      </li>
                      {isAdmin ? (
                        <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/admin"><Icon.ShieldCheck size={16} color="var(--text-mid)" />Admin Panel</Link></li>
                      ) : (
                        <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to="/profile"><Icon.BagCheck size={16} color="var(--text-mid)" />My Orders</Link></li>
                      )}
                      <li><hr className="dropdown-divider my-1" /></li>
                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={handleLogout} style={{ color: 'var(--rose-deep)' }}>
                          <Icon.Logout size={16} color="var(--rose-deep)" />
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Standalone logout button — always visible for customers on desktop */}
                  {!isAdmin && (
                    <button
                      onClick={handleLogout}
                      title="Sign out"
                      className="d-none d-lg-flex"
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: '1.5px solid #f8d7da', background: 'var(--white)',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s', color: 'var(--rose)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--rose)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--rose)'; e.currentTarget.style.borderColor = '#f8d7da'; }}
                    >
                      <Icon.Logout size={16} />
                    </button>
                  )}
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
                {user && !isAdmin && (
                  <NavLink className="nav-link" to="/profile" onClick={() => setMenuOpen(false)}>My Orders</NavLink>
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
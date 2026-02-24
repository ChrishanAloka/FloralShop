import { Icon } from './Icons';
import Logo from '../../assets/logo.png';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--text-dark)', color: 'rgba(255,255,255,0.7)', padding: '1.5rem 0', textAlign: 'center', marginTop: '0.5rem' }}>
            <div className="container">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                    <img src={Logo} alt="Bloom & Petal Logo" style={{ height: '40px', width: 'auto' }} />
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.4rem',
                        color: 'var(--blush)',
                        fontStyle: 'italic',
                        fontWeight: 600
                    }}>
                        Bloom & Petal
                    </span>
                </div>

                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Crafted with love. Delivered with care.
                </p>

                <div style={{
                    fontSize: '0.78rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '0.5rem',
                    color: 'rgba(255,255,255,0.5)'
                }}>
                    <div>&copy; {new Date().getFullYear()} ideasmart Solutions. All rights reserved.</div>
                    {/* <div style={{ marginTop: '0.4rem', fontStyle: 'italic' }}>
                        All rights reserved for the ideasmart Solutions
                    </div> */}
                </div>
            </div>
        </footer>
    );
}

import { isMobile } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icons';

export default function WhatsAppModal({ show, whatsappUrl, webWhatsappUrl, customerId, token, onClose }) {
  const navigate = useNavigate();
  const mobile = isMobile();

  const handleGoToProfile = () => {
    onClose();
    navigate('/profile');
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(58,37,53,0.45)', backdropFilter: 'blur(4px)', zIndex: 2000 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius)' }}>
          <div className="modal-header" style={{ background: 'var(--blush-light)', borderRadius: 'var(--radius) var(--radius) 0 0', border: 'none', padding: '1.2rem 1.5rem' }}>
            {/* Checkmark illustration */}
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #d4edda, #c3e6cb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.CheckCircle size={22} color="#155724" />
              </div>
              <div>
                <h5 className="modal-title mb-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', fontSize: '1.25rem' }}>
                  Order Created!
                </h5>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Now send it to us via WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="modal-body p-4">
            {mobile ? (
              <a href={whatsappUrl} className="whatsapp-option" target="_blank" rel="noreferrer">
                <Icon.WhatsApp size={40} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.95rem' }}>Open WhatsApp</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Tap to send your order now</div>
                </div>
                <Icon.ArrowRight size={18} color="var(--text-light)" style={{ marginLeft: 'auto' }} />
              </a>
            ) : (
              <>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-mid)', marginBottom: '1rem' }}>
                  How would you like to send your order?
                </p>
                <a href={webWhatsappUrl} className="whatsapp-option" target="_blank" rel="noreferrer">
                  <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.Globe size={28} color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.92rem' }}>Web WhatsApp</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-light)' }}>Open in your browser</div>
                  </div>
                  <Icon.ArrowRight size={16} color="var(--text-light)" style={{ marginLeft: 'auto' }} />
                </a>
                <a href={whatsappUrl} className="whatsapp-option" target="_blank" rel="noreferrer">
                  <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.Desktop size={28} color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.92rem' }}>WhatsApp Desktop</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-light)' }}>Open in the desktop app</div>
                  </div>
                  <Icon.ArrowRight size={16} color="var(--text-light)" style={{ marginLeft: 'auto' }} />
                </a>
              </>
            )}

            <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.8rem', margin: '1rem 0' }}>— or —</div>

            <button className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleGoToProfile}>
              <Icon.BagCheck size={18} color="var(--rose)" />
              View My Order in Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
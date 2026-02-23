import { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Icon } from '../common/Icons';

export default function AdminSettings() {
    const { currencyCode, currencySymbol, updateConfig } = useConfig();
    const [form, setForm] = useState({
        currencyCode: currencyCode || 'USD',
        currencySymbol: currencySymbol || '$'
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        const result = await updateConfig(form);

        if (result.success) {
            setMessage({ text: 'Settings updated successfully!', type: 'success' });
        } else {
            setMessage({ text: result.message, type: 'danger' });
        }
        setSaving(false);
    };

    return (
        <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Icon.ShieldCheck size={22} color="var(--rose)" />
                Store Settings
            </h4>

            <div className="row">
                <div className="col-lg-6">
                    <div className="bloom-card p-4">
                        <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Currency Configuration</h5>

                        {message.text && (
                            <div className={`alert alert-${message.type} py-2 px-3 mb-3`} style={{ fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Currency Code (ISO)</label>
                                <input
                                    className="form-control"
                                    value={form.currencyCode}
                                    onChange={e => setForm({ ...form, currencyCode: e.target.value.toUpperCase() })}
                                    placeholder="e.g. LKR, USD, EUR"
                                    maxLength={3}
                                    required
                                />
                                <div className="form-text" style={{ fontSize: '0.75rem' }}>Standard 3-letter currency code</div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Currency Symbol</label>
                                <input
                                    className="form-control"
                                    value={form.currencySymbol}
                                    onChange={e => setForm({ ...form, currencySymbol: e.target.value })}
                                    placeholder="e.g. Rs., $, €"
                                    required
                                />
                                <div className="form-text" style={{ fontSize: '0.75rem' }}>Displayed next to prices</div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                                disabled={saving}
                                style={{ minWidth: 140 }}
                            >
                                {saving ? (
                                    <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" /></path></svg>Saving...</>
                                ) : (
                                    <><Icon.Check size={18} color="white" /> Save Settings</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="bloom-card p-4 h-100" style={{ background: 'var(--blush-light)' }}>
                        <h5 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', fontSize: '1.1rem' }}>Preview</h5>
                        <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>This is how your prices will appear across the store:</p>

                        <div className="d-flex flex-column gap-3 mt-4">
                            <div className="p-3 bg-white rounded-3 shadow-sm d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '0.9rem' }}>Rose Bouquet</span>
                                <span style={{ fontWeight: 700, color: 'var(--rose)', fontSize: '1.1rem' }}>
                                    {form.currencySymbol}1,500.00
                                </span>
                            </div>
                            <div className="p-3 bg-white rounded-3 shadow-sm d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '0.9rem' }}>Lily Stem</span>
                                <span style={{ fontWeight: 700, color: 'var(--rose)', fontSize: '1.1rem' }}>
                                    {form.currencySymbol}150.00
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(58,37,53,0.05)', border: '1px dashed var(--petal)' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <Icon.Info size={16} color="var(--rose)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pro Tip</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', margin: 0 }}>
                                Changing the currency symbol only affects the display. Make sure the symbol matches your actual pricing value!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

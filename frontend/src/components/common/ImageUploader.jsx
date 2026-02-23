import { useState, useRef, useEffect, useCallback } from 'react';
import { uploadService } from '../../services/uploadService';
import { Icon } from './Icons';

// ─── Animated spinner ─────────────────────────────────────────────────────────
function Spin({ size = 22, color = 'var(--rose)' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.85s" repeatCount="indefinite" />
            </path>
        </svg>
    );
}

// ─── Drive image browser modal ────────────────────────────────────────────────
function DriveBrowser({ onSelect, onClose }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        uploadService.listImages()
            .then(res => setImages(res.data))
            .catch(() => setError('Could not load images — check your Drive connection.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        // Backdrop — click outside to close
        <div
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0, zIndex: 3000,
                background: 'rgba(30,18,28,0.6)', backdropFilter: 'blur(5px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
            }}
        >
            <div style={{
                background: 'white', borderRadius: 16, overflow: 'hidden',
                width: '100%', maxWidth: 680, maxHeight: '88vh',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '1rem 1.4rem', background: 'var(--blush-light)',
                    borderBottom: '1px solid var(--champagne)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <Icon.Google size={22} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                                MyFlowers Drive Folder
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                                Click any image to use it as the product photo
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: '1.5px solid var(--champagne)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                        <Icon.X size={15} color="var(--text-mid)" />
                    </button>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240, gap: '0.8rem' }}>
                            <Spin size={32} />
                            <span style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>Loading from Google Drive…</span>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#dc3545', fontSize: '0.85rem' }}>
                            <Icon.Warning size={28} color="#dc3545" style={{ marginBottom: '0.6rem' }} />
                            <p style={{ margin: 0 }}>{error}</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-light)' }}>
                            {/* Empty folder illustration */}
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ marginBottom: '1rem', opacity: 0.4 }}>
                                <rect x="4" y="20" width="56" height="36" rx="5" fill="#f5c6d0" />
                                <path d="M4 28h56" stroke="#d4637a" strokeWidth="1.5" />
                                <path d="M4 22 Q4 20 8 20 L26 20 L30 24 L56 24 Q60 24 60 28 L4 28z" fill="#e8a0b0" />
                            </svg>
                            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '0 0 0.4rem' }}>Folder is empty</p>
                            <p style={{ fontSize: '0.8rem', margin: 0 }}>Upload an image first using the upload box above</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                                {images.length} image{images.length !== 1 ? 's' : ''} in your Drive folder
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                                {images.map(img => (
                                    <button
                                        key={img.fileId}
                                        type="button"
                                        onClick={() => onSelect(img)}
                                        style={{
                                            border: '2px solid var(--champagne)', borderRadius: 10, overflow: 'hidden',
                                            cursor: 'pointer', background: 'none', padding: 0,
                                            transition: 'all 0.18s', textAlign: 'left',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--rose)';
                                            e.currentTarget.style.transform = 'scale(1.04)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,99,122,0.25)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--champagne)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <img
                                            src={img.thumbnailUrl || img.imageUrl}
                                            alt={img.name}
                                            style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                                            onError={e => e.target.src = `https://placehold.co/150x130/fdeef2/d4637a?text=img`}
                                        />
                                        <div style={{ padding: '0.5rem 0.6rem', background: 'white' }}>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-mid)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                                {img.name}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main ImageUploader component ────────────────────────────────────────────
// Props:
//   value     — current imageUrl string (Drive direct URL)
//   fileId    — current Drive file ID (for deletion)
//   onChange  — called with { imageUrl, fileId } when image changes
export function ImageUploader({ value, fileId, onChange, label = 'Product Image' }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);
    const [showBrowser, setShowBrowser] = useState(false);
    const [hoveringPreview, setHoveringPreview] = useState(false);
    const inputRef = useRef();

    const processFile = useCallback(async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please choose an image file (JPEG, PNG, WEBP, GIF)'); return; }
        if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
        setError('');
        setUploading(true);
        setProgress(0);
        try {
            const res = await uploadService.uploadImage(file, p => setProgress(p));
            onChange({ imageUrl: res.data.imageUrl, fileId: res.data.fileId });
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed — check your Drive connection');
        } finally { setUploading(false); setProgress(0); }
    }, [onChange]);

    const onDrop = useCallback(e => {
        e.preventDefault(); setDragging(false);
        processFile(e.dataTransfer.files[0]);
    }, [processFile]);

    const onDragOver = e => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    const borderColor = dragging ? 'var(--rose)' : value ? 'var(--petal)' : 'var(--champagne)';
    const bgColor = dragging ? 'var(--blush-light)' : 'var(--white)';

    return (
        <div>
            {/* Label */}
            <label className="form-label fw-semibold" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
                {label}
            </label>

            {/* Drop zone / preview */}
            <div
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => !uploading && !value && inputRef.current?.click()}
                style={{
                    border: `2px dashed ${borderColor}`,
                    borderRadius: 12,
                    background: bgColor,
                    overflow: 'hidden',
                    cursor: uploading || value ? 'default' : 'pointer',
                    transition: 'border-color 0.18s, background 0.18s',
                    minHeight: 160,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {uploading ? (
                    /* ── Upload progress ── */
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <Spin size={40} />
                        <p style={{ margin: '0.9rem 0 0.3rem', color: 'var(--text-mid)', fontWeight: 500, fontSize: '0.88rem' }}>
                            Uploading to Google Drive…
                        </p>
                        {/* Progress bar */}
                        <div style={{ width: 200, height: 5, background: 'var(--champagne)', borderRadius: 3, margin: '0.7rem auto 0', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 3,
                                background: 'linear-gradient(90deg, var(--rose), var(--petal))',
                                width: `${progress}%`, transition: 'width 0.15s',
                            }} />
                        </div>
                        <p style={{ margin: '0.3rem 0 0', color: 'var(--text-light)', fontSize: '0.75rem' }}>{progress}%</p>
                    </div>
                ) : value ? (
                    /* ── Image preview ── */
                    <div
                        style={{ width: '100%', position: 'relative' }}
                        onMouseEnter={() => setHoveringPreview(true)}
                        onMouseLeave={() => setHoveringPreview(false)}
                    >
                        <img src={value} alt="Product" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                            onError={e => e.target.src = 'https://placehold.co/400x200/fdeef2/d4637a?text=Image'}
                        />
                        {/* Drive badge */}
                        <div style={{
                            position: 'absolute', top: 8, left: 8,
                            background: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '3px 8px',
                            fontSize: '0.68rem', fontWeight: 600, color: '#444',
                            display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                            <Icon.Google size={11} /> Saved to Drive
                        </div>
                        {/* Hover overlay with replace / remove buttons */}
                        {hoveringPreview && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(30,18,28,0.52)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                            }}>
                                <button type="button" onClick={() => inputRef.current?.click()} style={{
                                    background: 'white', border: 'none', borderRadius: 8,
                                    padding: '0.5rem 1.1rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round">
                                        <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                    </svg>
                                    Replace image
                                </button>
                                <button type="button" onClick={e => { e.stopPropagation(); onChange({ imageUrl: '', fileId: null }); }} style={{
                                    background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: 8,
                                    padding: '0.35rem 0.8rem', fontSize: '0.78rem', color: '#dc3545', cursor: 'pointer',
                                }}>
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── Empty drop zone ── */
                    <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--petal)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.8rem', opacity: 0.75 }}>
                            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                        </svg>
                        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-mid)' }}>
                            Drop image here, or click to select
                        </p>
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                            Uploads directly to your Google Drive folder · JPEG, PNG, WEBP · max 10MB
                        </p>
                    </div>
                )}
            </div>

            {/* Action buttons row */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                {/* Upload button */}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.45rem 0.8rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                        background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', color: 'var(--text-mid)',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--champagne)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    Upload new
                </button>

                {/* Browse Drive button */}
                <button
                    type="button"
                    onClick={() => setShowBrowser(true)}
                    disabled={uploading}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.45rem 0.8rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                        background: 'white', border: '1.5px solid var(--champagne)', color: 'var(--text-mid)',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4285F4'; e.currentTarget.style.color = '#4285F4'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--champagne)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
                >
                    <Icon.Google size={14} />
                    Browse Drive
                </button>

                {/* View in Drive (when image exists) */}
                {value && (
                    <a
                        href={value} target="_blank" rel="noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 36, height: 36, borderRadius: 8, border: '1.5px solid var(--champagne)',
                            color: 'var(--text-light)', flexShrink: 0, textDecoration: 'none',
                        }}
                        title="View in browser"
                    >
                        <Icon.Globe size={15} />
                    </a>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', color: '#dc3545', fontSize: '0.78rem' }}>
                    <Icon.Warning size={13} color="#dc3545" />{error}
                </div>
            )}

            {/* Hidden file input */}
            <input
                ref={inputRef} type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                style={{ display: 'none' }}
                onChange={e => processFile(e.target.files[0])}
            />

            {/* Drive browser modal */}
            {showBrowser && (
                <DriveBrowser
                    onSelect={img => { onChange({ imageUrl: img.imageUrl, fileId: img.fileId }); setShowBrowser(false); }}
                    onClose={() => setShowBrowser(false)}
                />
            )}
        </div>
    );
}
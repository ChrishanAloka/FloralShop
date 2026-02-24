// All icons are hand-crafted inline SVGs — no icon fonts, no image files needed.
// Usage: <Icon.Bag size={20} color="currentColor" />

const svg = (path, viewBox = '0 0 24 24') => ({
    size = 20,
    color = 'currentColor',
    style = {},
    className = '',
}) => (
    <svg
        width={size} height={size} viewBox={viewBox}
        fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ flexShrink: 0, ...style }} className={className}
        aria-hidden="true"
    >
        {path}
    </svg>
);

const svgFill = (path, viewBox = '0 0 24 24') => ({
    size = 20,
    color = 'currentColor',
    style = {},
    className = '',
}) => (
    <svg width={size} height={size} viewBox={viewBox} fill={color} style={{ flexShrink: 0, ...style }} className={className} aria-hidden="true">
        {path}
    </svg>
);

export const Icon = {
    // Shopping bag with heart
    BagHeart: svg(
        <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /><path d="M12 14c-1.5 0-2.5.8-2.5 1.8 0 1.2 1.1 2 2.5 2s2.5-.8 2.5-2c0-1-.9-1.8-2.5-1.8z" strokeWidth="1.5" /></>
    ),
    // Bag with checkmark
    BagCheck: svg(
        <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /><polyline points="9 14 11 16 15 12" /></>
    ),
    // Bag with plus
    BagPlus: svg(
        <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /><line x1="12" y1="13" x2="12" y2="19" /><line x1="9" y1="16" x2="15" y2="16" /></>
    ),
    // Person / user
    Person: svg(
        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>
    ),
    // Person Circle
    PersonCircle: svg(
        <><circle cx="12" cy="12" r="10" /><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.832 2.849" /></>
    ),
    // Person with plus
    PersonAdd: svg(
        <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" /></>
    ),
    // Shield with check (admin)
    ShieldCheck: svg(
        <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>
    ),
    // Arrow right
    ArrowRight: svg(
        <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>
    ),
    // Logout / sign out
    Logout: svg(
        <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>
    ),
    // Search / magnifier
    Search: svg(
        <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>
    ),
    // X close
    X: svg(
        <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
    ),
    // Hamburger menu
    Menu: svg(
        <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
    ),
    // Pencil / edit
    Pencil: svg(
        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
    ),
    Edit: svg(
        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>
    ),
    // Trash / delete
    Trash: svg(
        <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>
    ),
    // Refresh
    Refresh: svg(
        <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>
    ),
    // Check circle
    CheckCircle: svg(
        <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
    ),
    // Phone
    Phone: svg(
        <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.11h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></>
    ),
    // Envelope / mail
    Envelope: svg(
        <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>
    ),
    Mail: svg(
        <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>
    ),
    // Chat / message bubble
    Chat: svg(
        <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>
    ),
    // Lock
    Lock: svg(
        <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
    ),
    // Enter / sign in
    SignIn: svg(
        <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>
    ),
    // Grid (dashboard)
    Grid: svg(
        <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>
    ),
    // Package / box
    Package: svg(
        <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>
    ),
    // Flower / blossom
    Flower: svg(
        <><circle cx="12" cy="12" r="3" /><path d="M12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM12 16a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zM2 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3zM16 12a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3z" /><path d="M5.64 5.64a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zM14.12 14.12a3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24zM5.64 18.36a3 3 0 0 1 0-4.24 3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0zM14.12 9.88a3 3 0 0 1 0-4.24 3 3 0 0 1 4.24 0 3 3 0 0 1 0 4.24 3 3 0 0 1-4.24 0z" /></>
    ),
    // Info circle
    Info: svg(
        <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>
    ),
    // Warning / exclamation
    Warning: svg(
        <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>
    ),
    // Palette / custom bouquet
    Palette: svg(
        <><circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>
    ),
    // Checkmark
    Check: svg(
        <><polyline points="20 6 9 17 4 12" /></>
    ),
    // Star
    Star: svgFill(
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    ),
    // Clock
    Clock: svg(
        <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>
    ),
    // Chevron down
    ChevronDown: svg(
        <polyline points="6 9 12 15 18 9" />
    ),
    // Plus
    Plus: svg(
        <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
    ),
    // Minus
    Minus: svg(
        <line x1="5" y1="12" x2="19" y2="12" />
    ),
    // Cart / shopping cart
    Cart: svg(
        <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>
    ),
    // Leaf / plant
    Leaf: svg(
        <><path d="M2 22c1.25-1.25 2.4-2.4 3.5-3.5C9 15 14 14 17 11c2.5-2.5 4.5-7 5-11-4 .5-8.5 2.5-11 5-3 3-4 8-1 11.5" /><path d="M2 22c1-3 2-6 5-9" /></>
    ),
    // Ribbon / gift
    Gift: svg(
        <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>
    ),
    // WhatsApp logo (filled)
    WhatsApp: ({ size = 24, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={style}>
            <circle cx="16" cy="16" r="16" fill="#25D366" />
            <path d="M23.5 8.5A10.44 10.44 0 0 0 16 5.5a10.5 10.5 0 0 0-9.1 15.72L5.5 26.5l5.42-1.42A10.5 10.5 0 0 0 26.5 16a10.44 10.44 0 0 0-3-7.5zm-7.5 16.16a8.72 8.72 0 0 1-4.44-1.22l-.32-.19-3.22.84.86-3.14-.21-.33A8.74 8.74 0 1 1 16 24.66zm4.8-6.54c-.26-.13-1.55-.77-1.79-.85s-.41-.13-.59.13-.68.85-.83 1-.31.2-.57.07a7.16 7.16 0 0 1-2.1-1.3 7.87 7.87 0 0 1-1.45-1.8c-.15-.26 0-.4.11-.53s.26-.3.39-.46a1.76 1.76 0 0 0 .26-.43.49.49 0 0 0 0-.46c-.07-.13-.59-1.42-.81-1.94s-.42-.44-.59-.45h-.5a1 1 0 0 0-.71.33 3 3 0 0 0-.93 2.23 5.22 5.22 0 0 0 1.09 2.77 11.94 11.94 0 0 0 4.57 4c.64.28 1.14.44 1.52.57a3.67 3.67 0 0 0 1.68.1 2.75 2.75 0 0 0 1.8-1.27 2.22 2.22 0 0 0 .15-1.27c-.06-.11-.24-.18-.5-.31z" fill="white" />
        </svg>
    ),
    // Google logo (coloured)
    Google: ({ size = 20, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    ),
    // Desktop / monitor
    Desktop: svg(
        <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>
    ),
    // Mobile phone
    Mobile: svg(
        <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>
    ),
    // Globe / web
    Globe: svg(
        <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>
    ),
    // Bouquet / flowers bunch (custom)
    Bouquet: ({ size = 80, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
            <ellipse cx="40" cy="56" rx="10" ry="18" fill="#f5c6d0" opacity=".4" />
            <path d="M40 68 Q36 58 38 48 Q40 40 40 40 Q40 40 42 48 Q44 58 40 68z" fill="#d4637a" opacity=".7" />
            {/* roses */}
            <circle cx="40" cy="28" r="10" fill="#e8a0b0" />
            <circle cx="40" cy="28" r="6" fill="#d4637a" />
            <circle cx="40" cy="28" r="3" fill="#b84e64" />
            <circle cx="28" cy="34" r="8" fill="#f5c6d0" />
            <circle cx="28" cy="34" r="4.5" fill="#e8a0b0" />
            <circle cx="28" cy="34" r="2" fill="#d4637a" />
            <circle cx="52" cy="34" r="8" fill="#f5c6d0" />
            <circle cx="52" cy="34" r="4.5" fill="#e8a0b0" />
            <circle cx="52" cy="34" r="2" fill="#d4637a" />
            {/* leaves */}
            <ellipse cx="32" cy="42" rx="5" ry="9" fill="#8fad88" transform="rotate(-30 32 42)" />
            <ellipse cx="48" cy="42" rx="5" ry="9" fill="#8fad88" transform="rotate(30 48 42)" />
        </svg>
    ),
    // Event / celebration
    Event: ({ size = 80, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
            <circle cx="40" cy="40" r="30" fill="#fdeef2" stroke="#f5c6d0" strokeWidth="2" />
            <path d="M25 50 Q40 25 55 50" stroke="#d4637a" strokeWidth="2.5" fill="#fdeef2" />
            <circle cx="32" cy="33" r="7" fill="#e8a0b0" />
            <circle cx="32" cy="33" r="4" fill="#d4637a" />
            <circle cx="48" cy="33" r="7" fill="#f5c6d0" />
            <circle cx="48" cy="33" r="4" fill="#e8a0b0" />
            <circle cx="40" cy="24" r="7" fill="#d4637a" />
            <circle cx="40" cy="24" r="4" fill="#b84e64" />
            <path d="M36 55 Q40 50 44 55 Q40 62 36 55z" fill="#c9a96e" />
        </svg>
    ),
    // Plant / leaf illustration
    Plant: ({ size = 80, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
            <rect x="35" y="50" width="10" height="20" rx="2" fill="#8fad88" />
            <ellipse cx="40" cy="40" rx="18" ry="22" fill="#c8dfc5" />
            <ellipse cx="40" cy="38" rx="13" ry="17" fill="#8fad88" />
            <ellipse cx="40" cy="36" rx="8" ry="12" fill="#6f9068" />
            {/* vein lines */}
            <line x1="40" y1="24" x2="40" y2="52" stroke="#c8dfc5" strokeWidth="1.5" />
            <line x1="40" y1="32" x2="30" y2="40" stroke="#c8dfc5" strokeWidth="1.2" />
            <line x1="40" y1="38" x2="50" y2="44" stroke="#c8dfc5" strokeWidth="1.2" />
        </svg>
    ),
    // Floral supplies / ribbon
    Supplies: ({ size = 80, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
            <rect x="28" y="35" width="24" height="30" rx="3" fill="#f0e6d3" stroke="#c9a96e" strokeWidth="1.5" />
            <rect x="36" y="35" width="8" height="30" fill="#c9a96e" opacity=".4" />
            <path d="M20 38 Q30 30 40 35 Q50 30 60 38" stroke="#d4637a" strokeWidth="2.5" fill="none" />
            <path d="M20 38 Q24 26 40 35 Q56 26 60 38" stroke="#d4637a" strokeWidth="2.5" fill="none" />
            <circle cx="40" cy="35" r="5" fill="#d4637a" />
            <circle cx="40" cy="35" r="2.5" fill="#b84e64" />
        </svg>
    ),
    // Custom palette / paint
    Custom: ({ size = 80, style = {} }) => (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={style}>
            <path d="M40 12C25.6 12 14 23.6 14 38s11.6 26 26 26c2.4 0 4.3-1.9 4.3-4.3 0-1.1-.5-2.2-1.1-2.9-.8-.8-1.1-1.7-1.1-2.9 0-2.4 1.9-4.3 4.3-4.3h5.2c7.9 0 14.4-6.5 14.4-14.4C66 20.5 54.4 12 40 12z" fill="#fdeef2" stroke="#f5c6d0" strokeWidth="1.5" />
            <circle cx="26" cy="32" r="4" fill="#d4637a" />
            <circle cx="34" cy="22" r="4" fill="#e8a0b0" />
            <circle cx="46" cy="20" r="4" fill="#8fad88" />
            <circle cx="54" cy="28" r="4" fill="#c9a96e" />
            <circle cx="56" cy="40" r="4" fill="#f5c6d0" />
        </svg>
    ),
};

export default Icon;
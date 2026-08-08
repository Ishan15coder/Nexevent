import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); setMobileOpen(false); };

    return (
        <header
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: scrolled ? 'rgba(12,16,21,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}
        >
            <nav className="container-app" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '32px' }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                    {/* Wordmark with teal underline trick */}
                    <div style={{ position: 'relative' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#F8FAFC' }}>
                            Nex<span style={{ color: '#FF4D6D' }}>Event</span>
                        </span>
                        <div style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #7C3AED, #FF4D6D)', borderRadius: '1px', transform: 'scaleX(0.45)', transformOrigin: 'left', transition: 'transform 0.3s ease' }} />
                    </div>
                </Link>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Desktop nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link to="/"
                        style={{
                            padding: '6px 14px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500,
                            color: location.pathname === '/' ? '#FF4D6D' : 'rgba(248,250,252,0.65)',
                            background: location.pathname === '/' ? 'rgba(255,77,109,0.1)' : 'transparent',
                            textDecoration: 'none', transition: 'all 0.2s', border: 'none',
                        }}
                    >
                        Events
                    </Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                style={{
                                    padding: '6px 14px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 500,
                                    color: 'rgba(248,250,252,0.65)', textDecoration: 'none', transition: 'color 0.2s',
                                }}
                            >
                                Dashboard
                            </Link>

                            {/* User chip */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '5px 12px 5px 8px', borderRadius: '999px',
                                background: '#131322', border: '1px solid rgba(255,255,255,0.08)',
                            }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #7C3AED, #FF4D6D)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 800, color: '#FFFFFF', flexShrink: 0,
                                }}>
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F8FAFC', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </span>
                                {user.role === 'admin' && (
                                    <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#FF4D6D', color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                        Admin
                                    </span>
                                )}
                            </div>

                            <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ marginLeft: '4px' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                            <Link to="/register" className="btn btn-teal btn-sm">Get started</Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        display: 'none', padding: '8px', borderRadius: '6px', border: 'none',
                        background: 'rgba(255,255,255,0.05)', color: '#F0FDFA', cursor: 'pointer',
                    }}
                    className="mobile-toggle"
                    aria-label="Menu"
                >
                    <span style={{ display: 'block', width: '18px', height: '2px', background: mobileOpen ? 'transparent' : '#F0FDFA', marginBottom: '4px', transition: 'all 0.2s' }} />
                    <span style={{ display: 'block', width: '18px', height: '2px', background: '#14B8A6', marginBottom: '4px' }} />
                    <span style={{ display: 'block', width: mobileOpen ? '12px' : '18px', height: '2px', background: '#F0FDFA', transition: 'width 0.2s' }} />
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    background: '#111921', borderTop: '1px solid rgba(255,255,255,0.06)',
                    padding: '20px 24px', animation: 'fadeUp 0.2s ease',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/" onClick={() => setMobileOpen(false)} style={{ color: '#F0FDFA', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600 }}>Events</Link>
                        {user ? (
                            <>
                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} style={{ color: 'rgba(240,253,250,0.6)', textDecoration: 'none', fontSize: '0.9375rem' }}>Dashboard</Link>
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                                <span style={{ color: '#5EEAD4', fontSize: '0.875rem' }}>Signed in as <strong style={{ color: '#F0FDFA' }}>{user.name}</strong></span>
                                <button onClick={handleLogout} className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost">Sign in</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-teal">Get started</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .mobile-toggle { display: block !important; }
                    nav > *:not(:first-child):not(.mobile-toggle) { display: none !important; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
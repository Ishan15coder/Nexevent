import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

/* ── OTP Modal (for unverified accounts) ──────────────────────── */
const OtpModal = ({ email, onClose }) => {
    const { verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            await verifyOtp(email, otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP. Try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                        <FaShieldAlt className="teal-text" size={20} />
                    </div>
                    <h3 className="heading-sm" style={{ marginBottom: '4px' }}>2FA Security Verification</h3>
                    <p className="muted" style={{ fontSize: '0.8125rem' }}>Code sent to <strong style={{ color: '#F0FDFA' }}>{email}</strong></p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text" maxLength={6} value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="input" style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.4em' }}
                        placeholder="000000" autoFocus required
                    />
                    {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" disabled={loading || otp.length < 6} className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                        {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
                </form>
            </div>
        </div>
    );
};

/* ── Login Page Component ─────────────────────────────────────── */
const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const data = await login(form.email, form.password);
            navigate(data.role === 'admin' ? '/admin' : '/');
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed.';
            if (msg.toLowerCase().includes('not verified') || msg.toLowerCase().includes('otp')) {
                setOtpEmail(form.email);
            } else {
                setError(msg);
            }
        } finally { setLoading(false); }
    };

    return (
        <>
            {otpEmail && <OtpModal email={otpEmail} onClose={() => setOtpEmail('')} />}

            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 24px 48px 24px' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#F0FDFA' }}>
                                Nex<span style={{ color: '#14B8A6' }}>Event</span>
                            </span>
                        </Link>
                        <h1 className="heading" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Welcome back</h1>
                        <p className="muted" style={{ fontSize: '0.875rem' }}>Sign in to manage your bookings and events</p>
                    </div>

                    <div className="surface-1" style={{ padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email" name="email" value={form.email} onChange={handleChange}
                                        className="input" placeholder="name@company.com" required
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <FaEnvelope style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(240,253,250,0.3)', fontSize: '14px' }} />
                                </div>
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                        className="input" placeholder="••••••••" required
                                        style={{ paddingLeft: '40px', paddingRight: '40px' }}
                                    />
                                    <FaLock style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(240,253,250,0.3)', fontSize: '14px' }} />
                                    <button
                                        type="button" onClick={() => setShowPw(!showPw)}
                                        style={{ position: 'absolute', right: '14px', top: '14px', background: 'none', border: 'none', color: 'rgba(240,253,250,0.4)', cursor: 'pointer' }}
                                    >
                                        {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div style={{ padding: '12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '0.8125rem', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn btn-teal btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                                {loading ? 'Signing in...' : <>Sign In <FaArrowRight size={12} /></>}
                            </button>
                        </form>

                        <div className="divider" />

                        <p className="muted" style={{ textAlign: 'center', fontSize: '0.8125rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#5EEAD4', textDecoration: 'none', fontWeight: 600 }}>Create one free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;

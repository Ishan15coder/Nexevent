import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

/* ── OTP Verification Step ────────────────────────────────────── */
const OtpStep = ({ email, onBack }) => {
    const { verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendMsg, setResendMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setResendMsg(''); setLoading(true);
        try {
            await verifyOtp(email, otp);
            setDone(true);
            setTimeout(() => navigate('/'), 1200);
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid OTP code.');
        } finally { setLoading(false); }
    };

    const handleResend = async () => {
        setError(''); setResendMsg(''); setResending(true);
        try {
            const data = await resendOtp(email);
            setResendMsg(data.message || 'OTP resent! Please check your inbox and Spam folder.');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP.');
        } finally { setResending(false); }
    };

    return (
        <div className="surface-1" style={{ padding: '32px', borderRadius: '16px', border: '1px solid rgba(20,184,166,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <FaShieldAlt className="teal-text" size={20} />
                </div>
                <h2 className="heading-sm" style={{ marginBottom: '4px' }}>Verify Email OTP</h2>
                <p className="muted" style={{ fontSize: '0.8125rem' }}>We sent a 6-digit code to <strong style={{ color: '#F0FDFA' }}>{email}</strong></p>
                <p style={{ fontSize: '0.75rem', color: '#5EEAD4', marginTop: '6px', opacity: 0.9 }}>
                    💡 Please check your <strong>Inbox</strong> & <strong>Spam / Junk folder</strong>.
                </p>
            </div>

            {done ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <FaCheckCircle className="teal-text" size={48} style={{ marginBottom: '12px' }} />
                    <h3 className="heading-sm" style={{ color: '#5EEAD4' }}>Account Verified!</h3>
                    <p className="muted" style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Redirecting to home page...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label className="label" style={{ display: 'block', marginBottom: '8px', textAlign: 'center' }}>Enter 6-Digit Code</label>
                        <input
                            type="text" maxLength={6} value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="input" style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.4em' }}
                            placeholder="000000" autoFocus required
                        />
                    </div>
                    {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}
                    {resendMsg && <p style={{ color: '#5EEAD4', fontSize: '0.75rem', textAlign: 'center' }}>{resendMsg}</p>}
                    <button type="submit" disabled={loading || otp.length < 6} className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm">← Back to Form</button>
                        <button type="button" onClick={handleResend} disabled={resending} className="btn btn-ghost btn-sm" style={{ color: '#5EEAD4' }}>
                            {resending ? 'Sending...' : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

/* ── Password Strength helper ─────────────────────────────────── */
const strengthOf = (p) => {
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', pct: '25%' };
    if (p.length < 8) return { label: 'Fair', color: '#f59e0b', pct: '50%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#14B8A6', pct: '100%' };
    return { label: 'Good', color: '#5EEAD4', pct: '75%' };
};

/* ── Register Page Component ──────────────────────────────────── */
const Register = () => {
    const { register } = useContext(AuthContext);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('');
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            setOtpStep(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally { setLoading(false); }
    };

    const str = strengthOf(form.password);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 24px 48px 24px' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#F0FDFA' }}>
                            Nex<span style={{ color: '#14B8A6' }}>Event</span>
                        </span>
                    </Link>
                    <h1 className="heading" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>Create an account</h1>
                    <p className="muted" style={{ fontSize: '0.875rem' }}>Join NexEvent to book tickets & manage events</p>
                </div>

                {otpStep ? (
                    <OtpStep email={form.email} onBack={() => setOtpStep(false)} />
                ) : (
                    <div className="surface-1" style={{ padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text" name="name" value={form.name} onChange={handleChange}
                                        className="input" placeholder="Alex Morgan" required
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <FaUser style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(240,253,250,0.3)', fontSize: '14px' }} />
                                </div>
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="email" name="email" value={form.email} onChange={handleChange}
                                        className="input" placeholder="alex@company.com" required
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
                                {str && (
                                    <div style={{ marginTop: '8px' }}>
                                        <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: str.pct, background: str.color, transition: 'all 0.3s' }} />
                                        </div>
                                        <span style={{ fontSize: '0.6875rem', color: str.color, fontWeight: 600 }}>{str.label}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="password" name="confirm" value={form.confirm} onChange={handleChange}
                                        className="input" placeholder="••••••••" required
                                        style={{ paddingLeft: '40px' }}
                                    />
                                    <FaLock style={{ position: 'absolute', left: '14px', top: '14px', color: 'rgba(240,253,250,0.3)', fontSize: '14px' }} />
                                </div>
                            </div>

                            {error && (
                                <div style={{ padding: '12px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '0.8125rem', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn btn-teal btn-lg" style={{ width: '100%', marginTop: '8px' }}>
                                {loading ? 'Creating Account...' : <>Register Account <FaArrowRight size={12} /></>}
                            </button>
                        </form>

                        <div className="divider" />

                        <p className="muted" style={{ textAlign: 'center', fontSize: '0.8125rem' }}>
                            Already registered?{' '}
                            <Link to="/login" style={{ color: '#5EEAD4', textDecoration: 'none', fontWeight: 600 }}>Sign in here</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;

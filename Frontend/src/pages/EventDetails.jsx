import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext.jsx';
import {
    FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowLeft,
    FaEnvelope, FaShieldAlt, FaCheckCircle, FaTimesCircle,
    FaClock, FaTag, FaTicketAlt
} from 'react-icons/fa';

/* ── Booking Modal Component ──────────────────────────────────── */
const BookingModal = ({ event, onClose, onSuccess }) => {
    const [step, setStep] = useState('confirm'); // confirm | otp | done
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const sendOtp = async () => {
        setLoading(true); setError('');
        try {
            await api.post('/bookings/send-otp', { eventId: event._id });
            setStep('otp');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally { setLoading(false); }
    };

    const confirmBooking = async () => {
        setLoading(true); setError('');
        try {
            const { data } = await api.post('/bookings', { eventId: event._id, otp });
            setStep('done');
            setTimeout(() => { onSuccess(data.booking); onClose(); }, 1800);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                {step === 'confirm' && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                <FaTicketAlt className="teal-text" size={20} />
                            </div>
                            <h3 className="heading-sm" style={{ marginBottom: '4px' }}>Confirm Ticket Booking</h3>
                            <p className="muted" style={{ fontSize: '0.8125rem' }}>{event.title}</p>
                        </div>

                        <div className="surface-2" style={{ padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                                <span className="muted">Ticket Price</span>
                                <strong style={{ color: '#F0FDFA' }}>{event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'FREE'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <span className="muted">Seats Remaining</span>
                                <span style={{ color: '#5EEAD4', fontWeight: 600 }}>{event.availableSeats}</span>
                            </div>
                        </div>

                        <p className="muted" style={{ fontSize: '0.75rem', textAlign: 'center', marginBottom: '20px' }}>
                            An OTP email will be sent to your account to confirm booking authorization.
                        </p>

                        {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={sendOtp} disabled={loading} className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                                {loading ? 'Sending OTP...' : <><FaEnvelope size={12} /> Request OTP & Continue</>}
                            </button>
                            <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
                        </div>
                    </>
                )}

                {step === 'otp' && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                                <FaShieldAlt className="teal-text" size={20} />
                            </div>
                            <h3 className="heading-sm" style={{ marginBottom: '4px' }}>Enter 6-Digit OTP</h3>
                            <p className="muted" style={{ fontSize: '0.8125rem' }}>Check your email inbox</p>
                        </div>

                        <input
                            type="text" maxLength={6} value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="input" style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.4em', marginBottom: '16px' }}
                            placeholder="000000" autoFocus
                        />

                        {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button onClick={confirmBooking} disabled={loading || otp.length < 6} className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                                {loading ? 'Confirming...' : 'Finalize Ticket Booking'}
                            </button>
                            <button onClick={() => setStep('confirm')} className="btn btn-ghost btn-sm">← Back</button>
                        </div>
                    </>
                )}

                {step === 'done' && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <FaCheckCircle className="teal-text" size={48} style={{ marginBottom: '16px' }} />
                        <h3 className="heading-sm" style={{ marginBottom: '8px' }}>Booking Request Sent!</h3>
                        <p className="muted" style={{ fontSize: '0.8125rem' }}>Pending admin manual confirmation.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Event Details Page Component ─────────────────────────────── */
const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [booked, setBooked] = useState(false);

    useEffect(() => { fetchEvent(); }, [id]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/events/${id}`);
            setEvent(data);
        } catch { setError('Event not found or failed to load.'); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#14B8A6', borderRadius: '50%' }} className="animate-spin" />
        </div>
    );

    if (error || !event) return (
        <div className="container-app" style={{ paddingTop: '120px', textAlign: 'center' }}>
            <FaTimesCircle style={{ color: '#ef4444', fontSize: '48px', marginBottom: '16px' }} />
            <h2 className="heading" style={{ marginBottom: '16px' }}>{error || 'Event Not Found'}</h2>
            <button onClick={() => navigate('/')} className="btn btn-outline">← Back to Catalog</button>
        </div>
    );

    const dateObj = new Date(event.date);
    const isPast = dateObj < new Date();
    const isFull = event.availableSeats <= 0;
    const isPaid = event.ticketPrice > 0;
    const pct = Math.max(5, (event.availableSeats / event.totalSeats) * 100);

    return (
        <>
            {showModal && <BookingModal event={event} onClose={() => setShowModal(false)} onSuccess={() => setBooked(true)} />}

            <div style={{ paddingTop: '80px', paddingBottom: '96px' }}>

                {/* Event Hero Banner */}
                <section style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '48px' }}>
                    <div className="container-app">
                        <button onClick={() => navigate('/')} className="btn btn-ghost btn-sm" style={{ marginBottom: '24px' }}>
                            <FaArrowLeft size={11} /> Back to events
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                    <span className="tag tag-teal">{event.category}</span>
                                    {isPaid ? <span className="tag tag-white">₹{event.ticketPrice}</span> : <span className="tag tag-free">FREE</span>}
                                    {isFull && <span className="tag tag-red">Sold Out</span>}
                                    {isPast && <span className="tag tag-amber">Concluded</span>}
                                </div>

                                <h1 className="display-sm" style={{ marginBottom: '20px' }}>{event.title}</h1>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'rgba(240,253,250,0.7)', fontSize: '0.9375rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaCalendarAlt className="teal-text" size={14} />
                                        {dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaMapMarkerAlt className="teal-text" size={14} /> {event.location}
                                    </span>
                                </div>
                            </div>

                            <div style={{ height: '320px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={e => { e.target.src = `https://placehold.co/800x600/111921/5EEAD4?text=${encodeURIComponent(event.title)}`; }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Event Details & Booking Column */}
                <section style={{ paddingTop: '48px' }}>
                    <div className="container-app">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>

                            {/* Main Content */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <h3 className="heading-sm" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="teal-bar" /> Event Description
                                </h3>
                                <p className="muted" style={{ fontSize: '1rem', lineHeight: 1.8, whitespace: 'pre-line', marginBottom: '40px' }}>
                                    {event.description}
                                </p>

                                <h3 className="heading-sm" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="teal-bar" /> Specifications
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                    {[
                                        { label: 'Date & Time', val: dateObj.toLocaleString('en-IN'), icon: <FaClock /> },
                                        { label: 'Location', val: event.location, icon: <FaMapMarkerAlt /> },
                                        { label: 'Category', val: event.category, icon: <FaTag /> },
                                        { label: 'Total Capacity', val: `${event.totalSeats} seats`, icon: <FaUsers /> },
                                    ].map((item, idx) => (
                                        <div key={idx} className="surface-1" style={{ padding: '16px', borderRadius: '8px' }}>
                                            <span className="teal-text" style={{ fontSize: '14px', display: 'block', marginBottom: '6px' }}>{item.icon}</span>
                                            <span className="label" style={{ fontSize: '0.625rem', display: 'block', marginBottom: '2px' }}>{item.label}</span>
                                            <strong style={{ fontSize: '0.875rem', color: '#F0FDFA' }}>{item.val}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Card Box */}
                            <div>
                                <div className="surface-2" style={{ padding: '32px', borderRadius: '16px', position: 'sticky', top: '96px', border: '1px solid rgba(20,184,166,0.2)' }}>
                                    <span className="label" style={{ display: 'block', marginBottom: '8px' }}>Ticket Price</span>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F0FDFA', marginBottom: '20px' }}>
                                        {isPaid ? `₹${event.ticketPrice}` : <span className="teal-text">FREE</span>}
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                                            <span className="muted">Available Seats</span>
                                            <strong style={{ color: isFull ? '#fca5a5' : '#5EEAD4' }}>{event.availableSeats} of {event.totalSeats}</strong>
                                        </div>
                                        <div className="seat-bar-track">
                                            <div className={`seat-bar-fill ${isFull ? 'full' : ''}`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>

                                    {booked ? (
                                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                            <FaCheckCircle className="teal-text" size={32} style={{ marginBottom: '8px' }} />
                                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#5EEAD4' }}>Booking Submitted!</p>
                                            <p className="muted" style={{ fontSize: '0.75rem', marginBottom: '16px' }}>Pending manual admin approval</p>
                                            <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ width: '100%' }}>View In Dashboard</Link>
                                        </div>
                                    ) : !user ? (
                                        <Link to="/login" className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                                            Sign In to Reserve Ticket
                                        </Link>
                                    ) : isPast ? (
                                        <button disabled className="btn btn-ghost btn-lg" style={{ width: '100%' }}>Event Concluded</button>
                                    ) : isFull ? (
                                        <button disabled className="btn btn-ghost btn-lg" style={{ width: '100%' }}>Sold Out</button>
                                    ) : (
                                        <button onClick={() => setShowModal(true)} className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                                            Reserve Ticket Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default EventDetails;

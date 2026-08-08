import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaTimesCircle, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

/* ── Cancel Confirm Modal ─────────────────────────────────────── */
const CancelModal = ({ booking, onConfirm, onClose }) => {
    const [loading, setLoading] = useState(false);
    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ textAlign: 'center' }}>
                <FaTimesCircle style={{ color: '#ef4444', fontSize: '40px', marginBottom: '16px' }} />
                <h3 className="heading-sm" style={{ marginBottom: '8px' }}>Cancel Ticket Booking?</h3>
                <p className="muted" style={{ fontSize: '0.8125rem', marginBottom: '24px' }}>
                    Cancel booking for <strong style={{ color: '#F0FDFA' }}>{booking.eventId?.title || 'this event'}</strong>?
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Keep Ticket</button>
                    <button onClick={async () => { setLoading(true); await onConfirm(booking._id); setLoading(false); }} disabled={loading} className="btn btn-teal" style={{ flex: 1, background: '#ef4444', color: '#fff' }}>
                        {loading ? 'Cancelling...' : 'Confirm Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── User Dashboard Component ─────────────────────────────────── */
const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelTarget, setCancelTarget] = useState(null);

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        setLoading(true); setError('');
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch { setError('Failed to fetch your bookings.'); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            setCancelTarget(null);
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel booking.');
            setCancelTarget(null);
        }
    };

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        pending: bookings.filter(b => b.status === 'pending').length,
    };

    return (
        <>
            {cancelTarget && <CancelModal booking={cancelTarget} onConfirm={handleCancel} onClose={() => setCancelTarget(null)} />}

            <div style={{ paddingTop: '96px', paddingBottom: '96px' }}>
                <div className="container-app">
                    
                    {/* Header */}
                    <div style={{ marginBottom: '36px' }}>
                        <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Personal Dashboard</span>
                        <h1 className="heading" style={{ fontSize: '2rem' }}>My Ticket Bookings</h1>
                        <p className="muted" style={{ fontSize: '0.875rem' }}>{user?.email}</p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Total Bookings</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F0FDFA' }}>{stats.total}</span>
                        </div>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #14B8A6' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Confirmed</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#5EEAD4' }}>{stats.confirmed}</span>
                        </div>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #f59e0b' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Pending Admin Review</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fcd34d' }}>{stats.pending}</span>
                        </div>
                    </div>

                    {/* Bookings List */}
                    <div className="surface-1" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <h3 className="heading-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaTicketAlt className="teal-text" size={16} /> Booking Records
                            </h3>
                        </div>

                        {loading ? (
                            <div style={{ padding: '48px 0', textAlign: 'center' }}>
                                <div style={{ width: '28px', height: '28px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#14B8A6', borderRadius: '50%', margin: '0 auto' }} className="animate-spin" />
                            </div>
                        ) : bookings.length === 0 ? (
                            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
                                <FaTicketAlt size={40} className="teal-text" style={{ opacity: 0.4, marginBottom: '16px' }} />
                                <h4 className="heading-sm" style={{ marginBottom: '8px' }}>No bookings found</h4>
                                <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>You haven't reserved any event tickets yet.</p>
                                <Link to="/" className="btn btn-teal">
                                    Browse Events <FaArrowRight size={12} />
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {bookings.map(b => {
                                    const ev = b.eventId;
                                    return (
                                        <div key={b._id} style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                    <h4 className="heading-sm" style={{ fontSize: '1rem' }}>{ev?.title || 'Unknown Event'}</h4>
                                                    <span className={`tag ${b.status === 'confirmed' ? 'tag-green' : b.status === 'cancelled' ? 'tag-red' : 'tag-amber'}`}>
                                                        {b.status}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '16px', color: 'rgba(240,253,250,0.6)', fontSize: '0.8125rem' }}>
                                                    {ev?.date && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <FaCalendarAlt size={11} className="teal-text" />
                                                            {new Date(ev.date).toLocaleDateString('en-IN')}
                                                        </span>
                                                    )}
                                                    {ev?.location && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <FaMapMarkerAlt size={11} className="teal-text" />
                                                            {ev.location}
                                                        </span>
                                                    )}
                                                    <span>Amount: <strong style={{ color: '#F0FDFA' }}>{b.amount > 0 ? `₹${b.amount}` : 'FREE'}</strong></span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {ev && <Link to={`/events/${ev._id}`} className="btn btn-ghost btn-sm">View Event</Link>}
                                                {b.status === 'pending' && (
                                                    <button onClick={() => setCancelTarget(b)} className="btn btn-ghost btn-sm" style={{ color: '#fca5a5' }}>
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDashboard;

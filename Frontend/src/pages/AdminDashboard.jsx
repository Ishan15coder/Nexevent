import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext.jsx';
import {
    FaCalendarAlt, FaUsers, FaMoneyBillWave, FaClock,
    FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle,
    FaSearch, FaTicketAlt
} from 'react-icons/fa';

/* ── Event Form Modal ─────────────────────────────────────────── */
const EventFormModal = ({ editEvent, onClose, onSaved }) => {
    const isEdit = !!editEvent;
    const existingDate = editEvent?.date ? new Date(editEvent.date) : null;
    const [form, setForm] = useState({
        title: editEvent?.title || '',
        description: editEvent?.description || '',
        dateDay: existingDate ? existingDate.toISOString().slice(0, 10) : '',
        dateTime: existingDate ? existingDate.toISOString().slice(11, 16) : '00:00',
        location: editEvent?.location || '',
        category: editEvent?.category || 'Technology',
        totalSeats: editEvent?.totalSeats || '',
        availableSeats: editEvent?.availableSeats || '',
        ticketPrice: editEvent?.ticketPrice ?? 0,
        imageUrl: editEvent?.imageUrl || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const categories = ['Music', 'Technology', 'Food', 'Business', 'Science', 'Art', 'Sports', 'Other'];

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            if (!form.dateDay) { setError('Please select a date.'); setLoading(false); return; }
            const combinedDate = new Date(`${form.dateDay}T${form.dateTime || '00:00'}`);
            const { dateDay, dateTime, ...rest } = form;
            const payload = {
                ...rest,
                date: combinedDate.toISOString(),
                totalSeats: Number(form.totalSeats),
                availableSeats: Number(form.availableSeats),
                ticketPrice: Number(form.ticketPrice),
            };
            if (isEdit) await api.put(`/events/${editEvent._id}`, payload);
            else await api.post('/events', payload);
            onSaved(); onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed.');
        } finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box" style={{ maxWidth: '640px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="heading-sm">{isEdit ? 'Edit Event Details' : 'Create New Event'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,253,250,0.5)', cursor: 'pointer' }}>
                        <FaTimesCircle size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Title</label>
                            <input name="title" value={form.title} onChange={handleChange} className="input" required placeholder="Event title..." />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={3} required placeholder="Description..." />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Date</label>
                            <input name="dateDay" type="date" value={form.dateDay} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Time <span style={{ color: 'rgba(240,253,250,0.4)', fontSize: '0.7rem' }}>(defaults to midnight)</span></label>
                            <input name="dateTime" type="time" value={form.dateTime} onChange={handleChange} className="input" />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Category</label>
                            <select name="category" value={form.category} onChange={handleChange} className="input">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Location</label>
                            <input name="location" value={form.location} onChange={handleChange} className="input" required placeholder="Venue, City" />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Total Seats</label>
                            <input name="totalSeats" type="number" min="1" value={form.totalSeats} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Available Seats</label>
                            <input name="availableSeats" type="number" min="0" value={form.availableSeats} onChange={handleChange} className="input" required />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Price ₹ (0 for free)</label>
                            <input name="ticketPrice" type="number" min="0" value={form.ticketPrice} onChange={handleChange} className="input" />
                        </div>
                        <div>
                            <label className="label" style={{ display: 'block', marginBottom: '6px' }}>Image URL</label>
                            <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} className="input" required />
                        </div>
                    </div>

                    {error && <p style={{ color: '#fca5a5', fontSize: '0.75rem', textAlign: 'center' }}>{error}</p>}

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" disabled={loading} className="btn btn-teal" style={{ flex: 1 }}>
                            {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ── Admin Dashboard Component ────────────────────────────────── */
const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState(() => localStorage.getItem('adminTab') || 'events');
    const switchTab = (t) => { localStorage.setItem('adminTab', t); setTab(t); };
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [evRes, bookRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/all'),
            ]);
            setEvents(evRes.data);
            setBookings(bookRes.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try { await api.delete(`/events/${deleteTarget._id}`); setDeleteTarget(null); fetchAll(); }
        catch (err) { console.error(err); }
    };

    const confirmBooking = async (id, paymentStatus) => {
        // Update UI immediately — don't wait for response shape
        setBookings(prev => prev.map(b =>
            b._id === id
                ? { ...b, status: 'confirmed', paymentStatus }
                : b
        ));
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
        } catch (err) {
            console.error(err);
            // Roll back on failure
            setBookings(prev => prev.map(b =>
                b._id === id
                    ? { ...b, status: 'pending', paymentStatus: 'not_paid' }
                    : b
            ));
        }
    };

    const pendingBookings  = bookings.filter(b => b.status === 'pending');
    const resolvedBookings = bookings.filter(b => b.status !== 'pending');

    const stats = {
        events: events.length,
        pending: pendingBookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        revenue: bookings.filter(b => b.status === 'confirmed' && b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0),
    };

    return (
        <>
            {showModal && (
                <EventFormModal editEvent={editEvent} onClose={() => { setShowModal(false); setEditEvent(null); }} onSaved={fetchAll} />
            )}

            {deleteTarget && (
                <div className="modal-overlay">
                    <div className="modal-box" style={{ textAlign: 'center' }}>
                        <FaTrash style={{ color: '#ef4444', fontSize: '36px', marginBottom: '16px' }} />
                        <h3 className="heading-sm" style={{ marginBottom: '8px' }}>Delete Event?</h3>
                        <p className="muted" style={{ fontSize: '0.8125rem', marginBottom: '24px' }}>Delete <strong style={{ color: '#F0FDFA' }}>"{deleteTarget.title}"</strong>?</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={handleDelete} className="btn btn-teal" style={{ flex: 1, background: '#ef4444', color: '#fff' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ paddingTop: '96px', paddingBottom: '96px' }}>
                <div className="container-app">
                    
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                        <div>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Admin Panel</span>
                            <h1 className="heading" style={{ fontSize: '2rem' }}>Platform Control</h1>
                        </div>
                        <button onClick={() => { setEditEvent(null); setShowModal(true); }} className="btn btn-teal">
                            <FaPlus size={12} /> New Event
                        </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Total Events</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F0FDFA' }}>{stats.events}</span>
                        </div>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #f59e0b' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Pending Approvals</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fcd34d' }}>{stats.pending}</span>
                        </div>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #14B8A6' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Confirmed Bookings</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#5EEAD4' }}>{stats.confirmed}</span>
                        </div>
                        <div className="surface-1" style={{ padding: '20px', borderRadius: '12px', borderLeft: '3px solid #5EEAD4' }}>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Total Revenue</span>
                            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#F0FDFA' }}>₹{stats.revenue}</span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button onClick={() => switchTab('events')} className={tab === 'events' ? 'btn btn-teal btn-sm' : 'btn btn-ghost btn-sm'}>
                            Events Catalog ({loading ? '…' : events.length})
                        </button>
                        <button onClick={() => switchTab('bookings')} className={tab === 'bookings' ? 'btn btn-teal btn-sm' : 'btn btn-ghost btn-sm'}>
                            Bookings Queue ({loading ? '…' : bookings.length})
                        </button>
                    </div>

                    {/* Events Table */}
                    {tab === 'events' && (
                        <div className="surface-1" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <th style={{ padding: '16px 20px', color: '#14B8A6', fontSize: '0.75rem', textTransform: 'uppercase' }}>Event Title</th>
                                        <th style={{ padding: '16px 20px', color: '#14B8A6', fontSize: '0.75rem', textTransform: 'uppercase' }}>Category</th>
                                        <th style={{ padding: '16px 20px', color: '#14B8A6', fontSize: '0.75rem', textTransform: 'uppercase' }}>Available Seats</th>
                                        <th style={{ padding: '16px 20px', color: '#14B8A6', fontSize: '0.75rem', textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ padding: '16px 20px', color: '#14B8A6', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(ev => (
                                        <tr key={ev._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '16px 20px', fontWeight: 600 }}>{ev.title}</td>
                                            <td style={{ padding: '16px 20px' }}><span className="tag tag-teal">{ev.category}</span></td>
                                            <td style={{ padding: '16px 20px' }}>{ev.availableSeats} / {ev.totalSeats}</td>
                                            <td style={{ padding: '16px 20px' }}>{ev.ticketPrice > 0 ? `₹${ev.ticketPrice}` : 'FREE'}</td>
                                            <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                <button onClick={() => { setEditEvent(ev); setShowModal(true); }} className="btn btn-ghost btn-sm" style={{ marginRight: '6px' }}>
                                                    <FaEdit size={12} />
                                                </button>
                                                <button onClick={() => setDeleteTarget(ev)} className="btn btn-ghost btn-sm" style={{ color: '#fca5a5' }}>
                                                    <FaTrash size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Bookings Queue */}
                    {tab === 'bookings' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                            {/* ── Pending Requests ── */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <FaClock style={{ color: '#f59e0b' }} />
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fcd34d', margin: 0 }}>
                                        Pending Requests
                                    </h2>
                                    <span style={{
                                        background: 'rgba(245,158,11,0.15)', color: '#fcd34d',
                                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                        borderRadius: '999px', border: '1px solid rgba(245,158,11,0.3)'
                                    }}>
                                        {pendingBookings.length}
                                    </span>
                                </div>

                                {pendingBookings.length === 0 ? (
                                    <div className="surface-1" style={{ borderRadius: '12px', padding: '28px', textAlign: 'center', color: 'rgba(240,253,250,0.4)', fontSize: '0.875rem' }}>
                                        🎉 No pending requests — all caught up!
                                    </div>
                                ) : (
                                    <div className="surface-1" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                            <thead>
                                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Event</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>User</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Amount</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingBookings.map(b => (
                                                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{b.eventId?.title || 'Unknown Event'}</td>
                                                        <td style={{ padding: '14px 20px' }}>{b.userId?.name || b.userId?.email || 'User'}</td>
                                                        <td style={{ padding: '14px 20px', color: '#5EEAD4' }}>
                                                            {b.amount > 0 ? `₹${b.amount}` : 'FREE'}
                                                        </td>
                                                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                                <button onClick={() => confirmBooking(b._id, 'paid')} className="btn btn-teal btn-sm">
                                                                    <FaCheckCircle size={10} /> Paid
                                                                </button>
                                                                <button onClick={() => confirmBooking(b._id, 'not_paid')} className="btn btn-outline btn-sm">
                                                                    Mark Free
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* ── Resolved Bookings ── */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <FaCheckCircle style={{ color: '#14B8A6' }} />
                                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#5EEAD4', margin: 0 }}>
                                        Resolved Bookings
                                    </h2>
                                    <span style={{
                                        background: 'rgba(20,184,166,0.15)', color: '#5EEAD4',
                                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                        borderRadius: '999px', border: '1px solid rgba(20,184,166,0.3)'
                                    }}>
                                        {resolvedBookings.length}
                                    </span>
                                </div>

                                {resolvedBookings.length === 0 ? (
                                    <div className="surface-1" style={{ borderRadius: '12px', padding: '28px', textAlign: 'center', color: 'rgba(240,253,250,0.4)', fontSize: '0.875rem' }}>
                                        No resolved bookings yet.
                                    </div>
                                ) : (
                                    <div className="surface-1" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                            <thead>
                                                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Event</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>User</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Status</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Payment</th>
                                                    <th style={{ padding: '14px 20px', color: '#14B8A6', fontSize: '0.7rem', textTransform: 'uppercase' }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resolvedBookings.map(b => (
                                                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: 0.85 }}>
                                                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{b.eventId?.title || 'Unknown Event'}</td>
                                                        <td style={{ padding: '14px 20px' }}>{b.userId?.name || b.userId?.email || 'User'}</td>
                                                        <td style={{ padding: '14px 20px' }}>
                                                            <span className={`tag ${b.status === 'confirmed' ? 'tag-green' : 'tag-red'}`}>
                                                                {b.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '14px 20px' }}>
                                                            <span className={`tag ${b.paymentStatus === 'paid' ? 'tag-teal' : 'tag-amber'}`}>
                                                                {b.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '14px 20px', color: '#5EEAD4' }}>
                                                            {b.amount > 0 ? `₹${b.amount}` : 'FREE'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext.jsx';
import {
    FaSearch, FaMapMarkerAlt, FaCalendarAlt,
    FaUsers, FaArrowRight, FaChevronRight,
    FaMusic, FaBriefcase, FaFlask, FaUtensils, FaRunning, FaPalette,
    FaTicketAlt, FaFire
} from 'react-icons/fa';

const CATEGORIES = ['All', 'Music', 'Technology', 'Food', 'Business', 'Science', 'Art', 'Sports'];
const CAT_ICONS = {
    Music: <FaMusic />, Technology: <FaBriefcase />, Science: <FaFlask />,
    Food: <FaUtensils />, Sports: <FaRunning />, Art: <FaPalette />, Business: <FaBriefcase />,
};

/* ── Event Card Component ─────────────────────────────────────── */
const EventCard = ({ event, featured = false }) => {
    const isPaid = event.ticketPrice > 0;
    const isFull = event.availableSeats <= 0;
    const dateObj = new Date(event.date);
    const isPast = dateObj < new Date();
    const pct = Math.max(5, (event.availableSeats / event.totalSeats) * 100);

    if (featured) {
        return (
            <Link to={`/events/${event._id}`} className="card surface-2 block relative group" style={{ textDecoration: 'none', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', minHeight: '340px' }}>
                    <div style={{ position: 'relative', minHeight: '240px', overflow: 'hidden' }}>
                        <img
                            src={event.imageUrl} alt={event.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                            className="group-hover:scale-105"
                            onError={e => { e.target.src = `https://placehold.co/800x600/111921/5EEAD4?text=${encodeURIComponent(event.title)}`; }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(17,25,33,0.2), rgba(17,25,33,0.9))' }} />
                        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                            <span className="tag tag-teal">
                                <FaFire style={{ marginRight: '4px' }} /> Featured
                            </span>
                            {isPaid ? <span className="tag tag-white">₹{event.ticketPrice}</span> : <span className="tag tag-free">FREE</span>}
                        </div>
                    </div>
                    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span className="label">{event.category}</span>
                            <span style={{ color: 'rgba(240,253,250,0.3)', fontSize: '12px' }}>•</span>
                            <span className="muted" style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaCalendarAlt className="teal-text" size={12} />
                                {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <h3 className="heading" style={{ fontSize: '1.75rem', marginBottom: '12px', lineHeight: 1.2 }}>
                            {event.title}
                        </h3>
                        <p className="muted line-clamp-2" style={{ marginBottom: '24px', fontSize: '0.9375rem' }}>
                            {event.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '0.8125rem', color: 'rgba(240,253,250,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaMapMarkerAlt className="teal-text" size={12} /> {event.location}
                                </span>
                            </div>
                            <span className="btn btn-teal btn-sm">
                                View Event <FaArrowRight size={11} />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link to={`/events/${event._id}`} className="card block group" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                <img
                    src={event.imageUrl} alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="group-hover:scale-105"
                    onError={e => { e.target.src = `https://placehold.co/400x250/111921/5EEAD4?text=${encodeURIComponent(event.title)}`; }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111921 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    {isPaid ? <span className="tag tag-white">₹{event.ticketPrice}</span> : <span className="tag tag-free">FREE</span>}
                    {isFull && <span className="tag tag-red">Sold Out</span>}
                </div>
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="tag tag-dark">{event.category}</span>
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                <h3 className="heading-sm line-clamp-1" style={{ marginBottom: '8px' }}>
                    {event.title}
                </h3>
                <p className="muted line-clamp-2" style={{ fontSize: '0.8125rem', marginBottom: '16px' }}>
                    {event.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(240,253,250,0.6)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaCalendarAlt className="teal-text" size={11} />
                            {dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FaMapMarkerAlt className="teal-text" size={11} /> {event.location}
                        </span>
                    </div>

                    {/* Seat Indicator */}
                    <div style={{ marginTop: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '4px' }}>
                            <span style={{ color: 'rgba(240,253,250,0.4)' }}>Capacity</span>
                            <span style={{ color: isFull ? '#fca5a5' : '#5EEAD4', fontWeight: 600 }}>
                                {event.availableSeats} / {event.totalSeats} seats left
                            </span>
                        </div>
                        <div className="seat-bar-track">
                            <div className={`seat-bar-fill ${isFull ? 'full' : ''}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#14B8A6' }}>Get Ticket</span>
                    <FaChevronRight size={10} style={{ color: '#14B8A6', transition: 'transform 0.2s' }} className="group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

const SkeletonCard = () => (
    <div className="card">
        <div className="skeleton" style={{ height: '190px' }} />
        <div style={{ padding: '20px' }}>
            <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '12px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '6px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '20px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ height: '4px', width: '100%', borderRadius: '2px' }} />
        </div>
    </div>
);

/* ── Main Home Page Component ─────────────────────────────────── */
const Home = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [error, setError] = useState('');

    useEffect(() => { fetchEvents(); }, [category]);

    const fetchEvents = async () => {
        setLoading(true); setError('');
        try {
            const params = {};
            if (category !== 'All') params.category = category;
            const { data } = await api.get('/events', { params });
            setEvents(data);
        } catch { setError('Failed to load events.'); }
        finally { setLoading(false); }
    };

    const filtered = events.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );

    const featuredEvent = filtered.find(e => new Date(e.date) >= new Date());
    const remainingEvents = featuredEvent ? filtered.filter(e => e._id !== featuredEvent._id) : filtered;
    const upcoming = remainingEvents.filter(e => new Date(e.date) >= new Date());
    const past = remainingEvents.filter(e => new Date(e.date) < new Date());

    return (
        <div style={{ paddingTop: '80px', paddingBottom: '96px' }}>

            {/* ── Editorial Hero Section ────────────────────────── */}
            <section style={{ padding: '48px 0 64px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container-app">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
                        <div>


                            <h1 className="display" style={{ marginBottom: '24px' }}>
                                Unforgettable <br />
                                <span className="accent-text">Experiences</span> <br />
                                Await You.
                            </h1>

                            <p className="muted" style={{ fontSize: '1.0625rem', maxWidth: '480px', marginBottom: '36px', lineHeight: 1.6 }}>
                                Discover tech summits, music festivals, design workshops, and exclusive gatherings — seamlessly booked with 2FA protection.
                            </p>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                <a href="#events-section" className="btn btn-teal btn-lg">
                                    Explore Events <FaArrowRight size={12} />
                                </a>
                                {!user && (
                                    <Link to="/register" className="btn btn-outline btn-lg">
                                        Create Account
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Search Box Card — Distinct & Clean */}
                        <div className="surface-2" style={{ padding: '32px', borderRadius: '16px', border: '1px solid rgba(20,184,166,0.2)' }}>
                            <h3 className="heading-sm" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaSearch className="teal-text" size={14} /> Find your next event
                            </h3>
                            <p className="muted" style={{ fontSize: '0.8125rem', marginBottom: '20px' }}>
                                Search by keyword, title, or city location
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search events, cities, keywords..."
                                        className="input"
                                        style={{ height: '48px', fontSize: '0.9375rem', paddingLeft: '44px' }}
                                    />
                                    <FaSearch style={{ position: 'absolute', left: '16px', top: '16px', color: 'rgba(240,253,250,0.3)' }} size={14} />
                                </div>

                                <div>
                                    <span className="label" style={{ display: 'block', marginBottom: '10px' }}>Popular Categories</span>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {CATEGORIES.slice(1, 6).map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setCategory(c === category ? 'All' : c)}
                                                style={{
                                                    padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                                                    background: category === c ? '#14B8A6' : 'rgba(255,255,255,0.05)',
                                                    color: category === c ? '#0C1015' : 'rgba(240,253,250,0.7)',
                                                    border: category === c ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                                    cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Events Showcase Section ──────────────────────── */}
            <section id="events-section" style={{ paddingTop: '64px' }}>
                <div className="container-app">

                    {/* Filter bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
                        <div>
                            <span className="label" style={{ display: 'block', marginBottom: '4px' }}>Browse Catalog</span>
                            <h2 className="heading" style={{ fontSize: '1.5rem' }}>Upcoming Events</h2>
                        </div>

                        {/* Category Horizontal Bar */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={category === cat ? 'btn btn-teal btn-sm' : 'btn btn-ghost btn-sm'}
                                    style={{ borderRadius: '99px' }}
                                >
                                    {CAT_ICONS[cat]} {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error ? (
                        <div style={{ textTransform: 'center', padding: '64px 0' }} className="surface-1">
                            <p style={{ color: '#fca5a5', marginBottom: '16px' }}>{error}</p>
                            <button onClick={fetchEvents} className="btn btn-outline">Retry Loading</button>
                        </div>
                    ) : (
                        <>
                            {/* Featured Banner Card */}
                            {!loading && featuredEvent && !search && category === 'All' && (
                                <div style={{ marginBottom: '40px' }}>
                                    <EventCard event={featuredEvent} featured={true} />
                                </div>
                            )}

                            {/* Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                                {loading
                                    ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
                                    : upcoming.length > 0
                                        ? upcoming.map(e => <EventCard key={e._id} event={e} />)
                                        : (
                                            <div style={{ gridColumn: '1 / -1', padding: '64px 24px', textAlign: 'center' }} className="card">
                                                <FaTicketAlt size={40} className="teal-text" style={{ marginBottom: '16px', opacity: 0.5 }} />
                                                <h3 className="heading-sm" style={{ marginBottom: '8px' }}>No events found</h3>
                                                <p className="muted" style={{ fontSize: '0.875rem' }}>Try clearing filters or search for something else.</p>
                                            </div>
                                        )
                                }
                            </div>

                            {/* Past Events */}
                            {!loading && past.length > 0 && (
                                <div style={{ marginTop: '64px' }}>
                                    <h3 className="heading-sm muted" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="teal-bar" /> Concluded Events ({past.length})
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', opacity: 0.55 }}>
                                        {past.map(e => <EventCard key={e._id} event={e} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;

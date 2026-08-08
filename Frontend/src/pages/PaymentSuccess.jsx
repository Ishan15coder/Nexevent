import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt, FaArrowRight } from 'react-icons/fa';

const PaymentSuccess = () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="surface-1" style={{ padding: '40px', borderRadius: '16px', maxWidth: '420px', width: '100%', textAlign: 'center', border: '1px solid rgba(20,184,166,0.2)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <FaCheckCircle className="teal-text" size={32} />
            </div>
            <h1 className="heading" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Booking Confirmed</h1>
            <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                Your ticket booking was successful and sent for processing. Check your email for details.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/dashboard" className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                    <FaTicketAlt size={12} /> My Dashboard
                </Link>
                <Link to="/" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                    Browse Events <FaArrowRight size={10} />
                </Link>
            </div>
        </div>
    </div>
);

export default PaymentSuccess;

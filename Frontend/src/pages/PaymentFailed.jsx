import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaArrowLeft } from 'react-icons/fa';

const PaymentFailed = () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="surface-1" style={{ padding: '40px', borderRadius: '16px', maxWidth: '420px', width: '100%', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <FaTimesCircle style={{ color: '#ef4444', fontSize: '32px' }} />
            </div>
            <h1 className="heading" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Booking Failed</h1>
            <p className="muted" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                Something went wrong while processing your booking request. Please try again.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/" className="btn btn-teal btn-lg" style={{ width: '100%' }}>
                    <FaRedo size={12} /> Try Again
                </Link>
                <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                    <FaArrowLeft size={10} /> Go to Dashboard
                </Link>
            </div>
        </div>
    </div>
);

export default PaymentFailed;

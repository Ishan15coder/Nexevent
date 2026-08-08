import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import EventDetails from './pages/EventDetails.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentFailed from './pages/PaymentFailed.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Auth routes (redirect if already logged in) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* User-protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><UserDashboard /></ProtectedRoute>}
        />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
        />

        {/* Booking status pages */}
        <Route path="/booking/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/booking/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 glow animate-float">
              <span style={{ color: '#D8F3DC', fontSize: '2rem', fontWeight: 900 }}>?</span>
            </div>
            <h1 className="text-7xl font-extrabold mb-4" style={{ background: 'linear-gradient(135deg, #40916C, #D8F3DC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</h1>
            <p className="text-lg mb-6" style={{ color: '#40916C' }}>Page not found</p>
            <a href="/" className="btn-primary px-8 py-3">← Go Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">TechFest 2026</Link>
      <div className="navbar-links">
        <Link to="/events">Events</Link>
        {user ? (
          <>
            <Link to="/my-registrations">My Registrations</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span className="navbar-user">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

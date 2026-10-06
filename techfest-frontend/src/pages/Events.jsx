import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Events.css';

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Other'];

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents]           = useState([]);
  const [myRegEventIds, setMyRegIds]  = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [category, setCategory]       = useState('All');
  const [message, setMessage]         = useState('');
  const [isSuccess, setIsSuccess]     = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = category !== 'All' ? { category } : {};
      const { data } = await API.get('/events', { params });
      setEvents(data.data);

      if (user) {
        try {
          const regRes = await API.get('/registrations/my');
          const registeredIds = new Set(regRes.data.data.map((r) => r.event?._id || r.event));
          setMyRegIds(registeredIds);
        } catch {
          // not critical
        }
      }
    } catch {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, user]);

  const handleRegister = async (eventId) => {
    setMessage('');
    try {
      const { data } = await API.post('/registrations', { eventId });
      setIsSuccess(true);
      setMessage(data.message);
      fetchData();
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="events-page">
      <h1>TechFest 2026 — Events</h1>

      <div className="category-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {message && <p className={`msg ${isSuccess ? 'success' : 'error'}`}>{message}</p>}

      {loading ? (
        <p className="center">Loading events...</p>
      ) : error ? (
        <p className="center error-text">{error}</p>
      ) : events.length === 0 ? (
        <p className="center">No events found.</p>
      ) : (
        <div className="events-grid">
          {events.map((ev) => {
            const isRegistered = myRegEventIds.has(ev._id);
            const isFull = ev.seatsAvailable <= 0;

            return (
              <div className="event-card" key={ev._id}>
                <span className="badge">{ev.category}</span>
                <h3>{ev.name}</h3>
                <p className="desc">{ev.description || 'No description provided.'}</p>
                <div className="event-meta">
                  <span>Date: {new Date(ev.date).toLocaleDateString()}</span>
                  <span>Venue: {ev.venue}</span>
                  <span>Fee: Rs. {ev.fee}</span>
                  <span className={isFull ? 'full' : ''}>
                    Seats: {ev.seatsAvailable} / {ev.totalSeats} available
                  </span>
                </div>

                {!user ? (
                  <p className="login-hint">Login to register</p>
                ) : isRegistered ? (
                  <button className="btn-registered" disabled>
                    Registered
                  </button>
                ) : isFull ? (
                  <button className="btn-reg" disabled>
                    Full
                  </button>
                ) : (
                  <button className="btn-reg" onClick={() => handleRegister(ev._id)}>
                    Register
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

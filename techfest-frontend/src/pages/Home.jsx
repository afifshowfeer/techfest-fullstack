import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>TechFest 2026</h1>
        <p>Celebrate innovation, culture and sports at the biggest college festival of the year.</p>
        <div className="hero-btns">
          <Link to="/events" className="btn-primary">Explore Events</Link>
          <Link to="/register" className="btn-secondary">Sign Up Free</Link>
        </div>
      </div>
      <div className="features">
        <div className="feature-card"><h3>Technical Events</h3><p>Hackathons, coding contests, and robotics challenges.</p></div>
        <div className="feature-card"><h3>Cultural Events</h3><p>Dance, music, drama, and art competitions.</p></div>
        <div className="feature-card"><h3>Sports Events</h3><p>Cricket, football, chess, and athletics.</p></div>
        <div className="feature-card"><h3>Workshops</h3><p>Hands-on sessions by industry experts.</p></div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login to TechFest</h2>
        {error && <p className="msg error">{error}</p>}
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        <p className="auth-link">Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}


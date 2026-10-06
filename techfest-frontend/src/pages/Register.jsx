import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password);
      setSuccess(data.message + ' — Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        {error   && <p className="msg error">{error}</p>}
        {success && <p className="msg success">{success}</p>}
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" required />
        <button type="submit" disabled={loading}>{loading ? 'Registering…' : 'Register'}</button>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}


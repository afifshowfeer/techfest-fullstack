import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './Admin.css';

const emptyEvent = { name: '', category: 'Technical', description: '', fee: '', totalSeats: '', date: '', venue: '' };

export default function Admin() {
  const [events, setEvents]       = useState([]);
  const [form, setForm]           = useState(emptyEvent);
  const [editId, setEditId]       = useState(null);
  const [message, setMessage]     = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [tab, setTab]             = useState('events');
  const [allRegs, setAllRegs]     = useState([]);

  const fetchEvents = async () => {
    const { data } = await API.get('/events');
    setEvents(data.data);
  };

  const fetchAllRegs = async () => {
    try {
      const { data } = await API.get('/registrations');
      setAllRegs(data.data);
    } catch {}
  };

  useEffect(() => {
    fetchEvents();
    fetchAllRegs();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editId) {
        await API.put(`/events/${editId}`, form);
        setIsSuccess(true);
        setMessage('Event updated successfully.');
      } else {
        await API.post('/events', form);
        setIsSuccess(true);
        setMessage('Event created successfully.');
      }
      setForm(emptyEvent);
      setEditId(null);
      fetchEvents();
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Error occurred.');
    }
  };

  const handleEdit = (ev) => {
    setEditId(ev._id);
    setForm({
      name: ev.name,
      category: ev.category,
      description: ev.description || '',
      fee: ev.fee,
      totalSeats: ev.totalSeats,
      date: ev.date?.slice(0, 10),
      venue: ev.venue || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      setIsSuccess(true);
      setMessage('Event deleted successfully.');
      fetchEvents();
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Error occurred.');
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <div className="admin-tabs">
        <button className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}>
          Events
        </button>
        <button className={tab === 'registrations' ? 'active' : ''} onClick={() => setTab('registrations')}>
          All Registrations
        </button>
      </div>

      {message && <p className={`msg ${isSuccess ? 'success' : 'error'}`}>{message}</p>}

      {tab === 'events' && (
        <>
          <form className="event-form" onSubmit={handleSubmit}>
            <h2>{editId ? 'Edit Event' : 'Add New Event'}</h2>
            <div className="form-grid">
              <div>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {['Technical', 'Cultural', 'Sports', 'Workshop', 'Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Fee (Rs.)</label>
                <input name="fee" type="number" value={form.fee} onChange={handleChange} required />
              </div>
              <div>
                <label>Total Seats</label>
                <input name="totalSeats" type="number" value={form.totalSeats} onChange={handleChange} required />
              </div>
              <div>
                <label>Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </div>
              <div>
                <label>Venue</label>
                <input name="venue" value={form.venue} onChange={handleChange} />
              </div>
            </div>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            <div className="form-actions">
              <button type="submit">{editId ? 'Update Event' : 'Create Event'}</button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm(emptyEvent);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Fee</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id}>
                    <td>{ev.name}</td>
                    <td>{ev.category}</td>
                    <td>{new Date(ev.date).toLocaleDateString()}</td>
                    <td>Rs. {ev.fee}</td>
                    <td>{ev.seatsAvailable} / {ev.totalSeats}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(ev)}>Edit</button>
                      <button className="btn-del" onClick={() => handleDelete(ev._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'registrations' && (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Event</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allRegs.map((r) => (
                <tr key={r._id}>
                  <td>{r.user?.name}</td>
                  <td>{r.user?.email}</td>
                  <td>{r.event?.name}</td>
                  <td>{r.event?.category}</td>
                  <td>{new Date(r.event?.date).toLocaleDateString()}</td>
                  <td><span className={`status ${r.status}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import './MyRegistrations.css';

export default function MyRegistrations() {
  const [regs, setRegs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [message, setMessage]     = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchRegs = async () => {
    try {
      const { data } = await API.get('/registrations/my');
      setRegs(data.data);
    } catch {
      setIsSuccess(false);
      setMessage('Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegs();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      const { data } = await API.delete(`/registrations/${id}`);
      setIsSuccess(true);
      setMessage(data.message);
      fetchRegs();
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Failed to cancel.');
    }
  };

  return (
    <div className="myreg-page">
      <h1>My Registrations</h1>
      {message && <p className={`msg ${isSuccess ? 'success' : 'error'}`}>{message}</p>}
      {loading ? (
        <p className="center">Loading...</p>
      ) : regs.length === 0 ? (
        <p className="center">You have not registered for any events yet.</p>
      ) : (
        <div className="reg-list">
          {regs.map((r) => (
            <div className="reg-card" key={r._id}>
              <div>
                <h3>{r.event?.name}</h3>
                <p>Date: {new Date(r.event?.date).toLocaleDateString()}</p>
                <p>Venue: {r.event?.venue} | Fee: Rs. {r.event?.fee} | Category: {r.event?.category}</p>
                <p>Status: <span className={`status ${r.status}`}>{r.status}</span></p>
              </div>
              <button className="btn-cancel" onClick={() => handleCancel(r._id)}>
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

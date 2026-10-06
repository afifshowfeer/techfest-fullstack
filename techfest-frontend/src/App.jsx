import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import Events          from './pages/Events';
import MyRegistrations from './pages/MyRegistrations';
import Admin           from './pages/Admin';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route
            path="/my-registrations"
            element={<PrivateRoute><MyRegistrations /></PrivateRoute>}
          />
          <Route
            path="/admin"
            element={<AdminRoute><Admin /></AdminRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

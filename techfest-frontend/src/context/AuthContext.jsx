import React, { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback(async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
    setToken(data.token);
    setUser(data.data);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await API.post('/auth/register', { name, email, password });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


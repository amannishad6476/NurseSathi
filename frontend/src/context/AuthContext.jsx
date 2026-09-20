import { createContext, useEffect, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const saveAuth = (data) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, setLoading, saveAuth, message, showMessage, api }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('qinghome2_token');
    const username = localStorage.getItem('qinghome2_username');
    if (token && username) {
      setUser({ token, username });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const result = await api.login(username, password);
    localStorage.setItem('qinghome2_token', result.token);
    localStorage.setItem('qinghome2_username', result.username);
    setUser({ token: result.token, username: result.username });
  }, []);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem('qinghome2_token');
    localStorage.removeItem('qinghome2_username');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
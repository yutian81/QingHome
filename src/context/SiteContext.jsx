import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api.js';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await api.getPublicConfig();
      setConfig(data);
      setError(null);
    } catch (err) {
      console.error('获取配置失败:', err);
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <SiteContext.Provider value={{ config, loading, error, refresh: fetchConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be inside SiteProvider');
  return ctx;
}
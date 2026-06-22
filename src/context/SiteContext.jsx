import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api.js';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const data = await api.getPublicConfig();
      setConfig(data);
    } catch (err) {
      console.error('获取配置失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <SiteContext.Provider value={{ config, loading, refresh: fetchConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api.js';

const SiteContext = createContext(null);

const CACHE_KEY = 'qinghome2_config_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 分钟

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    localStorage.removeItem(CACHE_KEY);
  } catch {}
  return null;
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(() => loadCache());
  const [loading, setLoading] = useState(!config);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await api.getPublicConfig();
      if (!mountedRef.current) return;
      setConfig(data);
      setError(null);
      saveCache(data);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('获取配置失败:', err);
      setError(err.message || '加载失败');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchConfig();
    return () => { mountedRef.current = false; };
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

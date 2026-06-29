import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as api from '../api.js';

const SiteContext = createContext(null);

const CACHE_KEY = 'qinghome2_config_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 分钟

// Worker 内嵌到 HTML 中的初始数据（优先级最高）
const INITIAL_DATA = typeof window !== 'undefined' ? window.__INITIAL_CONFIG__ : null;

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
  const [config, setConfig] = useState(() => INITIAL_DATA || loadCache());
  const [loading, setLoading] = useState(true); // 始终从加载中开始
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const configRef = useRef(config); // 用 ref 追踪最新 config，避免闭包陈旧值

  // 同步 configRef
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const fetchConfig = useCallback(async () => {
    setLoading(true); // 每次 fetch 都显示 spinner
    try {
      const data = await api.getPublicConfig();
      if (!mountedRef.current) return;
      setConfig(data);
      setError(null);
      saveCache(data);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('获取配置失败:', err);
      // 只有完全没有数据时才显示错误页（有老数据时不弹错）
      if (!configRef.current) {
        setError(err.message || '加载失败');
      }
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

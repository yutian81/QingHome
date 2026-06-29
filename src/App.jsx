import { Component, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SiteProvider } from './context/SiteContext.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          height: '100vh', background: '#0a0c10', color: '#e0e0e0', fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem'
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>😅 加载出错了</h1>
          <p style={{ marginBottom: '1rem', color: '#999' }}>请尝试刷新页面，或清除浏览器缓存后重试</p>
          <button onClick={() => window.location.reload()}
            style={{ padding: '0.6rem 1.5rem', background: '#f0b90b', border: 'none', borderRadius: '8px', color: '#0a0c10', fontWeight: 600, cursor: 'pointer' }}>
            刷新页面
          </button>
          <pre style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#666', maxWidth: '80vw', overflow: 'auto' }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="loading-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <SiteProvider>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </SiteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

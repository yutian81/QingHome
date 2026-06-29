import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SiteProvider } from './context/SiteContext.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg)' }}>
      <div className="loading-spinner" />
    </div>
  );
}

export default function App() {
  return (
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
  );
}

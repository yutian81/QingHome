import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api.js';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    api.getAdminStatus().then(s => {
      if (s.setupNeeded) setNotConfigured(true);
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>🔐 管理后台</h1>
        <p className="admin-login-sub">请输入管理员账号密码登录</p>

        {notConfigured && (
          <div className="admin-msg error">
            ⚠️ 管理员未配置。请在 Cloudflare Dashboard 中设置环境变量
            <code style={{ background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4, margin: '0 4px', fontWeight: 700 }}>ADMIN_USER</code> 和
            <code style={{ background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4, margin: '0 4px', fontWeight: 700 }}>ADMIN_PASS</code>，
            然后重新部署。
          </div>
        )}

        {error && <div className="admin-msg error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>用户名</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="admin-field">
            <label>密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn primary" disabled={busy || notConfigured}>
            {busy ? '登录中…' : '登录'}
          </button>
        </form>
        <p className="admin-login-footer">
          <Link to="/">← 返回首页</Link>
        </p>
      </div>
    </div>
  );
}
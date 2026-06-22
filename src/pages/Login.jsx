import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api.js';
import { FaIcon } from '../components/Icons.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [checking, setChecking] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  useEffect(() => {
    if (user) { navigate('/admin', { replace: true }); return; }
    api.getAdminStatus().then(s => {
      setMode(s.setupNeeded ? 'register' : 'login');
      setChecking(false);
    }).catch(() => setChecking(false));
  }, [user, navigate]);

  const handleLogin = async (e) => {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regPass !== regConfirm) { setError('两次密码不一致'); return; }
    if (regPass.length < 6) { setError('密码至少 6 位'); return; }
    setBusy(true);
    try {
      const result = await api.setup(regUser, regPass);
      localStorage.setItem('qinghome2_token', result.token);
      localStorage.setItem('qinghome2_username', result.username);
      window.location.href = '/admin';
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (checking) return <div className="admin-loading"><FaIcon icon="fa-solid fa-spinner fa-spin" size={15} /><span style={{marginLeft:8}}>加载中…</span></div>;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {mode === 'register' ? (
          <>
            <h1><FaIcon icon="fa-solid fa-rocket" size={22} /> 创建管理员</h1>
            <p className="admin-login-sub">首次使用，请设置管理员账号和密码</p>
            {error && <div className="admin-msg error"><FaIcon icon="fa-solid fa-circle-exclamation" size={14} /> {error}</div>}
            <form onSubmit={handleRegister}>
              <div className="admin-field">
                <label><FaIcon icon="fa-solid fa-user" size={14} /> 用户名</label>
                <input type="text" value={regUser} onChange={e => setRegUser(e.target.value)} required autoFocus />
              </div>
              <div className="admin-field">
                <label><FaIcon icon="fa-solid fa-lock" size={14} /> 密码</label>
                <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} required placeholder="至少 6 位" />
              </div>
              <div className="admin-field">
                <label><FaIcon icon="fa-solid fa-check" size={14} /> 确认密码</label>
                <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required />
              </div>
              <button type="submit" className="admin-btn primary" disabled={busy}>
                {busy ? <><FaIcon icon="fa-solid fa-spinner fa-spin" size={14} /> 创建中…</> : <><FaIcon icon="fa-solid fa-rocket" size={14} /> 创建管理员并登录</>}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1><FaIcon icon="fa-solid fa-lock" size={22} /> 管理后台</h1>
            <p className="admin-login-sub">请输入管理员账号密码登录</p>
            {error && <div className="admin-msg error"><FaIcon icon="fa-solid fa-circle-exclamation" size={14} /> {error}</div>}
            <form onSubmit={handleLogin}>
              <div className="admin-field">
                <label><FaIcon icon="fa-solid fa-user" size={14} /> 用户名</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
              </div>
              <div className="admin-field">
                <label><FaIcon icon="fa-solid fa-lock" size={14} /> 密码</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="admin-btn primary" disabled={busy}>
                {busy ? <><FaIcon icon="fa-solid fa-spinner fa-spin" size={14} /> 登录中…</> : <><FaIcon icon="fa-solid fa-right-to-bracket" size={14} /> 登录</>}
              </button>
            </form>
          </>
        )}
        <p className="admin-login-footer">
          <Link to="/"><FaIcon icon="fa-solid fa-arrow-left" size={12} /> 返回首页</Link>
        </p>
      </div>
    </div>
  );
}
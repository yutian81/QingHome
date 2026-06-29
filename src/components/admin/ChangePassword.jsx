import { useState } from 'react';
import * as api from '../../api.js';
import { FaIcon } from '../Icons.jsx';
import F from './FormField.jsx';

export default function ChangePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPass !== confirm) { setPasswordMsg({ text: '两次新密码不一致', type: 'error' }); return; }
    if (newPass.length < 6) { setPasswordMsg({ text: '新密码至少 6 位', type: 'error' }); return; }
    setBusy(true);
    try {
      const res = await api.changePassword(oldPass, newPass);
      setPasswordMsg({ text: res.message || '密码修改成功', type: 'success' });
      setOldPass(''); setNewPass(''); setConfirm('');
    } catch (err) {
      setPasswordMsg({ text: err.message, type: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h3><span className="admin-hicon-gap"><FaIcon icon="fa-solid fa-key" size={15} /> 修改密码</span></h3></div>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <F label="当前密码" value={oldPass} onChange={setOldPass} type="password" />
        <F label="新密码" value={newPass} onChange={setNewPass} type="password" placeholder="至少 6 位" />
        <F label="确认新密码" value={confirm} onChange={setConfirm} type="password" />
        <div className="admin-save-row">
          <button type="submit" className="admin-btn primary" disabled={busy}>
            {busy ? <span className="admin-icon-gap"><FaIcon icon="fa-solid fa-spinner fa-spin" size={14} />修改中…</span> : <span className="admin-icon-gap"><FaIcon icon="fa-solid fa-key" size={14} />修改密码</span>}
          </button>
          {passwordMsg && <span className={`admin-msg-inline ${passwordMsg.type}`}><span className="admin-icon-gap"><FaIcon icon={passwordMsg.type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-check-circle'} size={14} />{passwordMsg.text}</span></span>}
        </div>
      </form>
    </div>
  );
}
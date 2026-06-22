import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import * as api from '../api.js';
import { FaIcon } from '../components/Icons.jsx';
import '../styles/admin.css';

/* ──── 表单输入 ──── */
function F({ label, value, onChange, type = 'text', placeholder, rows, fullWidth }) {
  const id = label.replace(/\s+/g, '-');
  return (
    <div className="admin-field" style={fullWidth ? {gridColumn:'1 / -1'} : {}}>
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder || ''} />
      ) : type === 'color' ? (
        <input id={id} type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{width:60,height:36,padding:2,cursor:'pointer'}} />
      ) : type === 'hex' ? (
        <div className="admin-color-wrap">
          <span className="admin-color-swatch" style={{ background: value || '#000000' }} />
          <input id={id} type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} style={{flex:1}} />
        </div>
      ) : type === 'color-text' ? (
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)} style={{width:40,height:36,padding:2,cursor:'pointer',flexShrink:0}} />
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} style={{flex:1}} />
        </div>
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} />
      )}
    </div>
  );
}

/* ──── 列表编辑器 ──── */
function ListEditor({ items, columns, title, icon, onAdd, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const reset = () => { setEditing(null); setForm({}); };
  const startEdit = (item) => { setEditing(item.id); setForm({ ...item }); };
  const startAdd = () => {
    const o = {};
    columns.forEach(c => { if (!['sort_order'].includes(c.key)) o[c.key] = ''; });
    setEditing('new');
    setForm(o);
  };

  const save = async () => {
    if (editing === 'new') { await onAdd(form); }
    else { await onUpdate(editing, form); }
    reset();
  };

  const remove = async (id) => {
    if (!confirm('确定删除？')) return;
    await onDelete(id);
    if (editing === id) reset();
  };

  const displayCols = columns.filter(c => !['id', 'sort_order'].includes(c.key));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
              <h3>{icon && <><FaIcon icon={icon} size={15} /> {title}</>}</h3>
              <button className="admin-btn small" onClick={startAdd}><FaIcon icon="fa-solid fa-plus" size={12} /> 新增</button>
            </div>

      {editing && (
        <div className="admin-edit-panel">
          <h4>{editing === 'new' ? '新增' : '编辑'}</h4>
          <div className="admin-form-grid">
          {displayCols.map(c => (
            <F key={c.key} label={c.label} value={form[c.key] || ''} onChange={v => setForm(f => ({ ...f, [c.key]: v }))} rows={c.rows} type={c.type} placeholder={c.placeholder || ''} fullWidth={c.fullWidth} />
          ))}
          </div>
          <div className="admin-edit-actions">
            <button className="admin-btn primary" onClick={save}>保存</button>
            <button className="admin-btn" onClick={reset}>取消</button>
          </div>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>{displayCols.map(c => <th key={c.key}>{c.label}</th>)}

            <th style={{ width: 80 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && <tr><td colSpan={displayCols.length + 1} className="admin-empty">暂无数据</td></tr>}
          {items.map(item => (
            <tr key={item.id}>
              {displayCols.map(c => (
                <td key={c.key}>{c.render ? c.render(item[c.key]) : truncate(item[c.key], 50)}</td>
              ))}
              <td>
                <button className="admin-btn tiny" onClick={() => startEdit(item)}>编辑</button>
                <button className="admin-btn tiny danger" onClick={() => remove(item.id)}>删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '…' : s;
}

/* ──── 修改密码 ──── */
function ChangePassword() {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (newPass !== confirm) { setError('两次新密码不一致'); return; }
    if (newPass.length < 6) { setError('新密码至少 6 位'); return; }
    setBusy(true);
    try {
      const res = await api.changePassword(oldPass, newPass);
      setMsg(res.message);
      setOldPass(''); setNewPass(''); setConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h3><FaIcon icon="fa-solid fa-key" size={15} /> 修改密码</h3></div>
      {error && <div className="admin-msg error">{error}</div>}
      {msg && <div className="admin-msg success">{msg}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <F label="当前密码" value={oldPass} onChange={setOldPass} type="password" />
        <F label="新密码" value={newPass} onChange={setNewPass} type="password" placeholder="至少 6 位" />
        <F label="确认新密码" value={confirm} onChange={setConfirm} type="password" />
        <button type="submit" className="admin-btn primary" disabled={busy}>
          {busy ? '修改中…' : '修改密码'}
        </button>
      </form>
    </div>
  );
}

/* ──── 后台仪表盘 ──── */
function AdminDashboard() {
  const { user, logout } = useAuth();
  const { refresh } = useSite();
  const [tab, setTab] = useState('profile');
  const [msg, setMsg] = useState(null);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [nav, setNav] = useState([]);
  const [blog, setBlog] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [socials, setSocials] = useState([]);

  const show = (text, type = 'success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000); };

  const loadAll = useCallback(async () => {
    const c = await api.getAdminConfig();
    setProfile(c.profile);
    setStats(c.stats);
    setNav(c.navItems);
    setBlog(c.blogPosts);
    setProjects(c.projects);
    setResources(c.resources);
    setSocials(c.socials);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveProfile = async () => {
    await api.updateProfile(profile);
    show('个人资料已保存');
    refresh();
  };

  const TABS = [
    { id: 'profile', label: '个人资料', icon: 'fa-solid fa-user' },
    { id: 'stats', label: '统计胶囊', icon: 'fa-solid fa-chart-simple' },
    { id: 'nav', label: '站点导航', icon: 'fa-solid fa-bars' },
    { id: 'blog', label: '博客文章', icon: 'fa-solid fa-feather' },
    { id: 'projects', label: '项目仓库', icon: 'fa-solid fa-code' },
    { id: 'resources', label: '公益站点', icon: 'fa-solid fa-link' },
    { id: 'socials', label: '联系方式', icon: 'fa-solid fa-share-nodes' },
    { id: 'password', label: '修改密码', icon: 'fa-solid fa-key' },
  ];

  const refreshSection = async () => { await loadAll(); refresh(); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <h2>⚙️ 管理后台</h2>
          <p className="admin-user">👤 {user?.username}</p>
        </div>
        <nav>
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <FaIcon icon={t.icon} size={14} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-nav-btn"><FaIcon icon="fa-solid fa-house" size={15} /> 查看首页</Link>
          <button className="admin-nav-btn" onClick={logout}><FaIcon icon="fa-solid fa-right-from-bracket" size={15} /> 退出登录</button>
        </div>
      </aside>

      <main className="admin-main">
        {msg && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

        {/* 个人资料 */}
        {tab === 'profile' && (
                  <div className="admin-section">
                    <div className="admin-section-header"><h3><FaIcon icon="fa-solid fa-user" size={15} /> 个人资料</h3></div>
                    {!profile && <p style={{color:'var(--text-dim)',marginBottom:16}}>暂无数据，请先填写保存</p>}
                    <div className="admin-form-grid">
                      <F label="名称" value={profile?.name || ''} onChange={v => setProfile(p => ({ ...p || {}, name: v }))} placeholder="例如：青云志主页" />
                      <F label="品牌" value={profile?.brand || ''} onChange={v => setProfile(p => ({ ...p || {}, brand: v }))} placeholder="例如：QingHome" />
                      <F label="头像 URL" value={profile?.avatar || ''} onChange={v => setProfile(p => ({ ...p || {}, avatar: v }))} placeholder="https://example.com/avatar.png" />
                      <F label="标题" value={profile?.title || ''} onChange={v => setProfile(p => ({ ...p || {}, title: v }))} placeholder="例如：一个又菜又爱玩的小白" />
                      <F label="副标题" value={profile?.tagline || ''} onChange={v => setProfile(p => ({ ...p || {}, tagline: v }))} placeholder="例如：用代码解决问题，用文字记录思考。" />
                      <F label="邮箱" value={profile?.email || ''} onChange={v => setProfile(p => ({ ...p || {}, email: v }))} type="email" placeholder="admin@example.com" />
                      <F label="简介" value={profile?.bio || ''} onChange={v => setProfile(p => ({ ...p || {}, bio: v }))} rows={3} placeholder="个人简介，支持多行文本" />
                      <div className="admin-field">
                        <label htmlFor="status">状态 <span style={{fontWeight:400,color:'var(--text-dim)'}}>（available / busy / offline）</span></label>
                        <input id="status" type="text" value={profile?.status || 'available'} onChange={e => setProfile(p => ({ ...p || {}, status: e.target.value }))} placeholder="available" />
                      </div>
                    </div>
                    <button className="admin-btn primary" onClick={saveProfile} style={{marginTop:16}} disabled={!profile}>保存</button>
          </div>
        )}

        {/* 统计 */}
        {tab === 'stats' && (
          <ListEditor items={stats} title="统计胶囊" icon="fa-solid fa-chart-simple"
            columns={[
              { key: 'label', label: '标签', placeholder: '例如：开源贡献' },
              { key: 'value', label: '数值', placeholder: '例如：1.5k+' },
              { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-atom' },
            ]}
            onAdd={async d => { await api.addStat(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateStat(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteStat(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 导航 */}
        {tab === 'nav' && (
          <ListEditor items={nav} title="站点导航" icon="fa-solid fa-bars"
            columns={[
              { key: 'label', label: '标签', placeholder: '首页' },
              { key: 'section_id', label: '区块 ID', placeholder: 'home' },
              { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-house' },
            ]}
            onAdd={async d => { await api.addNav(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateNav(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteNav(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 博客 */}
        {tab === 'blog' && (
          <ListEditor items={blog} title="博客文章" icon="fa-solid fa-feather"
            columns={[
              { key: 'title', label: '标题', placeholder: '文章标题' },
              { key: 'date', label: '日期', type: 'date' },
              { key: 'url', label: '链接', placeholder: 'https://…' },
              { key: 'tags', label: '标签', placeholder: 'Cloudflare,Domain' },
              { key: 'excerpt', label: '摘要', rows: 2, placeholder: '文章摘要内容…' },
            ]}
            onAdd={async d => { await api.addBlog(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateBlog(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteBlog(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 项目 */}
        {tab === 'projects' && (
          <ListEditor items={projects} title="项目仓库" icon="fa-solid fa-code"
            columns={[
              { key: 'name', label: '名称', placeholder: 'project-name' },
              { key: 'tags', label: '标签', placeholder: 'Cloudflare,Vite' },
              { key: 'icon', label: '图标 Class', placeholder: 'fa-brands fa-github' },
              { key: 'stars', label: 'Stars', type: 'number', placeholder: '99' },
              { key: 'language', label: '语言', placeholder: 'JavaScript' },
              { key: 'language_color', label: '语言色', type: 'color-text', placeholder: '#3178c6' },
              { key: 'url', label: '链接', placeholder: 'https://github.com/…' },
              { key: 'description', label: '摘要', rows: 2, placeholder: '项目描述…' },
            ]}
            onAdd={async d => { await api.addProject({ ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateProject(id, { ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteProject(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 资源 */}
        {tab === 'resources' && (
          <ListEditor items={resources} title="公益站点" icon="fa-solid fa-link"
            columns={[
              { key: 'title', label: '标题', placeholder: '站点名称' },
              { key: 'category', label: '分类', placeholder: 'nav / video / images' },
              { key: 'url', label: '链接', placeholder: 'https://…' },
              { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-compass' },
              { key: 'description', label: '描述', rows: 2, placeholder: '站点描述…' },
            ]}
            onAdd={async d => { await api.addResource(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateResource(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteResource(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 社交 */}
        {tab === 'socials' && (
          <ListEditor items={socials} title="联系方式" icon="fa-solid fa-share-nodes"
            columns={[
              { key: 'name', label: '名称', placeholder: 'GitHub' },
              { key: 'handle', label: '账号', placeholder: '@username' },
              { key: 'url', label: '链接', placeholder: 'https://github.com/…' },
              { key: 'icon', label: '图标 Class', placeholder: 'fa-brands fa-github' },
              { key: 'color', label: '颜色', type: 'color-text', placeholder: '#838383' },
            ]}
            onAdd={async d => { await api.addSocial(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateSocial(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteSocial(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 修改密码 */}
        {tab === 'password' && <ChangePassword />}
      </main>
    </div>
  );
}

/* ──── Admin 根组件 ──── */
export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="admin-loading">加载中…</div>;
  if (!user) return null;

  return <AdminDashboard />;
}
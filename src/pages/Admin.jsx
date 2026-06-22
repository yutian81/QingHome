import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import * as api from '../api.js';
import '../styles/admin.css';

/* ──── 表单输入 ──── */
function F({ label, value, onChange, type = 'text', placeholder, rows }) {
  const id = label.replace(/\s+/g, '-');
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {rows ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} />
      ) : (
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

/* ──── 列表编辑器 ──── */
function ListEditor({ items, columns, title, onAdd, onUpdate, onDelete }) {
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
        <h3>{title}</h3>
        <button className="admin-btn small" onClick={startAdd}>＋ 新增</button>
      </div>

      {editing && (
        <div className="admin-edit-panel">
          <h4>{editing === 'new' ? '新增' : '编辑'}</h4>
          {displayCols.map(c => (
            <F key={c.key} label={c.label} value={form[c.key] || ''} onChange={v => setForm(f => ({ ...f, [c.key]: v }))} rows={c.rows} type={c.type} placeholder={c.placeholder} />
          ))}
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
    { id: 'profile', label: '个人资料' },
    { id: 'stats', label: '统计' },
    { id: 'nav', label: '导航' },
    { id: 'blog', label: '博客' },
    { id: 'projects', label: '项目' },
    { id: 'resources', label: '资源' },
    { id: 'socials', label: '社交' },
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
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-nav-btn">🏠 查看首页</Link>
          <button className="admin-nav-btn" onClick={logout}>🚪 退出登录</button>
        </div>
      </aside>

      <main className="admin-main">
        {msg && <div className={`admin-msg ${msg.type}`}>{msg.text}</div>}

        {/* 个人资料 */}
        {tab === 'profile' && profile && (
          <div className="admin-section">
            <div className="admin-section-header"><h3>📋 个人资料</h3></div>
            <F label="名称" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
            <F label="品牌" value={profile.brand} onChange={v => setProfile(p => ({ ...p, brand: v }))} />
            <F label="头像 URL" value={profile.avatar} onChange={v => setProfile(p => ({ ...p, avatar: v }))} />
            <F label="标题" value={profile.title} onChange={v => setProfile(p => ({ ...p, title: v }))} />
            <F label="副标题" value={profile.tagline} onChange={v => setProfile(p => ({ ...p, tagline: v }))} />
            <F label="简介" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} rows={3} />
            <F label="邮箱" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} type="email" />
            <F label="状态" value={profile.status} onChange={v => setProfile(p => ({ ...p, status: v }))} placeholder="available / busy / offline" />
            <button className="admin-btn primary" onClick={saveProfile}>保存</button>
          </div>
        )}

        {/* 统计 */}
        {tab === 'stats' && (
          <ListEditor items={stats} title="📊 统计胶囊"
            columns={[{ key: 'label', label: '标签' }, { key: 'value', label: '数值' }, { key: 'icon', label: '图标 Class' }]}
            onAdd={async d => { await api.addStat(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateStat(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteStat(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 导航 */}
        {tab === 'nav' && (
          <ListEditor items={nav} title="🧭 导航菜单"
            columns={[{ key: 'label', label: '标签' }, { key: 'icon', label: '图标 Class' }, { key: 'section_id', label: '区块 ID' }]}
            onAdd={async d => { await api.addNav(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateNav(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteNav(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 博客 */}
        {tab === 'blog' && (
          <ListEditor items={blog} title="📝 博客文章"
            columns={[{ key: 'title', label: '标题' }, { key: 'excerpt', label: '摘要', rows: 2 }, { key: 'date', label: '日期', type: 'date' }, { key: 'tags', label: '标签' }, { key: 'url', label: '链接' }]}
            onAdd={async d => { await api.addBlog(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateBlog(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteBlog(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 项目 */}
        {tab === 'projects' && (
          <ListEditor items={projects} title="💻 开源项目"
            columns={[{ key: 'name', label: '名称' }, { key: 'description', label: '描述', rows: 2 }, { key: 'tags', label: '标签' }, { key: 'stars', label: 'Stars', type: 'number' }, { key: 'language', label: '语言' }, { key: 'language_color', label: '语言色' }, { key: 'url', label: '链接' }, { key: 'icon', label: '图标 Class' }]}
            onAdd={async d => { await api.addProject({ ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateProject(id, { ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteProject(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 资源 */}
        {tab === 'resources' && (
          <ListEditor items={resources} title="🔗 资源分享"
            columns={[{ key: 'title', label: '标题' }, { key: 'description', label: '描述', rows: 2 }, { key: 'category', label: '分类' }, { key: 'icon', label: '图标 Class' }, { key: 'url', label: '链接' }]}
            onAdd={async d => { await api.addResource(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateResource(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteResource(id); await refreshSection(); show('已删除'); }}
          />
        )}

        {/* 社交 */}
        {tab === 'socials' && (
          <ListEditor items={socials} title="🌐 社交链接"
            columns={[{ key: 'name', label: '名称' }, { key: 'handle', label: '账号' }, { key: 'url', label: '链接' }, { key: 'icon', label: '图标 Class' }, { key: 'color', label: '颜色', type: 'color' }]}
            onAdd={async d => { await api.addSocial(d); await refreshSection(); show('已添加'); }}
            onUpdate={async (id, d) => { await api.updateSocial(id, d); await refreshSection(); show('已更新'); }}
            onDelete={async id => { await api.deleteSocial(id); await refreshSection(); show('已删除'); }}
          />
        )}
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
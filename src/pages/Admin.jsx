import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSite } from '../context/SiteContext.jsx';
import * as api from '../api.js';
import { FaIcon } from '../components/Icons.jsx';
import ListEditor from '../components/admin/ListEditor.jsx';
import ChangePassword from '../components/admin/ChangePassword.jsx';
import F from '../components/admin/FormField.jsx';
import '../styles/admin.css';

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
    show('资料已保存');
    refresh();
  };

  const refreshSection = async () => { await loadAll(); refresh(); };

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

  const STATUS_OPTIONS = [
    { value: 'available', label: 'available — 绿色状态点' },
    { value: 'busy', label: 'busy — 黄色状态点' },
    { value: 'offline', label: 'offline — 灰色状态点' },
  ];

  const fromList = (list) => ({
    onAdd: async (d) => { await list.add(d); await refreshSection(); show('已添加'); },
    onUpdate: async (id, d) => { await list.update(id, d); await refreshSection(); show('已更新'); },
    onDelete: async (id) => { await list.delete(id); await refreshSection(); show('已删除'); },
  });

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <h2><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-gear" size={16} />管理后台</span></h2>
          <p className="admin-user"><FaIcon icon="fa-solid fa-user" size={12} /> {user?.username}</p>
        </div>
        <nav>
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="admin-icon-gap"><FaIcon icon={t.icon} size={14} /> {t.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-nav-btn"><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-house" size={15} />查看首页</span></Link>
          <button className="admin-nav-btn" onClick={logout}><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-right-from-bracket" size={15} />退出登录</span></button>
        </div>
      </aside>

      <main className="admin-main">
        {msg && <div className={`admin-msg ${msg.type}`}><span className="admin-icon-gap"><FaIcon icon={msg.type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-check-circle'} size={14} />{msg.text}</span></div>}

        {tab === 'profile' && profile && (
          <div className="admin-section">
            <div className="admin-section-header"><h3><span className="admin-hicon-gap"><FaIcon icon="fa-solid fa-user" size={15} />个人资料</span></h3></div>
            <div className="admin-form-grid">
              <F label="名称" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="例如：青云志主页" />
              <F label="品牌" value={profile.brand} onChange={v => setProfile(p => ({ ...p, brand: v }))} placeholder="例如：QingHome" />
              <F label="头像 URL" value={profile.avatar} onChange={v => setProfile(p => ({ ...p, avatar: v }))} placeholder="https://example.com/avatar.png" />
              <F label="标题" value={profile.title} onChange={v => setProfile(p => ({ ...p, title: v }))} placeholder="例如：一个又菜又爱玩的小白" />
              <F label="副标题" value={profile.tagline} onChange={v => setProfile(p => ({ ...p, tagline: v }))} placeholder="例如：用代码解决问题，用文字记录思考。" />
              <F label="邮箱" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} type="email" placeholder="admin@example.com" />
              <F label="简介" value={profile.bio} onChange={v => setProfile(p => ({ ...p, bio: v }))} rows={3} placeholder="个人简介，支持多行文本" />
              <div className="admin-field">
                <label htmlFor="status">状态</label>
                <select id="status" value={profile.status} onChange={e => setProfile(p => ({ ...p, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <F label="博客链接" value={profile.blog_url} onChange={v => setProfile(p => ({ ...p, blog_url: v }))} placeholder="https://blog.notett.com" />
              <F label="博客按钮文字" value={profile.blog_label} onChange={v => setProfile(p => ({ ...p, blog_label: v }))} placeholder="访问我的博客" />
              <F label="Github 链接" value={profile.github_url} onChange={v => setProfile(p => ({ ...p, github_url: v }))} placeholder="https://github.com/yutian81" />
              <F label="Github 按钮文字" value={profile.github_label} onChange={v => setProfile(p => ({ ...p, github_label: v }))} placeholder="访问我的 Github" />
            </div>
            <button className="admin-btn primary" onClick={saveProfile} style={{ marginTop: 16 }}>保存</button>
          </div>
        )}

        {tab === 'stats' && <ListEditor items={stats} title="统计胶囊" icon="fa-solid fa-chart-simple"
          columns={[{ key: 'label', label: '标签', placeholder: '开源贡献' }, { key: 'value', label: '数值', placeholder: '1.5k+' }, { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-atom' }]}
          {...fromList(api.statsApi)} />}

        {tab === 'nav' && <ListEditor items={nav} title="站点导航" icon="fa-solid fa-bars"
          columns={[{ key: 'label', label: '标签', placeholder: '首页' }, { key: 'section_id', label: '区块 ID', placeholder: 'home' }, { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-house' }]}
          {...fromList(api.navApi)} />}

        {tab === 'blog' && <ListEditor items={blog} title="博客文章" icon="fa-solid fa-feather"
          columns={[{ key: 'title', label: '标题', placeholder: '文章标题' }, { key: 'date', label: '日期', type: 'date' },
            { key: 'url', label: '链接', placeholder: 'https://…' }, { key: 'tags', label: '标签', placeholder: 'Cloudflare,Domain' },
            { key: 'excerpt', label: '摘要', rows: 2, placeholder: '文章摘要内容…' }]}
          {...fromList(api.blogApi)} />}

        {tab === 'projects' && <ListEditor items={projects} title="项目仓库" icon="fa-solid fa-code"
          columns={[{ key: 'name', label: '名称', placeholder: 'project-name' }, { key: 'tags', label: '标签', placeholder: 'Cloudflare,Vite' },
            { key: 'icon', label: '图标 Class', placeholder: 'fa-brands fa-github' }, { key: 'stars', label: 'Stars', type: 'number', placeholder: '99' },
            { key: 'language', label: '语言', placeholder: 'JavaScript' }, { key: 'language_color', label: '语言色', type: 'color-text', placeholder: '#3178c6' },
            { key: 'url', label: '链接', placeholder: 'https://github.com/…' }, { key: 'description', label: '摘要', rows: 2, placeholder: '项目描述…' }]}
          onAdd={async d => { await api.projectsApi.add({ ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已添加'); }}
          onUpdate={async (id, d) => { await api.projectsApi.update(id, { ...d, stars: Number(d.stars) || 0 }); await refreshSection(); show('已更新'); }}
          onDelete={async id => { await api.projectsApi.delete(id); await refreshSection(); show('已删除'); }} />}

        {tab === 'resources' && <ListEditor items={resources} title="公益站点" icon="fa-solid fa-link"
          columns={[{ key: 'title', label: '标题', placeholder: '站点名称' }, { key: 'category', label: '分类', placeholder: 'nav / video / images' },
            { key: 'url', label: '链接', placeholder: 'https://…' }, { key: 'icon', label: '图标 Class', placeholder: 'fa-solid fa-compass' },
            { key: 'description', label: '描述', rows: 2, placeholder: '站点描述…' }]}
          {...fromList(api.resourcesApi)} />}

        {tab === 'socials' && <ListEditor items={socials} title="联系方式" icon="fa-solid fa-share-nodes"
          columns={[{ key: 'name', label: '名称', placeholder: 'GitHub' }, { key: 'handle', label: '账号', placeholder: '@username' },
            { key: 'url', label: '链接', placeholder: 'https://github.com/…' }, { key: 'icon', label: '图标 Class', placeholder: 'fa-brands fa-github' }]}
          {...fromList(api.socialsApi)} />}

        {tab === 'password' && <ChangePassword />}
      </main>
    </div>
  );
}

export default function Admin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="admin-loading"><span className="admin-icon-gap"><FaIcon icon="fa-solid fa-spinner fa-spin" size={15} />加载中…</span></div>;
  if (!user) return null;

  return <AdminDashboard />;
}
/**
 * QingHome Worker
 */

// ── 模块级初始化标志（仅首次请求建表）──
let _initialized = false;

// ── 默认种子数据 ──
const DEFAULT_PROFILE = {
  name: '青云志主页', brand: 'QingHome',
  avatar: 'https://pan.811520.xyz/icon/logo128.webp',
  title: '一个又菜又爱玩的小白',
  tagline: '用代码解决问题，用文字记录思考。',
  bio: '这里是我记录所学、与同好交流的小小窗口，也是督促自己不断精进的自留地。\\n愿每一位到访的你，都能有所收获、心生共鸣。',
  email: 'admin@24811213.xyz', status: 'available',
  blog_url: 'https://blog.notett.com', blog_label: '访问我的博客',
  github_url: 'https://github.com/yutian81', github_label: '访问我的 Github',
  site_icon: 'https://pan.811520.xyz/icon/qinghome128.png',
};

const DEFAULT_STATS = [
  { id: 1, label: '开源贡献', value: '1.5k+', icon: 'fa-solid fa-atom' },
  { id: 2, label: '技术文章', value: '96', icon: 'fa-solid fa-file-lines' },
  { id: 3, label: 'GitHub Stars', value: '839', icon: 'fa-solid fa-star' },
];

const DEFAULT_NAV = [
  { id: 1, label: '首页', icon: 'fa-solid fa-house', section_id: 'home' },
  { id: 2, label: '博客', icon: 'fa-solid fa-feather', section_id: 'blog' },
  { id: 3, label: '项目', icon: 'fa-solid fa-code', section_id: 'projects' },
  { id: 4, label: '站点', icon: 'fa-solid fa-compass', section_id: 'resources' },
  { id: 5, label: '联系', icon: 'fa-solid fa-envelope', section_id: 'connect' },
];

const DEFAULT_BLOG = [
  { id: 1, title: '现代化域名管理工具', excerpt: '基于 Cloudflare Worker 和 KV 构建的域名监控面板。', date: '2025-11-18', tags: 'Cloudflare,Domain', url: 'https://blog.notett.com/post/2025/11/251118-domain-check/' },
  { id: 2, title: 'Hexo 博客文章加密局部指定内容', excerpt: '加密插件 hexo-blog-encrypt 可以加密单篇文章，但不能实现局部内容加密。', date: '2025-12-24', tags: 'Hexo,Encrypt', url: 'https://blog.notett.com/post/2025/08/250809-hexo-jiami/' },
  { id: 3, title: '在 Obsidian 中使用兰空图床 API 自动传图', excerpt: 'pnpm workspace + Turborepo + Changesets 的实战落地。', date: '2025-02-18', tags: 'Obsidian,LskyPro', url: 'https://blog.notett.com/post/2024/10/lskypro-nf/' },
  { id: 4, title: '白嫖 B2 10G 对象存储并挂载到 alist', excerpt: '让 B2 的私有桶通过 CF Worker 反代实现公开访问。', date: '2025-05-03', tags: 'Backblaze,Cloudflare', url: 'https://blog.notett.com/post/2025/05/b2-bucket-mount/' },
  { id: 5, title: '免费域名资源收集', excerpt: '收集一些免费的域名资源供大家选择使用。', date: '2025-05-30', tags: 'Domain,Free', url: 'https://blog.notett.com/post/2025/05/250530-free-domain/' },
  { id: 6, title: '用 Serv00 设置域名邮箱', excerpt: 'Serv00 自带的邮箱功能能够实现收发件，同时支持 IMAP/POP/SMTP 功能。', date: '2025-06-29', tags: 'Serv00,Mail', url: 'https://blog.notett.com/post/2025/06/202506-s00-email/' },
];

const DEFAULT_PROJECTS = [
  { id: 1, name: 'domain-check', description: '基于 Cloudflare Worker 和 KV 构建的域名到期监控仪表盘，支持到期提醒。', tags: 'Cloudflare,Domain', stars: 245, language: 'JavaScript', language_color: '#083fa1', url: 'https://github.com/yutian81/domain-check', icon: 'fa-brands fa-github' },
  { id: 2, name: 'IP-SpeedTest', description: '测试 Cloudflare IP 地址的位置信息、延迟和下载速度。', tags: 'SpeedTest,Cloudflare', stars: 30, language: 'Golang', language_color: '#3178c6', url: 'https://github.com/yutian81/IP-SpeedTest', icon: 'fa-brands fa-github' },
  { id: 3, name: 'Keepalive', description: '各种保活项目合集。', tags: 'Keepalive,Action', stars: 167, language: 'Python', language_color: '#f1e05a', url: 'https://github.com/yutian81/Keepalive', icon: 'fa-brands fa-github' },
  { id: 4, name: 'QingHome', description: '一个精美的现代化个人主页。', tags: 'Cloudflare,Vite,React', stars: 99, language: 'TypeScript', language_color: '#3178c6', url: 'https://github.com/yutian81/QingHome', icon: 'fa-brands fa-github' },
  { id: 5, name: 'openclaw-hug', description: '专用于 Hugging Face 的 openclaw 部署方案。', tags: 'Hugging,AI', stars: 98, language: 'Shell', language_color: '#f1e05a', url: 'https://github.com/yutianqq/openclaw-hug', icon: 'fa-brands fa-github' },
  { id: 6, name: 'hermes-hug', description: '专用于 Hugging Face 的 hermes 部署方案。', tags: 'Hugging,AI', stars: 97, language: 'Shell', language_color: '#563d7c', url: 'https://github.com/yutianqq/hermes-hug', icon: 'fa-brands fa-github' },
];

const DEFAULT_RESOURCES = [
  { id: 1, title: '青云志导航', description: '个人导航站点，可注册账户，或私有化部署。', category: 'nav', icon: 'fa-solid fa-compass', url: 'https://weby.netlib.re' },
  { id: 2, title: 'MoonTV', description: '免费的在线视频网站。', category: 'video', icon: 'fa-solid fa-circle-play', url: 'https://moon.qyun.nyc.mn' },
  { id: 3, title: '域名邮箱', description: '可长期使用的免费域名邮箱。', category: 'email', icon: 'fa-solid fa-envelope', url: 'https://mail.v360.pp.ua/' },
  { id: 4, title: 'WebSSH', description: '在线SSH连接工具。', category: 'ssh', icon: 'fa-solid fa-crosshairs', url: 'https://ssh.yuzong.nyc.mn' },
  { id: 5, title: '订阅转换', description: '在线订阅转换工具，支持 clash、sing-box 等格式。', category: 'sub', icon: 'fa-solid fa-arrows-to-dot', url: 'https://sub.ccwu.cc' },
  { id: 6, title: '优选订阅', description: '精选大量优质中转IP，加速你的CF节点。', category: 'sub', icon: 'fa-solid fa-diagram-next', url: 'https://sub.ais.sld.tw/sub' },
  { id: 7, title: '兰空图床', description: '二开美化的兰空图床。', category: 'images', icon: 'fa-solid fa-images', url: 'https://img.811520.xyz' },
  { id: 8, title: '封面制作', description: '为博客文章制作精美的封面。', category: 'images', icon: 'fa-solid fa-layer-group', url: 'https://cover.811520.xyz' },
  { id: 9, title: '每日bing图', description: '每日自动更新 Bing 壁纸，提供精美高清图片。', category: 'images', icon: 'fa-brands fa-square-xing', url: 'https://bing.by.ccwu.cc' },
];

const DEFAULT_SOCIALS = [
  { id: 1, name: 'GitHub', handle: '@yutian81', url: 'https://github.com/yutian81', icon: 'fa-brands fa-github' },
  { id: 2, name: 'Telegram', handle: '@yutian88881', url: 'https://t.me/yutian88881', icon: 'fa-brands fa-telegram' },
  { id: 3, name: 'Bilibili', handle: '@雨天-狂奔', url: 'https://space.bilibili.com/677845115', icon: 'fa-brands fa-bilibili' },
  { id: 4, name: 'Email', handle: '@yutian81', url: 'mailto:admin@24811213.xyz', icon: 'fa-solid fa-envelope' },
];

// ── 密码哈希（PBKDF2 + 随机盐）──
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hash = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return saltHex + ':' + hash;
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  const hash = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hash === hashHex;
}

// ── 通用 CRUD 工厂 ──
function crudAPI(table, columns) {
  const cols = columns.join(',');
  const placeholders = columns.map(() => '?').join(',');
  const setClause = columns.map(c => `${c}=?`).join(',');

  return {
    async getAll(db) {
      const r = await db.prepare(`SELECT id,${cols} FROM ${table} ORDER BY sort_order ASC, id ASC`).all();
      return r.results;
    },
    async add(db, data) {
      const m = await db.prepare(`SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM ${table}`).first();
      const vals = columns.map(c => data[c] ?? null);
      await db.prepare(`INSERT INTO ${table} (${cols},sort_order) VALUES (${placeholders},?)`).bind(...vals, m.n).run();
    },
    async update(db, id, data) {
      const vals = columns.map(c => data[c] ?? null);
      await db.prepare(`UPDATE ${table} SET ${setClause} WHERE id=?`).bind(...vals, id).run();
    },
    async remove(db, id) {
      await db.prepare(`DELETE FROM ${table} WHERE id=?`).bind(id).run();
    },
  };
}

const SECTIONS = {
  stats: crudAPI('stats', ['label', 'value', 'icon']),
  nav: crudAPI('nav_items', ['label', 'icon', 'section_id']),
  blog: crudAPI('blog_posts', ['title', 'excerpt', 'date', 'tags', 'url']),
  projects: crudAPI('projects', ['name', 'description', 'tags', 'stars', 'language', 'language_color', 'url', 'icon']),
  resources: crudAPI('resources', ['title', 'description', 'category', 'icon', 'url']),
  socials: crudAPI('socials', ['name', 'handle', 'url', 'icon']),
};

// ── 建表（仅首次请求执行）──
const TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`,
  `CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', brand TEXT DEFAULT '', avatar TEXT DEFAULT '', title TEXT DEFAULT '', tagline TEXT DEFAULT '', bio TEXT DEFAULT '', email TEXT DEFAULT '', status TEXT DEFAULT 'available', site_icon TEXT DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT DEFAULT '', value TEXT DEFAULT '', icon TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT DEFAULT '', excerpt TEXT DEFAULT '', date TEXT DEFAULT '', tags TEXT DEFAULT '', url TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', description TEXT DEFAULT '', tags TEXT DEFAULT '', stars INTEGER DEFAULT 0, language TEXT DEFAULT '', language_color TEXT DEFAULT '', url TEXT DEFAULT '', icon TEXT DEFAULT 'fa-brands fa-github', sort_order INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT DEFAULT '', description TEXT DEFAULT '', category TEXT DEFAULT '', icon TEXT DEFAULT '', url TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS socials (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', handle TEXT DEFAULT '', url TEXT DEFAULT '', icon TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS nav_items (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT DEFAULT '', icon TEXT DEFAULT '', section_id TEXT DEFAULT '', sort_order INTEGER DEFAULT 0)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)`,
  `CREATE TABLE IF NOT EXISTS gh_stars_cache (repo TEXT PRIMARY KEY, stars INTEGER NOT NULL, updated_at TEXT NOT NULL)`,
];

async function ensureTables(env) {
  if (_initialized) return;
  // 轻量检查：尝试查询 profile 表，失败则创建
  try {
    await env.DB.prepare("SELECT 1 FROM profile LIMIT 1").run();
  } catch {
    for (const sql of TABLES_SQL) {
      await env.DB.prepare(sql).run();
    }
  }
  // 旧数据库兼容：添加新字段（忽略已存在）
  try { await env.DB.prepare("ALTER TABLE profile ADD COLUMN blog_url TEXT").run(); } catch {}
  try { await env.DB.prepare("ALTER TABLE profile ADD COLUMN blog_label TEXT").run(); } catch {}
  try { await env.DB.prepare("ALTER TABLE profile ADD COLUMN github_url TEXT").run(); } catch {}
  try { await env.DB.prepare("ALTER TABLE profile ADD COLUMN github_label TEXT").run(); } catch {}
  try { await env.DB.prepare("ALTER TABLE profile ADD COLUMN site_icon TEXT").run(); } catch {}
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
  _initialized = true;
}

// ── 种子数据 ──
async function seedIfEmpty(env) {
  const { count } = await env.DB.prepare('SELECT COUNT(*) as count FROM profile').first();
  if (count > 0) return;

  const stmts = [
    env.DB.prepare('INSERT INTO profile (name,brand,avatar,title,tagline,bio,email,status,blog_url,blog_label,github_url,github_label,site_icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(DEFAULT_PROFILE.name, DEFAULT_PROFILE.brand, DEFAULT_PROFILE.avatar, DEFAULT_PROFILE.title, DEFAULT_PROFILE.tagline, DEFAULT_PROFILE.bio, DEFAULT_PROFILE.email, DEFAULT_PROFILE.status, DEFAULT_PROFILE.blog_url, DEFAULT_PROFILE.blog_label, DEFAULT_PROFILE.github_url, DEFAULT_PROFILE.github_label, DEFAULT_PROFILE.site_icon),
  ];
  DEFAULT_STATS.forEach((s, i) => stmts.push(env.DB.prepare('INSERT INTO stats (label,value,icon,sort_order) VALUES (?,?,?,?)').bind(s.label, s.value, s.icon, i)));
  DEFAULT_NAV.forEach((n, i) => stmts.push(env.DB.prepare('INSERT INTO nav_items (label,icon,section_id,sort_order) VALUES (?,?,?,?)').bind(n.label, n.icon, n.section_id, i)));
  DEFAULT_BLOG.forEach((b, i) => stmts.push(env.DB.prepare('INSERT INTO blog_posts (title,excerpt,date,tags,url,sort_order) VALUES (?,?,?,?,?,?)').bind(b.title, b.excerpt, b.date, b.tags, b.url, i)));
  DEFAULT_PROJECTS.forEach((p, i) => stmts.push(env.DB.prepare('INSERT INTO projects (name,description,tags,stars,language,language_color,url,icon,sort_order) VALUES (?,?,?,?,?,?,?,?,?)').bind(p.name, p.description, p.tags, p.stars, p.language, p.language_color, p.url, p.icon, i)));
  DEFAULT_RESOURCES.forEach((r, i) => stmts.push(env.DB.prepare('INSERT INTO resources (title,description,category,icon,url,sort_order) VALUES (?,?,?,?,?,?)').bind(r.title, r.description, r.category, r.icon, r.url, i)));
  DEFAULT_SOCIALS.forEach((s, i) => stmts.push(env.DB.prepare('INSERT INTO socials (name,handle,url,icon,sort_order) VALUES (?,?,?,?,?)').bind(s.name, s.handle, s.url, s.icon, i)));

  await env.DB.batch(stmts);
}

async function hasAdmin(env) {
  const row = await env.DB.prepare('SELECT COUNT(*) as count FROM admin_users').first();
  return row.count > 0;
}

function json(data, status = 200, cacheControl) {
  const headers = { 'Content-Type': 'application/json' };
  if (cacheControl) headers['Cache-Control'] = cacheControl;
  return new Response(JSON.stringify(data), { status, headers });
}

// ── 路由处理 ──
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' } });
  }

  await ensureTables(env);
  await seedIfEmpty(env);

  // ── 公开配置 ──
  if (pathname === '/api/public/config' && request.method === 'GET') return getPublicConfig(env);

  // ── Auth ──
  if (pathname === '/api/auth/login' && request.method === 'POST') return login(request, env);
  if (pathname === '/api/auth/logout' && request.method === 'POST') return logout(request, env);

  // ── 后台状态 ──
  if (pathname === '/api/admin/status' && request.method === 'GET') {
    return json({ setupNeeded: !(await hasAdmin(env)) });
  }

  // ── 创建首位管理员 ──
  if (pathname === '/api/admin/setup' && request.method === 'POST') {
    const exists = await hasAdmin(env);
    if (exists) return json({ error: '管理员已存在' }, 400);
    const { username, password } = await request.json();
    if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);
    if (password.length < 6) return json({ error: '密码至少 6 位' }, 400);
    const hash = await hashPassword(password);
    try {
      await env.DB.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').bind(username, hash).run();
    } catch (e) {
      if (e.message.includes('UNIQUE')) return json({ error: '用户名已存在' }, 409);
      throw e;
    }
    await seedIfEmpty(env);
    const token = generateToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const user = await env.DB.prepare('SELECT id FROM admin_users WHERE username = ?').bind(username).first();
    await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();
    return json({ token, username, expires });
  }

  // ── 修改密码 ──
  if (pathname === '/api/admin/change-password' && request.method === 'POST') {
    const authUser = await getAuthUser(request, env);
    if (!authUser) return json({ error: '未登录' }, 401);
    const { oldPassword, newPassword } = await request.json();
    if (!oldPassword || !newPassword) return json({ error: '密码不能为空' }, 400);
    if (newPassword.length < 6) return json({ error: '新密码至少 6 位' }, 400);
    const user = await env.DB.prepare('SELECT password_hash FROM admin_users WHERE id = ?').bind(authUser.userId).first();
    if (!(await verifyPassword(oldPassword, user.password_hash))) return json({ error: '旧密码错误' }, 401);
    const newHash = await hashPassword(newPassword);
    await env.DB.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').bind(newHash, authUser.userId).run();
    return json({ ok: true });
  }

  // ── GitHub Stars 批量获取 ──
  if (pathname === '/api/github-stars' && request.method === 'GET') {
    const repos = url.searchParams.get('repos') || '';
    const list = repos.split(',').filter(Boolean);
    const results = {};
    const now = Date.now();
    const ttl = 60 * 60 * 1000; // 1 小时缓存

    for (const repo of list.slice(0, 20)) {
      // 先从 D1 读缓存
      const cached = await env.DB.prepare('SELECT stars, updated_at FROM gh_stars_cache WHERE repo = ?').bind(repo).first();
      if (cached && (now - new Date(cached.updated_at).getTime()) < ttl) {
        results[repo] = cached.stars;
        continue;
      }
      // 缓存过期或不存在，请求 GitHub
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { 'User-Agent': 'qinghome/1.0', 'Accept': 'application/vnd.github.v3+json' },
        });
        if (res.ok) {
          const data = await res.json();
          const stars = data.stargazers_count;
          results[repo] = stars;
          await env.DB.prepare('INSERT OR REPLACE INTO gh_stars_cache (repo, stars, updated_at) VALUES (?, ?, datetime(\'now\'))').bind(repo, stars).run();
        }
      } catch {}
    }
    return json(results);
  }

  // ── 管理后台 CRUD ──
  if (pathname.startsWith('/api/admin/')) {
    const authUser = await getAuthUser(request, env);
    if (!authUser) return json({ error: '未登录' }, 401);
    const sectionPath = pathname.replace('/api/admin/', '');

    // GET 所有配置
    if (sectionPath === 'config' && request.method === 'GET') return getPublicConfig(env);

    // Profile
    if (sectionPath === 'config/profile' && request.method === 'PUT') {
      const data = await parseJSON(request);
      const { count } = await env.DB.prepare('SELECT COUNT(*) as count FROM profile').first();
      if (count > 0) {
        await env.DB.prepare('UPDATE profile SET name=?,brand=?,avatar=?,title=?,tagline=?,bio=?,email=?,status=?,blog_url=?,blog_label=?,github_url=?,github_label=?,site_icon=? WHERE id=(SELECT id FROM profile LIMIT 1)')
          .bind(data.name, data.brand, data.avatar, data.title, data.tagline, data.bio, data.email, data.status, data.blog_url, data.blog_label, data.github_url, data.github_label, data.site_icon).run();
      } else {
        await env.DB.prepare('INSERT INTO profile (name,brand,avatar,title,tagline,bio,email,status,blog_url,blog_label,github_url,github_label,site_icon) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)')
          .bind(data.name, data.brand, data.avatar, data.title, data.tagline, data.bio, data.email, data.status, data.blog_url, data.blog_label, data.github_url, data.github_label, data.site_icon).run();
      }
      return json({ ok: true });
    }

    // 通用 CRUD 路由
    const sectionMatch = sectionPath.match(/^config\/(stats|nav|blog|projects|resources|socials)(?:\/(\d+))?$/);
    if (sectionMatch) {
      const section = sectionMatch[1];
      const id = sectionMatch[2] ? parseInt(sectionMatch[2]) : null;
      const api = SECTIONS[section];
      if (request.method === 'GET' && !id) { const items = await api.getAll(env.DB); return json(items); }
      if (request.method === 'POST' && !id) { const d = await parseJSON(request); await api.add(env.DB, d); return json({ ok: true }); }
      if (request.method === 'PUT' && id) { const d = await parseJSON(request); await api.update(env.DB, id, d); return json({ ok: true }); }
      if (request.method === 'DELETE' && id) { await api.remove(env.DB, id); return json({ ok: true }); }
    }

    return json({ error: '未知路由' }, 404);
  }

  return undefined;
}

async function parseJSON(request) {
  try { return await request.json(); } catch { return null; }
}

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getAuthUser(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const row = await env.DB.prepare(
    'SELECT s.user_id, u.username FROM sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime(\'now\')'
  ).bind(token).first();
  if (!row) return null;
  return { userId: row.user_id, username: row.username };
}

async function login(request, env) {
  const { username, password } = await parseJSON(request);
  if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);
  const user = await env.DB.prepare('SELECT id, password_hash FROM admin_users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: '用户名或密码错误' }, 401);
  if (!(await verifyPassword(password, user.password_hash))) return json({ error: '用户名或密码错误' }, 401);
  const token = generateToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();
  return json({ token, username, expires });
}

async function logout(request, env) {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const row = await env.DB.prepare('SELECT id FROM sessions WHERE token = ?').bind(token).first();
    if (row) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    }
  }
  return json({ ok: true });
}

// 返回纯数据对象（可复用：API 响应 + HTML 注入）
async function getPublicConfigData(env) {
	const db = env.DB;
	const [profile, stats, navItems, blogPosts, projects, resources, socials] = await Promise.all([
		db.prepare('SELECT * FROM profile LIMIT 1').first(),
		db.prepare('SELECT * FROM stats ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
		db.prepare('SELECT * FROM nav_items ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
		db.prepare('SELECT * FROM blog_posts ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
		db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
		db.prepare('SELECT * FROM resources ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
		db.prepare('SELECT * FROM socials ORDER BY sort_order ASC, id ASC').all().then(r => r.results),
	]);
	return {
		profile: profile || DEFAULT_PROFILE,
		stats: stats.length ? stats : DEFAULT_STATS,
		navItems: navItems.length ? navItems : DEFAULT_NAV,
		blogPosts: blogPosts.length ? blogPosts : DEFAULT_BLOG,
		projects: projects.length ? projects : DEFAULT_PROJECTS,
		resources: resources.length ? resources : DEFAULT_RESOURCES,
		socials: socials.length ? socials : DEFAULT_SOCIALS,
	};
}

async function getPublicConfig(env) {
	const data = await getPublicConfigData(env);
	return json(data, 200, 'public, max-age=3600');
}

export default {
  async scheduled(event, env) {
    // 保活：触发建表检查 + 一次空数据库查询使 D1 连接保持活跃
    await ensureTables(env);
    _initialized = true;
  },

  async fetch(request, env) {
    try {
      const response = await handleRequest(request, env);
      if (response) return response;

      // 静态资源缓存策略
      if (!env.ASSETS) return new Response('Not Found', { status: 404 });
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.ok) {
        const url = new URL(request.url);
        // 带 content hash 的文件（JS/CSS/图片）→ 长期缓存
        if (/\.[a-f0-9]{8,}\.(js|css|png|jpg|jpeg|webp|gif|svg|ico)$/i.test(url.pathname)) {
          const headers = new Headers(assetResponse.headers);
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return new Response(assetResponse.body, { status: assetResponse.status, headers });
        }
        // index.html → 内嵌配置数据，省掉前端 API 请求
        const contentType = assetResponse.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          const html = await assetResponse.text();
          const configData = await getPublicConfigData(env);
          const safeJson = JSON.stringify(configData).replace(/<\/script>/g, '<\\/script>');
          const injectedHtml = html.replace(
            '<div id="root">',
            `<script>window.__INITIAL_CONFIG__=${safeJson}</script>\n    <div id="root">`
          );
          const headers = new Headers(assetResponse.headers);
          headers.set('Cache-Control', 'no-cache');
          headers.delete('Content-Length');
          return new Response(injectedHtml, { status: 200, headers });
        }
      }
      return assetResponse;
    } catch (err) {
      console.error('QingHome Error:', err.message);
      return json({ error: '服务器内部错误' }, 500);
    }
  },
};
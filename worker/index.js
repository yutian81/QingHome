/**
 * QingHome2 Worker
 * 路由：/api/* → API 处理  / 其他 → 静态资源（SPA fallback）
 *
 * 环境变量（在 Cloudflare Dashboard 或通过 wrangler secret 设置）：
 *   ADMIN_USER  — 管理员用户名（必填）
 *   ADMIN_PASS  — 管理员密码（必填）
 */

// ──────────────────────────────────────────────
//  默认种子数据
// ──────────────────────────────────────────────
const DEFAULT_PROFILE = {
  name: '青云志主页', brand: 'QingHome',
  avatar: 'https://pan.811520.xyz/icon/logo128.webp',
  title: '一个又菜又爱玩的小白',
  tagline: '用代码解决问题，用文字记录思考。',
  bio: '这里是我记录所学、与同好交流的小小窗口，也是督促自己不断精进的自留地。\n愿每一位到访的你，都能有所收获、心生共鸣。',
  email: 'admin@24811213.xyz', status: 'available',
};

const DEFAULT_STATS = [
  { label: '开源贡献', value: '1.5k+', icon: 'fa-solid fa-atom' },
  { label: '技术文章', value: '96', icon: 'fa-solid fa-file-lines' },
  { label: 'GitHub Stars', value: '839', icon: 'fa-solid fa-star' },
];

const DEFAULT_NAV = [
  { label: '首页', icon: 'fa-solid fa-house', section_id: 'home' },
  { label: '博客', icon: 'fa-solid fa-feather', section_id: 'blog' },
  { label: '项目', icon: 'fa-solid fa-code', section_id: 'projects' },
  { label: '站点', icon: 'fa-solid fa-compass', section_id: 'resources' },
  { label: '联系', icon: 'fa-solid fa-envelope', section_id: 'connect' },
];

const DEFAULT_BLOG = [
  { title: '现代化域名管理工具', excerpt: '基于 Cloudflare Worker 和 KV 构建的域名监控面板。', date: '2025-11-18', tags: 'Cloudflare,Domain', url: 'https://blog.notett.com/post/2025/11/251118-domain-check/' },
  { title: 'Hexo 博客文章加密局部指定内容', excerpt: '加密插件 hexo-blog-encrypt 可以加密单篇文章，但不能实现局部内容加密。', date: '2025-12-24', tags: 'Hexo,Encrypt', url: 'https://blog.notett.com/post/2025/08/250809-hexo-jiami/' },
  { title: '在 Obsidian 中使用兰空图床 API 自动传图', excerpt: 'pnpm workspace + Turborepo + Changesets 的实战落地。', date: '2025-02-18', tags: 'Obsidian,LskyPro', url: 'https://blog.notett.com/post/2024/10/lskypro-nf/' },
  { title: '白嫖 B2 10G 对象存储并挂载到 alist', excerpt: '让 B2 的私有桶通过 CF Worker 反代实现公开访问。', date: '2025-05-03', tags: 'backblaze,Cloudflare', url: 'https://blog.notett.com/post/2025/05/b2-bucket-mount/' },
  { title: '免费域名资源收集', excerpt: '收集一些免费的域名资源供大家选择使用。', date: '2025-05-30', tags: 'Domain,Free', url: 'https://blog.notett.com/post/2025/05/250530-free-domain/' },
  { title: '用 Serv00 设置域名邮箱', excerpt: 'Serv00 自带的邮箱功能能够实现收发件，同时支持 IMAP/POP/SMTP 功能。', date: '2025-06-29', tags: 'Serv00,Mail', url: 'https://blog.notett.com/post/2025/06/202506-s00-email/' },
];

const DEFAULT_PROJECTS = [
  { name: 'domain-check', description: '基于 Cloudflare Worker 和 Worker KV 构建的域名到期监控仪表盘，支持到期提醒。', tags: 'Cloudflare,Domain', stars: 245, language: 'JavaScript', language_color: '#083fa1', url: 'https://github.com/yutian81/domain-check', icon: 'fa-brands fa-github' },
  { name: 'IP-SpeedTest', description: '测试 Cloudflare IP 地址的位置信息、延迟和下载速度。', tags: 'SpeedTest,Cloudflare', stars: 30, language: 'Golang', language_color: '#3178c6', url: 'https://github.com/yutian81/IP-SpeedTest', icon: 'fa-brands fa-github' },
  { name: 'Keepalive', description: '各种保活项目合集。', tags: 'Keepalive,Action', stars: 167, language: 'Python', language_color: '#f1e05a', url: 'https://github.com/yutian81/Keepalive', icon: 'fa-brands fa-github' },
  { name: 'QingHome', description: '一个精美的现代化个人主页。', tags: 'Cloudflare,Vite,React', stars: 99, language: 'TypeScript', language_color: '#3178c6', url: 'https://github.com/yutian81/QingHome', icon: 'fa-brands fa-github' },
  { name: 'openclaw-hug', description: '专用于 Hugging Face 的 openclaw 部署方案。', tags: 'Hugging,AI', stars: 98, language: 'Shell', language_color: '#f1e05a', url: 'https://github.com/yutianqq/openclaw-hug', icon: 'fa-brands fa-github' },
  { name: 'hermes-hug', description: '专用于 Hugging Face 的 hermes 部署方案。', tags: 'Hugging,AI', stars: 97, language: 'Shell', language_color: '#563d7c', url: 'https://github.com/yutianqq/hermes-hug', icon: 'fa-brands fa-github' },
];

const DEFAULT_RESOURCES = [
  { title: '青云志导航', description: '个人导航站点，可注册账户，或私有化部署。', category: 'nav', icon: 'fa-solid fa-compass', url: 'https://weby.netlib.re' },
  { title: 'MoonTV', description: '免费的在线视频网站。', category: 'video', icon: 'fa-solid fa-circle-play', url: 'https://moon.qyun.nyc.mn' },
  { title: '域名邮箱', description: '可长期使用的免费域名邮箱。', category: 'email', icon: 'fa-solid fa-envelope', url: 'https://mail.v360.pp.ua/' },
  { title: '兰空图床', description: '二开美化的兰空图床。', category: 'images', icon: 'fa-solid fa-images', url: 'https://img.811520.xyz' },
  { title: '短链生成', description: '一个简单易用的短链接生成器。', category: 'links', icon: 'fa-solid fa-link', url: 'https://v1.us.ci/yutian81' },
  { title: 'WebSSH', description: '在线SSH连接工具。', category: 'ssh', icon: 'fa-solid fa-crosshairs', url: 'https://ssh.yuzong.nyc.mn' },
  { title: '订阅转换', description: '在线订阅转换工具，支持 clash、sing-box 等格式。', category: 'sub', icon: 'fa-solid fa-arrows-to-dot', url: 'https://sub.ccwu.cc' },
  { title: '优选订阅', description: '精选大量优质中转IP，加速你的CF节点。', category: 'sub', icon: 'fa-solid fa-diagram-next', url: 'https://sub.ais.sld.tw/sub' },
  { title: '封面制作', description: '为博客文章制作精美的封面。', category: 'images', icon: 'fa-solid fa-layer-group', url: 'https://cover.811520.xyz' },
  { title: '每日bing图', description: '每日自动更新 Bing 壁纸，提供精美高清图片。', category: 'images', icon: 'fa-brands fa-square-xing', url: 'https://bing.by.ccwu.cc' },
];

const DEFAULT_SOCIALS = [
  { name: 'GitHub', handle: '@yutian81', url: 'https://github.com/yutian81', icon: 'fa-brands fa-github', color: '#838383' },
  { name: 'Telegram', handle: '@yutian88881', url: 'https://t.me/yutian88881', icon: 'fa-brands fa-telegram', color: '#1d9bf0' },
  { name: 'Bilibili', handle: '@雨天-狂奔', url: 'https://space.bilibili.com/677845115', icon: 'fa-brands fa-bilibili', color: '#1e80ff' },
  { name: 'Email', handle: '@yutian81', url: 'mailto:admin@24811213.xyz', icon: 'fa-solid fa-envelope', color: '#ea4335' },
];

// ──────────────────────────────────────────────
//  认证工具
// ──────────────────────────────────────────────
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
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
    'SELECT s.user_id, s.expires_at, u.username FROM sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.token = ?'
  ).bind(token).first();
  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return null;
  }
  return { userId: row.user_id, username: row.username };
}

// ──────────────────────────────────────────────
//  数据库初始化（建表 + 种子数据）
// ──────────────────────────────────────────────
async function ensureDatabase(env) {
  // 建表（幂等）
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT NOT NULL UNIQUE, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', brand TEXT DEFAULT '', avatar TEXT DEFAULT '', title TEXT DEFAULT '', tagline TEXT DEFAULT '', bio TEXT DEFAULT '', email TEXT DEFAULT '', status TEXT DEFAULT 'available');
    CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT DEFAULT '', value TEXT DEFAULT '', icon TEXT DEFAULT '', sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT DEFAULT '', excerpt TEXT DEFAULT '', date TEXT DEFAULT '', tags TEXT DEFAULT '', url TEXT DEFAULT '', sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', description TEXT DEFAULT '', tags TEXT DEFAULT '', stars INTEGER DEFAULT 0, language TEXT DEFAULT '', language_color TEXT DEFAULT '', url TEXT DEFAULT '', icon TEXT DEFAULT 'fa-brands fa-github', sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS resources (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT DEFAULT '', description TEXT DEFAULT '', category TEXT DEFAULT '', icon TEXT DEFAULT '', url TEXT DEFAULT '', sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS socials (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT DEFAULT '', handle TEXT DEFAULT '', url TEXT DEFAULT '', icon TEXT DEFAULT '', color TEXT DEFAULT '', sort_order INTEGER DEFAULT 0);
    CREATE TABLE IF NOT EXISTS nav_items (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT DEFAULT '', icon TEXT DEFAULT '', section_id TEXT DEFAULT '', sort_order INTEGER DEFAULT 0);
  `);

  // 每次请求都从环境变量同步到数据库
  const adminUser = env.ADMIN_USER;
  const adminPass = env.ADMIN_PASS;

  if (!adminUser || !adminPass) {
    return { adminConfigured: false };
  }

  // 创建或更新管理员（幂等：不存在则插入，存在则更新密码）
  const hash = await hashPassword(adminPass);
  const existing = await env.DB.prepare('SELECT id FROM admin_users WHERE username = ?').bind(adminUser).first();
  if (existing) {
    await env.DB.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').bind(hash, existing.id).run();
  } else {
    await env.DB.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').bind(adminUser, hash).run();
  }

  // 仅当没有种子数据时才写入默认数据
  const profileCount = await env.DB.prepare('SELECT COUNT(*) as count FROM profile').first();
  if (profileCount.count === 0) {
    await env.DB.prepare('INSERT INTO profile (name,brand,avatar,title,tagline,bio,email,status) VALUES (?,?,?,?,?,?,?,?)')
      .bind(DEFAULT_PROFILE.name, DEFAULT_PROFILE.brand, DEFAULT_PROFILE.avatar, DEFAULT_PROFILE.title, DEFAULT_PROFILE.tagline, DEFAULT_PROFILE.bio, DEFAULT_PROFILE.email, DEFAULT_PROFILE.status).run();

    for (let i = 0; i < DEFAULT_STATS.length; i++) {
      await env.DB.prepare('INSERT INTO stats (label,value,icon,sort_order) VALUES (?,?,?,?)')
        .bind(DEFAULT_STATS[i].label, DEFAULT_STATS[i].value, DEFAULT_STATS[i].icon, i).run();
    }
    for (let i = 0; i < DEFAULT_NAV.length; i++) {
      await env.DB.prepare('INSERT INTO nav_items (label,icon,section_id,sort_order) VALUES (?,?,?,?)')
        .bind(DEFAULT_NAV[i].label, DEFAULT_NAV[i].icon, DEFAULT_NAV[i].section_id, i).run();
    }
    for (let i = 0; i < DEFAULT_BLOG.length; i++) {
      await env.DB.prepare('INSERT INTO blog_posts (title,excerpt,date,tags,url,sort_order) VALUES (?,?,?,?,?,?)')
        .bind(DEFAULT_BLOG[i].title, DEFAULT_BLOG[i].excerpt, DEFAULT_BLOG[i].date, DEFAULT_BLOG[i].tags, DEFAULT_BLOG[i].url, i).run();
    }
    for (let i = 0; i < DEFAULT_PROJECTS.length; i++) {
      const p = DEFAULT_PROJECTS[i];
      await env.DB.prepare('INSERT INTO projects (name,description,tags,stars,language,language_color,url,icon,sort_order) VALUES (?,?,?,?,?,?,?,?,?)')
        .bind(p.name, p.description, p.tags, p.stars, p.language, p.language_color, p.url, p.icon, i).run();
    }
    for (let i = 0; i < DEFAULT_RESOURCES.length; i++) {
      const r = DEFAULT_RESOURCES[i];
      await env.DB.prepare('INSERT INTO resources (title,description,category,icon,url,sort_order) VALUES (?,?,?,?,?,?)')
        .bind(r.title, r.description, r.category, r.icon, r.url, i).run();
    }
    for (let i = 0; i < DEFAULT_SOCIALS.length; i++) {
      const s = DEFAULT_SOCIALS[i];
      await env.DB.prepare('INSERT INTO socials (name,handle,url,icon,color,sort_order) VALUES (?,?,?,?,?,?)')
        .bind(s.name, s.handle, s.url, s.icon, s.color, i).run();
    }
  }

  console.log('QingHome2: 数据库就绪');
  return { adminConfigured: true };
}

// ──────────────────────────────────────────────
//  API 路由处理
// ──────────────────────────────────────────────
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' },
  });
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS' },
    });
  }

  // 确保数据库已初始化（惰性初始化，仅在首次 API 请求时执行）
  const dbState = await ensureDatabase(env);

  // ── 公开配置 ──
  if (pathname === '/api/public/config' && request.method === 'GET') {
    return getPublicConfig(env);
  }

  // ── Auth ──
  if (pathname === '/api/auth/login' && request.method === 'POST') return login(request, env);
  if (pathname === '/api/auth/logout' && request.method === 'POST') return logout(request, env);

  // ── 调试接口：查看环境变量是否正常读取 ──
  if (pathname === '/api/admin/debug' && request.method === 'GET') {
    return json({
      hasAdminUser: !!env.ADMIN_USER,
      hasAdminPass: !!env.ADMIN_PASS,
      adminUserValue: env.ADMIN_USER ? env.ADMIN_USER.substring(0, 3) + '***' : null,
      adminPassValue: env.ADMIN_PASS ? '***' : null,
      allKeys: Object.keys(env).filter(k => !['DB', 'ASSETS'].includes(k)),
      dbState,
    });
  }

  // ── 管理后台状态 ──
  if (pathname === '/api/admin/status' && request.method === 'GET') {
    return json({ setupNeeded: !dbState.adminConfigured });
  }

  // ── 管理后台 CRUD（需要认证） ──
  if (pathname.startsWith('/api/admin/')) {
    const user = await getAuthUser(request, env);
    if (!user) return json({ error: '未登录或登录已过期' }, 401);
    const section = pathname.replace('/api/admin/', '');
    return handleAdminAPI(request, section, env, user);
  }

  // 非 API 路径 → 让静态资产处理
  return undefined;
}

// ──────────────────────────────────────────────
//  公开配置
// ──────────────────────────────────────────────
async function getPublicConfig(env) {
  const db = env.DB;

  const getSection = async (table, single = false) => {
    const rows = await db.prepare(`SELECT * FROM ${table} ORDER BY sort_order ASC, id ASC`).all();
    if (single) return rows.results?.[0] || null;
    return rows.results || [];
  };

  const profile = await getSection('profile', true);
  const stats = await getSection('stats');
  const navItems = await getSection('nav_items');
  const blogPosts = await getSection('blog_posts');
  const projects = await getSection('projects');
  const resources = await getSection('resources');
  const socials = await getSection('socials');

  return json({
    profile: profile || DEFAULT_PROFILE,
    stats: stats.length ? stats : DEFAULT_STATS,
    navItems: navItems.length ? navItems : DEFAULT_NAV,
    blogPosts: blogPosts.length ? blogPosts : DEFAULT_BLOG,
    projects: projects.length ? projects : DEFAULT_PROJECTS,
    resources: resources.length ? resources : DEFAULT_RESOURCES,
    socials: socials.length ? socials : DEFAULT_SOCIALS,
  });
}

// ──────────────────────────────────────────────
//  Auth
// ──────────────────────────────────────────────
async function login(request, env) {
  const { username, password } = await request.json();
  if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);

  const user = await env.DB.prepare('SELECT id, password_hash FROM admin_users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: '用户名或密码错误' }, 401);

  const hash = await hashPassword(password);
  if (hash !== user.password_hash) return json({ error: '用户名或密码错误' }, 401);

  const token = generateToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, user.id, expires).run();

  return json({ token, username, expires });
}

async function logout(request, env) {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(auth.slice(7)).run();
  }
  return json({ ok: true });
}

// ──────────────────────────────────────────────
//  管理后台 CRUD
// ──────────────────────────────────────────────
async function handleAdminAPI(request, path, env) {
  const method = request.method;
  const db = env.DB;

  // GET 所有配置
  if (path === 'config' && method === 'GET') return getPublicConfig(env);

  // ── Profile ──
  if (path === 'config/profile' && method === 'PUT') {
    const data = await request.json();
    const existing = await db.prepare('SELECT id FROM profile LIMIT 1').first();
    if (existing) {
      await db.prepare('UPDATE profile SET name=?, brand=?, avatar=?, title=?, tagline=?, bio=?, email=?, status=? WHERE id=?')
        .bind(data.name, data.brand, data.avatar, data.title, data.tagline, data.bio, data.email, data.status, existing.id).run();
    } else {
      await db.prepare('INSERT INTO profile (name,brand,avatar,title,tagline,bio,email,status) VALUES (?,?,?,?,?,?,?,?)')
        .bind(data.name, data.brand, data.avatar, data.title, data.tagline, data.bio, data.email, data.status).run();
    }
    return json({ ok: true });
  }

  // ── Stats ──
  if (path === 'config/stats' && method === 'GET') { const r = await db.prepare('SELECT * FROM stats ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/stats' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM stats').first();
    await db.prepare('INSERT INTO stats (label,value,icon,sort_order) VALUES (?,?,?,?)').bind(d.label, d.value, d.icon, m.n).run();
    return json({ ok: true });
  }
  const statsMatch = path.match(/^config\/stats\/(\d+)$/);
  if (statsMatch) {
    const id = parseInt(statsMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE stats SET label=?,value=?,icon=?,sort_order=? WHERE id=?').bind(d.label, d.value, d.icon, d.sort_order ?? 0, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM stats WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  // ── Nav ──
  if (path === 'config/nav' && method === 'GET') { const r = await db.prepare('SELECT * FROM nav_items ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/nav' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM nav_items').first();
    await db.prepare('INSERT INTO nav_items (label,icon,section_id,sort_order) VALUES (?,?,?,?)').bind(d.label, d.icon, d.section_id, m.n).run();
    return json({ ok: true });
  }
  const navMatch = path.match(/^config\/nav\/(\d+)$/);
  if (navMatch) {
    const id = parseInt(navMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE nav_items SET label=?,icon=?,section_id=?,sort_order=? WHERE id=?').bind(d.label, d.icon, d.section_id, d.sort_order ?? 0, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM nav_items WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  // ── Blog ──
  if (path === 'config/blog' && method === 'GET') { const r = await db.prepare('SELECT * FROM blog_posts ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/blog' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM blog_posts').first();
    await db.prepare('INSERT INTO blog_posts (title,excerpt,date,tags,url,sort_order) VALUES (?,?,?,?,?,?)').bind(d.title, d.excerpt, d.date, d.tags||'', d.url, m.n).run();
    return json({ ok: true });
  }
  const blogMatch = path.match(/^config\/blog\/(\d+)$/);
  if (blogMatch) {
    const id = parseInt(blogMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE blog_posts SET title=?,excerpt=?,date=?,tags=?,url=? WHERE id=?').bind(d.title, d.excerpt, d.date, d.tags||'', d.url, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM blog_posts WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  // ── Projects ──
  if (path === 'config/projects' && method === 'GET') { const r = await db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/projects' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM projects').first();
    await db.prepare('INSERT INTO projects (name,description,tags,stars,language,language_color,url,icon,sort_order) VALUES (?,?,?,?,?,?,?,?,?)')
      .bind(d.name, d.description, d.tags, d.stars, d.language, d.language_color, d.url, d.icon, m.n).run();
    return json({ ok: true });
  }
  const projMatch = path.match(/^config\/projects\/(\d+)$/);
  if (projMatch) {
    const id = parseInt(projMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE projects SET name=?,description=?,tags=?,stars=?,language=?,language_color=?,url=?,icon=? WHERE id=?').bind(d.name, d.description, d.tags, d.stars, d.language, d.language_color, d.url, d.icon, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM projects WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  // ── Resources ──
  if (path === 'config/resources' && method === 'GET') { const r = await db.prepare('SELECT * FROM resources ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/resources' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM resources').first();
    await db.prepare('INSERT INTO resources (title,description,category,icon,url,sort_order) VALUES (?,?,?,?,?,?)').bind(d.title, d.description, d.category, d.icon, d.url, m.n).run();
    return json({ ok: true });
  }
  const resMatch = path.match(/^config\/resources\/(\d+)$/);
  if (resMatch) {
    const id = parseInt(resMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE resources SET title=?,description=?,category=?,icon=?,url=? WHERE id=?').bind(d.title, d.description, d.category, d.icon, d.url, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM resources WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  // ── Socials ──
  if (path === 'config/socials' && method === 'GET') { const r = await db.prepare('SELECT * FROM socials ORDER BY sort_order ASC, id ASC').all(); return json(r.results); }
  if (path === 'config/socials' && method === 'POST') {
    const d = await request.json();
    const m = await db.prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 as n FROM socials').first();
    await db.prepare('INSERT INTO socials (name,handle,url,icon,color,sort_order) VALUES (?,?,?,?,?,?)').bind(d.name, d.handle, d.url, d.icon, d.color, m.n).run();
    return json({ ok: true });
  }
  const socialMatch = path.match(/^config\/socials\/(\d+)$/);
  if (socialMatch) {
    const id = parseInt(socialMatch[1]);
    if (method === 'PUT') { const d = await request.json(); await db.prepare('UPDATE socials SET name=?,handle=?,url=?,icon=?,color=? WHERE id=?').bind(d.name, d.handle, d.url, d.icon, d.color, id).run(); return json({ ok: true }); }
    if (method === 'DELETE') { await db.prepare('DELETE FROM socials WHERE id=?').bind(id).run(); return json({ ok: true }); }
  }

  return json({ error: '未知路由' }, 404);
}

// ──────────────────────────────────────────────
//  导出
// ──────────────────────────────────────────────
export default {
  async fetch(request, env) {
    try {
      const response = await handleRequest(request, env);
      if (response) return response;
      return env.ASSETS && env.ASSETS.fetch(request);
    } catch (err) {
      console.error('QingHome2 Worker Error:', err);
      return json({ error: err.message }, 500);
    }
  },
};
-- QingHome2 D1 Database Schema
-- 无需手动执行，Worker 在首次部署时会自动建表并初始化

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  title TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  email TEXT DEFAULT '',
  status TEXT DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT DEFAULT '',
  value TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  date TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  stars INTEGER DEFAULT 0,
  language TEXT DEFAULT '',
  language_color TEXT DEFAULT '',
  url TEXT DEFAULT '',
  icon TEXT DEFAULT 'fa-brands fa-github',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS socials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT '',
  handle TEXT DEFAULT '',
  url TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  color TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS nav_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  section_id TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0
);
const API_BASE = '';

async function request(path, options = {}) {
  const token = localStorage.getItem('qinghome2_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '请求失败');
  return data;
}

// 公开配置
export function getPublicConfig() {
  return request('/api/public/config');
}

// Auth
export function login(username, password) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
}
export function logout() {
  return request('/api/auth/logout', { method: 'POST' });
}

// 后台状态
export function getAdminStatus() {
  return request('/api/admin/status');
}

// 管理后台 API
export function getAdminConfig() {
  return request('/api/admin/config');
}
export function updateProfile(data) {
  return request('/api/admin/config/profile', { method: 'PUT', body: JSON.stringify(data) });
}
export function getStats() {
  return request('/api/admin/config/stats');
}
export function addStat(data) {
  return request('/api/admin/config/stats', { method: 'POST', body: JSON.stringify(data) });
}
export function updateStat(id, data) {
  return request(`/api/admin/config/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteStat(id) {
  return request(`/api/admin/config/stats/${id}`, { method: 'DELETE' });
}
export function getNav() {
  return request('/api/admin/config/nav');
}
export function addNav(data) {
  return request('/api/admin/config/nav', { method: 'POST', body: JSON.stringify(data) });
}
export function updateNav(id, data) {
  return request(`/api/admin/config/nav/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteNav(id) {
  return request(`/api/admin/config/nav/${id}`, { method: 'DELETE' });
}
export function getBlog() {
  return request('/api/admin/config/blog');
}
export function addBlog(data) {
  return request('/api/admin/config/blog', { method: 'POST', body: JSON.stringify(data) });
}
export function updateBlog(id, data) {
  return request(`/api/admin/config/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteBlog(id) {
  return request(`/api/admin/config/blog/${id}`, { method: 'DELETE' });
}
export function getProjects() {
  return request('/api/admin/config/projects');
}
export function addProject(data) {
  return request('/api/admin/config/projects', { method: 'POST', body: JSON.stringify(data) });
}
export function updateProject(id, data) {
  return request(`/api/admin/config/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteProject(id) {
  return request(`/api/admin/config/projects/${id}`, { method: 'DELETE' });
}
export function getResources() {
  return request('/api/admin/config/resources');
}
export function addResource(data) {
  return request('/api/admin/config/resources', { method: 'POST', body: JSON.stringify(data) });
}
export function updateResource(id, data) {
  return request(`/api/admin/config/resources/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteResource(id) {
  return request(`/api/admin/config/resources/${id}`, { method: 'DELETE' });
}
export function getSocials() {
  return request('/api/admin/config/socials');
}
export function addSocial(data) {
  return request('/api/admin/config/socials', { method: 'POST', body: JSON.stringify(data) });
}
export function updateSocial(id, data) {
  return request(`/api/admin/config/socials/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function deleteSocial(id) {
  return request(`/api/admin/config/socials/${id}`, { method: 'DELETE' });
}
# QingHome

> 动态个人主页 — 基于 React + Vite + Cloudflare Workers (D1 + Static Assets)  
> 所有配置由 D1 数据库驱动，提供可视化管理后台

![1782731954345.webp](https://tgfile.yuzong.nyc.mn/1782731954345.webp)

---

## ✨ 特性

- 🎨 **大气简约 · 卡片式设计**：渐变 Hero、毛玻璃导航、悬浮卡片、微交互动画
- 🌗 **明暗双主题**：跟随系统偏好，一键切换，localStorage 持久化，零白屏闪烁
- 🖼 **Font Awesome 图标**：CDN 加载 1500+ 免费图标，数据里直接写 class 即可更换
- 📱 **完全响应式**：桌面 3 列 → 平板 2 列 → 手机 1 列，含汉堡菜单
- 🚀 **边缘部署**：Cloudflare Workers + Static Assets，全球 300+ 节点 CDN
- 🗄️ **D1 数据库驱动**：所有配置存储在 D1 中，而非硬编码
- 🔐 **管理后台**：`/admin` 路径进入，支持可视化编辑所有配置
- 👤 **管理员认证**：用户名 + 密码登录，Bearer Token 会话（7 天有效期）

---

## 🛠 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 初始化本地 D1 数据库（仅首次需要）
npm run db:local

# 3. 启动本地开发服务器（Worker + 本地 D1 + 前端，端口 8787）
npm run dev:local
# → http://localhost:8787

# 4. 仅前端开发（热更新，端口 5173）
npm run dev
# → http://localhost:5173
```

---

## 🚀 部署到 Cloudflare Workers

### 前置条件

你需要一个 [Cloudflare 账户](https://dash.cloudflare.com/)。

> ⚠️ 无需手动设置任何环境变量，首次访问 `/admin/login` 时会自动引导创建管理员账号。

---

### 手动部署（Cloudflare Dashboard）

- Fork 本仓库
- 登录 [Cloudflare](https://dash.cloudflare.com/) 后台
- `Workers 和 Pages` → `创建应用程序` → `连接 Git`，选择 fork 的仓库
- **项目名称**：`qinghome`
- **构建命令**：`npm run build`
- **部署命令**：`npm run deploy`
- 其他默认，点击**部署**
- 等待部署完成，绑定一个自定义域名

### 自动部署（CLI）

#### Step 1 — 登录 Cloudflare

```bash
npx wrangler login
```

#### Step 2 — 创建 D1 数据库

```bash
npx wrangler d1 create qinghome-db
```

执行后无需手动更改 `wrangler.toml`（Wrangler v4 自动解析）。

#### Step 3 — 构建 + 部署

```bash
npm run deploy
```

首次部署成功后，终端会输出访问地址：

```
✨ Successfully published your script to
https://qinghome.<你的子域>.workers.dev
```

---

## 🎮 使用指南

### 创建管理员

1. 浏览器打开 `https://qinghome.<你的子域>.workers.dev` 或你的自定义域名，点击右上角 **「登录后台」** 按钮
2. 首次访问会自动显示 **「创建管理员」** 注册表单
3. 输入用户名和密码，点击「创建管理员并登录」
4. 创建成功后**自动登录**，进入管理仪表盘
5. 所有配置均可在线编辑，修改后首页实时生效

### 公开首页

访问 `/` 查看你的个人主页，包含：

- **Hero 首屏**：头像、名称、简介、统计胶囊
- **博客区**：文章列表
- **项目区**：开源项目卡片
- **资源区**：分类资源分享
- **社交链接**：GitHub / Telegram / 邮箱等

### 管理后台

访问 `/admin` 进入后台，有七个设置面板：

| 面板 | 可编辑内容 |
|------|-----------|
| 📋 个人资料 | 名称、品牌、头像 URL、标题、副标题、简介、邮箱、状态 |
| 📊 统计胶囊 | Hero 区域的统计胶囊（可增删改） |
| 🧭 站点导航 | 顶部导航菜单项（可增删改） |
| 📝 博客文章 | 博客精选文章（可增删改） |
| 💻 项目仓库 | 开源项目卡片（可增删改） |
| 🔗 公益站点 | 分类资源链接（可增删改） |
| 🌐 联系方式 | 社交媒体链接（可增删改） |

> 💡 **提示**：图标使用 Font Awesome 的完整 class（如 `fa-brands fa-github`），从 [fontawesome.com/search?ic=free-collection](https://fontawesome.com/search?ic=free-collection) 搜索复制即可。

---

## 📝 定制配色

打开 `src/styles/global.css`，修改顶部两个变量块：

```css
/* 亮色主题 */
:root, [data-theme='light'] {
  --brand: #6366f1;     /* 主品牌色（紫蓝） */
  --brand-2: #8b5cf6;   /* 渐变副色 */
  --accent: #06b6d4;    /* 强调色（青色） */
}

/* 暗色主题 */
[data-theme='dark'] {
  --brand: #818cf8;
  --brand-2: #a78bfa;
  --accent: #22d3ee;
}
```

---

## 📄 License

MIT

---

## 🙏 致谢

- 我的脑洞
- hermes + deepseek v4

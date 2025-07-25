# 我的博客项目

一个使用Node.js+Express和SQLite构建的个人博客网站，包含前端静态页面和后端API服务。

## 功能特点

- 响应式设计，适配各种设备屏幕
- 个人项目展示页面
- 作品展示功能
- 社区讨论板块
- 关于我页面
- RESTful API接口设计
- SQLite数据库集成
- 环境变量配置
- 开发热重载支持

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **后端**：Node.js, Express
- **数据库**：SQLite
- **开发工具**：nodemon

## 项目结构

```
my-blog/
├─ public/               # 前端静态文件
│  ├─ index.html         # 首页
│  ├─ projects.html      # 个人项目页
│  ├─ works.html         # 个人作品页
│  ├─ community.html     # 用户社区页
│  ├─ about.html         # 关于页
│  ├─ css/               # 样式文件
│  ├─ js/                # JavaScript文件
│  └─ images/            # 图片资源
├─ server/               # 后端文件
│  ├─ server.js          # 服务器入口
│  ├─ db.js              # 数据库连接
│  └─ routes/            # API路由
├─ .env                  # 环境变量配置
├─ .gitignore            # Git忽略文件
├─ package.json          # 项目依赖
└─ README.md             # 项目说明
```

## 安装与使用

### 前提条件

- Node.js (v14+) 和 npm

### 安装步骤

1. 克隆或下载项目到本地
2. 进入项目目录
3. 安装依赖

```bash
npm install
```

### 运行项目

- 开发模式（带热重载）

```bash
npm run dev
```

- 生产模式

```bash
npm start
```

4. 在浏览器中访问 `http://localhost:3000`

## 环境变量配置

在.env文件中可以配置以下参数：

- `PORT` - 服务器端口号，默认3000
- `DB_PATH` - 数据库文件路径
- `NODE_ENV` - 环境类型（development/production）
- `API_PREFIX` - API路由前缀
- `CORS_ORIGIN` - 跨域请求源

## API接口

### 项目相关

- `GET /api/projects` - 获取所有项目
- `GET /api/projects/:id` - 获取单个项目
- `POST /api/projects` - 创建新项目
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### 作品相关

- `GET /api/works` - 获取所有作品
- `GET /api/works/:id` - 获取单个作品
- `POST /api/works` - 创建新作品
- `PUT /api/works/:id` - 更新作品
- `DELETE /api/works/:id` - 删除作品

### 社区相关

- `GET /api/community` - 获取所有帖子
- `GET /api/community/:id` - 获取单个帖子
- `POST /api/community` - 创建新帖子
- `PUT /api/community/:id` - 更新帖子
- `DELETE /api/community/:id` - 删除帖子

## 许可证

[ISC](LICENSE)
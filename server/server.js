const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3004;

// 连接数据库
require('./db');

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析JSON请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析表单数据

// 静态文件服务（提供前端页面访问）
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '..')));

// 路由配置
app.use('/api/projects', require('./routes/projects'));
app.use('/api/works', require('./routes/works'));
app.use('/api/community', require('./routes/community'));

// 根路由，返回首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404处理
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动，访问地址：http://localhost:${PORT}`);
});

module.exports = app;
    
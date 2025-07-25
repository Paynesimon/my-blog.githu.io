const express = require('express');
const router = express.Router();
const db = require('../db'); // 导入数据库连接
// 1. 获取所有项目（支持筛选）
router.get('/', (req, res) => {
const { status, tech } = req.query;
let query = 'SELECT * FROM projects ORDER BY created_at DESC';
const params = [];
// 筛选条件（如果有）
if (status || tech) {
const conditions = [];
if (status) {
conditions.push ('status = ?');
params.push (status);
}
if (tech) {
// 模糊匹配技术栈（包含指定技术）
conditions.push ('tech LIKE ?');
params.push(`%${tech}%`);
}
query = `SELECT * FROM projects WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
}
db.all(query, params, (err, rows) => {
if (err) {
res.status(500).json({ error: err.message });
} else {
// 格式化数据（将逗号分隔的字符串转为数组）
const projects = rows.map (project => ({
...project,
tech: project.tech ? project.tech.split (',') : [],
screenshots: project.screenshots ? project.screenshots.split (',') : []
}));
res.json (projects);
}
});
});
// 2. 获取单个项目详情
router.get('/:id', (req, res) => {
const { id } = req.params;
db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
if (err) {
res.status(500).json({ error: err.message });
} else if (!row) {
res.status(404).json({ error: '项目不存在' });
} else {
// 格式化数据
res.json ({
...row,
tech: row.tech ? row.tech.split (',') : [],
screenshots: row.screenshots ? row.screenshots.split (',') : []
});
}
});
});
// 3. 添加新项目（仅管理员 / 博主可用，实际项目中需加权限验证）
router.post('/', (req, res) => {
const {
title,
description,
status,
tech,
progress,
screenshots,
demo_link,
github_link
} = req.body;
// 简单验证
if (!title || !status) {
return res.status(400).json({ error: '标题和状态为必填项' });
}
// 处理数组参数（转为逗号分隔的字符串存储）
const techStr = tech ? tech.join (',') : '';
const screenshotsStr = screenshots ? screenshots.join (',') : '';
db.run(`INSERT INTO projects (title, description, status, tech, progress, screenshots, demo_link, github_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [title, description, status, techStr, progress, screenshotsStr, demo_link, github_link], function (err) {
if (err) {
res.status(500).json({ error: err.message });
} else {
res.status(201).json({
id: this.lastID,
message: '项目添加成功'
});
}
});
});
// 4. 更新项目（仅管理员 / 博主可用）
router.put('/:id', (req, res) => {
const { id } = req.params;
const {
title,
description,
status,
tech,
progress,
screenshots,
demo_link,
github_link
} = req.body;
const techStr = tech ? tech.join(',') : '';
const screenshotsStr = screenshots ? screenshots.join(',') : '';
db.run(`UPDATE projects SET title = ?, description = ?, status = ?, tech = ?, progress = ?, screenshots = ?, demo_link = ?, github_link = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [title, description, status, techStr, progress, screenshotsStr, demo_link, github_link, id], function (err) {
if (err) {
res.status (500).json ({ error: err.message });
} else if (this.changes === 0) {
res.status(404).json({ error: '项目不存在' });
} else {
res.json({ message: '项目更新成功' });
}
});
});
// 5. 删除项目（仅管理员 / 博主可用）
router.delete('/:id', (req, res) => {
const { id } = req.params;
db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
if (err) {
res.status (500).json ({ error: err.message });
} else if (this.changes === 0) {
res.status (404).json ({ error: ' 项目不存在 ' });
} else {
res.json({ message: '项目删除成功' });
}
});
});

module.exports = router;
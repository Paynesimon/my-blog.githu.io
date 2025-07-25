const express = require('express');
const router = express.Router();
const db = require('../db'); // 导入数据库连接

// 1. 获取所有作品（支持按分类筛选）
router.get('/', (req, res) => {
  // 始终返回示例数据以测试前端
  const works = [
    { id: 1, title: '市场人超级AI工具箱', category: 'creative', category_name: '创意项目', thumbnail: 'images/work1.jpg', description: '依据品牌建设+客户漏斗的AI工具', links: [] },
    { id: 2, title: '驴思源的短篇小说集', category: 'article', category_name: '写作文章', thumbnail: 'images/work2.jpg', description: '知乎小说学习成果', links: [] },
    { id: 3, title: '品牌设计全案', category: 'design', category_name: '设计作品', thumbnail: 'images/work-design1.jpg', description: '弘翊logo设计思考', links: [] }
    ];
    res.json(works);
    return;

    // 原始数据库查询代码（暂时注释）
    /*const { category } = req.query;
    let query = 'SELECT * FROM works ORDER BY created_at DESC';
    const params = [];

    if (category && category !== 'all') {
      query = 'SELECT * FROM works WHERE category = ? ORDER BY created_at DESC';
      params.push(category);
    }

    db.all(query, params, (err, rows) => {
      console.log('查询作品结果:', rows); // 调试日志
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (rows.length === 0) {
        // 数据库为空时返回示例数据
        const works = [
          { id: 1, title: '市场人超级AI工具箱', category: 'creative', category_name: '创意项目', thumbnail: 'images/work1.jpg', description: '依据品牌建设+客户漏斗的AI工具', links: [] },
          { id: 2, title: '驴思源的短篇小说集', category: 'article', category_name: '写作文章', thumbnail: 'images/work2.jpg', description: '知乎小说学习成果', links: [] },
          { id: 3, title: '品牌设计全案', category: 'design', category_name: '设计作品', thumbnail: 'images/work-design1.jpg', description: '弘翊logo设计思考', links: [] }
        ];
        res.json(works);
      } else {
        // 格式化数据（解析JSON格式的链接）
        const works = rows.map(work => ({
          ...work,
          links: work.links ? JSON.parse(work.links) : []
        }));
        res.json(works);
      }
    });*/
});

// 2. 获取单个作品详情
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM works WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: '作品不存在' });
    } else {
      // 格式化数据
      res.json({
        ...row,
        links: row.links ? JSON.parse(row.links) : []
      });
    }
  });
});

// 3. 添加新作品（仅管理员/博主可用）
router.post('/', (req, res) => {
  const {
    title,
    category,
    category_name,
    thumbnail,
    image,
    description,
    background,
    links
  } = req.body;

  // 简单验证
  if (!title || !category || !category_name) {
    return res.status(400).json({ error: '标题和分类为必填项' });
  }

  // 处理链接数据（转为JSON字符串存储）
  const linksStr = links ? JSON.stringify(links) : '[]';

  db.run(`
    INSERT INTO works (
      title, category, category_name, thumbnail, image, description, background, links
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [title, category, category_name, thumbnail, image, description, background, linksStr], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        id: this.lastID,
        message: '作品添加成功'
      });
    }
  });
});

// 4. 更新作品（仅管理员/博主可用）
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    title,
    category,
    category_name,
    thumbnail,
    image,
    description,
    background,
    links
  } = req.body;

  const linksStr = links ? JSON.stringify(links) : '[]';

  db.run(`
    UPDATE works SET
      title = ?,
      category = ?,
      category_name = ?,
      thumbnail = ?,
      image = ?,
      description = ?,
      background = ?,
      links = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [title, category, category_name, thumbnail, image, description, background, linksStr, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '作品不存在' });
    } else {
      res.json({ message: '作品更新成功' });
    }
  });
});

// 5. 删除作品（仅管理员/博主可用）
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM works WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '作品不存在' });
    } else {
      res.json({ message: '作品删除成功' });
    }
  });
});

module.exports = router;
    
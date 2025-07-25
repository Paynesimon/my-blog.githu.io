const express = require('express');
const router = express.Router();
const db = require('../db'); // 导入数据库连接

// 1. 用户登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名和密码' });
  }
  
  // 实际项目中应使用加密存储密码，这里为简化直接比对
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', 
    [username, password], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!user) {
      res.status(401).json({ error: '用户名或密码错误' });
    } else {
      // 登录成功，返回用户信息（实际项目中应生成token）
      res.json({
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        message: '登录成功'
      });
    }
  });
});

// 2. 获取帖子列表
router.get('/posts', (req, res) => {
  // 联合查询获取帖子和作者信息
  const query = `
    SELECT p.*, u.username, u.avatar 
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(query, (err, posts) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(posts);
    }
  });
});

// 3. 获取单个帖子及评论
router.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  
  // 先获取帖子信息
  const postQuery = `
    SELECT p.*, u.username, u.avatar 
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;
  
  db.get(postQuery, [id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!post) {
      return res.status(404).json({ error: '帖子不存在' });
    }
    
    // 再获取该帖子的评论
    const commentQuery = `
      SELECT c.*, u.username, u.avatar 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `;
    
    db.all(commentQuery, [id], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({
        post,
        comments
      });
    });
  });
});

// 4. 发布帖子
router.post('/posts', (req, res) => {
  const { user_id, title, category, content } = req.body;
  
  if (!user_id || !title || !category || !content) {
    return res.status(400).json({ error: '请填写完整信息' });
  }
  
  db.run(`
    INSERT INTO posts (user_id, title, category, content)
    VALUES (?, ?, ?, ?)
  `, [user_id, title, category, content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({
        id: this.lastID,
        message: '帖子发布成功'
      });
    }
  });
});

// 5. 帖子点赞
router.post('/posts/:id/like', (req, res) => {
  const { id } = req.params;
  
  // 简单实现：每次点赞+1（实际项目应记录用户是否已点赞）
  db.run(`
    UPDATE posts 
    SET like_count = like_count + 1 
    WHERE id = ?
  `, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '帖子不存在' });
    } else {
      // 返回更新后的点赞数
      db.get('SELECT like_count FROM posts WHERE id = ?', [id], (err, row) => {
        res.json({
          like_count: row.like_count,
          message: '点赞成功'
        });
      });
    }
  });
});

// 6. 发布评论
router.post('/posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;
  
  if (!user_id || !content) {
    return res.status(400).json({ error: '请填写评论内容' });
  }
  
  // 先检查帖子是否存在
  db.get('SELECT id FROM posts WHERE id = ?', [id], (err, post) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!post) {
      return res.status(404).json({ error: '帖子不存在' });
    }
    
    // 发布评论
    db.run(`
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `, [id, user_id, content], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          id: this.lastID,
          message: '评论发布成功'
        });
      }
    });
  });
});

module.exports = router;
    
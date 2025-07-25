const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径（会自动创建）
const dbPath = path.resolve(__dirname, 'blog.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接错误：', err.message);
  } else {
    console.log('成功连接到SQLite数据库');
    // 初始化数据表
    initTables();
  }
});

// 初始化数据表
function initTables() {
  // 1. 项目表
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL, -- completed:已完成, progress:进行中
      tech TEXT, -- 技术栈，用逗号分隔
      progress TEXT, -- 进度百分比，如"70%"
      screenshots TEXT, -- 截图路径，用逗号分隔
      demo_link TEXT,
      github_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建项目表错误：', err.message);
    } else {
      console.log('项目表初始化完成');
    }
  });

  // 2. 作品表
  db.run(`
    CREATE TABLE IF NOT EXISTS works (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- design:设计, article:文章, creative:创意
      category_name TEXT NOT NULL,
      thumbnail TEXT, -- 缩略图路径
      image TEXT, -- 大图路径
      description TEXT,
      background TEXT, -- 创作背景
      links TEXT, -- 相关链接，JSON格式存储
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建作品表错误：', err.message);
    } else {
      console.log('作品表初始化完成');
    }
  });

  // 3. 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL, -- 实际项目中应加密存储
      avatar TEXT, -- 头像路径
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('创建用户表错误：', err.message);
    } else {
      console.log('用户表初始化完成');
      // 添加默认测试用户（用户名：test，密码：123456）
      db.run(`
        INSERT OR IGNORE INTO users (username, password, avatar)
        VALUES ('test', '123456', 'images/user1.jpg')
      `);
    }
  });

  // 4. 帖子表
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL, -- project:项目, work:作品, tech:技术, other:其他
      content TEXT NOT NULL,
      like_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建帖子表错误：', err.message);
    } else {
      console.log('帖子表初始化完成');
    }
  });

  // 5. 评论表
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('创建评论表错误：', err.message);
    } else {
      console.log('评论表初始化完成');
    }
  });
}

// 导出数据库连接供其他模块使用
module.exports = db;
    
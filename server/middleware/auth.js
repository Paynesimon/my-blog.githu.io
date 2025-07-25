// 简单的管理员权限验证中间件
const isAdmin = (req, res, next) => {
  // 实际项目中应使用session或token验证
  // 这里简化处理：只有用户名test（默认用户）为管理员
  const { username } = req.body;
  if (username === 'test') { // 可改为从数据库查询管理员列表
    next(); // 验证通过，继续处理请求
  } else {
    res.status(403).json({ error: '没有管理员权限' });
  }
};

module.exports = { isAdmin };

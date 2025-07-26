import { communityAPI } from '../api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    // 调用登录API
    const result = await communityAPI.login(username, password);
    
    // 验证是否为管理员（这里简化处理，实际应后端验证）
    if (username === 'test') {
      // 登录成功，跳转到后台首页
      localStorage.setItem('admin', 'true');
      window.location.href = 'works.html';
    } else {
      alert('没有管理员权限');
    }
  } catch (error) {
    // 错误已在API工具中处理
  }
});

import { communityAPI } from '../api.js';

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', () => {
  // 除了登录页，其他后台页面都需要验证登录
  if (!window.location.pathname.endsWith('login.html')) {
    checkAdminLogin();
  }

  // 绑定退出登录事件
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});

// 检查管理员登录状态
function checkAdminLogin() {
  const isLoggedIn = communityAPI.isLoggedIn();
  const isAdmin = localStorage.getItem('admin') === 'true';
  
  if (!isLoggedIn || !isAdmin) {
    // 未登录或非管理员，跳转到登录页
    window.location.href = 'login.html';
  }
}

// 退出登录
function logout() {
  communityAPI.logout();
  localStorage.removeItem('admin');
  window.location.href = 'login.html';
}

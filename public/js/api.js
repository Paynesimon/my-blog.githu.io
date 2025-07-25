// API基础路径（后端服务器地址）
const API_BASE_URL = 'http://localhost:3000/api';

// 工具函数：处理请求
async function request(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 如果有数据，添加到请求体
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // 解析响应数据
    const result = await response.json();
    
    // 处理错误状态
    if (!response.ok) {
      throw new Error(result.error || '请求失败');
    }
    
    return result;
  } catch (error) {
    console.error('API请求错误：', error.message);
    alert('操作失败：' + error.message);
    throw error; // 允许调用者捕获错误
  }
}

// 项目相关API
const projectAPI = {
  // 获取项目列表（支持筛选）
  async getProjects(filters = {}) {
    // 构建查询参数
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.tech) params.append('tech', filters.tech);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`${API_BASE_URL}/projects${queryString}`);
  },
  
  // 获取单个项目详情
  async getProject(id) {
    return request(`${API_BASE_URL}/projects/${id}`);
  },
  
  // 添加新项目（需要管理员权限）
  async addProject(projectData) {
    return request(`${API_BASE_URL}/projects`, 'POST', projectData);
  },
  
  // 更新项目（需要管理员权限）
  async updateProject(id, projectData) {
    return request(`${API_BASE_URL}/projects/${id}`, 'PUT', projectData);
  },
  
  // 删除项目（需要管理员权限）
  async deleteProject(id) {
    return request(`${API_BASE_URL}/projects/${id}`, 'DELETE');
  }
};

// 作品相关API
const workAPI = {
  // 获取作品列表（支持分类筛选）
  async getWorks(category = 'all') {
    const queryString = category !== 'all' ? `?category=${category}` : '';
    return request(`${API_BASE_URL}/works${queryString}`);
  },
  
  // 获取单个作品详情
  async getWork(id) {
    return request(`${API_BASE_URL}/works/${id}`);
  },
  
  // 添加新作品（需要管理员权限）
  async addWork(workData) {
    return request(`${API_BASE_URL}/works`, 'POST', workData);
  },
  
  // 更新作品（需要管理员权限）
  async updateWork(id, workData) {
    return request(`${API_BASE_URL}/works/${id}`, 'PUT', workData);
  },
  
  // 删除作品（需要管理员权限）
  async deleteWork(id) {
    return request(`${API_BASE_URL}/works/${id}`, 'DELETE');
  }
};

// 社区相关API
const communityAPI = {
  // 用户登录
  async login(username, password) {
    const result = await request(`${API_BASE_URL}/community/login`, 'POST', {
      username,
      password
    });
    // 登录成功后保存用户信息到本地存储
    if (result.id) {
      localStorage.setItem('user', JSON.stringify(result));
    }
    return result;
  },
  
  // 用户登出
  logout() {
    localStorage.removeItem('user');
  },
  
  // 获取当前登录用户
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // 检查是否已登录
  isLoggedIn() {
    return !!this.getCurrentUser();
  },
  
  // 获取帖子列表
  async getPosts() {
    return request(`${API_BASE_URL}/community/posts`);
  },
  
  // 获取单个帖子及评论
  async getPostWithComments(id) {
    return request(`${API_BASE_URL}/community/posts/${id}`);
  },
  
  // 发布帖子
  async createPost(postData) {
    return request(`${API_BASE_URL}/community/posts`, 'POST', postData);
  },
  
  // 帖子点赞
  async likePost(postId) {
    return request(`${API_BASE_URL}/community/posts/${postId}/like`, 'POST');
  },
  
  // 发布评论
  async addComment(postId, commentData) {
    return request(
      `${API_BASE_URL}/community/posts/${postId}/comments`, 
      'POST', 
      commentData
    );
  }
};

// 导出所有API模块
export { projectAPI, workAPI, communityAPI };
    
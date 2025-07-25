import { projectAPI } from './api.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  const projectList = document.getElementById('project-list');
  const statusFilter = document.getElementById('status-filter');
  const techFilter = document.getElementById('tech-filter');
  const loadingIndicator = document.createElement('div');
  
  // 创建加载指示器
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
  loadingIndicator.style.textAlign = 'center';
  loadingIndicator.style.padding = '30px';
  loadingIndicator.style.display = 'none';
  
  // 检查项目列表元素是否存在
  if (projectList && projectList.parentNode) {
    projectList.parentNode.insertBefore(loadingIndicator, projectList);
  } else {
    console.error('项目列表容器不存在');
    return; // 停止执行后续初始化
  }

  // 加载项目列表
  async function loadProjects(filters = {}) {
    try {
      // 显示加载状态
      loadingIndicator.style.display = 'block';
      projectList.innerHTML = '';
      
      // 调用API获取项目数据
      const projects = await projectAPI.getProjects(filters);
      
      if (projects.length === 0) {
        projectList.innerHTML = '<div style="text-align: center; padding: 30px;">没有找到匹配的项目</div>';
        return;
      }
      
      // 生成项目卡片
      projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectList.appendChild(projectCard);
      });
    } catch (error) {
      projectList.innerHTML = '<div style="text-align: center; padding: 30px; color: #e74c3c;">加载项目失败，请稍后重试</div>';
    } finally {
      // 隐藏加载状态
      loadingIndicator.style.display = 'none';
    }
  }

  // 创建项目卡片
  function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.marginBottom = '20px';
    
    // 处理项目状态样式
    const statusClass = project.status === 'completed' ? 'status-completed' : 'status-progress';
    const statusText = project.status === 'completed' ? '已完成' : '进行中';
    
    // 生成技术标签
    const techTags = project.tech.map(tech => `
      <span class="tech-tag">${tech}</span>
    `).join('');
    
    // 生成截图轮播
    let screenshotsHtml = '';
    if (project.screenshots && project.screenshots.length > 0) {
      screenshotsHtml = `
        <div class="screenshot-carousel">
          ${project.screenshots.map(img => `
            <img src="${img}" alt="${project.title}截图" class="carousel-img">
          `).join('')}
        </div>
      `;
    } else {
      screenshotsHtml = `
        <div class="no-screenshot" style="height: 180px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #999;">
          <i class="fas fa-image fa-3x"></i>
        </div>
      `;
    }
    
    // 项目卡片内容
    card.innerHTML = `
      <div class="card">
        <div class="card-content">
          ${screenshotsHtml}
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0;">
            <h3 class="card-title">${project.title}</h3>
            <span class="status-badge ${statusClass}">${statusText}</span>
          </div>
          
          <p class="card-desc">${project.description || '暂无项目描述'}</p>
          
          ${project.status === 'progress' && project.progress ? `
            <div class="progress-container">
              <div class="progress-label">
                <span>项目进度</span>
                <span>${project.progress}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.progress}"></div>
              </div>
            </div>
          ` : ''}
          
          <div style="margin: 15px 0;">
            <div style="font-weight: 500; margin-bottom: 5px;">技术栈</div>
            <div class="tech-tags">${techTags}</div>
          </div>
          
          <div class="project-actions">
            ${project.demo_link ? `<a href="${project.demo_link}" target="_blank" class="btn btn-secondary"><i class="fas fa-external-link-alt"></i> 在线演示</a>` : ''}
            ${project.github_link ? `<a href="${project.github_link}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>` : ''}
            <button class="btn show-details" data-id="${project.id}"><i class="fas fa-info-circle"></i> 查看详情</button>
          </div>
        </div>
      </div>
    `;
    
    // 绑定详情按钮事件
    card.querySelector('.show-details').addEventListener('click', () => {
      showProjectDetails(project.id);
    });
    
    return card;
  }

  // 显示项目详情
  async function showProjectDetails(projectId) {
    try {
      const project = await projectAPI.getProject(projectId);
      const modal = document.getElementById('project-modal');
      const modalContent = document.getElementById('project-modal-content');
      
      // 处理状态样式
      const statusClass = project.status === 'completed' ? 'status-completed' : 'status-progress';
      const statusText = project.status === 'completed' ? '已完成' : '进行中';
      
      // 生成技术标签
      const techTags = project.tech.map(tech => `
        <span class="tech-tag">${tech}</span>
      `).join('');
      
      // 生成截图
      const screenshotsHtml = project.screenshots && project.screenshots.length > 0 ? 
        project.screenshots.map(img => `
          <img src="${img}" alt="${project.title}截图" style="width: 100%; margin-bottom: 10px; border-radius: 4px;">
        `).join('') : 
        '<p style="text-align: center; color: #777;">暂无截图</p>';
      
      // 填充详情内容
      modalContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <h2 style="margin-top: 0; color: #2c3e50;">${project.title}</h2>
            <span class="status-badge ${statusClass}" style="margin-bottom: 20px; display: inline-block;">${statusText}</span>
            
            <h3 style="color: #3498db; margin: 15px 0 10px;">项目描述</h3>
            <p style="line-height: 1.7; margin-bottom: 20px;">${project.description || '暂无项目描述'}</p>
            
            <h3 style="color: #3498db; margin: 15px 0 10px;">技术栈</h3>
            <div class="tech-tags" style="margin-bottom: 20px;">${techTags}</div>
            
            ${project.status === 'progress' && project.progress ? `
              <div style="margin-bottom: 20px;">
                <h3 style="color: #3498db; margin: 15px 0 10px;">项目进度</h3>
                <div class="progress-container">
                  <div class="progress-label">
                    <span>完成度</span>
                    <span>${project.progress}</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}"></div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <div style="margin-top: 20px;">
              ${project.demo_link ? `<a href="${project.demo_link}" target="_blank" class="btn"><i class="fas fa-external-link-alt"></i> 在线演示</a>` : ''}
              ${project.github_link ? `<a href="${project.github_link}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>` : ''}
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-y: auto; max-height: 600px;">
            <h3 style="color: #3498db; margin-top: 0;">项目截图</h3>
            ${screenshotsHtml}
          </div>
        </div>
      `;
      
      // 显示弹窗
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('加载项目详情失败：', error);
      alert('加载项目详情失败');
    }
  }

  // 筛选事件监听
  function setupFilters() {
    // 状态筛选
    if (statusFilter) {
  statusFilter.addEventListener('change', applyFilters);
} else {
  console.error('状态筛选器元素不存在');
}
    
    // 技术筛选
  if (techFilter) {
  techFilter.addEventListener('change', applyFilters);
} else {
  console.error('技术筛选器元素不存在');
}

  // 加载更多按钮
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreProjects);
  } else {
    console.error('加载更多按钮元素不存在');
    }

  }

    // 应用筛选条件
  function applyFilters() {
    const filters = {
      status: statusFilter.value !== 'all' ? statusFilter.value : '',
      tech: techFilter.value !== 'all' ? techFilter.value : ''
    };
    loadProjects(filters);
  }

  // 关闭详情弹窗
  const closeModalBtn = document.getElementById('close-project-modal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', function() {
    document.getElementById('project-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  // 点击弹窗外部关闭
  const projectModal = document.getElementById('project-modal');
  if (projectModal) {
    projectModal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }

  // 初始化
  setupFilters();
  loadProjects();
}
});

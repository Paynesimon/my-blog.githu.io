import { workAPI } from './api.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  const workGallery = document.querySelector('.work-gallery');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const workModal = document.getElementById('work-modal');
  const closeWorkModal = document.getElementById('close-work-modal');
  const loadingIndicator = document.createElement('div');
  
  // 创建加载指示器
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
  loadingIndicator.style.textAlign = 'center';
  loadingIndicator.style.padding = '30px';
  loadingIndicator.style.gridColumn = '1 / -1'; // 占满整个网格
  loadingIndicator.style.display = 'none';
  workGallery.parentNode.insertBefore(loadingIndicator, workGallery);

  // 加载作品列表
  async function loadWorks(category = 'all') {
    try {
      // 显示加载状态
      loadingIndicator.style.display = 'block';
      workGallery.innerHTML = '';
      
      // 调用API获取作品数据
      const works = await workAPI.getWorks(category);
      
      if (works.length === 0) {
        workGallery.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 30px;">
            没有找到匹配的作品
          </div>
        `;
        return;
      }
      
      // 生成作品卡片
      works.forEach(work => {
        const workItem = createWorkItem(work);
        workGallery.appendChild(workItem);
      });
    } catch (error) {
      workGallery.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: #e74c3c;">
          加载作品失败，请稍后重试
        </div>
      `;
    } finally {
      // 隐藏加载状态
      loadingIndicator.style.display = 'none';
    }
  }

  // 创建作品卡片
  function createWorkItem(work) {
    const item = document.createElement('div');
    item.className = 'work-item';
    item.setAttribute('data-category', work.category);
    
    item.innerHTML = `
      <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: pointer; transition: transform 0.3s;">
        <img src="${work.thumbnail || 'images/placeholder.jpg'}" alt="${work.title}" style="width: 100%; height: 200px; object-fit: cover;">
        <div style="padding: 15px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 5px; color: #2c3e50;">${work.title}</h3>
          <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">${work.description || '暂无描述'}</p>
          <span class="tag">${work.category_name}</span>
        </div>
      </div>
    `;
    
    // 绑定点击事件，打开详情弹窗
    item.addEventListener('click', () => {
      showWorkDetails(work);
    });
    
    // 卡片悬停效果
    const card = item.querySelector('div');
    item.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    item.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    return item;
  }

  // 显示作品详情弹窗
  function showWorkDetails(work) {
    const workModalTitle = document.getElementById('work-modal-title');
    const workModalCategory = document.getElementById('work-modal-category');
    const workModalImage = document.getElementById('work-modal-image');
    const workModalDescription = document.getElementById('work-modal-description');
    const workModalBackground = document.getElementById('work-modal-background');
    const workModalLinks = document.getElementById('work-modal-links');
    
    // 填充弹窗内容
    workModalTitle.textContent = work.title;
    workModalCategory.textContent = work.category_name;
    workModalImage.src = work.image || work.thumbnail || 'images/placeholder.jpg';
    workModalImage.alt = work.title;
    workModalDescription.textContent = work.description || '暂无作品描述';
    workModalBackground.textContent = work.background || '暂无创作背景信息';
    
    // 生成链接按钮
    workModalLinks.innerHTML = '';
    if (work.links && work.links.length > 0) {
      work.links.forEach(link => {
        const linkBtn = document.createElement('a');
        linkBtn.href = link.url || '#';
        linkBtn.className = 'btn btn-secondary';
        linkBtn.target = '_blank';
        linkBtn.innerHTML = `<i class="${link.icon || 'fas fa-link'}"></i> ${link.name}`;
        workModalLinks.appendChild(linkBtn);
      });
    } else {
      workModalLinks.innerHTML = '<p style="color: #777;">暂无相关链接</p>';
    }
    
    // 显示弹窗
    workModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // 分类筛选功能
  function setupCategoryFilters() {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // 更新按钮样式
        categoryBtns.forEach(b => {
          b.classList.remove('active', 'btn');
          b.classList.add('btn-secondary');
        });
        this.classList.add('active', 'btn');
        this.classList.remove('btn-secondary');

        // 获取选中的分类并加载对应作品
        const category = this.getAttribute('data-category');
        loadWorks(category);
      });
    });
  }

  // 关闭弹窗
  function closeModal() {
    workModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // 绑定关闭事件
  closeWorkModal.addEventListener('click', closeModal);
  
  // 点击弹窗外部关闭
  workModal.addEventListener('click', function(e) {
    if (e.target === workModal) {
      closeModal();
    }
  });

  // 初始化
  setupCategoryFilters();
  loadWorks(); // 默认加载所有作品
});

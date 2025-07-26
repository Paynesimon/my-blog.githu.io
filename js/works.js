import { workAPI } from './api.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const workModal = document.getElementById('work-modal');
  const closeWorkModal = document.querySelector('.close-btn');
  const addWorkBtn = document.getElementById('add-work-btn');
  const workForm = document.getElementById('work-form');
  const modalTitle = document.getElementById('modal-title');
  const workIdInput = document.getElementById('work-id');
  const worksTableBody = document.getElementById('works-table-body');

  // 初始化
  initEventListeners();
  loadWorks();

  // 初始化事件监听器
  function initEventListeners() {
    // 添加作品按钮
    addWorkBtn.addEventListener('click', () => openModal());

    // 关闭模态框
    closeWorkModal.addEventListener('click', () => closeModal());
    window.addEventListener('click', (e) => {
      if (e.target === workModal) closeModal();
    });

    // 表单提交
    workForm.addEventListener('submit', handleFormSubmit);

    // 编辑和删除按钮事件委托
    worksTableBody.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.action-btn[data-id]');
      if (!editBtn) return;

      const id = editBtn.getAttribute('data-id');
      if (editBtn.querySelector('.fa-edit')) {
        editWork(id);
      } else if (editBtn.querySelector('.fa-trash')) {
        deleteWork(id);
      }
    });
  }

  // 加载作品列表
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
      worksTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center"><i class="fas fa-spinner fa-spin"></i> 加载中...</td></tr>';
      const works = await workAPI.getWorks(category);
      renderWorksTable(works);
    } catch (error) {
      console.error('加载作品失败:', error);
      worksTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #e74c3c;">加载失败，请刷新页面重试</td></tr>';
    }
  }

  // 渲染作品表格
  function renderWorksTable(works) {
    if (works.length === 0) {
      worksTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">暂无作品数据</td></tr>';
      return;
    }

    worksTableBody.innerHTML = works.map(work => `
      <tr>
        <td>${work.id}</td>
        <td>${work.title}</td>
        <td>${work.category_name}</td>
        <td>
          <button class="action-btn btn btn-secondary" data-id="${work.id}"><i class="fas fa-edit"></i> 编辑</button>
          <button class="action-btn btn btn-secondary" data-id="${work.id}"><i class="fas fa-trash"></i> 删除</button>
        </td>
      </tr>
    `).join('');
  }

  // 打开模态框
  function openModal(work = null) {
    // 重置表单
    workForm.reset();
    workIdInput.value = '';
    modalTitle.textContent = work ? '编辑作品' : '添加作品';
    workModal.style.display = 'block';

    // 如果是编辑，填充表单数据
    if (work) {
      workIdInput.value = work.id;
      document.getElementById('work-title').value = work.title;
      document.getElementById('work-category').value = work.category;
      document.getElementById('work-description').value = work.description || '';
      document.getElementById('work-thumbnail').value = work.thumbnail || '';
    }
  }

  // 关闭模态框
  function closeModal() {
    workModal.style.display = 'none';
  }

  // 处理表单提交
  async function handleFormSubmit(e) {
    e.preventDefault();

    const workData = {
      title: document.getElementById('work-title').value,
      category: document.getElementById('work-category').value,
      category_name: document.getElementById('work-category').options[document.getElementById('work-category').selectedIndex].text,
      description: document.getElementById('work-description').value,
      thumbnail: document.getElementById('work-thumbnail').value
    };

    try {
      const workId = workIdInput.value;
      if (workId) {
        // 编辑现有作品
        await workAPI.updateWork(workId, workData);
        alert('作品更新成功');
      } else {
        // 添加新作品
        await workAPI.addWork(workData);
        alert('作品添加成功');
      }

      closeModal();
      loadWorks(); // 重新加载作品列表
    } catch (error) {
      console.error('保存作品失败:', error);
      alert('保存失败: ' + error.message);
    }
  }

  // 编辑作品
  async function editWork(id) {
    try {
      const work = await workAPI.getWork(id);
      openModal(work);
    } catch (error) {
      console.error('加载作品详情失败:', error);
      alert('加载作品详情失败: ' + error.message);
    }
  }

  // 删除作品
  async function deleteWork(id) {
    if (!confirm('确定要删除这个作品吗？')) return;

    try {
      await workAPI.deleteWork(id);
      alert('作品删除成功');
      loadWorks(); // 重新加载作品列表
    } catch (error) {
      console.error('删除作品失败:', error);
      alert('删除失败: ' + error.message);
    }
  }

  // 原始加载作品列表代码
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

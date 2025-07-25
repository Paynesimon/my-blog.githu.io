import { communityAPI } from './api.js';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 元素获取
  const loginPrompt = document.getElementById('login-prompt');
  const postForm = document.getElementById('post-form');
  const showLoginBtn = document.getElementById('show-login');
  const loginBtn = document.getElementById('login-btn');
  const loginModal = document.getElementById('login-modal');
  const closeLogin = document.getElementById('close-login');
  const loginForm = document.getElementById('login-form');
  const postsList = document.getElementById('posts-list');
  const loadMoreBtn = document.getElementById('load-more');
  const postTitleInput = document.getElementById('post-title');
  const postCategorySelect = document.getElementById('post-category');
  const postContentInput = document.getElementById('post-content');

  // 初始化登录状态
  checkLoginStatus();
  
  // 加载帖子列表
  loadPosts();

  // 检查登录状态并更新UI
  function checkLoginStatus() {
    const isLoggedIn = communityAPI.isLoggedIn();
    if (isLoggedIn) {
      loginPrompt.style.display = 'none';
      postForm.style.display = 'block';
      loginBtn.textContent = `欢迎，${communityAPI.getCurrentUser().username}`;
      loginBtn.disabled = true;
      loginBtn.style.cursor = 'default';
    } else {
      loginPrompt.style.display = 'block';
      postForm.style.display = 'none';
      loginBtn.innerHTML = '<i class="fas fa-user"></i> 账号登录';
      loginBtn.disabled = false;
      loginBtn.style.cursor = 'pointer';
    }
  }

  // 打开登录弹窗
  function openLoginModal() {
    loginModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // 关闭登录弹窗
  function closeLoginModal() {
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // 登录处理
  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      // 调用API登录
      await communityAPI.login(username, password);
      
      // 更新UI
      checkLoginStatus();
      closeLoginModal();
      loadPosts(); // 重新加载帖子列表
      
      // 清空表单
      loginForm.reset();
    } catch (error) {
      // 错误已在API工具中处理，这里无需额外操作
    }
  }

  // 发布帖子处理
  async function handlePostSubmit(e) {
    e.preventDefault();
    const user = communityAPI.getCurrentUser();
    
    if (!user) {
      alert('请先登录');
      return;
    }
    
    const title = postTitleInput.value.trim();
    const category = postCategorySelect.value;
    const content = postContentInput.value.trim();
    
    if (!title || !content) {
      alert('请填写标题和内容');
      return;
    }
    
    try {
      // 调用API发布帖子
      await communityAPI.createPost({
        user_id: user.id,
        title,
        category,
        content
      });
      
      // 重置表单
      postForm.reset();
      
      // 重新加载帖子列表
      loadPosts();
      
      alert('帖子发布成功！');
    } catch (error) {
      // 错误已在API工具中处理
    }
  }

  // 加载帖子列表
  async function loadPosts() {
    try {
      // 显示加载状态
      postsList.innerHTML = '<div style="text-align: center; padding: 30px;"><i class="fas fa-spinner fa-spin"></i> 加载帖子中...</div>';
      
      // 调用API获取帖子
      const posts = await communityAPI.getPosts();
      
      if (posts.length === 0) {
        postsList.innerHTML = '<div style="text-align: center; padding: 30px;">暂无帖子，快来发布第一条帖子吧！</div>';
        return;
      }
      
      // 生成帖子HTML
      postsList.innerHTML = '';
      posts.forEach(post => {
        const postElement = createPostElement(post);
        postsList.appendChild(postElement);
      });
      
      // 绑定评论和点赞事件
      bindPostEvents();
    } catch (error) {
      postsList.innerHTML = '<div style="text-align: center; padding: 30px; color: #e74c3c;">加载帖子失败，请稍后重试</div>';
    }
  }

  // 创建帖子元素
  function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.marginBottom = '20px';
    div.setAttribute('data-post-id', post.id);
    
    // 格式化日期
    const formattedDate = new Date(post.created_at).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // 帖子内容
    div.innerHTML = `
      <div class="card-content">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${post.avatar || 'images/user-default.jpg'}" alt="${post.username}的头像" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            <div>
              <div style="font-weight: 500;">${post.username}</div>
              <div style="font-size: 0.8rem; color: #777;">${formattedDate} · ${getCategoryName(post.category)}</div>
            </div>
          </div>
          <div style="color: #777; font-size: 0.9rem;">
            <i class="far fa-comment"></i> <span class="comment-count">0</span> 条评论
          </div>
        </div>
        
        <h3 class="card-title" style="margin-bottom: 10px;">${post.title}</h3>
        <p class="card-desc">${post.content}</p>
        
        <div style="display: flex; gap: 15px; margin-top: 15px; align-items: center;">
          <button class="like-btn btn btn-secondary" data-post-id="${post.id}">
            <i class="far fa-thumbs-up"></i> <span>${post.like_count || 0}</span>
          </button>
          <button class="show-comments btn btn-secondary" data-post-id="${post.id}">
            <i class="far fa-comment"></i> 查看评论
          </button>
        </div>
        
        <!-- 评论区（默认隐藏） -->
        <div class="comments-section" data-post-id="${post.id}" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; display: none;">
          <h4 style="margin-bottom: 15px;">评论</h4>
          
          <!-- 评论列表 -->
          <div class="comments-list" style="margin-bottom: 20px;">
            <!-- 评论将动态加载 -->
            <div style="text-align: center; color: #777; padding: 10px;">加载评论中...</div>
          </div>
          
          <!-- 评论输入框 -->
          <div>
            <textarea placeholder="写下你的评论..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 0.9rem; margin-bottom: 10px; resize: vertical;"></textarea>
            <button class="post-comment btn btn-secondary" data-post-id="${post.id}" style="float: right;">发表评论</button>
            <div style="clear: both;"></div>
          </div>
        </div>
      </div>
    `;
    
    return div;
  }

  // 绑定帖子相关事件
  function bindPostEvents() {
    // 评论显示/隐藏事件
    document.querySelectorAll('.show-comments').forEach(btn => {
      btn.addEventListener('click', toggleComments);
    });
    
    // 点赞事件
    document.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', handleLike);
    });
    
    // 发表评论事件
    document.querySelectorAll('.post-comment').forEach(btn => {
      btn.addEventListener('click', handleComment);
    });
  }

  // 切换评论区显示/隐藏
  async function toggleComments(e) {
    const postId = e.currentTarget.getAttribute('data-post-id');
    const commentsSection = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
    const commentsList = commentsSection.querySelector('.comments-list');
    
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
      // 显示评论区并加载评论
      commentsSection.style.display = 'block';
      e.currentTarget.innerHTML = '<i class="far fa-comment"></i> 收起评论';
      
      // 加载评论
      await loadComments(postId, commentsList);
    } else {
      // 隐藏评论区
      commentsSection.style.display = 'none';
      e.currentTarget.innerHTML = '<i class="far fa-comment"></i> 查看评论';
    }
  }

  // 加载评论
  async function loadComments(postId, commentsListElement) {
    try {
      const result = await communityAPI.getPostWithComments(postId);
      const comments = result.comments || [];
      
      if (comments.length === 0) {
        commentsListElement.innerHTML = '<div style="text-align: center; color: #777; padding: 10px;">暂无评论，快来抢沙发吧~</div>';
      } else {
        // 更新评论计数
        const commentCountElem = document.querySelector(`[data-post-id="${postId}"] .comment-count`);
        if (commentCountElem) {
          commentCountElem.textContent = comments.length;
        }
        
        // 生成评论HTML
        commentsListElement.innerHTML = '';
        comments.forEach(comment => {
          const commentElem = createCommentElement(comment);
          commentsListElement.appendChild(commentElem);
        });
      }
    } catch (error) {
      commentsListElement.innerHTML = '<div style="text-align: center; color: #e74c3c; padding: 10px;">加载评论失败</div>';
    }
  }

  // 创建评论元素
  function createCommentElement(comment) {
    const div = document.createElement('div');
    div.style.marginBottom = '15px';
    div.style.paddingBottom = '15px';
    div.style.borderBottom = '1px solid #f1f1f1';
    
    const formattedDate = new Date(comment.created_at).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    div.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 5px;">
        <img src="${comment.avatar || 'images/user-default.jpg'}" alt="${comment.username}的头像" style="width: 30px; height: 30px; border-radius: 50%;">
        <div>
          <div style="font-weight: 500; font-size: 0.9rem;">${comment.username}</div>
          <div style="font-size: 0.8rem; color: #777;">${formattedDate}</div>
        </div>
      </div>
      <p style="margin-left: 40px; font-size: 0.95rem;">${comment.content}</p>
    `;
    
    return div;
  }

  // 处理点赞
  async function handleLike(e) {
    e.preventDefault();
    
    if (!communityAPI.isLoggedIn()) {
      alert('请先登录后再点赞');
      return;
    }
    
    const postId = e.currentTarget.getAttribute('data-post-id');
    const likeBtn = e.currentTarget;
    const countElem = likeBtn.querySelector('span');
    
    try {
      // 调用API点赞
      const result = await communityAPI.likePost(postId);
      
      // 更新UI
      countElem.textContent = result.like_count;
      
      // 添加点赞效果
      likeBtn.classList.add('active', 'btn');
      likeBtn.classList.remove('btn-secondary');
      likeBtn.querySelector('i').classList.remove('far');
      likeBtn.querySelector('i').classList.add('fas');
    } catch (error) {
      // 错误已在API工具中处理
    }
  }

  // 处理评论发布
  async function handleComment(e) {
    const postId = e.currentTarget.getAttribute('data-post-id');
    const commentsSection = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
    const textarea = commentsSection.querySelector('textarea');
    const content = textarea.value.trim();
    const user = communityAPI.getCurrentUser();
    
    if (!user) {
      alert('请先登录后再评论');
      return;
    }
    
    if (!content) {
      alert('请输入评论内容');
      return;
    }
    
    try {
      // 调用API发布评论
      await communityAPI.addComment(postId, {
        user_id: user.id,
        content
      });
      
      // 清空输入框
      textarea.value = '';
      
      // 重新加载评论
      const commentsList = commentsSection.querySelector('.comments-list');
      await loadComments(postId, commentsList);
    } catch (error) {
      // 错误已在API工具中处理
    }
  }

  // 加载更多帖子（模拟）
  function loadMorePosts() {
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
    
    // 模拟网络延迟
    setTimeout(() => {
      loadMoreBtn.innerHTML = '加载更多';
      alert('已加载全部帖子');
    }, 1000);
  }

  // 获取分类名称
  function getCategoryName(category) {
    const categories = {
      'project': '项目讨论',
      'work': '作品反馈',
      'tech': '技术交流',
      'other': '其他话题'
    };
    return categories[category] || category;
  }

  // 绑定事件
  showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal();
  });
  loginBtn.addEventListener('click', openLoginModal);
  closeLogin.addEventListener('click', closeLoginModal);
  loginForm.addEventListener('submit', handleLogin);
  postForm.addEventListener('submit', handlePostSubmit);
  loadMoreBtn.addEventListener('click', loadMorePosts);

  // 点击弹窗外部关闭登录框
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
});

// 帖子编辑脚本
import { communityAPI } from '../api.js';

class PostEditor {
    constructor() {
        this.postId = this.getUrlParam('id');
        this.init();
    }

    // 获取URL参数
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 初始化
    async init() {
        this.bindEvents();
        // 如果有postId，加载帖子数据
        if (this.postId) {
            await this.loadPostData();
        }
    }

    // 加载帖子数据
    async loadPostData() {
        try {
            const response = await communityAPI.getPost(this.postId);
            if (response && response.post) {
                const post = response.post;
                document.getElementById('page-title').textContent = '编辑帖子';
                document.getElementById('post-id').value = post.id;
                document.getElementById('post-title').value = post.title || '';
                document.getElementById('post-category').value = post.category || 'discussion';
                document.getElementById('post-content').value = post.content || '';
            }
        } catch (error) {
            console.error('加载帖子失败:', error);
            alert('加载帖子失败，请重试');
        }
    }

    // 绑定事件
    bindEvents() {
        // 保存按钮点击事件
        document.getElementById('save-post-btn').addEventListener('click', () => this.savePost());
    }

    // 保存帖子
    async savePost() {
        const postData = {
            title: document.getElementById('post-title').value,
            category: document.getElementById('post-category').value,
            content: document.getElementById('post-content').value,
            // 当前登录用户ID，实际项目中应从登录状态获取
            user_id: 1
        };

        // 简单验证
        if (!postData.title || !postData.content) {
            alert('标题和内容为必填项');
            return;
        }

        try {
            if (this.postId) {
                // 更新现有帖子
                await communityAPI.updatePost(this.postId, postData);
                alert('帖子更新成功');
            } else {
                // 创建新帖子
                await communityAPI.createPost(postData);
                alert('帖子添加成功');
            }
            // 返回帖子列表
            window.location.href = 'posts.html';
        } catch (error) {
            console.error('保存帖子失败:', error);
            alert('保存帖子失败: ' + (error.message || '网络错误'));
        }
    }
}

// 初始化帖子编辑器
document.addEventListener('DOMContentLoaded', () => {
    new PostEditor();
});
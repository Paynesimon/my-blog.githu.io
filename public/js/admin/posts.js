// 帖子管理脚本
import { communityAPI } from '../api.js';

// 帖子数据管理类
class PostManager {
    constructor() {
        this.posts = [];
        this.init();
    }

    // 初始化
    async init() {
        await this.loadPosts();
        this.bindEvents();
    }

    // 从API加载帖子数据
    async loadPosts() {
        try {
            // 使用公共API请求函数
            const data = await communityAPI.getPosts();
            if (data && data.posts) {
                this.posts = data.posts;
                this.renderPostTable();
            } else {
                // 模拟数据，实际项目中应删除
                this.posts = [
                    { id: 1, title: '欢迎来到驴友的草料房', author: '驴思源', date: '刚刚', category: '公告' },
                    { id: 2, title: '关于任务管理应用的功能建议', author: '张小明', date: '2天前', category: '项目讨论' },
                    { id: 3, title: 'UI设计中的颜色搭配请教', author: '王小红', date: '5天前', category: '技术交流' }
                ];
                this.renderPostTable();
            }
        } catch (error) {
            console.error('加载帖子失败:', error);
        }
    }

    // 渲染帖子表格
    renderPostTable() {
        const tableBody = document.getElementById('posts-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.posts.forEach(post => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${post.date}</td>
                <td>
                    <button class="action-btn btn btn-secondary edit-btn" data-id="${post.id}"><i class="fas fa-edit"></i> 编辑</button>
                    <button class="action-btn btn btn-secondary delete-btn" data-id="${post.id}"><i class="fas fa-trash"></i> 删除</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // 绑定编辑和删除按钮事件
        this.bindTableEvents();
    }

    // 绑定表格按钮事件
    bindTableEvents() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.editPost(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deletePost(id);
            });
        });
    }

    // 绑定页面事件
    bindEvents() {
        // 添加帖子按钮
        const addBtn = document.getElementById('add-post-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddPostForm());
        }
    }

    // 显示添加帖子表单
    showAddPostForm() {
        // 在实际项目中，这里应该显示一个模态框表单
        alert('添加帖子功能将在后续实现');
        // 实际实现时应打开模态框并加载表单
    }

    // 编辑帖子
    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        // 在实际项目中，这里应该显示编辑表单
        alert(`编辑帖子: ${post.title}`);
        // 实际实现时应打开模态框并加载帖子数据到表单
    }

    // 删除帖子
    async deletePost(id) {
        if (!confirm('确定要删除这个帖子吗？')) return;

        try {
            // 使用公共API请求函数
            const result = await communityAPI.deletePost(id);
            if (result && result.success) {
                // 从列表中移除并重新渲染
                this.posts = this.posts.filter(p => p.id !== id);
                this.renderPostTable();
                alert('帖子已删除');
            } else {
                alert('删除失败');
            }
        } catch (error) {
            console.error('删除帖子失败:', error);
            alert('删除失败，请重试');
        }
    }
}

// 初始化帖子管理器
document.addEventListener('DOMContentLoaded', () => {
    new PostManager();
});
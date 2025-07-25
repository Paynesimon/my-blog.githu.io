// 作品管理脚本
import { workAPI } from '../api.js';

// 作品数据管理类
class WorkManager {
    constructor() {
        this.works = [];
        this.init();
    }

    // 初始化
    async init() {
        await this.loadWorks();
        this.bindEvents();
    }

    // 从API加载作品数据
    async loadWorks() {
        try {
            // 使用公共API请求函数
            const data = await workAPI.getWorks();
            if (data && data.works) {
                this.works = data.works;
                this.renderWorkTable();
            } else {
                // 模拟数据，实际项目中应删除
                this.works = [
                    { id: 1, title: '市场人超级AI工具箱', category: '创意项目', tags: ['AI', '创意项目'] },
                    { id: 2, title: '驴思源的短篇小说集', category: '写作文章', tags: ['写作', '文章'] },
                    { id: 3, title: '品牌设计全案', category: '设计作品', tags: ['设计', '品牌'] }
                ];
                this.renderWorkTable();
            }
        } catch (error) {
            console.error('加载作品失败:', error);
        }
    }

    // 渲染作品表格
    renderWorkTable() {
        const tableBody = document.getElementById('works-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.works.forEach(work => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${work.id}</td>
                <td>${work.title}</td>
                <td>${work.category}</td>
                <td>
                    <button class="action-btn btn btn-secondary edit-btn" data-id="${work.id}"><i class="fas fa-edit"></i> 编辑</button>
                    <button class="action-btn btn btn-secondary delete-btn" data-id="${work.id}"><i class="fas fa-trash"></i> 删除</button>
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
                this.editWork(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteWork(id);
            });
        });
    }

    // 绑定页面事件
    bindEvents() {
        // 添加作品按钮
        const addBtn = document.getElementById('add-work-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddWorkForm());
        }
    }

    // 显示添加作品表单
    showAddWorkForm() {
        // 在实际项目中，这里应该显示一个模态框表单
        alert('添加作品功能将在后续实现');
        // 实际实现时应打开模态框并加载表单
    }

    // 编辑作品
    editWork(id) {
        const work = this.works.find(w => w.id === id);
        if (!work) return;

        // 在实际项目中，这里应该显示编辑表单
        alert(`编辑作品: ${work.title}`);
        // 实际实现时应打开模态框并加载作品数据到表单
    }

    // 删除作品
    async deleteWork(id) {
        if (!confirm('确定要删除这个作品吗？')) return;

        try {
            // 使用公共API请求函数
            const result = await apiRequest(`/api/works/${id}`, 'DELETE');
            if (result && result.success) {
                // 从列表中移除并重新渲染
                this.works = this.works.filter(w => w.id !== id);
                this.renderWorkTable();
                alert('作品已删除');
            } else {
                alert('删除失败');
            }
        } catch (error) {
            console.error('删除作品失败:', error);
            alert('删除失败，请重试');
        }
    }
}

// 初始化作品管理器
document.addEventListener('DOMContentLoaded', () => {
    new WorkManager();
});
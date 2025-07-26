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

    // 初始化模态框
    initModal() {
        this.modal = document.getElementById('work-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.workForm = document.getElementById('work-form');
        this.workIdInput = document.getElementById('work-id');
        this.titleInput = document.getElementById('work-title');
        this.categoryInput = document.getElementById('work-category');
        this.descriptionInput = document.getElementById('work-description');
        this.thumbnailInput = document.getElementById('work-thumbnail');
        this.closeBtn = document.querySelector('.close-btn');

        // 关闭模态框事件
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // 表单提交事件
        if (this.workForm) {
            this.workForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    // 显示添加作品表单
    showAddWorkForm() {
        this.modalTitle.textContent = '添加作品';
        this.workForm.reset();
        this.workIdInput.value = '';
        this.openModal();
    }

    // 显示编辑作品表单
    editWork(id) {
        const work = this.works.find(w => w.id === id);
        if (!work) return;

        this.modalTitle.textContent = '编辑作品';
        this.workIdInput.value = work.id;
        this.titleInput.value = work.title || '';
        this.categoryInput.value = work.category || 'creative';
        this.descriptionInput.value = work.description || '';
        this.thumbnailInput.value = work.thumbnail || '';
        this.openModal();
    }

    // 打开模态框
    openModal() {
        if (this.modal) {
            this.modal.style.display = 'block';
        }
    }

    // 关闭模态框
    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    // 处理表单提交
    async handleFormSubmit(e) {
        e.preventDefault();

        const workData = {
            title: this.titleInput.value,
            category: this.categoryInput.value,
            description: this.descriptionInput.value,
            thumbnail: this.thumbnailInput.value
        };

        try {
            const workId = this.workIdInput.value;
            if (workId) {
                // 编辑现有作品
                await workAPI.updateWork(workId, workData);
                alert('作品更新成功');
            } else {
                // 添加新作品
                await workAPI.addWork(workData);
                alert('作品添加成功');
            }

            // 关闭模态框并刷新列表
            this.closeModal();
            this.loadWorks();
        } catch (error) {
            console.error('保存作品失败:', error);
        }
    }

    // 删除作品
    async deleteWork(id) {
        if (!confirm('确定要删除这个作品吗？')) return;

        try {
            // 使用公共API请求函数
            const result = await workAPI.delete(id);
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
// 项目管理脚本

import { projectAPI } from '../api.js';

// 项目数据管理类
class ProjectManager {
    constructor() {
        this.projects = [];
        this.init();
    }

    // 初始化
    async init() {
        await this.loadProjects();
        this.initModal();
        this.bindEvents();
    }

    // 初始化模态框
    initModal() {
        this.modal = document.getElementById('project-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.projectForm = document.getElementById('project-form');
        this.projectIdInput = document.getElementById('project-id');
        this.titleInput = document.getElementById('project-title');
        this.descriptionInput = document.getElementById('project-description');
        this.statusInput = document.getElementById('project-status');
        this.techInput = document.getElementById('project-tech');
        this.progressInput = document.getElementById('project-progress');
        this.demoInput = document.getElementById('project-demo');
        this.githubInput = document.getElementById('project-github');
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
        if (this.projectForm) {
            this.projectForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    // 从API加载项目数据
    async loadProjects() {
        try {
            // 使用公共API请求函数
            const data = await projectAPI.getProjects();
            if (data && data.projects) {
                this.projects = data.projects;
                this.renderProjectTable();
            } else {
                // 模拟数据，实际项目中应删除
                this.projects = [
                    { id: 1, title: '打造一人超级市场部', status: 'progress', tags: ['AI', '市场营销'] },
                    { id: 2, title: '我的知乎超新星计划', status: 'progress', tags: ['写作', '小说创作'] }
                ];
                this.renderProjectTable();
            }
        } catch (error) {
            console.error('加载项目失败:', error);
        }
    }

    // 渲染项目表格
    renderProjectTable() {
        const tableBody = document.getElementById('projects-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        this.projects.forEach(project => {
            const row = document.createElement('tr');
            const statusLabel = project.status === 'completed' ? 
                '<span style="background: #2ecc71; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">已完成</span>' : 
                '<span style="background: #3498db; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">进行中</span>';

            row.innerHTML = `
                <td>${project.id}</td>
                <td>${project.title}</td>
                <td>${statusLabel}</td>
                <td>${project.tags.join(',')}</td>
                <td>
                    <button class="action-btn btn btn-secondary edit-btn" data-id="${project.id}"><i class="fas fa-edit"></i> 编辑</button>
                    <button class="action-btn btn btn-secondary delete-btn" data-id="${project.id}"><i class="fas fa-trash"></i> 删除</button>
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
                this.editProject(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deleteProject(id);
            });
        });
    }

    // 绑定页面事件
    bindEvents() {
        // 添加项目按钮
        const addBtn = document.getElementById('add-project-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddProjectForm());
        }
    }

    // 显示添加项目表单
    showAddProjectForm() {
        this.modalTitle.textContent = '添加项目';
        this.projectForm.reset();
        this.projectIdInput.value = '';
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

    // 编辑项目
    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;

        this.modalTitle.textContent = '编辑项目';
        this.projectIdInput.value = project.id;
        this.titleInput.value = project.title || '';
        this.descriptionInput.value = project.description || '';
        this.statusInput.value = project.status || 'progress';
        this.techInput.value = project.tech ? project.tech.join(',') : '';
        this.progressInput.value = project.progress || 0;
        this.demoInput.value = project.demo_link || '';
        this.githubInput.value = project.github_link || '';
        this.openModal();
    }

    // 处理表单提交
    async handleFormSubmit(e) {
        e.preventDefault();

        const projectData = {
            title: this.titleInput.value,
            description: this.descriptionInput.value,
            status: this.statusInput.value,
            tech: this.techInput.value ? this.techInput.value.split(',').map(t => t.trim()) : [],
            progress: this.progressInput.value,
            demo_link: this.demoInput.value,
            github_link: this.githubInput.value
        };

        try {
            const projectId = this.projectIdInput.value;
            if (projectId) {
                // 编辑现有项目
                await projectAPI.updateProject(projectId, projectData);
                alert('项目更新成功');
            } else {
                // 添加新项目
                await projectAPI.addProject(projectData);
                alert('项目添加成功');
            }

            // 关闭模态框并刷新列表
            this.closeModal();
            this.loadProjects();
        } catch (error) {
            console.error('保存项目失败:', error);
            alert('保存失败: ' + (error.message || '网络错误'));
        }
    }

    // 删除项目
    async deleteProject(id) {
        if (!confirm('确定要删除这个项目吗？')) return;

        try {
            // 使用公共API请求函数
            const result = await projectAPI.delete(id);
            if (result && result.success) {
                // 从列表中移除并重新渲染
                this.projects = this.projects.filter(p => p.id !== id);
                this.renderProjectTable();
                alert('项目已删除');
            } else {
                alert('删除失败');
            }
        } catch (error) {
            console.error('删除项目失败:', error);
            alert('删除失败，请重试');
        }
    }
}

// 初始化项目管理器
document.addEventListener('DOMContentLoaded', () => {
    new ProjectManager();
});
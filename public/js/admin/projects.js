// 项目管理脚本

// 项目数据管理类
class ProjectManager {
    constructor() {
        this.projects = [];
        this.init();
    }

    // 初始化
    async init() {
        await this.loadProjects();
        this.bindEvents();
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
        // 在实际项目中，这里应该显示一个模态框表单
        alert('添加项目功能将在后续实现');
        // 实际实现时应打开模态框并加载表单
    }

    // 编辑项目
    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;

        // 在实际项目中，这里应该显示编辑表单
        alert(`编辑项目: ${project.title}`);
        // 实际实现时应打开模态框并加载项目数据到表单
    }

    // 删除项目
    async deleteProject(id) {
        if (!confirm('确定要删除这个项目吗？')) return;

        try {
            // 使用公共API请求函数
            const result = await apiRequest(`/api/projects/${id}`, 'DELETE');
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
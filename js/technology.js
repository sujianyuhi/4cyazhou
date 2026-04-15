/**
 * 技·营造之技页面脚本
 */

// ===== 技术标签切换 =====
const TechTabs = {
    tabs: null,
    panels: null,

    init() {
        this.tabs = document.querySelectorAll('.tech-tab');
        this.panels = document.querySelectorAll('.tech-panel');

        if (!this.tabs.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tech = tab.dataset.tech;
                this.switchTab(tech);
            });
        });
    },

    switchTab(tech) {
        // 更新标签状态
        this.tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tech="${tech}"]`).classList.add('active');

        // 更新面板显示
        this.panels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `tech-${tech}`) {
                panel.classList.add('active');
            }
        });
    }
};

// ===== 水利系统Canvas动画 =====
const WaterSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

    nodeInfo: {
        ningyuan: {
            title: '宁远河',
            description: '崖州母亲河，发源于保亭毛感石林，流经崖州平原，为古城提供水源与灌溉。'
        },
        moat: {
            title: '护城河',
            description: '环绕古城的护城河，兼具军事防御与城市排水功能。'
        },
        guangou: {
            title: '官沟',
            description: '明代官府主持修建的水利工程，引宁远河水灌溉农田。'
        },
        field: {
            title: '灌溉农田',
            description: '宁远河冲积平原土壤肥沃，加上完善的水利系统，使崖州成为琼南重要的粮食产区。'
        }
    },

    init() {
        this.canvas = document.getElementById('water-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.initParticles();
        this.animate();
        this.bindEvents();

        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = 350;
    },

    initParticles() {
        this.particles = [];
        for (let i = 0; i < 25; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 2 + Math.random() * 3,
                speedX: 0.5 + Math.random() * 1,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    },

    animate() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#E8F4F8');
        gradient.addColorStop(1, '#D0E8F0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制水流路径
        this.drawFlowPath();

        // 绘制粒子
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(47, 93, 122, ${p.opacity})`;
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    drawFlowPath() {
        const pathPoints = [
            { x: this.canvas.width * 0.1, y: this.canvas.height * 0.3 },
            { x: this.canvas.width * 0.35, y: this.canvas.height * 0.5 },
            { x: this.canvas.width * 0.6, y: this.canvas.height * 0.4 },
            { x: this.canvas.width * 0.85, y: this.canvas.height * 0.6 }
        ];

        this.ctx.strokeStyle = 'rgba(47, 93, 122, 0.3)';
        this.ctx.lineWidth = 20;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
        for (let i = 1; i < pathPoints.length; i++) {
            const cpX = (pathPoints[i - 1].x + pathPoints[i].x) / 2;
            this.ctx.quadraticCurveTo(cpX, pathPoints[i - 1].y, pathPoints[i].x, pathPoints[i].y);
        }
        this.ctx.stroke();
    },

    bindEvents() {
        const nodes = document.querySelectorAll('.water-node');
        const infoPanel = document.getElementById('water-info');

        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const nodeKey = node.dataset.node;
                const info = this.nodeInfo[nodeKey];

                if (info && infoPanel) {
                    infoPanel.innerHTML = `<h4>${info.title}</h4><p>${info.description}</p>`;
                    infoPanel.style.opacity = '0';
                    setTimeout(() => infoPanel.style.opacity = '1', 50);
                }
            });
        });
    },

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    TechTabs.init();
    WaterSystem.init();
});

window.addEventListener('beforeunload', () => {
    WaterSystem.stop();
});

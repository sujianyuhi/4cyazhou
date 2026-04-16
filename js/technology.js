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

// ===== 多维度时间轴交互系统 =====
const MultiDimensionalTimeline = {
    container: null,
    wrapper: null,
    scrollBg: null,
    progressBar: null,
    modal: null,

    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    activeNode: null,

    // 历史数据
    timelineData: {
        dynasty: [
            { year: '公元前214年', title: '秦朝', era: '秦代', desc: '秦统一岭南，设南海郡，开启中原建筑技术南传之路。', features: ['中原技术引入', '郡县制建立'], source: '《史记·秦始皇本纪》' },
            { year: '公元1171年', title: '南宋', era: '宋代', desc: '崖州古城始建，奠定城市格局基础。', features: ['城池初建', '夯土城墙'], source: '《崖州志》' },
            { year: '公元1276年', title: '元朝', era: '元代', desc: '元军南下，崖州城遭破坏后重建，引入北方建筑工艺。', features: ['城池重建', '砖石结构'], source: '《元史·地理志》' },
            { year: '公元1450年', title: '明朝', era: '明代', desc: '明代大规模修建崖州城，形成完整的城防体系。', features: ['城墙加固', '四门确立'], source: '《明史·地理志》' },
            { year: '公元1670年', title: '清朝', era: '清代', desc: '清康熙九年重修，广济桥等重要建筑落成。', features: ['桥梁建设', '水利完善'], source: '《崖州志·城池志》' }
        ],
        craft: [
            { year: '宋-元', title: '夯土筑墙', era: '传统工艺', desc: '采用本地黏土与贝壳灰混合夯实，形成坚固的城墙基座。', features: ['就地取材', '层层夯实'], source: '《营造法式》' },
            { year: '明初', title: '火山岩砌筑', era: '地方特色', desc: '利用海南特有的火山岩作为建筑材料，形成独特的"黑石城"。', features: ['火山岩利用', '干砌工艺'], source: '《崖州志·物产志》' },
            { year: '明中期', title: '蚝壳窗工艺', era: '热带适配', desc: '将蚝壳打磨成薄片用于窗棂，通风透光又抗台风。', features: ['蚝壳加工', '热带建筑'], source: '实地考察记录' },
            { year: '清代', title: '石拱桥营造', era: '成熟技艺', desc: '采用单孔拱券结构建造广济桥，体现高超的石作技艺。', features: ['拱券技术', '灌浆工艺'], source: '《琼台志》' }
        ],
        artisan: [
            { year: '宋元时期', title: '徭役制度', era: '官营工匠', desc: '官府征发民夫参与城池建设，工匠身份世袭。', features: ['徭役征发', '匠籍制度'], source: '《宋史·食货志》' },
            { year: '明朝初期', title: '军户屯田', era: '军事化组织', desc: '卫所制度下，军户兼负建筑修缮职责。', features: ['军户制度', '自给自足'], source: '《明实录》' },
            { year: '明中后期', title: '民间工匠兴起', era: '市场化萌芽', desc: '民间建筑活动增多，出现专业工匠群体。', features: ['行会组织', '师徒传承'], source: '《广东通志》' },
            { year: '清代', title: '物勒工名制', era: '质量追溯', desc: '城砖刻有工匠姓名戳记，实行质量责任制。', features: ['质量问责', '实名制砖'], source: '现存古城砖铭文' }
        ],
        tool: [
            { year: '宋元', title: '传统木工具', era: '基础工具集', desc: '使用锯、刨、凿、锤等传统木作工具。', features: ['手工制作', '铁器工具'], source: '《天工开物》' },
            { year: '明代', title: '夯土工具改进', era: '专用设备', desc: '发展出专用的夯土器具，提高城墙施工效率。', features: ['夯具标准化', '分层夯实'], source: '《鲁班经》' },
            { year: '明清', title: '测量工具', era: '精准定位', desc: '使用罗盘、水准仪等工具进行建筑定位和测量。', features: ['风水堪舆', '精密测量'], source: '《营造法原》' },
            { year: '清代', title: '起重运输', era: '大型构件安装', desc: '使用滑轮、杠杆等原理搬运大型石料。', features: ['机械原理', '团队协作'], source: '工程实践记录' }
        ],
        material: [
            { year: '历代', title: '火山岩', era: '本地石材', desc: '海南岛广泛分布的玄武岩，质地坚硬耐腐蚀。', features: ['就地取材', '抗风化'], source: '地质调查报告' },
            { year: '沿海地区', title: '蚝壳材料', era: '海洋资源', desc: '充分利用海洋生物资源，变废为宝。', features: ['生态环保', '资源循环'], source: '民居调查' },
            { year: '山地', title: '木材来源', era: '森林资源', desc: '使用本地热带硬木如菠萝格、母生等。', features: ['优质硬木', '防腐耐用'], source: '《崖州志·物产志》' },
            { year: '平原', title: '黏土与石灰', era: '基础建材', desc: '本地黏土烧制砖瓦，贝壳烧制石灰。', features: ['砖瓦生产', '石灰工艺'], source: '传统工艺调查' }
        ]
    },

    init() {
        this.container = document.getElementById('timeline-container');
        this.wrapper = document.getElementById('timeline-wrapper');
        this.scrollBg = document.getElementById('scroll-bg');
        this.progressBar = document.getElementById('timeline-progress');
        this.modal = document.getElementById('timeline-modal');

        if (!this.container || !this.wrapper) return;

        this.renderTimelineNodes();
        this.bindDragEvents();
        this.bindScrollEvents();
        this.bindNavEvents();
        this.bindModalEvents();
        this.updateProgress();
    },

    renderTimelineNodes() {
        const dimensions = ['dynasty', 'craft', 'artisan', 'tool', 'material'];

        dimensions.forEach(dim => {
            const container = document.getElementById(`${dim}-nodes`);
            if (!container) return;

            const data = this.timelineData[dim];
            container.innerHTML = data.map((item, index) => `
                <div class="timeline-node" data-dimension="${dim}" data-index="${index}">
                    <div class="node-dot"></div>
                    <div class="node-content">
                        <div class="node-year">${item.year}</div>
                        <div class="node-title">${item.title}</div>
                    </div>
                </div>
            `).join('');
        });
    },

    bindDragEvents() {
        let startPos = 0;
        let isDown = false;

        this.wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startPos = e.pageX - this.wrapper.offsetLeft;
            this.scrollLeft = this.wrapper.scrollLeft;
            this.wrapper.style.cursor = 'grabbing';
        });

        this.wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            this.wrapper.style.cursor = 'grab';
        });

        this.wrapper.addEventListener('mouseup', () => {
            isDown = false;
            this.wrapper.style.cursor = 'grab';
        });

        this.wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.wrapper.offsetLeft;
            const walk = (startPos - x) * 1.5;
            this.wrapper.scrollLeft = this.scrollLeft + walk;
            this.updateParallax();
            this.updateProgress();
        });

        // 触屏支持
        let touchStartX = 0;
        let touchScrollLeft = 0;

        this.wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX;
            touchScrollLeft = this.wrapper.scrollLeft;
        }, { passive: true });

        this.wrapper.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const x = e.touches[0].pageX;
            const walk = (touchStartX - x) * 1.5;
            this.wrapper.scrollLeft = touchScrollLeft + walk;
            this.updateParallax();
            this.updateProgress();
        }, { passive: true });

        this.wrapper.addEventListener('touchend', () => {
            touchStartX = 0;
        });
    },

    bindScrollEvents() {
        // 鼠标滚轮支持
        this.wrapper.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                this.wrapper.scrollLeft += e.deltaY;
                this.updateParallax();
                this.updateProgress();
            }
        }, { passive: false });

        this.wrapper.addEventListener('scroll', () => {
            this.updateParallax();
            this.updateProgress();
        });
    },

    bindNavEvents() {
        const prevBtn = document.getElementById('timeline-prev');
        const nextBtn = document.getElementById('timeline-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.smoothScroll(-400);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.smoothScroll(400);
            });
        }

        // 节点点击事件
        document.querySelectorAll('.timeline-node').forEach(node => {
            node.addEventListener('click', (e) => {
                e.stopPropagation();
                this.activateNode(node);
                this.centerNode(node);
                this.showModal(node);
            });
        });
    },

    smoothScroll(distance) {
        const targetScroll = this.wrapper.scrollLeft + distance;
        this.wrapper.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    },

    activateNode(node) {
        // 移除所有激活状态
        document.querySelectorAll('.timeline-node').forEach(n => {
            n.classList.remove('active');
        });

        // 激活当前节点
        node.classList.add('active');
        this.activeNode = node;
    },

    centerNode(node) {
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();

        const scrollLeft = this.wrapper.scrollLeft +
            (nodeRect.left + nodeRect.width / 2) -
            (wrapperRect.left + wrapperRect.width / 2);

        this.wrapper.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    },

    updateParallax() {
        if (!this.scrollBg) return;

        const maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
        const currentScroll = this.wrapper.scrollLeft;
        const parallaxOffset = (currentScroll / maxScroll) * 30;

        this.scrollBg.style.transform = `translateX(-${parallaxOffset}%)`;
    },

    updateProgress() {
        if (!this.progressBar || !this.wrapper) return;

        const maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;
        const currentScroll = this.wrapper.scrollLeft;
        const progress = (currentScroll / maxScroll) * 100;

        this.progressBar.style.width = `${Math.min(progress, 100)}%`;
    },

    showModal(node) {
        const dimension = node.dataset.dimension;
        const index = parseInt(node.dataset.index);
        const data = this.timelineData[dimension][index];

        if (!data || !this.modal) return;

        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-era').textContent = data.era;
        document.getElementById('modal-desc').textContent = data.desc;

        // 图片区域（预留）
        const imageContainer = document.getElementById('modal-image');
        imageContainer.innerHTML = '<div class="modal-image-placeholder">📷 实物图片待搜集</div>';

        // 特性标签
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = data.features.map(f =>
            `<span class="modal-feature-tag">${f}</span>`
        ).join('');

        // 史料出处
        document.getElementById('modal-source').innerHTML =
            `<strong>史料出处：</strong>${data.source}`;

        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    hideModal() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        document.body.style.overflow = '';

        if (this.activeNode) {
            this.activeNode.classList.remove('active');
            this.activeNode = null;
        }
    },

    bindModalEvents() {
        const closeBtn = document.getElementById('modal-close');
        const overlay = document.getElementById('modal-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.hideModal());
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }
};

// 更新初始化代码
document.addEventListener('DOMContentLoaded', () => {
    TechTabs.init();
    WaterSystem.init();
    MultiDimensionalTimeline.init();
});

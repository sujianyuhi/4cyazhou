/**
 * 魂·风骨之承 - 交互脚本
 * 崖城之魂核心交互逻辑
 */

// ===== 数据定义 =====
const dimensionData = {
    shape: {
        name: '形',
        title: '古城格局',
        subtitle: '空间载体',
        color: '#8B4513',
        description: '古城独特的城池格局、街巷肌理、空间布局，是崖州文化最直观的物质载体。',
        details: [
            '"三通、四漏、七转、八角"的古城形制',
            '依山傍海的选址智慧',
            '构筑了崖州千年不变的城市骨架'
        ],
        features: ['城池形制', '街巷肌理', '空间布局'],
        tooltip: '形承载空间格局，为文化精神的孕育奠定空间基础。有形的城池格局，承载无形的山海气场。'
    },
    tech: {
        name: '技',
        title: '营造技艺',
        subtitle: '匠心智慧',
        color: '#D2691E',
        description: '传统营造技艺、材料工艺、装饰美学，是古人因地制宜、顺势而为的建造智慧。',
        details: [
            '精雕细琢的工艺细节',
            '适配南疆气候的建筑技法',
            '体现了精益求精、务实创新的工匠精神'
        ],
        features: ['榫卯工艺', '雕刻技法', '建筑智慧'],
        tooltip: '技凝聚匠心智慧，让古城不止有皮囊，更拥有坚韧、细致、质朴的文化气质。'
    },
    people: {
        name: '人',
        title: '历史人物',
        subtitle: '人文底蕴',
        color: '#CD853F',
        description: '历代名臣谪贤、本土先民、商旅百姓在崖州生活耕耘、兴教兴城。',
        details: [
            '人物事迹不断重塑建筑功能',
            '丰富城市故事、积累地域底蕴',
            '让静态古建筑成为流动的文化载体'
        ],
        features: ['名臣谪贤', '本土先民', '商旅百姓'],
        tooltip: '人注入人文底蕴，因人而有故事，因故事而有温度，赋予古城生命力。'
    },
    soul: {
        name: '魂',
        title: '崖城之魂',
        subtitle: '精神内核',
        color: '#C9A961',
        description: '形、技、人三者共同凝练崖城精神内核。',
        tooltip: '开放包容、崇文刚毅、生生不息的千年精神内核。'
    }
};

// ===== 状态管理 =====
const State = {
    activeDimensions: new Set(),
    connections: new Map(),

    init() {
        this.updateUI();
    },

    activateDimension(dim) {
        this.activeDimensions.add(dim);
        this.updateUI();

        const beam = document.querySelector(`.energy-beam.beam-${dim}`);
        if (beam) {
            beam.classList.add('active');
            this.createBeamParticles(dim);
        }

        this.checkCompletion();
    },

    createBeamParticles(dim) {
        const beam = document.querySelector(`.energy-beam.beam-${dim}`);
        if (!beam) return;
        const svg = beam.closest('svg');
        if (!svg) return;

        const x1 = parseFloat(beam.getAttribute('x1'));
        const y1 = parseFloat(beam.getAttribute('y1'));
        const x2 = parseFloat(beam.getAttribute('x2'));
        const y2 = parseFloat(beam.getAttribute('y2'));

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const t = Math.random();
                const px = x1 + (x2 - x1) * t;
                const py = y1 + (y2 - y1) * t;
                const particle = document.createElement('div');
                particle.className = 'beam-particle';
                particle.style.left = px + 'px';
                particle.style.top = py + 'px';
                particle.style.animationDelay = (Math.random() * 0.5) + 's';
                svg.parentElement.appendChild(particle);
                setTimeout(() => particle.remove(), 2500);
            }, i * 400);
        }
    },

    deactivateDimension(dim) {
        this.activeDimensions.delete(dim);
        this.connections.delete(dim);
        this.updateUI();

        const beam = document.querySelector(`.energy-beam.beam-${dim}`);
        if (beam) beam.classList.remove('active');
    },

    reset() {
        this.activeDimensions.clear();
        this.connections.clear();
        this.updateUI();
        this.hideCompletionAnimation();

        document.querySelectorAll('.energy-beam').forEach(beam => {
            beam.classList.remove('active');
        });
    },

    updateUI() {
        document.querySelectorAll('.module-card').forEach(card => {
            const dim = card.dataset.dimension;
            card.classList.toggle('active', this.activeDimensions.has(dim));
        });

        document.querySelectorAll('.cosmos-orbit').forEach(orbit => {
            const dim = orbit.dataset.dimension;
            orbit.classList.toggle('active', this.activeDimensions.has(dim));
        });

        const soul = document.querySelector('.cosmos-soul');
        if (soul) {
            soul.classList.toggle('active', this.activeDimensions.size === 3);
        }

        document.querySelectorAll('.progress-item').forEach(item => {
            const dim = item.dataset.dim;
            const isActive = this.activeDimensions.has(dim);
            item.classList.toggle('active', isActive);
            const fill = item.querySelector('.progress-fill');
            if (fill) fill.style.width = isActive ? '100%' : '0%';
        });

        document.querySelectorAll('.status-dot').forEach(dot => {
            const dim = dot.dataset.dim;
            dot.classList.toggle('active', this.activeDimensions.has(dim));
        });

        const statusNum = document.querySelector('.status-num');
        if (statusNum) {
            statusNum.textContent = this.activeDimensions.size;
        }
    },

    checkCompletion() {
        if (this.activeDimensions.size === 3) {
            setTimeout(() => this.showCompletionAnimation(), 800);
        }
    },

    showCompletionAnimation() {
        const existing = document.querySelector('.soul-completion-animation');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'soul-completion-animation';
        overlay.innerHTML = `
            <div class="soul-completion-content">
                <h2>崖城之魂 · 觉醒</h2>
                <p>形、技、人三维合一，千年精神内核已然凝练</p>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('show'));

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        CelebrationEffect.createParticles(centerX, centerY);

        setTimeout(() => {
            CelebrationEffect.createParticles(centerX - 100, centerY - 50);
            CelebrationEffect.createParticles(centerX + 100, centerY + 50);
        }, 500);

        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }, 3500);
    },

    hideCompletionAnimation() {
        const overlay = document.querySelector('.soul-completion-animation');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }
    }
};

// ===== 宇宙星系Canvas系统 =====
const CosmosSystem = {
    canvas: null,
    ctx: null,
    stars: [],
    orbitParticles: [],
    energyParticles: [],
    animationId: null,
    time: 0,

    init() {
        this.canvas = document.getElementById('cosmos-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.createStars();
        this.createOrbitParticles();
        this.animate();
    },

    resize() {
        if (!this.canvas) return;
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    },

    createStars() {
        this.stars = [];
        const count = 100;
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random(),
                y: Math.random(),
                size: Math.random() * 1.2 + 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    },

    createOrbitParticles() {
        this.orbitParticles = [];
        const orbits = [
            { radius: 0.35, angle: 0, speed: 0.15, color: 'rgba(139, 69, 19, 0.3)' },
            { radius: 0.3, angle: Math.PI * 0.67, speed: 0.2, color: 'rgba(210, 105, 30, 0.3)' },
            { radius: 0.25, angle: Math.PI * 1.33, speed: 0.25, color: 'rgba(205, 133, 63, 0.3)' }
        ];

        for (let i = 0; i < 30; i++) {
            const orbit = orbits[i % 3];
            this.orbitParticles.push({
                angle: orbit.angle + (i * Math.PI * 2 / 30),
                radius: orbit.radius + (Math.random() - 0.5) * 0.05,
                speed: orbit.speed + (Math.random() - 0.5) * 0.05,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                color: orbit.color
            });
        }
    },

    addEnergyParticle(dim) {
        const colors = { shape: '#8B4513', tech: '#D2691E', people: '#CD853F' };
        const angles = { shape: -Math.PI / 2, tech: Math.PI / 6, people: Math.PI * 5 / 6 };
        const angle = angles[dim] || 0;
        const radius = 0.35;

        for (let i = 0; i < 25; i++) {
            const spreadAngle = angle + (Math.random() - 0.5) * 0.8;
            this.energyParticles.push({
                x: 0.5 + Math.cos(spreadAngle) * radius,
                y: 0.5 + Math.sin(spreadAngle) * radius,
                vx: (Math.random() - 0.5) * 0.01,
                vy: (Math.random() - 0.5) * 0.01,
                life: 1,
                size: Math.random() * 3 + 1,
                color: colors[dim] || '#C9A961'
            });
        }
    },

    animate() {
        if (!this.ctx) return;
        this.time += 0.016;

        const w = this.canvas.width / (window.devicePixelRatio || 1);
        const h = this.canvas.height / (window.devicePixelRatio || 1);
        const cx = w / 2;
        const cy = h / 2;
        const minDim = Math.min(w, h);

        this.ctx.clearRect(0, 0, w, h);

        this.stars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            const opacity = star.opacity * (0.4 + 0.6 * Math.sin(star.twinklePhase));

            this.ctx.beginPath();
            this.ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(201, 169, 97, ${opacity})`;
            this.ctx.fill();
        });

        this.orbitParticles.forEach(p => {
            p.angle += p.speed * 0.016;
            const x = cx + Math.cos(p.angle) * p.radius * minDim;
            const y = cy + Math.sin(p.angle) * p.radius * minDim;

            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(this.time * 2 + p.angle));
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;

        this.energyParticles = this.energyParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.012;
            p.size *= 0.98;

            if (p.life > 0) {
                this.ctx.beginPath();
                this.ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life * 0.7;
                this.ctx.fill();
                return true;
            }
            return false;
        });
        this.ctx.globalAlpha = 1;

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

// ===== 解说区更新 =====
function updateExplanation(dimension) {
    const container = document.getElementById('explanation-content');
    if (!container) return;

    const data = dimensionData[dimension];
    if (!data) return;

    const iconSvg = {
        shape: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="20" width="48" height="36" rx="2"/><path d="M4 20L32 4L60 20"/><rect x="24" y="36" width="16" height="20"/><path d="M32 36V28"/></svg>',
        tech: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M32 8L32 20"/><path d="M20 14L32 20L44 14"/><path d="M32 20L32 32"/><path d="M20 26L32 32L44 26"/><path d="M32 32L32 44"/><path d="M20 38L32 44L44 38"/><circle cx="32" cy="52" r="4"/></svg>',
        people: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="16" r="10"/><path d="M16 56C16 42 23 34 32 34C41 34 48 42 48 56"/><path d="M8 56L56 56"/></svg>'
    };

    container.innerHTML = `
        <div class="dimension-explanation">
            <div class="dim-icon" style="color: ${data.color}">
                ${iconSvg[dimension] || ''}
            </div>
            <h4 style="color: ${data.color}">${data.title}</h4>
            <span class="dim-subtitle">${data.subtitle}</span>
            <p>${data.description}</p>
            ${data.details ? data.details.map(d => `<p>${d}</p>`).join('') : ''}
            ${data.features ? `
                <div class="dim-features">
                    ${data.features.map(f => `<span class="dim-feature">${f}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// ===== 知识点弹窗 =====
const Tooltip = {
    element: null,
    timeout: null,

    init() {
        this.element = document.getElementById('tooltip');
        if (!this.element) return;

        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.show(e, card.dataset.dimension));
            card.addEventListener('mouseleave', () => this.hide());
        });

        document.querySelectorAll('.ring-outer, .ring-middle, .ring-inner, .ring-center').forEach(ring => {
            ring.addEventListener('mouseenter', (e) => this.show(e, ring.dataset.dimension));
            ring.addEventListener('mouseleave', () => this.hide());
        });

        document.querySelectorAll('.detail-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => this.show(e, card.dataset.dimension));
            card.addEventListener('mouseleave', () => this.hide());
        });
    },

    show(e, dimension) {
        if (!this.element) return;
        const data = dimensionData[dimension];
        if (!data || !data.tooltip) return;

        clearTimeout(this.timeout);

        this.element.innerHTML = `
            <div class="tooltip-title">${data.name} · ${data.title}</div>
            <div>${data.tooltip}</div>
        `;

        const rect = e.currentTarget.getBoundingClientRect();
        const tooltipRect = this.element.getBoundingClientRect();

        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 12;

        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = rect.bottom + 12;

        this.element.style.left = left + 'px';
        this.element.style.top = top + 'px';
        this.element.classList.add('visible');
    },

    hide() {
        if (!this.element) return;
        this.timeout = setTimeout(() => {
            this.element.classList.remove('visible');
        }, 100);
    }
};

// ===== 模块卡片点击 =====
function initModuleCards() {
    document.querySelectorAll('.module-card').forEach(card => {
        const inner = card.querySelector('.module-card-inner');

        card.addEventListener('mousemove', (e) => {
            if (!inner) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            inner.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (inner) {
                inner.style.transform = '';
            }
        });

        card.addEventListener('click', () => {
            const dim = card.dataset.dimension;
            if (State.activeDimensions.has(dim)) {
                State.deactivateDimension(dim);
            } else {
                State.activateDimension(dim);
                updateExplanation(dim);
                createRipple(card, event);
            }
        });
    });
}

function createRipple(element, event) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(201, 169, 97, 0.3);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// ===== 轨道节点交互 =====
function initOrbitInteraction() {
    // 兼容旧版 cosmos-orbit（如有）
    document.querySelectorAll('.cosmos-orbit').forEach(orbit => {
        orbit.addEventListener('click', () => {
            const dim = orbit.dataset.dimension;
            if (State.activeDimensions.has(dim)) {
                State.deactivateDimension(dim);
            } else {
                State.activateDimension(dim);
                updateExplanation(dim);
            }
        });

        orbit.addEventListener('mouseenter', () => {
            const dim = orbit.dataset.dimension;
            const data = dimensionData[dim];
            if (data && data.tooltip) {
                clearTimeout(Tooltip.timeout);
                Tooltip.element.innerHTML = `
                    <div class="tooltip-title">${data.name} · ${data.title}</div>
                    <div>${data.tooltip}</div>
                `;
                const rect = orbit.getBoundingClientRect();
                const tooltipRect = Tooltip.element.getBoundingClientRect();
                let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                let top = rect.top - tooltipRect.height - 12;
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) top = rect.bottom + 12;
                Tooltip.element.style.left = left + 'px';
                Tooltip.element.style.top = top + 'px';
                Tooltip.element.classList.add('visible');
            }
        });

        orbit.addEventListener('mouseleave', () => {
            Tooltip.hide();
        });
    });

    // 新版 3D 转盘外圈 avatar-node 交互
    document.querySelectorAll('.avatar-node').forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            const dim = node.dataset.dimension;
            if (!dim) return;
            if (State.activeDimensions.has(dim)) {
                State.deactivateDimension(dim);
            } else {
                State.activateDimension(dim);
                updateExplanation(dim);
            }
        });

        node.addEventListener('mouseenter', () => {
            const dim = node.dataset.dimension;
            const data = dimensionData[dim];
            if (data && data.tooltip) {
                clearTimeout(Tooltip.timeout);
                Tooltip.element.innerHTML = `
                    <div class="tooltip-title">${data.name} · ${data.title}</div>
                    <div>${data.tooltip}</div>
                `;
                const rect = node.getBoundingClientRect();
                const tooltipRect = Tooltip.element.getBoundingClientRect();
                let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                let top = rect.top - tooltipRect.height - 12;
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) top = rect.bottom + 12;
                Tooltip.element.style.left = left + 'px';
                Tooltip.element.style.top = top + 'px';
                Tooltip.element.classList.add('visible');
            }
        });

        node.addEventListener('mouseleave', () => {
            Tooltip.hide();
        });
    });

    // 中央魂字点击交互
    const soul = document.querySelector('.center-soul');
    if (soul) {
        soul.addEventListener('click', () => {
            if (State.activeDimensions.size < 3) {
                const dims = ['shape', 'tech', 'people'];
                const inactive = dims.filter(d => !State.activeDimensions.has(d));
                if (inactive.length > 0) {
                    const dim = inactive[0];
                    State.activateDimension(dim);
                    updateExplanation(dim);
                }
            }
        });
    }
}

// ===== 重置按钮 =====
function initResetButton() {
    const resetBtn = document.getElementById('reset-btn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
        State.reset();

        const container = document.getElementById('explanation-content');
        if (container) {
            container.innerHTML = `
                <div class="default-explanation">
                    <div class="explanation-icon">
                        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="24" cy="24" r="20"/>
                            <path d="M24 14V24L30 30"/>
                        </svg>
                    </div>
                    <p class="explanation-text">点击左侧模块或中央环形图，探索形、技、人三个维度如何汇聚成崖城之魂。</p>
                    <div class="explanation-tips">
                        <span class="tip">点击模块</span>
                        <span class="tip">拖拽连线</span>
                        <span class="tip">悬停查看</span>
                    </div>
                </div>
            `;
        }

        resetBtn.style.transform = 'rotate(-360deg)';
        setTimeout(() => {
            resetBtn.style.transform = '';
        }, 500);
    });
}

// ===== 滚动显示动画 =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===== 详情卡片交互 =====
function initDetailCards() {
    document.querySelectorAll('.detail-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        card.addEventListener('click', () => {
            const dim = card.dataset.dimension;
            if (!State.activeDimensions.has(dim)) {
                State.activateDimension(dim);
                updateExplanation(dim);
                document.querySelector('.spirit-interactive-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== 打字机效果 =====
const Typewriter = {
    init() {
        const textElement = document.querySelector('.epilogue-text');
        if (!textElement) return;

        const originalText = textElement.textContent;
        textElement.textContent = '';
        textElement.classList.add('typing-complete');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.typeText(textElement, originalText);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(textElement);
    },

    typeText(element, text, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => this.typeText(element, text, index + 1), 30);
        }
    }
};

// ===== 庆祝粒子特效 =====
const CelebrationEffect = {
    createParticles(x, y) {
        const container = document.createElement('div');
        container.className = 'celebration-particles';
        document.body.appendChild(container);

        const colors = ['#C9A961', '#8B4513', '#D2691E', '#CD853F', '#DEB887', '#FFD700'];

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';

            const angle = (Math.PI * 2 * i) / 50 + Math.random() * 0.5;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                --tx: ${tx}px;
                --ty: ${ty}px;
                width: ${4 + Math.random() * 6}px;
                height: ${4 + Math.random() * 6}px;
            `;

            container.appendChild(particle);
        }

        setTimeout(() => container.remove(), 2000);
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    State.init();
    // CosmosSystem.init(); // 3D转盘已替代Canvas星象图
    Tooltip.init();
    initModuleCards();
    initOrbitInteraction();
    initResetButton();
    initScrollReveal();
    initDetailCards();
    Typewriter.init();
    State.updateUI();

    console.log('崖城之魂交互系统已加载 - 3D转盘法阵版');
});

// ===== 页面进度条 =====
window.addEventListener('scroll', () => {
    const progress = document.querySelector('.page-progress');
    if (progress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progress.style.height = scrollPercent + '%';
    }
});

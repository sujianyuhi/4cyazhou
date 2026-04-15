/**
 * 首页脚本 - 崖城风骨
 */

// ===== 首屏粒子效果 =====
const HeroParticles = {
    container: null,
    particleCount: 25,

    init() {
        this.container = document.getElementById('hero-particles');
        if (!this.container) return;

        this.createParticles();
    },

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            this.container.appendChild(particle);
        }
    }
};

// ===== 首屏功能 =====
const HeroSection = {
    init() {
        this.bindEvents();
        HeroParticles.init();
    },

    bindEvents() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                utils.scrollTo('#narrative', 80);
            });
        }
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    HeroSection.init();
});

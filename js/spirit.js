/**
 * 魂·风骨之承页面脚本
 */

// ===== 环形图交互 =====
const NarrativeRing = {
    rings: null,

    pageMap: {
        shape: 'page-shape.html',
        tech: 'page-technology.html',
        people: 'page-people.html',
        soul: 'page-spirit.html'
    },

    init() {
        this.rings = document.querySelectorAll('.ring');
        if (!this.rings.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.rings.forEach(ring => {
            ring.addEventListener('click', () => {
                const layer = ring.dataset.layer;
                this.navigateToLayer(layer);
            });
        });
    },

    navigateToLayer(layer) {
        const target = this.pageMap[layer];
        if (target) {
            window.location.href = target;
        }
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    NarrativeRing.init();
});

/**
 * 城门转盘组件 - 点击切换版本
 * 支持点击城门切换信息展示
 */

const GateWheel = {
    // DOM元素
    wheel: null,
    infoPanel: null,
    wheelItems: null,
    pointerArrow: null,

    // 当前激活的城门
    activeGate: 'north',

    // 城门角度映射（从顶部顺时针）
    gateAngles: {
        north: 0,
        east: 90,
        south: 180,
        west: 270
    },

    // 城门数据
    gateData: {
        south: {
            name: '南门·文明门',
            direction: '面向南方',
            icon: '🏛️',
            image: '../images/content/gate-south.jpg',
            description: '南门名"文明"，是古城的正门，面向宁远河，是进出城的主要通道。现存城门楼为清代遗存，上书"文明门"三字，体现了崖州作为南疆文化中心的地位。',
            features: ['古城正门，规模宏大', '面向宁远河，水运便利', '清代遗存，保存完好', '门额题字，书法精美'],
            history: '始建于南宋，明代扩建，清代重修。南门作为正门，是古城最繁忙的通道，也是官员进出、百姓交易的主要门户。'
        },
        east: {
            name: '东门·朝阳门',
            direction: '面向东方',
            icon: '🌅',
            image: '../images/content/gate-east.jpg',
            description: '东门名"朝阳"，面向东方，迎接朝阳，是古城通往东部的重要门户。城门面向宁远河，体现了崖州古城对日出东方的礼敬之意。',
            features: ['面向宁远河', '迎朝阳，寓意吉祥', '通往东部要道', '视野开阔，景色宜人'],
            history: '始建于南宋，明代扩建。东门是连接崖州与东部沿海地区的重要通道，商贾往来频繁。'
        },
        north: {
            name: '北门·拱辰门',
            direction: '面向北方',
            icon: '⛰️',
            image: '../images/content/gate-east.jpg',
            description: '北门原名"拱辰"，清代改名凝秀门，背靠崖城山，是古城的北门屏障。城门依山而建，地势险要，具有重要的军事防御价值。',
            features: ['背靠崖城山', '清代改名凝秀门'],
            history: '始建于南宋，明代扩建，是崖州古城防御体系的重要组成部分。'
        },
        west: {
            name: '西门·镇海门',
            direction: '面向西方',
            icon: '🌊',
            image: '../images/content/gate-south.jpg',
            description: '西门名"镇海"，面向大海，寓意镇服海疆，体现了崖州作为海防重镇的军事功能。城门临海而建，是观赏海景的绝佳位置。',
            features: ['面向大海', '镇服海疆之意'],
            history: '始建于南宋，明代扩建。'
        }
    },

    /**
     * 初始化
     */
    init() {
        this.wheel = document.getElementById('wheel');
        this.infoPanel = document.getElementById('info-panel');
        this.wheelItems = document.querySelectorAll('.wheel-item');
        this.pointerArrow = document.querySelector('.pointer-arrow');

        if (!this.wheel) return;

        this.bindEvents();
        this.updateInfoPanel('north');
        this.highlightActiveGate('north');
    },

    /**
     * 绑定事件 - 只保留点击事件
     */
    bindEvents() {
        // 点击城门项目切换信息
        this.wheelItems.forEach(item => {
            item.addEventListener('click', () => {
                const gate = item.dataset.gate;
                this.selectGate(gate);
            });
        });

        // 查看详细资料按钮
        const panelLink = document.getElementById('panel-link');
        if (panelLink) {
            panelLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDetailModal();
            });
        }
    },

    /**
     * 选择城门
     */
    selectGate(gate) {
        if (gate === this.activeGate) return;

        this.activeGate = gate;
        this.highlightActiveGate(gate);
        this.updateInfoPanel(gate);
        this.rotatePointer(gate);
    },

    /**
     * 旋转指针指向城门
     */
    rotatePointer(gate) {
        if (!this.pointerArrow) return;
        
        const angle = this.gateAngles[gate];
        this.pointerArrow.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    },

    /**
     * 高亮当前城门
     */
    highlightActiveGate(gate) {
        this.wheelItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.gate === gate) {
                item.classList.add('active');
            }
        });
    },

    /**
     * 更新信息面板
     */
    updateInfoPanel(gate) {
        const data = this.gateData[gate];
        if (!data || !this.infoPanel) return;

        // 添加过渡效果
        this.infoPanel.classList.add('transitioning');

        setTimeout(() => {
            // 更新内容
            const iconEl = document.getElementById('panel-icon');
            const titleEl = document.getElementById('panel-title');
            const directionEl = document.getElementById('panel-direction');
            const imageEl = document.getElementById('panel-image');
            const descEl = document.getElementById('panel-description');
            const featuresEl = document.getElementById('panel-features');
            const historyEl = document.getElementById('panel-history');

            if (iconEl) iconEl.textContent = data.icon;
            if (titleEl) titleEl.textContent = data.name;
            if (directionEl) directionEl.textContent = data.direction;
            if (imageEl) imageEl.src = data.image;
            if (imageEl) imageEl.alt = data.name;
            if (descEl) descEl.textContent = data.description;
            if (historyEl) historyEl.textContent = data.history;

            if (featuresEl) {
                featuresEl.innerHTML = data.features
                    .map(f => `<li>${f}</li>`)
                    .join('');
            }

            // 移除过渡效果
            this.infoPanel.classList.remove('transitioning');
        }, 200);
    },

    /**
     * 显示详细资料弹窗
     */
    showDetailModal() {
        const data = this.gateData[this.activeGate];
        if (!data) return;
        
        const modalContent = `
            <h3>${data.name}</h3>
            <p><strong>简介：</strong>${data.description}</p>
            <p><strong>建筑特色：</strong></p>
            <ul>${data.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <p><strong>历史沿革：</strong>${data.history}</p>
        `;
        
        if (typeof Modal !== 'undefined') {
            Modal.show(modalContent);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    GateWheel.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GateWheel;
}

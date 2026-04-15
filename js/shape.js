/**
 * 形·古城之形页面脚本
 */

// ===== 时间轴交互 =====
const Timeline = {
    items: null,
    display: null,
    
    eraData: {
        tang: {
            title: '唐代崖州城',
            description: '唐武德四年(621年)设振州，此为崖州古城之始。唐代为土城，规模较小，主要作为南疆军事据点。',
            features: ['土城结构', '军事据点', '规模较小'],
            image: '../images/content/gate-south.jpg'
        },
        song: {
            title: '南宋崖州城',
            description: '南宋庆元四年(1198年)始砌砖墙，绍定六年(1233年)扩大城址，开东、西、南三个城门，奠定古城基本格局。',
            features: ['始砌砖墙', '三门格局', '规模扩大'],
            image: '../images/content/gate-east.jpg'
        },
        ming: {
            title: '明代崖州城',
            description: '明洪武十七年(1384年)扩建为千户所城，形成"城中有城"的防御体系。四门对称布局，中轴线贯穿南北，完整体现中华传统营城礼制。',
            features: ['千户所城', '四门对称', '子城罗城', '中轴线'],
            image: '../images/content/gate-south.jpg'
        },
        qing: {
            title: '清代崖州城',
            description: '清道光年间古城建筑基本定形，城墙多次修缮，街巷肌理完善，成为琼南地区最繁华的州城之一。',
            features: ['建筑定形', '街巷完善', '商业繁华'],
            image: '../images/content/gate-east.jpg'
        }
    },

    init() {
        this.items = document.querySelectorAll('.timeline-item');
        this.display = document.getElementById('era-display');
        
        if (!this.items.length || !this.display) return;
        
        this.bindEvents();
    },

    bindEvents() {
        this.items.forEach(item => {
            item.addEventListener('click', () => {
                const era = item.dataset.era;
                this.switchEra(era);
            });
        });
    },

    switchEra(era) {
        const data = this.eraData[era];
        if (!data) return;

        // 更新时间轴状态
        this.items.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.era === era) {
                item.classList.add('active');
            }
        });

        // 更新显示内容
        this.display.innerHTML = `
            <div class="era-image">
                <img src="${data.image}" alt="${data.title}">
            </div>
            <div class="era-info">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="era-features">
                    ${data.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
            </div>
        `;

        // 添加淡入动画
        this.display.style.opacity = '0';
        setTimeout(() => {
            this.display.style.opacity = '1';
        }, 50);
    }
};

// ===== 城门弹窗 =====
const GateModal = {
    cards: null,

    gateInfo: {
        south: {
            name: '南门·文明门',
            description: '南门名"文明"，是古城的正门，面向宁远河，是进出城的主要通道。现存城门楼为清代遗存，上书"文明门"三字。'
        },
        north: {
            name: '北门·拱辰门（凝秀门）',
            description: '北门原名"拱辰"，清代改为"凝秀门"，背靠崖城山，是古城的北门屏障。'
        },
        east: {
            name: '东门·朝阳门',
            description: '东门名"朝阳"，面向东方，迎接朝阳，是古城通往东部的重要门户。'
        },
        west: {
            name: '西门·镇海门',
            description: '西门名"镇海"，面向大海，寓意镇服海疆，体现了崖州作为海防重镇的军事功能。'
        }
    },

    init() {
        this.cards = document.querySelectorAll('.gate-card');
        if (!this.cards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const gate = card.dataset.gate;
                this.showInfo(gate);
            });
        });
    },

    showInfo(gate) {
        const info = this.gateInfo[gate];
        if (!info) return;

        const content = `
            <h3>${info.name}</h3>
            <p>${info.description}</p>
        `;

        Modal.show(content);
    }
};

// ===== 选址卡片交互 =====
const SiteCards = {
    cards: null,

    siteInfo: {
        fengshui: {
            title: '天人合一',
            content: '崖州古城选址遵循中国传统风水理念，背靠崖城山形成"靠山"，面朝宁远河形成"明堂"，山环水抱的格局体现了人与自然的和谐共生。'
        },
        defense: {
            title: '军事防御',
            content: '崖城山作为天然屏障，易守难攻；宁远河形成外围防线，护城河环绕城墙，四门对称布局便于兵力调配，构成完整的防御体系。'
        },
        livelihood: {
            title: '民生功能',
            content: '宁远河为古城提供水源、灌溉农田、便利水运；护城河兼具防御与排水功能；城内暗渠系统完善，体现了古代城市规划的先进理念。'
        }
    },

    init() {
        this.cards = document.querySelectorAll('.site-card');
        if (!this.cards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.showInfo(feature);
            });
        });
    },

    showInfo(feature) {
        const info = this.siteInfo[feature];
        if (!info) return;

        const content = `
            <h3>${info.title}</h3>
            <p>${info.content}</p>
        `;

        Modal.show(content);
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    Timeline.init();
    GateModal.init();
    SiteCards.init();
});

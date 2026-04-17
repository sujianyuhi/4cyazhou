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
        
        // 初始化显示状态
        this.display.classList.add('visible');
        
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

        // 防止重复点击和动画冲突
        if (this.display.classList.contains('transitioning')) return;

        // 标记正在过渡
        this.display.classList.add('transitioning');

        // 移除可见类,触发淡出动画
        this.display.classList.remove('visible');

        // 更新时间轴状态
        this.items.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.era === era) {
                item.classList.add('active');
            }
        });

        // 等待淡出完成后更新内容
        setTimeout(() => {
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

            // 强制重绘以确保过渡生效
            void this.display.offsetWidth;

            // 添加可见类,触发淡入动画
            requestAnimationFrame(() => {
                this.display.classList.add('visible');
            });

            // 动画完成后移除transitioning标记
            setTimeout(() => {
                this.display.classList.remove('transitioning');
            }, 700);
        }, 400);
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
            content: '古城北倚鳌山、南望宁远河与大海，严格契合玄武、朱雀、青龙、白虎传统风水格局，北高南低、负阴抱阳，顺应自然山水走向，藏风聚气、向阳纳吉，是古代天人合一规划理念的典型实践。'
        },
        defense: {
            title: '军事防御',
            content: '背靠山体形成天然屏障，南侧水系构成护城河防线，依山面海的地形易守难攻；北高南低的地势兼具瞭望与御敌优势，山水合围的格局，为古城构筑起稳固的天然军事防御体系。'
        },
        livelihood: {
            title: '民生功能',
            content: '南向开阔向阳，采光通风俱佳，宜居宜业；南临宁远河与出海口，兼具水运交通、水源供给、渔业通商三大民生价值，兼顾居住舒适与生产生活便利，支撑古城长期发展。'
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

// ===== 建筑格局卡片交互 =====
const LayoutCards = {
    cards: null,

    layoutInfo: {
        hierarchy: {
            title: '罗城子城',
            content: '明代洪武十七年（1384年）扩建形成的"罗城包子城"双重城郭体系，是中国古代城市防御体系的典型代表。子城（内城）位于古城中心，是崖州州署、学宫等行政文教设施的所在地，为古城的核心区域；罗城（外城）环绕子城四周，容纳民居、商铺和寺庙，形成外环防御屏障。这种"城中有城"的格局既增强了军事防御能力，又体现了等级分明的城市空间结构，是明代卫所制度在地方城市中的典型实践。'
        },
        axis: {
            title: '中轴对称',
            content: '崖州古城严格遵循中华传统营城礼制，以南北方向为中轴线，重要公共建筑沿轴线依次分布。从南门文明门进入，沿中轴线向北，依次经过学宫（文庙）、州署、城隍庙等重要建筑，直至北门拱辰门。这种布局体现了"前朝后市，左祖右社"的传统规划理念，彰显了古代城市规划的秩序美与礼仪感。中轴线不仅是空间组织的骨架，更是礼制文化的空间载体。'
        },
        street: {
            title: '十字街格局',
            content: '古城内部道路以十字街为主干，南北向大街连接南门文明门与北门拱辰门，东西向大街连接东门朝阳门与西门镇海门，两条主街在城中心交汇，形成典型的"十"字形道路骨架。十字街不仅是古城的交通枢纽，也是商业活动的核心区域，沿街分布着各类商铺、作坊和集市。这种十字街格局是中国传统方城最常见的道路形式，便于交通组织和城市管理。'
        },
        fang: {
            title: '厢坊布局',
            content: '古城内部空间以十字街为界，划分为东厢、西厢等居住区域，形成"街-巷-院"三级空间体系。主街之下分布着若干巷道，连接各个民居院落。东厢、西厢内各有纵横交错的街巷网络，既保证了居住的私密性，又便于邻里交往。这种厢坊布局方式源自唐代的里坊制度，在宋代以后逐渐演变为更加开放的街巷制，体现了古代城市居住形态的历史演变。'
        }
    },

    init() {
        this.cards = document.querySelectorAll('.layout-card');
        if (!this.cards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const layout = card.dataset.layout;
                this.showInfo(layout);
            });
        });
    },

    showInfo(layout) {
        const info = this.layoutInfo[layout];
        if (!info) return;

        const content = `
            <h3>${info.title}</h3>
            <p>${info.content}</p>
        `;

        Modal.show(content);
    }
};

// ===== 卷轴弹窗 =====
const ScrollModal = {
    modal: null,
    closeBtn: null,
    layoutImage: null,

    init() {
        this.modal = document.getElementById('scroll-modal');
        this.closeBtn = document.getElementById('scroll-close');
        this.layoutImage = document.querySelector('.layout-image');

        if (!this.modal) return;

        this.bindEvents();
    },

    bindEvents() {
        // 点击图片打开卷轴
        if (this.layoutImage) {
            this.layoutImage.style.cursor = 'pointer';
            this.layoutImage.addEventListener('click', () => {
                this.open();
            });
        }

        // 点击关闭按钮
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.close();
            });
        }

        // 点击背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('scroll-backdrop')) {
                this.close();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    },

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    Timeline.init();
    GateModal.init();
    SiteCards.init();
    LayoutCards.init();
    ScrollModal.init();
});

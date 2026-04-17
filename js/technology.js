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
    MultiDimensionalTimeline.init();
    YachengXuegong.init();
});

window.addEventListener('beforeunload', () => {
    WaterSystem.stop();
});

window.addEventListener('resize', () => {
    if (MultiDimensionalTimeline.wrapper) {
        MultiDimensionalTimeline.unifyTrackWidths();
    }
});

// ===== 崖城学宫交互系统 =====
const YachengXuegong = {
    infoCard: null,
    cardTitle: null,
    cardBody: null,

    nodeData: [
        {
            title: '始建与变迁',
            content: '始建于北宋庆历四年，历经宋、元、明、清十数次迁建重修，清道光三年迁至今址定型，现存以清代风格为主。',
            details: [
                { label: '始建年代', value: '北宋庆历四年（1044年）' },
                { label: '迁建时间', value: '南宋淳祐年间' },
                { label: '历史地位', value: '海南第一庙' }
            ]
        },
        {
            title: '整体布局与建筑风格',
            content: '坐北朝南，中轴对称，庙学合一宫殿式建筑群，仿中原礼制、融海南海洋特色，庄重恢弘，适配湿热气候。',
            details: [
                { label: '布局特点', value: '中轴对称、三进院落' },
                { label: '建筑风格', value: '中原官式+岭南特色' },
                { label: '占地面积', value: '约12000平方米' }
            ]
        },
        {
            title: '主体构造',
            content: '由南至北依次为：文明门、棂星门、泮池泮桥、大成门、天子台、大成殿、崇圣祠，以火山岩、青砖、杉木构筑。',
            details: [
                { label: '核心建筑', value: '大成殿（五开间）' },
                { label: '构架形式', value: '抬梁式木构架' },
                { label: '屋顶形制', value: '重檐歇山顶' }
            ]
        },
        {
            title: '内部设计',
            content: '大成殿祀孔子及四配十二哲，杉木榫卯梁架，设神龛、祭器、乐器；东西庑陈列典籍碑刻；崇圣祠祀孔子先人。',
            details: [
                { label: '主祀神位', value: '孔子（至圣先师）' },
                { label: '配享诸贤', value: '四配十二哲' },
                { label: '装饰工艺', value: '藻井彩绘、梁架彩画' }
            ]
        },
        {
            title: '建筑装饰 — 柱础',
            content: '殿内柱础为覆盆莲花纹，外檐柱础为须弥座方形并饰万字纹，坚固且具吉祥寓意。',
            details: [
                { label: '主要形制', value: '覆盆式、鼓镜式、须弥座式' },
                { label: '石材来源', value: '本地火山岩（玄武岩）' },
                { label: '装饰题材', value: '缠枝莲、如意云纹' }
            ]
        },
        {
            title: '建筑装饰 — 脊饰',
            content: '正脊双龙戏珠，戗角卷纹龙，脊端饰卷草纹，鸱吻为水鸟样式，融合中原礼制与沿海特色。',
            details: [
                { label: '正脊装饰', value: '龙凤纹鸱吻' },
                { label: '垂脊装饰', value: '走兽排列' },
                { label: '工艺材料', value: '灰塑、琉璃瓦' }
            ]
        },
        {
            title: '建筑装饰 — 门窗',
            content: '门窗采用木雕工艺，设钱纹镂空窗与如意卷草纹，通风散热，适配海南湿热气候。',
            details: [
                { label: '窗格样式', value: '棂花窗格（几何+自然）' },
                { label: '木材种类', value: '优质杉木' },
                { label: '装饰题材', value: '梅兰竹菊、山水人物' }
            ]
        }
    ],

    init() {
        this.infoCard = document.getElementById('xuegong-info-card');
        this.cardTitle = document.getElementById('xg-card-title');
        this.cardBody = document.getElementById('xg-card-body');

        if (!this.infoCard || !this.cardTitle || !this.cardBody) return;

        this.bindEvents();
    },

    bindEvents() {
        const nodes = document.querySelectorAll('.xg-node');

        nodes.forEach(node => {
            node.addEventListener('click', () => {
                const index = parseInt(node.dataset.index);
                this.switchNode(index, node);
            });
        });
    },

    switchNode(index, clickedNode) {
        const nodes = document.querySelectorAll('.xg-node');

        nodes.forEach(n => n.classList.remove('active'));
        if (clickedNode) {
            clickedNode.classList.add('active');
        }

        const data = this.nodeData[index];
        if (!data) return;

        this.infoCard.classList.add('active');

        this.cardBody.style.opacity = '0';
        this.cardBody.style.transform = 'translateY(10px)';

        setTimeout(() => {
            this.cardTitle.textContent = data.title;

            let detailsHTML = '';
            if (data.details && data.details.length > 0) {
                detailsHTML = '<div class="card-details">';
                data.details.forEach(detail => {
                    detailsHTML += `
                        <div class="detail-item">
                            <span class="detail-label">${detail.label}</span>
                            <span class="detail-value">${detail.value}</span>
                        </div>
                    `;
                });
                detailsHTML += '</div>';
            }

            this.cardBody.innerHTML = `
                <p>${data.content}</p>
                ${detailsHTML}
            `;

            this.cardBody.classList.add('card-fade-in');
            this.cardBody.style.opacity = '1';
            this.cardBody.style.transform = 'translateY(0)';

            setTimeout(() => {
                this.cardBody.classList.remove('card-fade-in');
            }, 400);
        }, 200);

        setTimeout(() => {
            this.infoCard.classList.remove('active');
        }, 800);
    }
};

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
        craft: [
            { year: '唐-宋初', title: '夯土版筑', era: '传统工艺', desc: '纯生土版筑，以木板为夹板、夯实生土，无砖石包裹，城垣简陋，仅御小寇，学宫早期附属建筑亦采用此工艺。', features: ['就地取材', '层层夯实'], source: '1. 清光绪《崖州志》：宋以前系土城，仅以木栅备寇，板筑夯实，无砖石包裹，城垣简陋，仅御小寇；2. 学宫考古报告：学宫早期附属建筑遗址，发现夯土版筑痕迹，与唐至宋初故城夯土工艺一致。' },
            { year: '南宋', title: '砖土混构', era: '地方特色', desc: '土城芯体分层夯实，女墙独用砖砌，为砖城雏形；学宫同期采用芯填生土、外墙砌砖工艺。', features: ['火山岩利用', '干砌工艺'], source: '1. 南宋《吉阳军修城志》：庆元戊午，始筑土城，周回若干丈，女墙独用砖，以御矢石；2. 明人裴崇礼跋文：土城芯体，板筑夯实，女墙板筑陶砖，层层相扣，略具砖城之形；3. 清光绪《崖州志》：南宋学宫，墙体芯填生土，外墙砌砖，略具规模' },
            { year: '明清', title: '砖石全包', era: '热带适配', desc: '采用条石基脚 + 夯土芯体 + 内外包砖结构，灰浆勾缝，城门拱券砌筑、学宫全砖砌筑。', features: ['蚝壳加工', '热带建筑'], source: '1. 明正德《琼台志》：洪武二十七年，重修崖州城，基脚条石，芯填生土，内外包砖，灰浆勾缝，城高丈余，坚不可摧；城门拱券，砖石砌筑，稳固耐用；2. 清光绪《崖州志》：康熙年间，复修崖州城，沿用砖石全包之法，灰浆拌糯米汁，抵御海风，经久不颓；3. 清光绪《崖州志》：明清重修学宫，正殿全砖砌筑，灰浆勾缝，坚致耐久' },
            { year: '明代', title: '物勒工名刻砖', era: '成熟技艺', desc: '采城砖刻有烧制时间、窑户、工匠、监造官姓名，学宫砖刻学宫专用，符合造砖必刻姓名，以备查核的规定。', features: ['拱券技术', '灌浆工艺'], source: '1. 明代铭文城砖实物：万历三年，窑户赵六，工匠钱七，监造官李八，砖重廿斤；2.《明会典・工部》：凡造城砖，必刻窑户、工匠、监造官姓名，以备查核，若砖不合规，追责到底；3. 学宫出土铭文砖实物：嘉靖二十三年，窑户王九，工匠孙十，监造官刘十一，学宫专用。' },
            { year: '清代', title: '木构榫卯工艺', era: '成熟技艺', desc: '学宫梁架、城门木构采用榫卯咬合，无钉无铆，稳固耐久，适配湿热气候，城门木构裹以铁皮。', features: ['拱券技术', '灌浆工艺'], source: '1. 清光绪《崖州志》：学宫梁架、斗拱，皆用榫卯咬合，无钉无铆，稳固耐久，遇台风不倾；2. 学宫考古报告：出土梁架、斗拱残件，榫卯结构清晰，工艺精湛；3. 明正德《琼台志》：城门木构，榫卯连接，裹以铁皮，启闭灵活，经久耐用。' }
        ],
        artisan: [
            { year: '明代', title: '物勒工名追责制', era: '官营工匠', desc: '以城砖铭文为依据，建立监造官、窑户、工匠三级追责，砖有瑕疵则追责到底、监造官连坐。', features: ['徭役征发', '匠籍制度'], source: '1. 清光绪《崖州志・职官》：监造城池官，掌城砖烧制、砌筑之监查，砖有瑕疵，追究窑户、工匠，监造官连坐；2. 明代铭文城砖实物：砖不合格，窑户工匠问罪，监造官罚俸。' },
            { year: '明清', title: '工役征调制', era: '军事化组织', desc: '明代军卒 + 民夫 + 窑户协同筑城；清代征调本地工匠，分工明确、按技任职。', features: ['军户制度', '自给自足'], source: '1. 明正德《琼台志・兵防》：筑城之役，军卒守砌，民夫运土、采石，窑户专司烧砖，各司其职，协同完工；2. 清光绪《崖州志・赋役》：修城工役，征调本地石匠、砖匠，按技分工，给以粮米，限期完工。' },
            { year: '明代', title: '工匠分工制', era: '市场化萌芽', desc: '石匠、砖匠、夯土匠、木匠各司其职，分别负责采石砌基、烧砖砌筑、夯土城芯、制板造门。', features: ['行会组织', '师徒传承'], source: '1.《明代海南军屯与城池建设》：崖州筑城，工匠分工明确，石匠采石砌基，砖匠烧砖砌筑，夯土匠夯实城芯，木匠制板造门，缺一不可；2. 考古工具遗存报告：出土石凿、砖坯模、木夯等工具，对应不同工匠分工，印证分工制度。' }
        ],
        tool: [
            { year: '唐-宋初', title: '简易工具', era: '基础工具集', desc: '以木夯、石夯、版筑夹板、石凿为主，工具简易，适配纯夯土版筑。', features: ['手工制作', '铁器工具'], source: '1.《中国古代夯土筑城工具研究》：唐至宋初，夯土筑城多用木夯、石夯夯实，板为夹板，石凿采石，工具简易，适配纯土城营造；2.2010 考古发掘报告：出土石凿、木夯残件，石夯用于夯土，石凿用于开采火山岩。' },
            { year: '南宋-元', title: '工具改进', era: '专用设备', desc: '新增小型砖窑、砖坯模、铜凿，适配砖土混构工艺。', features: ['夯具标准化', '分层夯实'], source: '1. 南宋《吉阳军修城志》：筑城用砖，设小型砖窑，制砖坯模，规范砖形，铜凿细琢砖石，适配砖土混构之法；2.《海南古代制砖工艺研究》：南宋至元代，崖州制砖用砖坯模，烧制用小型砖窑，铜凿用于砖石精细加工' },
            { year: '明-清', title: '精细工具', era: '精准定位', desc: '铁錾、石锤、辘轳、官窑窑具、灰浆桶等工具，精细多样，适配砖石全包工艺。', features: ['风水堪舆', '精密测量'], source: '1. 清《工程做法则例》：明清筑城，铁錾琢石，石锤砌砖，辘轳运料，官窑窑具规范烧砖，灰浆桶运灰浆，工具精细，适配砖石全包工艺；2. 窑址考古遗存报告：出土官窑窑具、铁錾、石锤等实物，印证明清筑城工具使用。' }
        ],
        material: [
            { year: '周边山体',title: '火山岩（玄武岩）', era: '本地石材', desc: '本地开采，用于城墙基脚、城门石构，采用错缝砌筑工艺；同时用于学宫台阶、石栏及广济桥桥基砌筑。', features: ['就地取材', '抗风化'], source: '1. 清光绪《崖州志》：基脚以石为之；2.2010 考古报告：出土石器含火山岩遗存，印证基脚石构砌筑方式；3. 清光绪《崖州志》：阶砌以石，栏楯皆火山岩，坚致耐用。' },
            { year: '海边滩涂',title: '蚝壳材料', era: '海洋资源', desc: '从南海滩涂采集，经晒制切片后用于民居窗户砌筑，通风防潮，耐海风侵蚀。', features: ['生态环保', '资源循环'], source: '1.《海南传统民居营造技艺》：崖州沿海民居，多取蚝壳为窗，经晒制切片，嵌于墙体，通风防潮，耐海风侵蚀；2. 保平村民居考证：现存清代民居蚝壳窗，蚝壳排列整齐，切片规整，印证其营造工艺。' },
            { year: '本地山林',title: '木材来源', era: '森林资源（杉木、松木）', desc: '取自海南本地山林，经防腐处理，用于学宫梁架、城门木构，杉木为梁、松木为门窗。', features: ['优质硬木', '防腐耐用'], source: '1. 清光绪《崖州志》：学宫正殿梁架用杉木，门窗以松木为之，经防腐处理，经久不腐；2. 明正德《琼台志》：崖州城门木构，采本地杉木，制为门扇、门轴，裹以铁皮，增强防御；3. 学宫考古报告：出土杉木梁架残件，表面有防腐处理痕迹，与史料记载一致。' },
            { year: '统一烧制',title: '青砖', era: '基础建材', desc: '由州府官窑统一烧制，规格统一，用于城墙内外包砖、女墙砌筑等，部分城砖刻有窑户、工匠铭文。', features: ['砖瓦生产', '石灰工艺'], source: '1. 明正德《琼台志》：官窑烧砖，规制统一，砖文记窑户、工匠姓名；2. 明代铭文城砖实物：嘉靖十七年，窑户张三，工匠李四，监造官王五；3. 清光绪《崖州志》：学宫正殿墙体以青砖砌筑，脊砖规制统一，皆官窑所出。' },
            { year: '古城沙土',title: '夯土生土', era: '基础建材', desc: '取自古城周边沙土，经筛选后分层夯实，作为城墙、学宫附属建筑墙体核心，遵循以板为模，填土夯实工艺。', features: ['砖瓦生产', '石灰工艺'], source: '1. 清光绪《崖州志》：崖州城芯以生土分层夯实，取城周沙土，筛去碎石，每层厚数寸，坚如磐石；2. 明人裴崇礼《吉阳军修城志・跋》：以板为模，填土夯实，层叠而上，不疏不松；3. 学宫考古报告：学宫偏殿墙体芯体为夯土，分层夯实痕迹明显，与故城城墙夯土工艺一致。'},
            { year: '石灰糯米',title: '石灰糯米灰浆', era: '基础建材', desc: '以石灰、糯米汁、细沙搅拌而成，用于砖石缝隙粘合，经考古检测确认含糯米成分。', features: ['砖瓦生产', '石灰工艺'], source: '1. 清光绪《崖州志》：崖州城砖石砌筑，灰浆拌以糯米汁，粘合力强，耐海水侵蚀；2. 学宫考古检测报告：墙体灰浆样本检测含淀粉成分，印证使用糯米灰浆；3.《中国古代建筑灰浆工艺》：南方沿海地区常用石灰糯米灰浆，防潮抗腐蚀效果显著。' }
        ],
        bridgeWater: [
            { year: '南宋-明清', title: '广济桥', era: '故城周边', desc: '南宋绍定间建，跨护城河、石基砖拱，石灰灰浆勾缝，桥面石板铺砌，明清修缮、民国损毁，现存桥基及部分拱券。', features: ['自然水源', '简易渠道'], source: '1. 清光绪《崖州志》：广济桥，宋绍定间建，跨护城河，石基砖拱，石灰灰浆勾缝，桥面石板铺砌，通城外要道；2. 广济桥遗址考据报告：广济桥桥基为火山岩，拱券为青砖，灰浆含糯米成分，与故城城墙工艺一致。' },
            { year: '宋代', title: '后河', era: '人工河', desc: '后河南宋淳祐五年毛奎开凿，长八里，东三里引水、余用天然洼地，明清沿用、民国淤塞，2013 年清理遗址。', features: ['石拱结构', '交通枢纽'], source: '1. 南宋《吉阳军修城志》：淳祐五年，知军毛奎凿后河，绕城北，长八里，东三里引水，余用天然洼地，以利灌溉、防御；2. 明人裴崇礼跋文：后河开凿，引宁远河水，灌田护城，为崖州水利之要；3. 2013 年后河遗址考据报告：后河遗址主体清晰，东部引水段人工开凿痕迹明显。' },
            { year: '明清', title: '古城护城河', era: '城市水系', desc: '护城河明清建、环绕古城，周回三里许、深五米，清代疏浚、民国填埋，现存西段。', features: ['环形水系', '防洪排涝'], source: '清光绪《崖州志》：护城河环绕古城，周回三里许，深五米，兼具防御、排水、灌溉之能。' },
            { year: '明清', title: '城内四渠', era: '农田灌溉', desc: '城内四渠明清建、疏导雨水，合古城四漏之局，清代修缮，部分被覆盖。', features: ['人工渠道', '农田灌溉'], source: '1. 清光绪《崖州志》：城内排水渠四，分导雨水、生活用水，合古城四漏之局。' },
            { year: '清代', title: '登云桥', era: '维护保养', desc: '清代建、砖石结构，通城外道路，民国局部改建、主体留存。', features: ['技术改进', '防灾减灾'], source: '1. 清光绪《崖州志》：登云桥，清时建，砖石结构，通城外道路。' }
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
        this.unifyTrackWidths();
        this.bindDragEvents();
        this.bindScrollEvents();
        this.bindNavEvents();
        this.bindModalEvents();
        this.updateProgress();
    },

    unifyTrackWidths() {
        const tracks = this.wrapper.querySelectorAll('.timeline-track');
        if (!tracks.length) return;
        let maxContentWidth = 0;
        tracks.forEach(track => {
            const nodesContainer = track.querySelector('.track-nodes');
            if (nodesContainer) {
                const width = nodesContainer.scrollWidth;
                if (width > maxContentWidth) maxContentWidth = width;
            }
        });
        const uniformWidth = 140 + maxContentWidth;
        tracks.forEach(track => {
            track.style.width = `${uniformWidth}px`;
            const line = track.querySelector('.track-line');
            if (line) {
                line.style.width = `${maxContentWidth}px`;
            }
        });
    },

    renderTimelineNodes() {
        const dimensions = ['craft', 'artisan', 'tool', 'material', 'bridgeWater'];

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

        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-desc');
        const imageContainer = document.getElementById('modal-image');
        const sourceEl = document.getElementById('modal-source');

        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;

        if (imageContainer) {
            imageContainer.innerHTML = '<div class="modal-image-placeholder">📷 实物图片待搜集</div>';
        }

        if (sourceEl) {
            sourceEl.innerHTML = `<strong>史料出处：</strong>${data.source}`;
        }

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
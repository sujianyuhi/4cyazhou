/**
 * 全局脚本 - 崖城风骨
 * 国赛级多页面Web作品
 */

// ===== 工具函数 =====
const utils = {
    $(selector, context = document) {
        return context.querySelector(selector);
    },

    $$(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    on(element, event, handler, options = false) {
        if (element) {
            element.addEventListener(event, handler, options);
        }
    },

    throttle(fn, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn.apply(this, args);
            }
        };
    },

    scrollTo(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    },

    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        }
    }
};

// ===== 导航栏 =====
const Navbar = {
    navbar: null,
    toggle: null,
    menu: null,
    links: null,

    init() {
        this.navbar = document.querySelector('.navbar');
        this.toggle = document.querySelector('.nav-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.links = document.querySelectorAll('.nav-link');

        if (!this.navbar) return;

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 100));

        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.menu.classList.toggle('active');
            });
        }

        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.menu.classList.remove('active');
            });
        });
    },

    handleScroll() {
        if (window.pageYOffset > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
};

// ===== 页面进度条 =====
const PageProgress = {
    progressBar: null,

    init() {
        this.progressBar = document.querySelector('.page-progress');
        if (!this.progressBar) return;

        window.addEventListener('scroll', utils.throttle(() => {
            this.update();
        }, 50));
    },

    update() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.height = progress + '%';
    }
};

// ===== 全局控件 =====
const GlobalControls = {
    audioBtn: null,
    topBtn: null,
    fontBtn: null,
    isPlaying: false,
    audioElement: null,
    volume: 0.3,
    progressInterval: null,
    fontSize: 16,

    init() {
        this.audioBtn = document.getElementById('audio-btn');
        this.topBtn = document.getElementById('top-btn');
        this.fontBtn = document.getElementById('font-btn');

        this.loadAudioState();
        this.bindEvents();
    },

    bindEvents() {
        if (this.audioBtn) {
            this.audioBtn.addEventListener('click', () => this.toggleAudio());
        }

        if (this.topBtn) {
            this.topBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        if (this.fontBtn) {
            this.fontBtn.addEventListener('click', () => this.toggleFontSize());
        }
    },

    loadAudioState() {
        const savedState = utils.storage.get('audioState', null);
        if (savedState) {
            this.isPlaying = savedState.isPlaying;
            this.volume = savedState.volume || 0.3;
            
            if (this.isPlaying && this.audioBtn) {
                this.audioBtn.classList.add('playing');
                this.updateAudioIcon(true);
            }
            
            if (this.isPlaying) {
                this.tryResumeAudio(savedState.currentTime || 0);
            }
        }
    },

    saveAudioState() {
        const state = {
            isPlaying: this.isPlaying,
            volume: this.volume,
            currentTime: this.audioElement ? this.audioElement.currentTime : 0
        };
        utils.storage.set('audioState', state);
    },

    startProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        this.progressInterval = setInterval(() => {
            if (this.isPlaying && this.audioElement) {
                this.saveAudioState();
            }
        }, 1000);
    },

    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },

    toggleAudio() {
        if (this.isPlaying) {
            this.stopAudio();
        } else {
            this.playAudio();
        }
    },

    playAudio() {
        try {
            if (!this.audioElement) {
                const audioPath = window.location.pathname.includes('/pages/') 
                    ? '../bkmusic/古风温馨的纯音乐-宁静纯洁-清明时节_爱给网_aigei_com.mp3'
                    : './bkmusic/古风温馨的纯音乐-宁静纯洁-清明时节_爱给网_aigei_com.mp3';
                this.audioElement = new Audio(audioPath);
                this.audioElement.loop = true;
                this.audioElement.volume = this.volume;
            }

            this.audioElement.play();
            this.isPlaying = true;
            this.audioBtn.classList.add('playing');
            this.updateAudioIcon(true);
            this.saveAudioState();
            this.startProgressTracking();
        } catch (e) {
            console.warn('音频播放不支持:', e);
        }
    },

    tryResumeAudio(savedTime) {
        setTimeout(() => {
            try {
                if (!this.audioElement) {
                    const audioPath = window.location.pathname.includes('/pages/') 
                        ? '../bkmusic/古风温馨的纯音乐-宁静纯洁-清明时节_爱给网_aigei_com.mp3'
                        : './bkmusic/古风温馨的纯音乐-宁静纯洁-清明时节_爱给网_aigei_com.mp3';
                    this.audioElement = new Audio(audioPath);
                    this.audioElement.loop = true;
                    this.audioElement.volume = this.volume;
                }
                
                if (savedTime > 0) {
                    this.audioElement.currentTime = savedTime;
                }
                
                this.audioElement.play().then(() => {
                    this.isPlaying = true;
                    this.audioBtn.classList.add('playing');
                    this.updateAudioIcon(true);
                    this.startProgressTracking();
                }).catch(e => {
                    console.warn('自动播放被阻止:', e);
                    this.isPlaying = false;
                    this.saveAudioState();
                });
            } catch (e) {
                console.warn('音频恢复失败:', e);
            }
        }, 500);
    },

    stopAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
        }
        this.stopProgressTracking();
        this.isPlaying = false;
        this.audioBtn.classList.remove('playing');
        this.updateAudioIcon(false);
        this.saveAudioState();
    },

    updateAudioIcon(playing) {
        const svg = this.audioBtn.querySelector('svg');
        if (playing) {
            svg.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>';
        } else {
            svg.innerHTML = '<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
        }
    },

    toggleFontSize() {
        this.fontSize = this.fontSize === 16 ? 18 : (this.fontSize === 18 ? 14 : 16);
        document.documentElement.style.fontSize = this.fontSize + 'px';
    }
};

// ===== 弹窗 =====
const Modal = {
    modal: null,
    closeBtn: null,

    init() {
        this.modal = document.querySelector('.modal');
        this.closeBtn = document.querySelector('.modal-close');

        if (!this.modal) return;

        this.bindEvents();
    },

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.hide());
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });
    },

    show(content) {
        const modalBody = this.modal.querySelector('.modal-body');
        if (modalBody && content) {
            modalBody.innerHTML = content;
        }
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    hide() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ===== 引导蒙层 =====
const GuideOverlay = {
    overlay: null,
    closeBtn: null,

    init() {
        this.overlay = document.querySelector('.guide-overlay');
        this.closeBtn = document.querySelector('#guide-close');

        if (!this.overlay) return;

        const hasVisited = utils.storage.get('hasVisited', false);
        if (!hasVisited) {
            setTimeout(() => this.show(), 500);
        }

        this.bindEvents();
    },

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hide();
                utils.storage.set('hasVisited', true);
            });
        }

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
                utils.storage.set('hasVisited', true);
            }
        });
    },

    show() {
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    hide() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// ===== 滚动显示动画 =====
const ScrollReveal = {
    elements: null,
    observer: null,

    init() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        if (this.elements.length === 0) return;

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => this.observer.observe(el));
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    Navbar.init();
    PageProgress.init();
    GlobalControls.init();
    Modal.init();
    GuideOverlay.init();
    ScrollReveal.init();
    Assistant.init();

    console.log('%c崖城风骨——崖州古城建筑文化数字图鉴', 'color: #8B4513; font-size: 18px; font-weight: bold;');
    console.log('%c全国大学生计算机设计大赛参赛作品', 'color: #2F5D7A; font-size: 14px;');
});

// ===== 智能信息查询助手 =====
const Assistant = {
    float: null,
    header: null,
    input: null,
    searchBtn: null,
    closeBtn: null,
    minBtn: null,
    toggleBtn: null,
    resultsContainer: null,
    resultsList: null,
    loading: null,
    empty: null,
    pagination: null,
    
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    floatStartX: 0,
    floatStartY: 0,
    
    currentCategory: 'all',
    currentPage: 1,
    itemsPerPage: 5,
    searchKeyword: '',
    searchHistory: [],
    
    data: {
        history: [
            {
                id: 1,
                title: '崖州古城的起源与发展',
                category: 'history',
                summary: '崖州古城始建于南北朝时期，历经隋、唐、宋、元、明、清六个朝代的建设与发展，是海南岛历史最悠久的古城之一。',
                detail: {
                    timeline: ['南北朝时期：始建土城', '唐代：扩建为州城', '宋代：正式命名崖州', '明代：大规模修筑砖石城墙', '清代：多次重修加固'],
                    description: '崖州古城自建立以来，一直是海南岛南部的政治、经济、文化中心。其城墙周长约2.5公里，设有东、南、西、北四个城门，城内布局严谨，街道整齐，体现了古代城市规划的高超技艺。'
                }
            },
            {
                id: 2,
                title: '崖州古城的历史地位',
                category: 'history',
                summary: '崖州古城作为古代海南岛的重要门户，是海上丝绸之路的重要节点，见证了中原文化与岭南文化的交融。',
                detail: {
                    significance: ['海上丝绸之路的重要驿站', '中原文化传入海南的桥头堡', '贬官文化的重要发源地', '海南历史文化的重要象征'],
                    description: '崖州古城在历史上曾是海南岛的政治中心，许多著名文人墨客如李德裕、苏轼、赵鼎等都曾在此留下足迹，形成了独特的贬官文化。'
                }
            },
            {
                id: 3,
                title: '崖州古城的近代变迁',
                category: 'history',
                summary: '近代以来，崖州古城经历了多次战争与变革，城墙逐渐损毁，但城内的历史建筑和文化传统得以保留。',
                detail: {
                    events: ['1939年：日军侵占崖州', '1945年：抗日战争胜利', '1950年：海南岛解放', '20世纪80年代：开始文物保护'],
                    description: '尽管经历了岁月的沧桑，崖州古城依然保留着丰富的历史遗存。如今，古城的修复与保护工作正在有序进行，致力于重现昔日的辉煌。'
                }
            }
        ],
        officials: [
            {
                id: 4,
                title: '李德裕',
                category: 'officials',
                summary: '唐代著名宰相，因政治斗争被贬至崖州，在崖州期间兴修水利、发展教育，深受百姓爱戴。',
                detail: {
                    title: '唐代宰相',
                    tenure: '848年-850年',
                    achievements: ['兴修水利灌溉农田', '兴办学校教化民众', '整理地方文献', '安抚少数民族'],
                    evaluation: '李德裕在崖州期间政绩卓著，被誉为"崖州之贤"，其事迹被载入《崖州志》。'
                }
            },
            {
                id: 5,
                title: '苏轼',
                category: 'officials',
                summary: '北宋著名文学家，晚年被贬至儋州，途经崖州时留下了大量诗词作品，对海南文化产生深远影响。',
                detail: {
                    title: '翰林学士',
                    tenure: '1097年-1100年（谪居海南期间）',
                    achievements: ['传播中原文化', '培育当地学子', '创作大量诗词', '记录海南风土人情'],
                    evaluation: '苏轼的到来开启了海南文化发展的新篇章，其影响至今仍在。'
                }
            },
            {
                id: 6,
                title: '赵鼎',
                category: 'officials',
                summary: '南宋宰相，因反对秦桧投降政策被贬至崖州，在崖州坚持气节，著书立说，最终含冤而死。',
                detail: {
                    title: '南宋宰相',
                    tenure: '1145年-1147年',
                    achievements: ['坚持抗金主张', '撰写《忠正德文集》', '培养后学', '保持民族气节'],
                    evaluation: '赵鼎被誉为"南宋第一忠臣"，其忠贞不屈的精神为后人所敬仰。'
                }
            },
            {
                id: 7,
                title: '胡铨',
                category: 'officials',
                summary: '南宋著名谏官，因弹劾秦桧被贬至崖州，在崖州期间讲学授徒，传播文化，深受当地人民尊敬。',
                detail: {
                    title: '秘书少监',
                    tenure: '1148年-1159年',
                    achievements: ['创办学校', '教化百姓', '撰写史论', '传承儒家思想'],
                    evaluation: '胡铨在崖州的文化贡献被载入史册，成为崖州文化发展的重要里程碑。'
                }
            }
        ],
        architecture: [
            {
                id: 8,
                title: '崖州古城城墙',
                category: 'architecture',
                summary: '崖州古城城墙始建于唐代，历经多次修缮，是中国现存较为完整的古代城墙之一。',
                detail: {
                    structure: ['周长约2.5公里', '高约8米', '宽约6米', '设有四个城门'],
                    features: ['砖石结构', '马面防御设施', '护城河环绕', '城楼高耸'],
                    description: '崖州古城城墙是古代军事防御工程的杰出代表，其建筑工艺精湛，体现了古代劳动人民的智慧。'
                }
            },
            {
                id: 9,
                title: '崖州学宫',
                category: 'architecture',
                summary: '崖州学宫是古代崖州的最高学府，始建于宋代，是海南保存最完整的学宫建筑之一。',
                detail: {
                    layout: ['棂星门', '泮池', '大成殿', '明伦堂', '尊经阁'],
                    significance: ['传播儒家文化', '培养地方人才', '传承教育传统'],
                    description: '崖州学宫不仅是教育场所，也是地方文化活动的中心，见证了崖州文化教育的发展历程。'
                }
            },
            {
                id: 10,
                title: '迎旺塔',
                category: 'architecture',
                summary: '迎旺塔位于崖州古城东郊，建于清代，是崖州古城的标志性建筑之一。',
                detail: {
                    structure: ['八角七层楼阁式砖塔', '高约20米', '每层设有佛龛'],
                    features: ['层层收分', '飞檐翘角', '砖雕精美', '登高望远'],
                    description: '迎旺塔是古代崖州人为祈求文运昌盛而建，其建筑风格独特，具有重要的历史和艺术价值。'
                }
            }
        ],
        literature: [
            {
                id: 11,
                title: '《崖州志》',
                category: 'literature',
                summary: '《崖州志》是记载崖州历史的重要地方志，由清代知县张嶲编纂，是研究崖州历史的珍贵资料。',
                detail: {
                    content: ['地理沿革', '政治军事', '经济物产', '文化教育', '人物传记'],
                    value: ['研究崖州历史的权威资料', '记录地方文化的重要文献', '具有重要的学术价值'],
                    description: '《崖州志》详细记载了崖州从唐代到清代的历史变迁，是了解崖州历史文化的重要窗口。'
                }
            },
            {
                id: 12,
                title: '《琼台志》',
                category: 'literature',
                summary: '《琼台志》是明代海南的省级地方志，其中包含大量关于崖州的记载，是研究海南历史的重要文献。',
                detail: {
                    content: ['海南全岛地理', '各州县概况', '历史事件记录', '人物传记'],
                    value: ['海南历史的百科全书', '研究明代海南的重要依据', '具有重要的史料价值'],
                    description: '《琼台志》由明代学者唐胄编纂，是海南历史上第一部完整的省级地方志。'
                }
            },
            {
                id: 13,
                title: '苏轼海南诗词',
                category: 'literature',
                summary: '苏轼在海南期间创作了大量诗词作品，记录了他在海南的生活经历和情感体验。',
                detail: {
                    representative: ['《食荔枝》', '《儋耳》', '《和子由渑池怀旧》', '《记承天寺夜游》'],
                    theme: ['海南风光描写', '贬谪生活感悟', '人生哲理思考', '友情亲情表达'],
                    description: '苏轼的海南诗词不仅具有很高的文学价值，也是研究宋代海南社会生活的重要资料。'
                }
            }
        ]
    },
    
    init() {
        this.float = document.getElementById('assistant-float');
        this.header = document.getElementById('assistant-header');
        this.input = document.getElementById('assistant-input');
        this.searchBtn = document.getElementById('assistant-search-btn');
        this.closeBtn = document.getElementById('assistant-close');
        this.minBtn = document.getElementById('assistant-min');
        this.toggleBtn = document.getElementById('assistant-toggle');
        this.resultsContainer = document.getElementById('assistant-results');
        this.resultsList = document.getElementById('results-list');
        this.loading = document.getElementById('results-loading');
        this.empty = document.getElementById('results-empty');
        this.pagination = document.getElementById('assistant-pagination');
        
        if (!this.float) return;
        
        this.bindEvents();
        this.loadSearchHistory();
        this.renderResults();
    },
    
    bindEvents() {
        this.header.addEventListener('mousedown', (e) => this.startDrag(e));
        this.closeBtn.addEventListener('click', () => this.hide());
        this.minBtn.addEventListener('click', () => this.minimize());
        this.toggleBtn.addEventListener('click', () => this.toggle());
        
        this.searchBtn.addEventListener('click', () => this.search());
        this.input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.search();
        });
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.currentPage = 1;
                this.renderResults();
            });
        });
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
    },
    
    startDrag(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.floatStartX = this.float.offsetLeft;
        this.floatStartY = this.float.offsetTop;
        this.float.style.cursor = 'grabbing';
    },
    
    drag(e) {
        if (!this.isDragging) return;
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        let newX = this.floatStartX + dx;
        let newY = this.floatStartY + dy;
        
        newX = Math.max(0, Math.min(newX, window.innerWidth - this.float.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - this.float.offsetHeight));
        
        this.float.style.left = newX + 'px';
        this.float.style.top = newY + 'px';
    },
    
    stopDrag() {
        this.isDragging = false;
        this.float.style.cursor = '';
    },
    
    search() {
        this.searchKeyword = this.input.value.trim();
        this.currentPage = 1;
        
        if (this.searchKeyword) {
            this.addToHistory(this.searchKeyword);
        }
        
        setTimeout(() => {
            this.renderResults();
        }, 300);
    },
    
    addToHistory(keyword) {
        if (!this.searchHistory.includes(keyword)) {
            this.searchHistory.unshift(keyword);
            if (this.searchHistory.length > 10) {
                this.searchHistory.pop();
            }
            utils.storage.set('searchHistory', this.searchHistory);
        }
    },
    
    loadSearchHistory() {
        this.searchHistory = utils.storage.get('searchHistory', []);
    },
    
    getFilteredData() {
        let allData = [];
        
        if (this.currentCategory === 'all') {
            allData = [
                ...this.data.history,
                ...this.data.officials,
                ...this.data.architecture,
                ...this.data.literature
            ];
        } else {
            allData = this.data[this.currentCategory] || [];
        }
        
        if (this.searchKeyword) {
            const keyword = this.searchKeyword.toLowerCase();
            return allData.filter(item => 
                item.title.toLowerCase().includes(keyword) ||
                item.summary.toLowerCase().includes(keyword)
            );
        }
        
        return allData;
    },
    
    renderResults() {
        const filteredData = this.getFilteredData();
        const totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageData = filteredData.slice(start, end);
        
        this.loading.style.display = 'none';
        this.empty.style.display = filteredData.length === 0 ? 'flex' : 'none';
        this.resultsList.style.display = filteredData.length > 0 ? 'flex' : 'none';
        
        if (filteredData.length > 0) {
            this.resultsList.innerHTML = pageData.map(item => this.createResultItem(item)).join('');
            
            this.resultsList.querySelectorAll('.result-item').forEach(item => {
                item.addEventListener('click', () => this.toggleDetail(item));
            });
        }
        
        this.renderPagination(totalPages);
    },
    
    createResultItem(item) {
        const categoryNames = {
            history: '历史沿革',
            officials: '官员信息',
            architecture: '建筑布局',
            literature: '历史文献'
        };
        
        return `
            <div class="result-item" data-id="${item.id}">
                <h4>${item.title}</h4>
                <p>${item.summary}</p>
                <div class="result-meta">
                    <span class="result-category">${categoryNames[item.category]}</span>
                    <span>点击查看详情</span>
                </div>
                <div class="result-detail" id="detail-${item.id}">
                    ${this.createDetailContent(item.detail)}
                </div>
            </div>
        `;
    },
    
    createDetailContent(detail) {
        let html = '';
        
        if (detail.description) {
            html += `<p>${detail.description}</p>`;
        }
        
        if (detail.timeline) {
            html += `
                <h5>历史时间线</h5>
                <ul class="detail-list">
                    ${detail.timeline.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.title) {
            html += `<h5>官职：${detail.title}</h5>`;
        }
        
        if (detail.tenure) {
            html += `<p><strong>任期：</strong>${detail.tenure}</p>`;
        }
        
        if (detail.achievements) {
            html += `
                <h5>主要政绩</h5>
                <ul class="detail-list">
                    ${detail.achievements.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.evaluation) {
            html += `<p><strong>历史评价：</strong>${detail.evaluation}</p>`;
        }
        
        if (detail.structure) {
            html += `
                <h5>建筑结构</h5>
                <ul class="detail-list">
                    ${detail.structure.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.features) {
            html += `
                <h5>建筑特色</h5>
                <ul class="detail-list">
                    ${detail.features.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.layout) {
            html += `
                <h5>布局结构</h5>
                <ul class="detail-list">
                    ${detail.layout.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.significance) {
            html += `
                <h5>重要意义</h5>
                <ul class="detail-list">
                    ${detail.significance.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.content) {
            html += `
                <h5>内容概要</h5>
                <ul class="detail-list">
                    ${detail.content.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.value) {
            html += `
                <h5>文献价值</h5>
                <ul class="detail-list">
                    ${detail.value.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.representative) {
            html += `
                <h5>代表作品</h5>
                <ul class="detail-list">
                    ${detail.representative.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.theme) {
            html += `
                <h5>创作主题</h5>
                <ul class="detail-list">
                    ${detail.theme.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        if (detail.events) {
            html += `
                <h5>重要事件</h5>
                <ul class="detail-list">
                    ${detail.events.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }
        
        return html;
    },
    
    toggleDetail(item) {
        const detail = item.querySelector('.result-detail');
        detail.classList.toggle('active');
    },
    
    renderPagination(totalPages) {
        if (totalPages <= 1) {
            this.pagination.innerHTML = '';
            return;
        }
        
        let html = `<span class="pagination-info">第 ${this.currentPage} / ${totalPages} 页</span>`;
        
        html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
            onclick="Assistant.goToPage(${this.currentPage - 1})">上一页</button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="pagination-btn ${this.currentPage === i ? 'active' : ''}" 
                onclick="Assistant.goToPage(${i})">${i}</button>`;
        }
        
        html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
            onclick="Assistant.goToPage(${this.currentPage + 1})">下一页</button>`;
        
        this.pagination.innerHTML = html;
    },
    
    goToPage(page) {
        const totalPages = Math.ceil(this.getFilteredData().length / this.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        this.currentPage = page;
        this.renderResults();
    },
    
    hide() {
        this.float.style.display = 'none';
        this.toggleBtn.style.display = 'flex';
    },
    
    show() {
        this.float.style.display = 'flex';
        this.toggleBtn.style.display = 'none';
    },
    
    minimize() {
        this.hide();
    },
    
    toggle() {
        if (this.float.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }
};

// ===== 页面卸载清理 =====
window.addEventListener('beforeunload', () => {
    GlobalControls.saveAudioState();
    GlobalControls.stopProgressTracking();
});

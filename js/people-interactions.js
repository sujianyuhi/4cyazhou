/**
 * 人·人文之脉 - 创意交互功能
 * 包含：人物关系图谱、时空对话模拟器、诗词飞花令
 */

// ===== 人物关系图谱 =====
const RelationGraph = {
    canvas: null,
    ctx: null,
    nodes: [],
    edges: [],
    hoveredNode: null,
    animationId: null,
    tooltip: null,

    nodeData: [
        { id: 'hanyuan', name: '韩瑗', era: '唐', x: 0.2, y: 0.3, color: '#8B4513', size: 28, type: 'tang' },
        { id: 'cuiyuanzong', name: '崔元综', era: '唐', x: 0.35, y: 0.2, color: '#8B4513', size: 26, type: 'tang' },
        { id: 'yangyan', name: '杨炎', era: '唐', x: 0.15, y: 0.55, color: '#8B4513', size: 26, type: 'tang' },
        { id: 'weizhiyi', name: '韦执谊', era: '唐', x: 0.3, y: 0.7, color: '#8B4513', size: 26, type: 'tang' },
        { id: 'luduoxun', name: '卢多逊', era: '宋', x: 0.55, y: 0.25, color: '#D2691E', size: 28, type: 'song' },
        { id: 'dingwei', name: '丁谓', era: '宋', x: 0.5, y: 0.5, color: '#D2691E', size: 28, type: 'song' },
        { id: 'zhaoding', name: '赵鼎', era: '宋', x: 0.7, y: 0.4, color: '#D2691E', size: 28, type: 'song' },
        { id: 'wangshixi', name: '王仕熙', era: '元', x: 0.8, y: 0.6, color: '#CD853F', size: 26, type: 'yuan' },
        { id: 'huangdaopo', name: '黄道婆', era: '元', x: 0.65, y: 0.75, color: '#2F5D7A', size: 24, type: 'mingren' },
        { id: 'xianfuren', name: '冼夫人', era: '隋', x: 0.45, y: 0.85, color: '#2F5D7A', size: 24, type: 'mingren' },
        { id: 'zhongfang', name: '钟芳', era: '明', x: 0.85, y: 0.3, color: '#2F5D7A', size: 24, type: 'mingren' },
        { id: 'wangyangming', name: '王阳明', era: '明', x: 0.9, y: 0.75, color: '#2F5D7A', size: 24, type: 'mingren' }
    ],

    edgeData: [
        { from: 'hanyuan', to: 'cuiyuanzong', label: '同为唐相贬崖州', strength: 0.8 },
        { from: 'hanyuan', to: 'yangyan', label: '贬官先驱', strength: 0.6 },
        { from: 'cuiyuanzong', to: 'weizhiyi', label: '水利兴修', strength: 0.5 },
        { from: 'luduoxun', to: 'dingwei', label: '宋相贬崖州', strength: 0.9 },
        { from: 'luduoxun', to: 'zhaoding', label: '水南村文脉', strength: 0.8 },
        { from: 'dingwei', to: 'zhaoding', label: '盛德堂传承', strength: 0.7 },
        { from: 'zhaoding', to: 'wangshixi', label: '崖州文化传承', strength: 0.5 },
        { from: 'wangshixi', to: 'zhongfang', label: '崖州名士', strength: 0.6 },
        { from: 'huangdaopo', to: 'xianfuren', label: '崖州女性传奇', strength: 0.4 },
        { from: 'zhongfang', to: 'wangyangming', label: '心学交流', strength: 0.7 },
        { from: 'hanyuan', to: 'luduoxun', label: '贬官文化谱系', strength: 0.5 },
        { from: 'weizhiyi', to: 'dingwei', label: '教民耕牧', strength: 0.4 }
    ],

    init() {
        this.canvas = document.getElementById('relation-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.tooltip = document.getElementById('relation-tooltip');

        this.resizeCanvas();
        this.createNodes();
        this.createEdges();
        this.bindEvents();
        this.animate();

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createNodes();
            this.createEdges();
        });
    },

    resizeCanvas() {
        const wrapper = this.canvas.parentElement;
        this.canvas.width = wrapper.offsetWidth;
        this.canvas.height = wrapper.offsetHeight;
    },

    createNodes() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.nodes = this.nodeData.map(d => ({
            ...d,
            px: d.x * w,
            py: d.y * h,
            vx: 0,
            vy: 0,
            targetX: d.x * w,
            targetY: d.y * h
        }));
    },

    createEdges() {
        this.edges = this.edgeData.map(e => {
            const fromNode = this.nodes.find(n => n.id === e.from);
            const toNode = this.nodes.find(n => n.id === e.to);
            return { ...e, fromNode, toNode };
        });
    },

    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let found = null;
            for (const node of this.nodes) {
                const dx = x - node.px;
                const dy = y - node.py;
                if (Math.sqrt(dx * dx + dy * dy) < node.size + 5) {
                    found = node;
                    break;
                }
            }

            this.hoveredNode = found;
            this.canvas.style.cursor = found ? 'pointer' : 'default';

            if (found && this.tooltip) {
                this.tooltip.innerHTML = `
                    <strong>${found.name}</strong>
                    <span>${found.era}代</span>
                `;
                this.tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
                this.tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
                this.tooltip.classList.add('show');
            } else if (this.tooltip) {
                this.tooltip.classList.remove('show');
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.hoveredNode = null;
            if (this.tooltip) this.tooltip.classList.remove('show');
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.hoveredNode) {
                this.showNodeDetail(this.hoveredNode);
            }
        });
    },

    showNodeDetail(node) {
        const related = this.edges
            .filter(e => e.from === node.id || e.to === node.id)
            .map(e => {
                const otherId = e.from === node.id ? e.to : e.from;
                const other = this.nodes.find(n => n.id === otherId);
                return { name: other.name, relation: e.label };
            });

        let content = `
            <h3>${node.name} <small>（${node.era}代）</small></h3>
            <p class="modal-subtitle">点击查看更多详情</p>
        `;

        if (related.length > 0) {
            content += '<div class="relation-list"><h4>人物关联：</h4>';
            related.forEach(r => {
                content += `<p><strong>${r.name}</strong> — ${r.relation}</p>`;
            });
            content += '</div>';
        }

        if (typeof Modal !== 'undefined') {
            Modal.show(content);
        }
    },

    animate() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // 绘制连线
        this.edges.forEach(edge => {
            if (!edge.fromNode || !edge.toNode) return;

            const alpha = this.hoveredNode &&
                (this.hoveredNode.id === edge.from || this.hoveredNode.id === edge.to) ? 0.8 : 0.25;

            ctx.beginPath();
            ctx.moveTo(edge.fromNode.px, edge.fromNode.py);
            ctx.lineTo(edge.toNode.px, edge.toNode.py);
            ctx.strokeStyle = `rgba(139, 69, 19, ${alpha})`;
            ctx.lineWidth = this.hoveredNode &&
                (this.hoveredNode.id === edge.from || this.hoveredNode.id === edge.to) ? 2.5 : 1;
            ctx.stroke();

            // 绘制关系标签（仅高亮时）
            if (this.hoveredNode &&
                (this.hoveredNode.id === edge.from || this.hoveredNode.id === edge.to)) {
                const mx = (edge.fromNode.px + edge.toNode.px) / 2;
                const my = (edge.fromNode.py + edge.toNode.py) / 2;
                ctx.fillStyle = 'rgba(139, 69, 19, 0.9)';
                ctx.font = '12px "Noto Sans SC", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(edge.label, mx, my - 5);
            }
        });

        // 绘制节点
        this.nodes.forEach(node => {
            const isHovered = this.hoveredNode === node;
            const isRelated = this.hoveredNode && this.edges.some(e =>
                (e.from === this.hoveredNode.id && e.to === node.id) ||
                (e.to === this.hoveredNode.id && e.from === node.id)
            );

            // 脉冲效果
            const pulse = isHovered ? Math.sin(Date.now() / 200) * 5 : 0;

            // 外发光
            if (isHovered || isRelated) {
                ctx.beginPath();
                ctx.arc(node.px, node.py, node.size + 8 + pulse, 0, Math.PI * 2);
                ctx.fillStyle = isHovered ? 'rgba(201, 169, 97, 0.3)' : 'rgba(201, 169, 97, 0.15)';
                ctx.fill();
            }

            // 节点圆形
            ctx.beginPath();
            ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();

            // 边框
            ctx.strokeStyle = isHovered ? '#C9A961' : 'rgba(255,255,255,0.8)';
            ctx.lineWidth = isHovered ? 3 : 2;
            ctx.stroke();

            // 文字
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${node.size > 26 ? 13 : 11}px "Noto Serif SC", serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, node.px, node.py);

            // 时代标签
            ctx.fillStyle = isHovered ? '#8B4513' : 'rgba(139, 69, 19, 0.7)';
            ctx.font = '10px "Noto Sans SC", sans-serif';
            ctx.fillText(node.era, node.px, node.py + node.size + 14);
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }
};

// ===== 时空对话模拟器 =====
const DialogueApp = {
    currentCharacter: 'huangdaopo',
    isTyping: false,

    characterData: {
        huangdaopo: {
            name: '黄道婆',
            image: '../images/humanity/history/huangdaopo.png',
            welcome: '吾乃黄道婆，宋末元初之人。少时流落崖州，得黎族同胞传授纺织之术，三十余载，学有所成。后归故里，改良织机，推广棉纺技艺。今与汝相隔千年，却有幸以这种方式相会，实乃天意。汝有何想问的？',
            seal: '黄道婆印',
            questions: {
                '您在崖州生活的三十年，最大的收获是什么？': {
                    answer: '崖州三十年，乃吾一生最珍贵之岁月。初到之时，见黎族姐妹以手去籽、以竹弹棉，技艺精湛。吾虚心求教，习得"错纱、配色、综线、累花"之妙技。更难得者，黎族同胞待吾如亲人，使吾这异乡漂泊之人，得享温暖。此段经历，不仅使吾掌握棉纺之术，更让吾明白：技艺无分南北，智慧源于民间。',
                    mood: '感慨'
                },
                '您改良的纺织工具具体有哪些创新？': {
                    answer: '吾归松江后，见当地棉纺工具粗陋，效率低下。遂将崖州所学与中原技艺结合，创制数器：一曰搅车，以铁木为架，两轴相轧，可快速去籽；二曰弹棉椎弓，以竹为弓、以绳为弦，弹棉蓬松如雪；三曰三锭脚踏纺车，一脚踏动，三锭同转，效率倍增。此三器一出，淞江棉纺业大兴，百姓衣被充足。',
                    mood: '自豪'
                },
                '您如何看待黎族人民的智慧？': {
                    answer: '黎族同胞之智慧，实令吾叹服！彼等居于南疆，却能因地制宜，创造出整套棉纺织技艺。其织锦图案，取材于自然，花鸟鱼虫、山川云霞，无不栩栩如生。更难得者，黎族姐妹无私传授，不设门户之见。此种开放包容之精神，正是中华文明之精髓。吾今日之成就，皆源于黎族同胞之慷慨相授。',
                    mood: '敬佩'
                },
                '您对后世有什么期望？': {
                    answer: '吾一生致力于棉纺技艺之推广，唯愿天下百姓皆有衣御寒、有布遮体。后世之人，当铭记：技艺之道，在于利民；传承之要，在于创新。吾更期望南北交融、民族团结，使中原之先进技术与边疆之传统智慧相互借鉴，共同推动文明进步。如此，则吾之愿足矣。',
                    mood: '期许'
                }
            }
        },
        xianfuren: {
            name: '冼夫人',
            image: '../images/humanity/history/xianfuren.png',
            welcome: '本宫冼英，世居岭南，统领俚部千余洞寨。一生历经梁、陈、隋三朝，唯愿岭南安定、百姓安居。今与汝对话，虽隔千年，但保家卫国之心，古今同一。',
            seal: '谯国夫人印',
            questions: {
                '您是如何统一岭南各部落的？': {
                    answer: '本宫自幼贤明，多谋略，年少时便世袭大首领之位。然本宫深知，武力征服易，民心归附难。故本宫以诚信待人，公正处事，调解各部纷争，保护商旅安全。久而久之，南海沿海及海南岛共千余部落皆愿归附。本宫更推行中原礼法，教民耕织，使岭南由蛮荒之地渐成文明之邦。',
                    mood: '威严'
                },
                '您为何被称为"岭南圣母"？': {
                    answer: '"岭南圣母"之称，乃百姓所赠，本宫实不敢当。本宫一生，唯做两件事：一曰维护国家统一，反对分裂；二曰促进民族团结，化解矛盾。每当战乱之际，本宫必挺身而出，保境安民。隋文帝统一南北后，本宫率众归附，使岭南免遭战火。百姓感念本宫护佑之恩，遂建庙祭祀，尊为"圣母"。',
                    mood: '谦逊'
                },
                '您对崖州有什么特殊的情感？': {
                    answer: '崖州乃本宫辖地之南端，虽地处偏远，却风景秀美、物产丰饶。本宫多次巡察崖州，见当地俚人淳朴善良，遂推广中原农耕技术，教民筑堤防洪。更派汉人官吏与俚人首领共同治理，使汉俚和睦相处。崖州之安定，乃本宫一生最为欣慰之成就之一。',
                    mood: '慈爱'
                },
                '作为女性领袖，您如何面对质疑？': {
                    answer: '本宫身为女子，统领千军万马，质疑之声自然不绝于耳。然本宫始终坚信：治国之道，在于德；领军之要，在于信。本宫以德行服人，以诚信待人，以战功立威。久而久之，那些质疑之声皆化为拥护之呼。本宫想告诉后世女子：性别非界限，志向定高低。只要有才能、有胆识，女子亦可建功立业，青史留名！',
                    mood: '坚定'
                }
            }
        },
        zhongfang: {
            name: '钟芳',
            image: '../images/humanity/history/zhongfang.png',
            welcome: '在下钟芳，字仲实，号筠溪，崖州水南村人。自幼苦读，后中进士，官至户部右侍郎。虽宦游四方，然心系崖州，常以"钟崖州"自居。今日能与后人论学，实乃幸事。',
            seal: '钟芳之印',
            questions: {
                '您被称为"钟崖州"，对这个称呼有什么感触？': {
                    answer: '"钟崖州"之称，乃同乡友人戏称，在下却引以为荣。崖州虽地处南疆，然山川秀美、人杰地灵。在下出身于此，受教于斯，无论宦游何方，始终不忘根本。此称呼提醒在下：无论官居何位，不可忘本；无论学至何处，当报桑梓。崖州之水南村，乃在下灵魂之归宿。',
                    mood: '感慨'
                },
                '您的科举之路顺利吗？': {
                    answer: '在下科举之路，可谓一波三折。幼年丧母，家境贫寒，寄居外亲黄家。然在下自幼好学，十岁入州学，昼夜苦读。弘治十四年乡试第二，正德三年殿试二甲第三，选翰林院庶吉士。时人誉在下为"丘文庄后又一南溟奇才"。然在下深知，功名乃过眼云烟，唯有学问与德行可传后世。',
                    mood: '淡然'
                },
                '您与王阳明先生有过交流吗？': {
                    answer: '确有此事！阳明先生乃心学巨擘，在下对其"知行合一"之论深表赞同。虽二人见面不多，然书信往来频繁。在下曾就"格物致知"与阳明先生辩论，先生以"心即理"回应，令在下茅塞顿开。二人虽学术观点略有差异，然皆致力于儒学之创新，共同推动明代学术之多元发展。此乃崖州与中原文化交流之佳话。',
                    mood: '欣喜'
                },
                '您对崖州学子有什么寄语？': {
                    answer: '在下想告慰崖州学子：崖州虽偏远，然非文化荒漠。昔日本朝名臣丘濬，亦出自海南。只要立志向学，勤勉不辍，必能出人头地。更望学子们不仅追求功名，更要修身立德，以所学回馈桑梓，使崖州文化薪火相传。切记：读书不为做官，而为明理；明理不为利己，而为利人。',
                    mood: '期许'
                }
            }
        },
        wangyangming: {
            name: '王阳明',
            image: '../images/humanity/history/wangyangming.png',
            welcome: '吾乃王守仁，字伯安，号阳明。虽非崖州人士，然与崖州籍名臣钟芳颇有交集，对崖州之风土人情亦有所闻。吾之心学，主张"心即理"、"知行合一"、"致良知"。今日有幸与汝论道，不胜欢喜。',
            seal: '阳明山人',
            questions: {
                '什么是"心即理"？': {
                    answer: '"心即理"乃吾心学之基石。世人皆以为理在外物，须格物方能致知。然吾以为，天理自在人心，不假外求。心之本体，即是天理。只要反观内心，去除私欲遮蔽，自然明理。正如崖州山水，美在天然，不需粉饰。人心亦然，善性本具，只需觉悟。',
                    mood: '深思'
                },
                '如何理解"知行合一"？': {
                    answer: '"知行合一"乃吾龙场悟道后之核心主张。世人常将知与行分作两事，以为先知后行。然吾以为，真知必能行，不行不足以谓之知。譬如知崖州沉香之珍贵，必亲自嗅闻方能真知；知黎族纺织之精妙，必亲手操作方能真懂。知而不行，只是未知；行而不知，只是盲动。唯有知行合一，方为至理。',
                    mood: '睿智'
                },
                '您与钟芳先生的交往给您带来了什么启发？': {
                    answer: '钟芳先生乃崖州才子，学识渊博，为官清廉。吾二人虽见面不多，然书信论学，受益良多。钟先生出身南疆，却能精通儒学，更将中原文化与崖州本土智慧融合，此种开放包容之精神，令吾深受启发。吾以为，学术之道，在于交流；文化之盛，在于融合。崖州虽远，其文化价值不可小觑。',
                    mood: '欣慰'
                },
                '您对后世读书人有什么建议？': {
                    answer: '吾一生历经坎坷，龙场悟道后方知心学真谛。告慰后世读书人：第一，立志要高远，不以功名为唯一目标；第二，学问要躬行，不可空谈理论；第三，处世要随心，保持良知清明。更望诸位记住：人人皆有良知，圣贤与凡夫之别，唯在觉悟与否。只要肯向内求，人人皆可成圣。',
                    mood: '恳切'
                }
            }
        }
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // 卡片上的对话按钮
        document.querySelectorAll('.figure-dialogue-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const charId = btn.dataset.character;
                this.openDialogue(charId);
            });
        });

        // 关闭弹层
        const closeBtn = document.getElementById('dialogue-overlay-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDialogue());
        }

        const overlay = document.getElementById('dialogue-overlay');
        if (overlay) {
            overlay.querySelector('.dialogue-overlay-backdrop').addEventListener('click', () => this.closeDialogue());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeDialogue();
        });
    },

    openDialogue(charId) {
        this.currentCharacter = charId;
        const data = this.characterData[charId];
        if (!data) return;

        // 更新弹层内容
        const overlay = document.getElementById('dialogue-overlay');
        if (!overlay) return;

        // 显示欢迎语
        this.showWelcome(data);

        // 更新问题按钮
        const questionsContainer = document.getElementById('overlay-dialogue-questions');
        if (questionsContainer && data.questions) {
            questionsContainer.innerHTML = '';
            Object.keys(data.questions).forEach(q => {
                const btn = document.createElement('button');
                btn.className = 'question-btn';
                btn.setAttribute('data-question', q);
                btn.textContent = this.getQuestionLabel(q);
                btn.addEventListener('click', () => {
                    this.askQuestion(q);
                });
                questionsContainer.appendChild(btn);
            });
        }

        // 显示弹层
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeDialogue() {
        const overlay = document.getElementById('dialogue-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.isTyping = false;
    },

    getQuestionLabel(question) {
        const labels = {
            '您在崖州生活的三十年，最大的收获是什么？': '崖州岁月',
            '您改良的纺织工具具体有哪些创新？': '纺织创新',
            '您如何看待黎族人民的智慧？': '黎族智慧',
            '您对后世有什么期望？': '后世寄语',
            '您是如何统一岭南各部落的？': '统一岭南',
            '您为何被称为"岭南圣母"？': '岭南圣母',
            '您对崖州有什么特殊的情感？': '崖州情感',
            '作为女性领袖，您如何面对质疑？': '女性领袖',
            '您被称为"钟崖州"，对这个称呼有什么感触？': '钟崖州',
            '您的科举之路顺利吗？': '科举之路',
            '您与王阳明先生有过交流吗？': '阳明之交',
            '您对崖州学子有什么寄语？': '学子寄语',
            '什么是"心即理"？': '心即理',
            '如何理解"知行合一"？': '知行合一',
            '您与钟芳先生的交往给您带来了什么启发？': '钟芳之交',
            '您对后世读书人有什么建议？': '读书建议'
        };
        return labels[question] || question.substring(0, 6) + '...';
    },

    showWelcome(data) {
        const messagesContainer = document.getElementById('overlay-dialogue-messages');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = `
            <div class="dialogue-welcome">
                <div class="ancient-paper">
                    <p class="welcome-text">${data.welcome}</p>
                    <div class="paper-seal">${data.seal}</div>
                </div>
            </div>
        `;
    },

    askQuestion(question) {
        if (this.isTyping) return;

        const data = this.characterData[this.currentCharacter];
        const qa = data.questions[question];
        if (!qa) return;

        this.isTyping = true;

        const messagesContainer = document.getElementById('overlay-dialogue-messages');

        // 添加用户问题
        const userMsg = document.createElement('div');
        userMsg.className = 'dialogue-message user';
        userMsg.innerHTML = `<div class="message-bubble">${question}</div>`;
        messagesContainer.appendChild(userMsg);

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 添加角色回答（打字机效果）
        setTimeout(() => {
            const charMsg = document.createElement('div');
            charMsg.className = 'dialogue-message character';
            charMsg.innerHTML = `
                <div class="message-avatar">
                    <img src="${data.image}" alt="${data.name}">
                </div>
                <div class="message-bubble typing"></div>
            `;
            messagesContainer.appendChild(charMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const bubble = charMsg.querySelector('.message-bubble');
            this.typeText(bubble, qa.answer, () => {
                this.isTyping = false;
                bubble.classList.remove('typing');
            });
        }, 500);
    },

    typeText(element, text, callback) {
        let i = 0;
        element.textContent = '';

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;

                // 滚动到底部
                const messagesContainer = document.getElementById('overlay-dialogue-messages');
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }

                setTimeout(type, 30 + Math.random() * 20);
            } else if (callback) {
                callback();
            }
        };

        type();
    }
};

// ===== 水墨诗境 =====
const InkPoetry = {
    poems: [
        {
            title: '登崖州城作',
            author: '李德裕',
            char: '登',
            content: '独上高楼望帝京，<br>鸟飞犹是半年程。<br>青山似欲留人住，<br>百匝千遭绕郡城。',
            note: '李德裕被贬崖州时所作，表达了对京城的思念和崖州山水环绕的景象。'
        },
        {
            title: '水南村为黎伯淳题',
            author: '卢多逊',
            char: '水',
            content: '珠崖风景水南村，<br>山下人家林下门。<br>鹦鹉巢时椰结子，<br>鹧鸪啼处竹生孙。',
            note: '卢多逊贬居崖州水南村时所作，描绘了崖州田园风光的祥和景象。'
        },
        {
            title: '崖州',
            author: '杨炎',
            char: '崖',
            content: '一去一万里，<br>千知千不还。<br>崖州何处在，<br>生度鬼门关。',
            note: '杨炎被贬崖州时所作，表达了贬谪之路的遥远与艰辛。'
        },
        {
            title: '鳌山白云',
            author: '王仕熙',
            char: '鳌',
            content: '鳌山高耸接云端，<br>白云缭绕似仙寰。<br>海天一色无边际，<br>唯有清风伴我闲。',
            note: '王仕熙首创崖州八景之一，描绘了鳌山（今大小洞天）的壮丽景色。'
        },
        {
            title: '鲸海西风',
            author: '王仕熙',
            char: '鲸',
            content: '鲸海茫茫接远天，<br>西风吹浪打渔船。<br>渔歌唱晚归来急，<br>满载鱼虾过酒帘。',
            note: '崖州八景之一，描绘了崖州渔港的繁忙景象。'
        },
        {
            title: '绝命诗',
            author: '赵鼎',
            char: '绝',
            content: '身骑箕尾归天上，<br>气作山河壮本朝。<br>莫道崖州天样远，<br>忠魂长绕海南潮。',
            note: '赵鼎绝食殉国前所作，表达了忠贞不屈、以身许国的崇高气节。'
        },
        {
            title: '天香传（节选）',
            author: '丁谓',
            char: '香',
            content: '崖州沉香，<br>天下第一。<br>香气清远，<br>经久不散。',
            note: '丁谓在崖州所著《天香传》，首次系统记载了崖州沉香的品质。'
        },
        {
            title: '咏岩塘陂',
            author: '韦执谊',
            char: '陂',
            content: '岩塘陂水润桑田，<br>亭塘灌溉三千年。<br>韦公洋上稻花香，<br>百姓安居乐丰年。',
            note: '韦执谊主持修筑岩塘陂、亭塘陂后，当地百姓传颂的赞歌。'
        }
    ],

    particleCanvas: null,
    particleCtx: null,
    particles: [],
    animId: null,

    init() {
        this.createOrbs();
        this.initParticles();
        this.bindEvents();
    },

    createOrbs() {
        const container = document.getElementById('ink-orbs');
        if (!container) return;

        container.innerHTML = '';

        this.poems.forEach((poem, index) => {
            const orb = document.createElement('div');
            orb.className = 'ink-orb';
            orb.dataset.index = index;

            orb.innerHTML = `
                <div class="ink-orb-sphere">
                    <span class="ink-orb-text">${poem.char}</span>
                    <span class="ink-orb-subtext">${poem.author}</span>
                </div>
                <div class="ink-orb-info">
                    <div class="ink-orb-title">${poem.title}</div>
                    <div class="ink-orb-author">${poem.author}</div>
                </div>
                <div class="ink-orb-ripple"></div>
            `;

            orb.style.animationDelay = `${index * 0.15}s`;
            orb.style.opacity = '0';
            orb.style.transform = 'translateY(30px)';

            setTimeout(() => {
                orb.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                orb.style.opacity = '1';
                orb.style.transform = 'translateY(0)';
            }, 200 + index * 120);

            container.appendChild(orb);
        });
    },

    initParticles() {
        this.particleCanvas = document.getElementById('ink-particle-canvas');
        if (!this.particleCanvas) return;

        this.particleCtx = this.particleCanvas.getContext('2d');
        this.resizeCanvas();

        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle());
        }

        this.animateParticles();

        window.addEventListener('resize', () => this.resizeCanvas());
    },

    resizeCanvas() {
        const section = this.particleCanvas.closest('.poetry-ink-section');
        if (!section) return;
        this.particleCanvas.width = section.offsetWidth;
        this.particleCanvas.height = section.offsetHeight;
    },

    createParticle() {
        const w = this.particleCanvas?.width || 1200;
        const h = this.particleCanvas?.height || 700;

        return {
            x: Math.random() * w,
            y: Math.random() * h,
            size: 1 + Math.random() * 2.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -0.1 - Math.random() * 0.3,
            opacity: 0.1 + Math.random() * 0.5,
            opacitySpeed: (Math.random() - 0.5) * 0.005,
            color: Math.random() > 0.5 ? '201, 169, 97' : '200, 180, 140'
        };
    },

    animateParticles() {
        const ctx = this.particleCtx;
        if (!ctx) return;

        const w = this.particleCanvas.width;
        const h = this.particleCanvas.height;

        ctx.clearRect(0, 0, w, h);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.opacity += p.opacitySpeed;

            if (p.opacity <= 0.05 || p.opacity >= 0.7) {
                p.opacitySpeed *= -1;
            }

            if (p.y < -10) p.y = h + 10;
            if (p.x < -10) p.x = w + 10;
            if (p.x > w + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            ctx.fill();

            if (p.size > 2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.opacity * 0.1})`;
                ctx.fill();
            }
        });

        this.animId = requestAnimationFrame(() => this.animateParticles());
    },

    bindEvents() {
        const orbsContainer = document.getElementById('ink-orbs');
        if (orbsContainer) {
            orbsContainer.addEventListener('click', (e) => {
                const orb = e.target.closest('.ink-orb');
                if (orb) {
                    const index = parseInt(orb.dataset.index);
                    this.showPoem(index);
                }
            });
        }

        const closeBtn = document.getElementById('ink-poem-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePoem());
        }

        const overlay = document.getElementById('ink-poem-overlay');
        if (overlay) {
            overlay.querySelector('.ink-poem-backdrop').addEventListener('click', () => this.hidePoem());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hidePoem();
        });
    },

    showPoem(index) {
        const poem = this.poems[index];
        if (!poem) return;

        document.getElementById('ink-poem-title').textContent = poem.title;
        document.getElementById('ink-poem-author').textContent = `—— ${poem.author}`;
        document.getElementById('ink-poem-body').innerHTML = poem.content;
        document.getElementById('ink-poem-note').textContent = poem.note;

        const overlay = document.getElementById('ink-poem-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    hidePoem() {
        const overlay = document.getElementById('ink-poem-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    RelationGraph.init();
    DialogueApp.init();
    InkPoetry.init();
});

window.DialogueApp = DialogueApp;

/**
 * 人·人文之脉页面脚本
 */

// ===== 贬官卡片交互 =====
const OfficialCards = {
    cards: null,

    officialData: {
        lideyu: {
            name: '李德裕',
            title: '唐代宰相',
            period: '787-850',
            content: `
                <p>李德裕，字文饶，唐代著名政治家、文学家。历仕宪宗、穆宗、敬宗、文宗、武宗、宣宗六朝，两度为相。</p>
                <p>大中二年(848年)，李德裕被贬为崖州司户参军。在崖州期间，他虽身处边地，却心系国家，积极著书立说，传播中原文化。</p>
                <p>他在崖州写下《登崖州城作》："独上高楼望帝京，鸟飞犹是半年程。青山似欲留人住，百匝千遭绕郡城。"</p>
            `
        },
        huquan: {
            name: '胡铨',
            title: '宋代名臣',
            period: '1102-1180',
            content: `
                <p>胡铨，字邦衡，号澹庵，南宋著名政治家、文学家。因上《上高宗封事》反对与金议和，被贬谪海南。</p>
                <p>绍兴十四年(1144年)，胡铨被贬至吉阳军(今崖州)。在崖州近八年间，他大力振兴当地教育。</p>
                <p>他将自己的住所腾出来办学，"出俸百千"重修学宫，亲自登坛授课，"日以训经传书为事"。</p>
            `
        }
    },

    init() {
        this.cards = document.querySelectorAll('.official-card');
        if (!this.cards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const official = card.dataset.official;
                this.showDetail(official);
            });
        });
    },

    showDetail(official) {
        const data = this.officialData[official];
        if (!data) return;

        const content = `
            <h3>${data.name} <small>(${data.period})</small></h3>
            <p class="modal-subtitle">${data.title}</p>
            ${data.content}
        `;

        Modal.show(content);
    }
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    OfficialCards.init();
});

/**
 * 交互式城门转盘组件 - 中心指针版本
 * 支持拖拽旋转、指针指向检测和信息展示
 */

const GateWheel = {
    // DOM元素
    wheel: null,
    infoPanel: null,
    wheelItems: null,

    // 状态
    isDragging: false,
    currentAngle: 0,
    startAngle: 0,
    lastAngle: 0,

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

    // 当前激活的城门
    activeGate: 'north',

    /**
     * 初始化
     */
    init() {
        this.wheel = document.getElementById('wheel');
        this.infoPanel = document.getElementById('info-panel');
        this.wheelItems = document.querySelectorAll('.wheel-item');

        if (!this.wheel) return;

        this.bindEvents();
        this.updateInfoPanel('north');
        this.highlightActiveGate('north');
    },

    /**
     * 绑定事件
     */
    bindEvents() {
        // 鼠标事件
        this.wheel.addEventListener('mousedown', this.handleStart.bind(this));
        document.addEventListener('mousemove', this.handleMove.bind(this));
        document.addEventListener('mouseup', this.handleEnd.bind(this));

        // 触摸事件
        this.wheel.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleEnd.bind(this));

        // 点击城门项目
        this.wheelItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    const gate = item.dataset.gate;
                    this.rotateToGate(gate);
                }
            });
        });

        // 防止拖拽时选中文本
        this.wheel.addEventListener('selectstart', (e) => e.preventDefault());
    },

    /**
     * 获取事件坐标
     */
    getEventPoint(e) {
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    },

    /**
     * 获取角度
     */
    getAngle(point) {
        const rect = this.wheel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = point.x - centerX;
        const dy = point.y - centerY;

        // 计算角度（顺时针，从顶部开始为0）
        let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        return angle;
    },

    /**
     * 处理开始拖拽
     */
    handleStart(e) {
        if (e.target.closest('.wheel-item')) return; // 点击城门项目时不拖拽

        e.preventDefault();

        this.isDragging = true;
        this.wheel.classList.add('dragging');

        const point = this.getEventPoint(e);
        this.startAngle = this.getAngle(point);
        this.lastAngle = this.currentAngle;
    },

    /**
     * 处理拖拽移动
     */
    handleMove(e) {
        if (!this.isDragging) return;

        e.preventDefault();

        const point = this.getEventPoint(e);
        const angle = this.getAngle(point);

        // 计算旋转角度差
        let deltaAngle = angle - this.startAngle;

        // 处理跨越0度的情况
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;

        // 更新当前角度
        this.currentAngle = this.lastAngle + deltaAngle;

        // 应用旋转
        this.applyRotation();

        // 检测指向的城门
        this.detectActiveGate();
    },

    /**
     * 处理结束拖拽
     */
    handleEnd(e) {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.wheel.classList.remove('dragging');

        // 直接吸附到最近的城门（无惯性）
        this.snapToNearestGate();
    },

    /**
     * 应用旋转
     */
    applyRotation() {
        this.wheel.style.transform = `rotate(${this.currentAngle}deg)`;
        
        // 标记反向旋转，保持正向
        const gateBaseTransforms = {
            south: 'translateX(-50%)',
            east: 'translateY(-50%)',
            north: 'translateX(-50%)',
            west: 'translateY(-50%)'
        };
        
        this.wheelItems.forEach(item => {
            const gate = item.dataset.gate;
            const baseTransform = gateBaseTransforms[gate];
            item.style.transform = `${baseTransform} rotate(${-this.currentAngle}deg)`;
        });
    },

    /**
     * 标准化角度到0-360范围
     */
    normalizeAngle(angle) {
        let normalized = angle % 360;
        if (normalized < 0) normalized += 360;
        return normalized;
    },

    /**
     * 检测当前指针指向的城门
     * 指针固定在中心指向顶部（0度方向）
     * 当城门旋转到顶部时被选中
     */
    detectActiveGate() {
        // 城门角度映射 - 城门在转盘上的固定位置
        const gateAngles = {
            north: 0,    // 北门在顶部
            east: 90,    // 东门在右侧
            south: 180,  // 南门在底部
            west: 270    // 西门在左侧
        };

        // 计算每个城门相对于指针（顶部0度）的距离
        let closestGate = null;
        let minDiff = Infinity;

        Object.entries(gateAngles).forEach(([gate, baseAngle]) => {
            // 计算城门当前实际角度（考虑转盘旋转）
            const actualAngle = this.normalizeAngle(baseAngle + this.currentAngle);
            
            // 计算到0度（顶部/指针位置）的最短距离
            const diff = Math.min(
                Math.abs(actualAngle),
                Math.abs(360 - actualAngle)
            );

            if (diff < minDiff) {
                minDiff = diff;
                closestGate = gate;
            }
        });

        // 当角度差小于阈值时更新
        if (minDiff < 30 && closestGate !== this.activeGate) {
            this.activeGate = closestGate;
            this.highlightActiveGate(closestGate);
            this.updateInfoPanel(closestGate);
        }
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
     * 吸附到最近的城门 - 使用最短路径
     * 停止拖拽后，转盘自动旋转使最近的城门对齐指针（顶部）
     */
    snapToNearestGate() {
        // 城门角度映射 - 城门在转盘上的固定位置
        const gateAngles = {
            north: 0,    // 北门在顶部
            east: 90,    // 东门在右侧
            south: 180,  // 南门在底部
            west: 270    // 西门在左侧
        };

        // 找到距离指针（顶部0度）最近的城门
        let closestGate = null;
        let minDiff = Infinity;
        let shortestRotation = 0;

        Object.entries(gateAngles).forEach(([gate, baseAngle]) => {
            // 计算城门当前相对于指针的角度
            const currentGateAngle = this.normalizeAngle(baseAngle + this.currentAngle);
            
            // 计算需要旋转多少度才能让这个城门到达顶部（0度）
            let rotationNeeded = -currentGateAngle;
            
            // 标准化到 -180 到 180 度范围内，确保最短路径
            if (rotationNeeded > 180) rotationNeeded -= 360;
            if (rotationNeeded < -180) rotationNeeded += 360;
            
            // 计算绝对角度差
            const diff = Math.abs(rotationNeeded);

            if (diff < minDiff) {
                minDiff = diff;
                closestGate = gate;
                shortestRotation = rotationNeeded;
            }
        });

        // 计算目标角度（使用最短路径）
        const targetAngle = this.currentAngle + shortestRotation;

        // 使用CSS过渡动画吸附到指针位置
        this.wheel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.currentAngle = targetAngle;
        this.applyRotation();

        // 动画结束后移除过渡并更新状态
        setTimeout(() => {
            this.wheel.style.transition = '';
            if (closestGate) {
                this.activeGate = closestGate;
                this.highlightActiveGate(closestGate);
                this.updateInfoPanel(closestGate);
            }
        }, 500);
    },

    /**
     * 旋转到指定城门 - 使用最短路径
     */
    rotateToGate(gate) {
        // 城门角度映射 - 城门在转盘上的固定位置
        const gateAngles = {
            north: 0,    // 北门在顶部
            east: 90,    // 东门在右侧
            south: 180,  // 南门在底部
            west: 270    // 西门在左侧
        };

        const targetBaseAngle = gateAngles[gate];
        
        // 计算城门当前相对于指针的角度
        const currentGateAngle = this.normalizeAngle(targetBaseAngle + this.currentAngle);
        
        // 计算需要旋转多少度才能让这个城门到达顶部（0度）
        let rotationNeeded = -currentGateAngle;
        
        // 标准化到 -180 到 180 度范围内，确保最短路径
        if (rotationNeeded > 180) rotationNeeded -= 360;
        if (rotationNeeded < -180) rotationNeeded += 360;
        
        // 计算目标角度
        const targetAngle = this.currentAngle + rotationNeeded;

        // 应用旋转动画
        this.wheel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        this.currentAngle = targetAngle;
        this.applyRotation();

        setTimeout(() => {
            this.wheel.style.transition = '';
            this.activeGate = gate;
            this.highlightActiveGate(gate);
            this.updateInfoPanel(gate);
        }, 500);
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

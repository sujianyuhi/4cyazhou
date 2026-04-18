# 圆形转盘组件 - AI提示词

## 提示词

请帮我创建一个圆形转盘组件，要求如下：

### 1. 视觉效果
- 一个圆形转盘，中间有中心图片区域
- 转盘周围均匀分布6个可点击的项目节点
- 节点带有图标和文字标签
- 转盘整体缓慢旋转，但节点和中心图片保持正向（不跟随旋转）

### 2. 交互功能
- 点击节点时，高亮显示该节点
- 点击后右侧或下方显示对应项目的详细信息
- 切换内容时有淡入淡出动画效果

### 3. 技术实现
- 使用纯HTML/CSS/JavaScript实现
- 使用CSS动画实现转盘旋转
- 使用反向旋转(counter-rotate)保持节点正向
- 响应式设计，适配移动端

### 4. 样式要求
- 转盘有圆角阴影效果
- 节点有悬停放大效果
- 整体风格清新自然，可用渐变色背景

请提供完整的HTML、CSS和JavaScript代码。

---

## 参考代码

### HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>圆形转盘组件</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- 转盘区域 -->
        <div class="solar-terms">
            <div class="term-circle" id="termCircle">
                <div class="center-image" id="term-image"></div>
            </div>
        </div>
        
        <!-- 内容显示区域 -->
        <div class="content" id="termContent">
            <h2>请点击左侧项目查看详情</h2>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

---

### CSS 样式 (style.css)

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: "Microsoft YaHei", sans-serif;
    background: #f8fff0;
    min-height: 100vh;
    color: #333;
}

.container {
    display: flex;
    padding: 30px 5%;
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
}

/* 转盘容器 */
.solar-terms {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

/* 圆形转盘 */
.term-circle {
    position: relative;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    background-image: url('your-background.jpg');
    background-size: cover;
    background-position: center;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    /* 转盘旋转动画 */
    animation: rotate 60s linear infinite;
    transform-style: preserve-3d;
    perspective: 1000px;
}

/* 虚线装饰圈 */
.term-circle::before {
    content: '';
    position: absolute;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    border: 2px dashed rgba(76, 175, 80, 0.5);
}

/* 中心图片 */
.center-image {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.3);
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
    /* 反向旋转保持正向 */
    animation: counter-rotate 60s linear infinite;
}

/* 转盘项目节点 */
.term-item {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    background-size: cover;
    background-position: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    width: 80px;
    height: 80px;
    justify-content: center;
    /* 反向旋转保持正向 */
    animation: counter-rotate 60s linear infinite;
}

.term-item:hover,
.term-item.active {
    background: rgba(76, 175, 80, 0.2);
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.term-item .icon {
    font-size: 1.8em;
    margin-bottom: 4px;
}

.term-item .name {
    font-size: 0.9em;
    font-weight: bold;
    color: #333;
}

/* 旋转动画 */
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 反向旋转动画 - 保持内容正向 */
@keyframes counter-rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
}

/* 内容区域 */
.content {
    flex: 1;
    background: rgba(255, 255, 255, 0.8);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.content h2 {
    font-size: 2.2em;
    margin-bottom: 20px;
    color: #2e7d32;
}

.content p {
    font-size: 1.1em;
    line-height: 1.8;
    margin-bottom: 15px;
    color: #444;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .container {
        flex-direction: column;
        align-items: center;
    }
    
    .term-circle {
        width: 400px;
        height: 400px;
    }
    
    .center-image {
        width: 250px;
        height: 250px;
    }
}

@media (max-width: 768px) {
    .term-circle {
        width: 300px;
        height: 300px;
    }
    
    .center-image {
        width: 180px;
        height: 180px;
    }
    
    .term-item {
        width: 60px;
        height: 60px;
    }
    
    .term-item .icon {
        font-size: 1.4em;
    }
    
    .term-item .name {
        font-size: 0.8em;
    }
}
```

---

### JavaScript 逻辑 (script.js)

```javascript
// 项目数据
const items = [
    { name: '项目1', icon: '🌱', content: '项目1的详细内容...', image: 'image1.jpg' },
    { name: '项目2', icon: '🌧️', content: '项目2的详细内容...', image: 'image2.jpg' },
    { name: '项目3', icon: '⚡', content: '项目3的详细内容...', image: 'image3.jpg' },
    { name: '项目4', icon: '☀️', content: '项目4的详细内容...', image: 'image4.jpg' },
    { name: '项目5', icon: '🌿', content: '项目5的详细内容...', image: 'image5.jpg' },
    { name: '项目6', icon: '🌾', content: '项目6的详细内容...', image: 'image6.jpg' }
];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    createItems();
});

// 创建转盘项目
function createItems() {
    const circle = document.getElementById('termCircle');
    const radius = 200; // 项目分布的半径
    const totalItems = items.length;

    items.forEach((item, index) => {
        // 计算角度 - 从顶部开始，均匀分布
        const angle = (2 * Math.PI * index) / totalItems - Math.PI / 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        // 创建项目元素
        const itemElement = document.createElement('div');
        itemElement.className = 'term-item';
        itemElement.setAttribute('data-index', index);
        itemElement.innerHTML = `
            <div class="icon">${item.icon}</div>
            <div class="name">${item.name}</div>
        `;

        // 定位项目 - 使用百分比定位
        itemElement.style.left = `${50 + (x / radius) * 50}%`;
        itemElement.style.top = `${50 + (y / radius) * 50}%`;
        itemElement.style.transform = `translate(-50%, -50%)`;

        // 延迟出现动画
        itemElement.style.opacity = '0';
        itemElement.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
        setTimeout(() => {
            itemElement.style.opacity = '1';
        }, 100 * index);

        // 点击事件
        itemElement.addEventListener('click', () => {
            // 移除其他项目的active状态
            document.querySelectorAll('.term-item').forEach(el => {
                el.classList.remove('active');
            });
            itemElement.classList.add('active');
            
            // 显示内容
            showItemContent(item);
        });

        circle.appendChild(itemElement);
    });
}

// 显示项目内容
function showItemContent(item) {
    const content = document.getElementById('termContent');
    const centerImage = document.getElementById('term-image');

    // 淡出效果
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    // 更新中心图片
    centerImage.style.backgroundImage = `url('images/${item.image}')`;

    setTimeout(() => {
        // 更新内容
        content.innerHTML = `
            <h2>${item.icon} ${item.name}</h2>
            <p>${item.content}</p>
        `;

        // 淡入效果
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 300);
}
```

---

## 核心原理说明

| 技术点 | 说明 |
|--------|------|
| **转盘旋转** | 使用 `animation: rotate 60s linear infinite` 让转盘持续旋转 |
| **节点正向** | 使用 `animation: counter-rotate` 反向旋转，使节点内容保持正向 |
| **均匀分布** | 使用三角函数 `Math.cos()` / `Math.sin()` 计算节点位置 |
| **点击交互** | 通过 `data-index` 关联数据，点击时更新右侧内容 |
| **动画过渡** | 使用 `transition` 实现淡入淡出和缩放效果 |

---

## 使用说明

1. 将HTML代码保存为 `index.html`
2. 将CSS代码保存为 `style.css`
3. 将JavaScript代码保存为 `script.js`
4. 准备项目图片放在 `images/` 目录下
5. 用浏览器打开 `index.html` 即可查看效果

---

*参考来源：稼穑天工 - 节气农学的数字密码项目*

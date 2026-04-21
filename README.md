# 崖城风骨 —— 崖州古城建筑文化数字图鉴

<p align="center">
  <img src="images/content/Introduction.png" alt="崖城风骨" width="200">
</p>

<p align="center">
  <a href="https://github.com/sujianyuhi/4cyazhou"><img src="https://img.shields.io/github/license/sujianyuhi/4cyazhou" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
</p>

<p align="center">
  <b>全国大学生计算机设计大赛参赛作品（信息可视化·交互信息设计赛道）</b>
</p>

---

## 📖 项目简介

**崖城风骨** 是一款以海南崖州古城建筑文化为主题的数字图鉴 Web 应用。作品采用「从物到魂」四层叙事结构，通过现代化的交互设计，展现崖州古城的历史文化、建筑特色、人文精神和科技智慧。

🌐 **在线访问**: [https://sujianyu.cn](https://sujianyu.cn)

### ✨ 核心特色

- 🏛️ **四层叙事结构**: 形制 → 营造 → 人文 → 精神
- 🤖 **AI 智能助手**: 集成 DeepSeek API，提供智能问答服务
- 🎨 **纯原生实现**: 零第三方依赖，HTML5 + CSS3 + JavaScript (ES6+)
- 📱 **响应式设计**: 支持桌面端和移动端访问
- 🎭 **丰富交互**: 转盘、时间轴、粒子效果等交互组件

---

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 本地运行

```bash
# 克隆项目
git clone https://github.com/sujianyuhi/4cyazhou.git
cd 4cyazhou

# 安装依赖（可选，项目无第三方依赖）
npm install

# 启动服务器
npm start
# 或
node api-server.js
```

访问 http://localhost:8080 查看应用

### Docker 部署

```bash
# 构建镜像
docker build -t yazhou-guocai .

# 运行容器
docker run -p 6677:8080 -e DEEPSEEK_API_KEY=your_key yazhou-guocai
```

### Docker Compose 部署

```bash
# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置 DEEPSEEK_API_KEY

# 启动服务
docker-compose up -d
```

---

## 📁 项目结构

```
4cyazhou/
├── 📄 index.html              # 首页入口
├── 📄 api-server.js           # Node.js API 服务器
├── 📄 server.js               # 静态文件服务器
├── 📄 package.json            # 项目配置
├── 📄 Dockerfile              # Docker 配置
├── 📄 docker-compose.yml      # Docker Compose 配置
│
├── 📁 css/                    # 样式文件
│   ├── global.css             # 全局样式
│   ├── index.css              # 首页样式
│   ├── pages.css              # 页面通用样式
│   └── ...
│
├── 📁 js/                     # JavaScript 文件
│   ├── global.js              # 全局功能（导航、弹窗、AI助手等）
│   ├── index.js               # 首页逻辑
│   ├── wheel.js               # 城门转盘组件
│   ├── officials-wheel.js     # 官员转盘组件
│   └── ...
│
├── 📁 pages/                  # 子页面
│   ├── page-intro.html        # 古城概况
│   ├── page-shape.html        # 古城形制
│   ├── page-technology.html   # 营造技艺
│   ├── page-people.html       # 历史人文
│   └── page-spirit.html       # 崖城风骨
│
├── 📁 images/                 # 图片资源
│   ├── bg/                    # 背景图片
│   ├── content/               # 内容图片
│   ├── humanity/              # 人文图片
│   └── technology/            # 技术图片
│
├── 📁 components/             # 可复用组件
├── 📁 bkmusic/                # 背景音乐
└── 📄 开源代码与组件使用说明.md  # 开源说明文档
```

---

## 🎯 功能模块

### 1️⃣ 古城形制
展示崖州古城的整体布局、城门结构、城墙体系等空间形态特征。

### 2️⃣ 营造技艺
介绍古城建筑的营造工艺，包括材料、结构、装饰等技术细节。

### 3️⃣ 历史人文
呈现与古城相关的历史人物、事件和文化传承。

### 4️⃣ 崖城风骨
提炼古城所承载的精神内涵和文化价值。

### 🤖 AI 智能助手
- 基于 DeepSeek API 的智能对话
- 支持历史、文化、建筑等多领域问答
- 可拖拽的悬浮对话窗口

---

## 🛠️ 技术栈

### 前端
| 技术 | 说明 |
|------|------|
| HTML5 | 语义化标签，无障碍支持 |
| CSS3 | CSS Variables、Flexbox、Grid、Animations |
| JavaScript (ES6+) | 原生 API，模块化开发 |
| SVG | 矢量图标和图形 |

### 后端
| 技术 | 说明 |
|------|------|
| Node.js | 运行时环境 |
| 原生 http 模块 | HTTP 服务器 |
| DeepSeek API | AI 对话服务 |

### 部署
- Docker / Docker Compose
- 1Panel 面板
- Nginx 反向代理

---

## 🔧 配置说明

### 环境变量

创建 `.env` 文件：

```env
# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-your-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# 服务器端口
PORT=8080
```

获取 DeepSeek API Key: [https://platform.deepseek.com](https://platform.deepseek.com)

---

## 📚 文档

- [开源代码与组件使用说明](./开源代码与组件使用说明.md) - 详细的技术栈和开源资源说明
- [1Panel 部署指南](./1panel-deploy.md) - 使用 1Panel 面板的部署教程

---

## 🤝 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

### 使用的开源资源

| 资源 | 许可证 |
|------|--------|
| Google Fonts (Noto 字体) | SIL Open Font License 1.1 |
| Node.js | MIT License |
| Docker | Apache License 2.0 |

---

## 🙏 致谢

- 全国大学生计算机设计大赛
- DeepSeek AI 提供的大模型支持
- 崖州古城文化遗产保护中心

---

## 📧 联系我们

如有问题或建议，欢迎提交 [Issue](https://github.com/sujianyuhi/4cyazhou/issues) 或 [Pull Request](https://github.com/sujianyuhi/4cyazhou/pulls)。

---

<p align="center">
  <b>崖城风骨 · 传承千年文化</b>
</p>

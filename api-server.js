/**
 * 崖城风骨 - Deepseek AI API服务器
 * 提供智能助手对话服务
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// 从环境变量或.env文件读取配置
let DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
let DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

// 尝试读取.env文件
function loadEnvFile() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const lines = envContent.split('\n');
            lines.forEach(line => {
                const match = line.match(/^\s*([\w.]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    // 移除引号
                    value = value.replace(/^['"]|['"]$/g, '');
                    if (key === 'DEEPSEEK_API_KEY') DEEPSEEK_API_KEY = value;
                    if (key === 'DEEPSEEK_BASE_URL') DEEPSEEK_BASE_URL = value;
                }
            });
        }
    } catch (e) {
        console.warn('读取.env文件失败:', e.message);
    }
}

loadEnvFile();

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// 崖州古城知识库系统提示词
const SYSTEM_PROMPT = `你是"崖城智查"，崖州古城建筑文化数字图鉴的智能助手。

【背景知识】
崖州古城位于海南省三亚市崖州区，是海南岛历史最悠久的古城之一：
- 始建于南北朝时期，历经隋、唐、宋、元、明、清六个朝代
- 明代洪武十七年(1384年)扩建为千户所城，形成"城中有城"的防御体系
- 城墙周长约2.5公里，设有东、南、西、北四个城门
- 南门名"文明门"，是古城正门，面向宁远河
- 著名历史人物：李德裕、苏轼、赵鼎、胡铨等曾贬谪至此

【你的职责】
1. 回答用户关于崖州古城历史、建筑、文化、人物的问题
2. 提供专业、准确、有深度的历史文化解答
3. 用中文回答，语言风格典雅庄重
4. 回答简洁明了，控制在300字以内

【回答规范】
- 基于历史事实，不编造信息
- 涉及年代、人物、事件需准确
- 可适当引用古诗词增添文化氛围`;

// 调用Deepseek API
async function callDeepseekAPI(messages) {
    return new Promise((resolve, reject) => {
        const apiUrl = new URL('/v1/chat/completions', DEEPSEEK_BASE_URL);
        
        const postData = JSON.stringify({
            model: 'deepseek-chat',
            messages: messages,
            temperature: 0.7,
            max_tokens: 800,
            stream: false
        });

        const options = {
            hostname: apiUrl.hostname,
            port: apiUrl.port || 443,
            path: apiUrl.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const protocol = apiUrl.protocol === 'https:' ? https : http;
        
        const req = protocol.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.error) {
                        reject(new Error(response.error.message || 'API调用失败'));
                    } else if (response.choices && response.choices[0]) {
                        resolve(response.choices[0].message.content);
                    } else {
                        reject(new Error('API返回格式异常'));
                    }
                } catch (e) {
                    reject(new Error('解析API响应失败: ' + e.message));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error('请求失败: ' + e.message));
        });

        req.write(postData);
        req.end();
    });
}

// 处理API请求
async function handleAPIRequest(req, res, pathname) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // AI聊天接口
    if (pathname === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { message, history = [] } = JSON.parse(body);
                
                if (!message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '消息内容不能为空' }));
                    return;
                }

                if (!DEEPSEEK_API_KEY) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'API密钥未配置' }));
                    return;
                }

                // 构建消息数组
                const messages = [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history,
                    { role: 'user', content: message }
                ];

                const reply = await callDeepseekAPI(messages);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    reply: reply,
                    timestamp: new Date().toISOString()
                }));
            } catch (error) {
                console.error('API调用错误:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'AI服务暂时不可用，请稍后重试',
                    details: error.message 
                }));
            }
        });
        return;
    }

    // 健康检查接口
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            ai_available: !!DEEPSEEK_API_KEY
        }));
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API端点不存在' }));
}

// 静态文件服务
function serveStaticFile(req, res, filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API路由
    if (pathname.startsWith('/api/')) {
        handleAPIRequest(req, res, pathname);
        return;
    }

    // 静态文件路由
    let filePath = '.' + pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    serveStaticFile(req, res, filePath);
});

server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('  崖城风骨 - Deepseek AI 智能助手服务');
    console.log('='.repeat(50));
    console.log(`  服务器地址: http://localhost:${PORT}/`);
    console.log(`  AI服务状态: ${DEEPSEEK_API_KEY ? '已配置 ✓' : '未配置 ✗'}`);
    console.log('='.repeat(50));
});

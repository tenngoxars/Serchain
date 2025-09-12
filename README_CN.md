<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="200"/>
</p>

<h1 align="center">Serchain</h1>
<h3 align="center">🔍 现代化以太坊转账浏览器</h3>

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=for-the-badge" alt="License"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.10%2B-blue?style=for-the-badge" alt="Python"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-18.x-green?style=for-the-badge" alt="Node.js"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge" alt="Vercel"></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/flask-3.x-lightgrey?style=for-the-badge" alt="Flask"></a>
</p>

<p align="center">
  <strong>简体中文</strong> | <a href="README.md">English</a>
</p>

---

**Serchain** 是一个现代化的开源以太坊转账浏览器，提供网页和命令行两种界面来跟踪链上转账。基于 Flask 和 Tailwind CSS 构建，提供简洁的响应式界面，实时获取以太坊主网数据。

## ✨ 核心功能

- 🔍 **实时转账跟踪** - 查询任意以太坊地址查看转账记录，支持无限分页加载
- 📊 **全面数据展示** - 查看交易时间、方向、地址、金额、资产类型和手续费
- 📥 **智能 CSV 导出** - 下载筛选后的转账数据（全部/转入/转出）用于本地分析
- 🔄 **增量加载** - 按需加载更多数据，无需重新获取已有记录
- 🏷️ **智能筛选** - 按方向筛选转账记录（全部/转入/转出），带动画效果
- 📋 **一键复制** - 点击地址即可复制，带视觉反馈
- 💾 **智能缓存** - 5分钟本地缓存，减少API调用，提升性能
- 📚 **查询历史** - 记录最近搜索，支持快速重新查询
- 🌐 **双重界面** - 现代化网页界面和强大的命令行工具
- 🎨 **现代设计** - 玻璃拟态UI，深色主题，响应式布局，流畅动画
- 🌍 **多语言支持** - 支持中文和英文界面，无缝语言切换
- 📱 **移动端友好** - 完全响应式设计，适配所有设备
- 🔒 **无需认证** - 无需连接钱包或用户登录
- ⚡ **快速可靠** - 基于 Alchemy API 提供准确、实时的数据
- 🛠️ **开发者友好** - 提供 REST API 接口便于集成
- 🎯 **生产就绪** - 针对Vercel部署和自定义域名优化

## 🚀 快速开始

### 环境要求

- **Python** 3.12 或更高版本
- **Node.js** 18.x 或更高版本
- **Alchemy API 密钥** (在 [alchemy.com](https://www.alchemy.com/) 获取)

### 1. 克隆并安装

```bash
# 克隆仓库
git clone https://github.com/tenngoxars/serchain.git
cd serchain

# 安装 Python 依赖
pip install -r requirements.txt

# 安装 Node.js 依赖
cd webapp
npm install
```

### 2. 配置环境

在项目根目录创建 `.env` 文件：

```env
ALCHEMY_API_KEY=你的API密钥
```

> ⚠️ **重要**：请勿将 `.env` 文件提交到版本控制。

### 3. 构建并运行

```bash
# 构建 Tailwind CSS
npm run build:css

# 运行网页应用
python webapp/app.py
```

在浏览器中访问 `http://127.0.0.1:8080`！

## 🌐 在线演示

**在线体验 Serchain**: [serchain.xyz](https://serchain.xyz)

无需安装，直接输入以太坊地址即可开始探索！

## 📁 项目结构

```
Serchain/
├── webapp/                    # 网页应用
│   ├── templates/
│   │   └── index.html         # 主 HTML 模板
│   ├── static/                # 静态资源
│   │   ├── css/
│   │   │   ├── main.css       # Tailwind 源文件
│   │   │   └── output.css     # 编译后的 CSS
│   │   └── js/                # JavaScript 模块
│   │       ├── app.js         # 主应用逻辑
│   │       ├── api.js         # API 通信
│   │       ├── history.js     # 查询历史
│   │       └── i18n.js        # 国际化
│   ├── app.py                 # Flask 后端
│   └── package.json           # Node.js 依赖
├── data/                      # CSV 导出目录
├── serchain.py                # CLI 应用
├── requirements.txt           # Python 依赖
├── Procfile                   # Railway 部署配置
└── .env                       # 环境变量
```

## 🖥️ 使用方法

### 网页界面

1. **启动应用**（如果尚未运行）：
   ```bash
   python webapp/app.py
   ```

2. **打开浏览器** 访问 `http://127.0.0.1:8080`

3. **输入以太坊地址** 在输入框中（必须以 `0x` 开头，长度为 42 个字符）

4. **查看结果** 在美观的表格界面中，包含：
   - 交易方向（转入/转出）带视觉指示器
   - 时间戳格式化显示
   - 发送方/接收方地址支持一键复制
   - 金额和资产类型
   - 手续费
   - 带动画效果的表格行

5. **筛选数据** 使用智能筛选标签（全部/转入/转出）

6. **加载更多** 点击"查询更多"按钮获取额外记录

7. **导出数据** 点击下载按钮获取筛选后的 CSV 文件

8. **复制地址** 点击表格中的任意地址即可复制

9. **查看历史** 在侧边栏查看最近的查询记录

### 命令行界面

面向开发者和自动化使用：

```bash
python serchain.py
```

CLI 会提示输入以太坊地址，在终端显示结果，并自动保存到 `data/` 目录的 CSV 文件中。

### API 接口

用于与其他应用集成：

- **POST** `/api/query` - 查询地址的转账记录
  ```json
  {
    "address": "0x1234..."
  }
  ```

- **GET** `/download?address=0x1234...` - 下载地址的 CSV 文件
- **POST** `/api/load_more` - 为地址加载更多转账记录
  ```json
  {
    "address": "0x1234...",
    "pageKey": "cursor_string"
  }
  ```

## 🆕 最新功能

### 智能筛选与导出
- **按方向筛选**: 查看全部转账、仅转入或仅转出记录
- **智能 CSV 导出**: 只下载当前筛选的数据，而非全部记录
- **流畅动画**: 切换筛选标签时的优美过渡效果

### 增强用户体验
- **一键复制**: 点击任意地址即可复制到剪贴板，带视觉反馈
- **查询历史**: 记录最近5次搜索，支持快速重新查询
- **增量加载**: 加载更多数据而无需重新获取已有记录
- **智能缓存**: 5分钟本地缓存减少API调用，提升性能

### 生产就绪
- **Vercel 部署**: 针对Vercel优化，支持自定义域名
- **SEO 优化**: 完整的meta标签、favicon和社交媒体预览
- **移动端响应**: 在所有设备尺寸上都有完美体验
- **性能优化**: 遵循最佳实践的清洁代码

## 📊 示例输出

### CLI 示例

```bash
python serchain.py
```

**示例输出：**
```
=== Serchain: 链上 ETH 转账跟踪器 ===
输入以太坊地址 (0x...): 0x1234567890abcdef1234567890abcdef12345678

🔍 正在获取转账记录: 0x1234567890abcdef1234567890abcdef12345678 ...

📦 找到 2 条转账记录:

#1 📤 转出
  🕒 时间:   2025-01-15T14:30:00.000Z
  💸 发送方: 0x1234567890abcdef1234567890abcdef12345678
  📥 接收方: 0xabcdefabcdefabcdefabcdefabcdefabcdef
  💰 金额:   1.23 ETH
  🔗 交易哈希: 0xabc123...
  ⛽ 手续费: 0.001 ETH

#2 📥 转入
  🕒 时间:   2025-01-15T15:45:00.000Z
  💸 发送方: 0xabcdefabcdefabcdefabcdefabcdefabcdef
  📥 接收方: 0x1234567890abcdef1234567890abcdef12345678
  💰 金额:   0.45 ETH
  🔗 交易哈希: 0xdef456...
  ⛽ 手续费: 0.0005 ETH

✅ 已保存到: data/transfers_123456_20250115_154500.csv
```

### 网页界面

网页界面以美观、可排序的表格形式显示相同数据，包含：
- 实时搜索和过滤
- 移动设备响应式设计
- 深色主题现代样式和交互动画
- 一键 CSV 导出
- 查询历史跟踪
- 动态背景效果和流畅过渡
- 语言切换和偏好保存

## 🚀 部署

### Railway（推荐）

1. **连接仓库** 到 Railway
2. **设置环境变量**：
   - `ALCHEMY_API_KEY`: 你的 Alchemy API 密钥
3. **配置构建设置**：
   - **构建命令**：
     ```bash
     pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css
     ```
   - **启动命令**：
     ```bash
     gunicorn -w 2 -k gthread -b 0.0.0.0:$PORT webapp.app:app
     ```
4. **部署** 并监控日志

### 其他平台

应用可部署在任何支持 Python 和 Node.js 的平台上：

- **Heroku**: 使用包含的 `Procfile`
- **Docker**: 创建多阶段构建的 Dockerfile
- **VPS**: 使用 nginx + gunicorn 直接部署

## 🔧 故障排查

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| **网页应用无法启动** | 检查 Python/Node.js 版本，确保所有依赖已正确安装 |
| **CSS 样式缺失** | 在 `webapp` 目录运行 `npm run build:css` |
| **API 错误** | 验证 Alchemy API 密钥是否正确且有足够配额 |
| **无数据返回** | 检查地址是否有效且有最近交易 |
| **CSV 下载失败** | 确保 `data/` 目录存在且可写 |

### 开发

开发时使用实时 CSS 更新：

```bash
cd webapp
npm run watch:css
```

这将监听 `main.css` 的变化并自动重新构建 `output.css`。

## 🤝 贡献

我们欢迎贡献！以下是参与方式：

1. **Fork 仓库**
2. **创建功能分支**：`git checkout -b feature/amazing-feature`
3. **提交更改**：`git commit -m '添加新功能'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **创建 Pull Request**

### 开发环境

```bash
# 安装开发依赖
pip install -r requirements.txt
cd webapp && npm install

# 开发模式运行
npm run watch:css  # 终端 1
python webapp/app.py  # 终端 2
```

## 📄 许可证

本项目采用 Apache-2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Alchemy](https://www.alchemy.com/) 提供可靠的以太坊 API 访问
- [Tailwind CSS](https://tailwindcss.com/) 提供美观的样式框架
- [Flask](https://flask.palletsprojects.com/) 提供轻量级 Web 框架

---

<div align="center">
  <p>由 <a href="https://github.com/tenngoxars">LemonBrandy</a> 用 ❤️ 制作</p>
  <p>⭐ 如果这个项目对你有帮助，请给它一个星标！</p>
</div>
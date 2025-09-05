<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  English | <a href="README_CN.md">简体中文</a>
</p>
<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=for-the-badge" alt="License"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.10%2B-blue?style=for-the-badge" alt="Python"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-18.x-green?style=for-the-badge" alt="Node.js"></a>
  <a href="https://railway.app/"><img src="https://img.shields.io/badge/deploy-railway-purple?style=for-the-badge" alt="Railway"></a>
</p>

Serchain 是一个开源且用户友好的以太坊链上转账浏览器。它支持快速的网页查询和主网的 CSV 导出。

## 功能特点

- 通过输入任意以太坊地址跟踪最近的链上转账
- 查看交易时间、方向、对方地址、金额、资产类型及手续费
- 一键下载 CSV，方便本地分析和归档
- 支持多语言（英文 / 中文）
- 提供响应式布局和移动端友好界面
- 无需连接钱包或登录
- 使用 Tailwind CSS 实现现代化样式

复制 .env.example 到 .env 并填写你的凭证。

## 项目结构

```
Serchain/
├── webapp/            # Flask 后端 + HTML 前端
│   ├── templates/
│   │   └── index.html
│   ├── static/        # Tailwind CSS 样式/脚本
│   │   └── css/
│   │       └── output.css  # Tailwind 构建输出
│   ├── app.py         # 后端服务逻辑
│   └── package.json   # 前端依赖
│
├── serchain.py        # 核心查询逻辑（支持 CLI）
├── requirements.txt   # Python 依赖
├── Procfile           # Railway 部署配置
├── README.md
└── .env               # 本地环境变量，包括 ALCHEMY_URL
```


## 本地运行指南

1. 克隆此仓库

```bash
git clone https://github.com/tenngoxars/serchain.git
cd serchain
```

2. 安装 Python 依赖

```bash
pip install -r requirements.txt
```

3. 安装 Node.js 依赖（用于 Tailwind CSS）

```bash
cd webapp
npm install
```

4. 配置 `.env` 文件（注册 [Alchemy](https://www.alchemy.com/) 获取 API 密钥）

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

> 请勿将 .env 提交到版本控制。

5. 构建 Tailwind CSS

```bash
npm run build:css
```

6. 运行网页版本

```bash
python app.py
```

7. 在浏览器打开

访问 `http://127.0.0.1:8080`

## 可选：命令行运行

```bash
python serchain.py
```

按照提示输入地址。转账信息会打印并自动保存为 CSV 文件。

## 推荐版本

- **Python**: 3.10 或更高
- **Node.js**: 18.x

请使用这些版本以避免兼容性问题。

## CLI 示例

运行以下命令使用 CLI：

```bash
python serchain.py
```

示例输入和输出：

| #  | 时间                 | 方向     | 发送方地址                                | 接收方地址                              | 数额  | 资产  | 手续费 (ETH) |
|----|----------------------|----------|-----------------------------------------|-----------------------------------------|-------|-------|--------------|
| 1  | 2025-09-01 12:00:00  | 转出     | 0x1234567890abcdef1234567890abcdef12345678 | 0xabcdefabcdefabcdefabcdefabcdefabcdef | 1.23  | ETH   | 0.001        |
| 2  | 2025-09-01 13:00:00  | 转入     | 0xabcdefabcdefabcdefabcdefabcdefabcdef  | 0x1234567890abcdef1234567890abcdef12345678 | 0.45  | ETH   | 0.0005       |

结果已保存到 transfers.csv

## 部署 (Railway)

1. 在 Railway 设置环境变量：
   - `ALCHEMY_URL`: 你的 Alchemy API 密钥

2. 配置构建和启动命令：

- **构建命令（推荐）**：
  ```bash
  pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css
  ```
- **构建命令（备用）**：
  ```bash
  pip install -r requirements.txt && cd webapp && npm install && npm run build:css
  ```

- **启动命令**：
  ```bash
  gunicorn -b 0.0.0.0:$PORT webapp.app:app
  ```

3. 部署并监控日志以排查问题。

## 故障排查

- **问题：** Web 应用无法启动或启动后崩溃  
  **解决方案：** 确认所有依赖已正确安装，环境变量（特别是 `ALCHEMY_URL`）配置正确。

- **问题：** CSS 样式不显示或布局错乱  
  **解决方案：** 确保在 `webapp` 目录运行了 `npm run build:css`，且静态文件已正确提供。

## 贡献

欢迎提交 PR 和反馈问题！

## 许可证
Apache-2.0 许可证 © 2025 [LemonBrandy](https://github.com/tenngoxars)
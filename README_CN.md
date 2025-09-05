<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md">简体中文</a>
</p>

Serchain 是一个开源项目，专注于用户友好设计、简洁视觉和便捷部署。它允许快速查询任何以太坊地址的链上转账历史。目前支持 ETH 主网，提供基于网页的查询和 CSV 导出功能。

## 功能

- 🌐 多语言支持（英文 / 中文）
- 通过输入任意以太坊地址跟踪近期链上转账
- 查看交易时间、方向、对方地址、金额、资产类型及手续费
- 一键下载 CSV，便于本地分析和存档
- 响应式布局，移动端友好
- 无需钱包连接或用户登录
- 使用 Tailwind CSS 实现现代化样式

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

## 本地快速开始

1. 克隆本仓库

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

4. 配置 `.env` 文件（在 [Alchemy](https://www.alchemy.com/) 注册获取 API 密钥）

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

5. 构建 Tailwind CSS

```bash
npm run build:css
```

6. 运行网页版本

```bash
python app.py
```

7. 浏览器打开

访问 `http://127.0.0.1:8080`

## 可选：通过 CLI 运行

```bash
python serchain.py
```

根据提示输入地址。转账记录将打印并自动保存为 CSV 文件。

## 推荐版本

- **Python**：3.10 或更高
- **Node.js**：18.x

请确保使用这些版本以避免兼容性问题。

## CLI 示例

运行以下命令使用 CLI：

```bash
python serchain.py
```

输入输出示例：

| #  | 时间                 | 方向     | 发送方地址                               | 接收方地址                             | 数额  | 资产 | 手续费 (ETH)  |
|----|----------------------|----------|-----------------------------------------|-----------------------------------------|-------|-------|---------------|
| 1  | 2025-09-01 12:00:00  | 支出     | 0x1234567890abcdef1234567890abcdef12345678 | 0xabcdefabcdefabcdefabcdefabcdefabcdef | 1.23  | ETH   | 0.001         |
| 2  | 2025-09-01 13:00:00  | 收入     | 0xabcdefabcdefabcdefabcdefabcdefabcdef  | 0x1234567890abcdef1234567890abcdef12345678 | 0.45  | ETH   | 0.0005        |

结果保存至 transfers.csv

## 部署（Railway）

1. 在 Railway 设置环境变量：
   - `ALCHEMY_URL`：你的 Alchemy API 密钥

2. 配置构建和启动命令：

- **构建命令（推荐）**：
  ```bash
  pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css
  ```
- **构建命令（备选）**：
  ```bash
  pip install -r requirements.txt && cd webapp && npm install && npm run build:css
  ```

- **启动命令**：
  ```bash
  gunicorn -b 0.0.0.0:$PORT webapp.app:app
  ```

3. 部署并监控日志以排查问题。

## 许可证
Apache-2.0 许可证 © 2025 [LemonBrandy](https://github.com/tenngoxars)
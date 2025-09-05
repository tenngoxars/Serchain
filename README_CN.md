<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md">简体中文</a>
</p>

Serchain 是一个开源项目，专注于用户友好的设计、简洁的视觉效果和便捷的部署。它允许快速查询任意 Ethereum 地址的链上转账历史。目前支持 ETH 主网，提供基于网页的查询和 CSV 导出功能。

## 功能特点

- 输入任意 Ethereum 地址，即可追踪最近的链上转账记录
- 支持查看交易时间、方向、对方地址、金额、资产类型、Gas 费
- 一键下载 CSV，便于本地分析归档
- 响应式布局，支持移动端访问
- 无需连接钱包、无需注册登录
- 使用 Tailwind CSS 提供现代化样式

## 项目结构

```
Serchain/
├── webapp/            # Flask 后端 + HTML 前端
│   ├── templates/
│   │   └── index.html
│   ├── static/        # Tailwind CSS 样式/脚本
│   ├── app.py         # 后端服务逻辑
│   └── package.json   # 前端依赖
│
├── serchain.py        # 核心查询逻辑（可命令行使用）
├── requirements.txt   # Python 依赖
├── Procfile           # Railway 部署配置
├── README.md
└── .env               # 本地环境变量，包含 ALCHEMY_URL
```

## 本地运行指南

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

4. 配置 `.env` 文件（需注册 [Alchemy](https://www.alchemy.com/) 获取 API Key）

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

5. 构建 Tailwind CSS

```bash
npm run build
```

6. 运行网页版本

```bash
python app.py
```

7. 访问网站

浏览器访问 `http://127.0.0.1:8080`

## 命令行使用（可选）

```bash
python serchain.py
```

按提示输入地址后，将打印转账记录并自动保存为 CSV 文件。

## 部署（Railway）

1. 在 Railway 中设置环境变量：
   - `ALCHEMY_URL`：你的 Alchemy API Key

2. 配置构建和启动命令：
   - **构建命令**：
     ```bash
     apt-get update && apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && npm install --prefix webapp && npm run build --prefix webapp
     ```
   - **启动命令**：
     ```bash
     python webapp/app.py
     ```

3. 部署并监控日志以排查问题。

## 推荐版本

- **Python**：3.10 或更高版本
- **Node.js**：18.x

请确保使用这些版本以避免兼容性问题。

## 命令行示例

运行以下命令以使用命令行工具：

```bash
python serchain.py
```

示例输入和输出：

```plaintext
请输入 Ethereum 地址（0x 开头）：0x1234567890abcdef1234567890abcdef12345678
正在获取转账记录...

#  时间                 方向      发出地址                              接收地址                              金额    资产  Gas 费 (ETH)
1  2025-09-01 12:00:00  转出      0x1234567890abcdef1234567890abcdef12345678  0xabcdefabcdefabcdefabcdefabcdefabcdef  1.23   ETH    0.001
2  2025-09-01 13:00:00  转入      0xabcdefabcdefabcdefabcdefabcdefabcdef  0x1234567890abcdef1234567890abcdef12345678  0.45   ETH    0.0005

结果已保存至 transfers.csv
```

## License
Apache-2.0 License © 2025 [LemonBrandy](https://github.com/tenngoxars)
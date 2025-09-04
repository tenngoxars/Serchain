<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md"> 简体中文</a>
</p>

Serchain 是一个面向用户友好、视觉简洁、部署简便的开源项目，用于快速查询任意地址的链上转账记录，支持 ETH 主网，已实现网页端查询与 CSV 下载。

## 功能特点

- 输入任意 Ethereum 地址，即可追踪最近的链上转账记录
- 支持查看交易时间、方向、对方地址、金额、资产类型、Gas 费
- 一键下载 CSV，便于本地分析归档
- 响应式布局，支持移动端访问
- 无需连接钱包、无需注册登录

## 项目结构

```
Serchain/
├── webapp/            # Flask 后端 + HTML 前端
│   ├── templates/
│   │   └── index.html
│   ├── static/        # 可选的样式或脚本扩展
│   └── app.py         # 后端服务逻辑
│
├── serchain.py        # 核心查询逻辑（可命令行使用）
├── requirements.txt   # 所需依赖
├── README.md
└── .env               # 本地环境变量，包含 ALCHEMY_URL
```

## 本地运行指南

1. 克隆本仓库

```bash
git clone https://github.com/tenngoxars/serchain.git
cd serchain
```

2. 安装依赖

```bash
pip install -r requirements.txt
```

3. 配置 `.env` 文件（需注册 [Alchemy](https://www.alchemy.com/) 获取 API Key）

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

4. 运行网页版本

```bash
cd webapp
python app.py
```

5. 访问网站

浏览器访问 `http://127.0.0.1:8080`

## 命令行使用（可选）

```
python serchain.py
```

按提示输入地址后，将打印转账记录并自动保存为 CSV 文件。


## License
Apache-2.0 License © 2025 [LemonBrandy](https://github.com/tenngoxars)
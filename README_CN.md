<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md"> 简体中文</a>
</p>

**Serchain** 是一个面向小白的开源链上资产追踪工具，  
通过命令行即可轻松查询和分析钱包的转账记录。

## 功能特点
- 🔍 查询钱包转账（支持 📥 转入 / 📤 转出）
- ⛽ 显示每笔交易的 Gas 费用
- 📄 导出交易记录为 CSV 文件
- 🌐 可使用 Serchain 默认远程 API，也支持配置 Alchemy API Key

## 安装方法

```bash
git clone git@github.com:tenngoxars/serchain.git
cd serchain
pip install -r requirements.txt
```

## 使用方式

```bash
python serchain.py
```

输入任意地址：

```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### 示例输出

```
📦 共找到 10 条交易记录：

#1 📥 转入
🕒 时间:   2024-09-01T12:30:00Z
💸 From:   0x123...
📥 To:     0xabc...
💰 金额:  1.0 ETH
⛽ Gas 费用: 0.00042 ETH
🔗 交易哈希: 0x123abc...
```

所有记录将自动保存为 CSV 文件。

## 开发计划
- [ ] 支持 Solana 和 Bitcoin
- [ ] 提供基于 Streamlit/Next.js 的 Web UI
- [ ] 可视化转账图谱
- [ ] 可疑交易识别能力

## 授权协议
MIT License © 2025 [LemonBrandy](https://github.com/tenngoxars)
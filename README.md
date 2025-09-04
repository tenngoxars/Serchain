<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md">简体中文</a>
</p>

**Serchain** is a beginner-friendly, open-source tool for on-chain asset tracking.  
It helps you analyze and visualize wallet activities with simple CLI commands.

## Features
- 🔍 Track wallet transfers (📥 Received / 📤 Sent)
- ⛽ Display gas fees for each transaction
- 📄 Export transactions to CSV
- 🌐 No API key required — powered by Serchain remote API *(or use your own Alchemy key)*

## Installation

```bash
git clone git@github.com:tenngoxars/serchain.git
cd serchain
pip install -r requirements.txt
```

## Usage

```bash
python serchain.py
```

Enter any address:

```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### Example output

```
📦 Found 10 transfers:

#1 📥 Received
🕒 Time:   2024-09-01T12:30:00Z
💸 From:   0x123...
📥 To:     0xabc...
💰 Value:  1.0 ETH
⛽ Gas Fee: 0.00042 ETH
🔗 TxHash: 0x123abc...
```

All results are also saved to CSV.

## Roadmap
- [ ] Support Solana & Bitcoin
- [ ] Web UI with Streamlit/Next.js
- [ ] Graph visualization of transfers
- [ ] Suspicious transaction detection

## License
MIT License © 2025 [LemonBrandy](https://github.com/tenngoxars)
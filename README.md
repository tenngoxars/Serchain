<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="180"/>
</p>

<h1 align="center">Serchain</h1>

<p align="center">
  🌐 <a href="README.md">English</a> | <a href="README_CN.md">简体中文</a>
</p>

Serchain is an open-source project focused on user-friendly design, clean visuals, and easy deployment. It allows quick lookup of on-chain transfer history for any Ethereum address. Currently supports ETH mainnet with web-based queries and CSV export.

## Features

- Track recent on-chain transfers by entering any Ethereum address
- View transaction time, direction, counterparty address, value, asset type, and gas fee
- One-click CSV download for local analysis and archiving
- Responsive layout, mobile-friendly
- No wallet connection or user login required

## Project Structure

```
Serchain/
├── webapp/            # Flask backend + HTML frontend
│   ├── templates/
│   │   └── index.html
│   ├── static/        # Optional styles/scripts
│   └── app.py         # Backend service logic
│
├── serchain.py        # Core querying logic (CLI available)
├── requirements.txt   # Dependencies
├── README.md
└── .env               # Local env vars including ALCHEMY_URL
```

## Getting Started (Local)

1. Clone this repository

```bash
git clone https://github.com/tenngoxars/serchain.git
cd serchain
```

2. Install dependencies

```bash
pip install -r requirements.txt
```

3. Configure `.env` file (Register at [Alchemy](https://www.alchemy.com/) to get your API key)

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

4. Run the web version

```bash
cd webapp
python app.py
```

5. Open in browser

Go to `http://127.0.0.1:8080`

## Optional: Run via CLI

```
python serchain.py
```

Follow the prompt to input an address. Transfers will be printed and saved to a CSV file automatically.

## License
Apache-2.0 License © 2025 [LemonBrandy](https://github.com/tenngoxars)
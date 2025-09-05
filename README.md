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
- Tailwind CSS for modern styling

## Project Structure

```
Serchain/
├── webapp/            # Flask backend + HTML frontend
│   ├── templates/
│   │   └── index.html
│   ├── static/        # Tailwind CSS styles/scripts
│   ├── app.py         # Backend service logic
│   └── package.json   # Frontend dependencies
│
├── serchain.py        # Core querying logic (CLI available)
├── requirements.txt   # Python dependencies
├── Procfile           # Railway deployment configuration
├── README.md
└── .env               # Local env vars including ALCHEMY_URL
```

## Getting Started (Local)

1. Clone this repository

```bash
git clone https://github.com/tenngoxars/serchain.git
cd serchain
```

2. Install Python dependencies

```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies (for Tailwind CSS)

```bash
cd webapp
npm install
```

4. Configure `.env` file (Register at [Alchemy](https://www.alchemy.com/) to get your API key)

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-key-here]
```

5. Build Tailwind CSS

```bash
npm run build
```

6. Run the web version

```bash
python app.py
```

7. Open in browser

Go to `http://127.0.0.1:8080`

## Optional: Run via CLI

```bash
python serchain.py
```

Follow the prompt to input an address. Transfers will be printed and saved to a CSV file automatically.

## Recommended Versions

- **Python**: 3.10 or higher
- **Node.js**: 18.x

Ensure you are using these versions to avoid compatibility issues.

## CLI Example

Run the following command to use the CLI:

```bash
python serchain.py
```

Example input and output:

```plaintext
Enter Ethereum address (starts with 0x): 0x1234567890abcdef1234567890abcdef12345678
Fetching transfer history...

#  Time                 Direction  From                                   To                                     Value    Asset  Gas Fee (ETH)
1  2025-09-01 12:00:00  Outgoing  0x1234567890abcdef1234567890abcdef12345678  0xabcdefabcdefabcdefabcdefabcdefabcdef  1.23     ETH    0.001
2  2025-09-01 13:00:00  Incoming  0xabcdefabcdefabcdefabcdefabcdefabcdef  0x1234567890abcdef1234567890abcdef12345678  0.45     ETH    0.0005

Results saved to transfers.csv
```

## Deployment (Railway)

1. Set up environment variables in Railway:
   - `ALCHEMY_URL`: Your Alchemy API key

2. Configure Build and Start Commands:
   - **Build Command**:
     ```bash
     apt-get update && apt-get install -y curl && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && npm install --prefix webapp && npm run build --prefix webapp
     ```
   - **Start Command**:
     ```bash
     python webapp/app.py
     ```

3. Deploy and monitor logs for any issues.

## License
Apache-2.0 License © 2025 [LemonBrandy](https://github.com/tenngoxars)
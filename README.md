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

Serchain is an open-source, user-friendly on-chain transfer explorer for Ethereum. It supports quick, web-based lookups and CSV export on mainnet.

## Features

- Track recent on-chain transfers by entering any Ethereum address
- View transaction time, direction, counterparty address, value, asset type, and gas fee
- Download CSV with one click for local analysis and archiving
- Support multi-language (English / 中文)
- Provide responsive layout and mobile-friendly interface
- Require no wallet connection or user login
- Use Tailwind CSS for modern styling

Copy .env.example to .env and fill your credentials.

## Project Structure

```
Serchain/
├── webapp/            # Flask backend + HTML frontend
│   ├── templates/
│   │   └── index.html
│   ├── static/        # Tailwind CSS styles/scripts
│   │   └── css/
│   │       └── output.css  # Tailwind build output
│   ├── app.py         # Backend service logic
│   └── package.json   # Frontend dependencies
│
├── serchain.py        # Core querying logic (CLI available)
├── requirements.txt   # Python dependencies
├── Procfile           # Railway deployment configuration
├── README.md
└── .env               # Local env vars including ALCHEMY_URL
```

## Demo

Live demo: https://your-demo-url.example

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

> Do **not** commit .env to version control.

5. Build Tailwind CSS

```bash
npm run build:css
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

| #  | Time                 | Direction | From                                    | To                                      | Value | Asset | Gas Fee (ETH) |
|----|----------------------|-----------|-----------------------------------------|-----------------------------------------|-------|-------|---------------|
| 1  | 2025-09-01 12:00:00  | Outgoing  | 0x1234567890abcdef1234567890abcdef12345678 | 0xabcdefabcdefabcdefabcdefabcdefabcdef | 1.23  | ETH   | 0.001         |
| 2  | 2025-09-01 13:00:00  | Incoming  | 0xabcdefabcdefabcdefabcdefabcdefabcdef  | 0x1234567890abcdef1234567890abcdef12345678 | 0.45  | ETH   | 0.0005        |

Results saved to transfers.csv

## Deployment (Railway)

1. Set up environment variables in Railway:
   - `ALCHEMY_URL`: Your Alchemy API key

2. Configure Build and Start Commands:

- **Build Command (recommended)**:
  ```bash
  pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css
  ```
- **Build Command (alternative)**:
  ```bash
  pip install -r requirements.txt && cd webapp && npm install && npm run build:css
  ```

- **Start Command**:
  ```bash
  gunicorn -b 0.0.0.0:$PORT webapp.app:app
  ```

3. Deploy and monitor logs for any issues.

## Troubleshooting

- **Issue:** Web app not starting or crashing on launch  
  **Solution:** Check that all dependencies are installed correctly and environment variables (especially `ALCHEMY_URL`) are properly set.

- **Issue:** CSS styles not appearing or broken layout  
  **Solution:** Ensure Tailwind CSS is built by running `npm run build:css` in the `webapp` directory and that the static files are correctly served.

## Contributing

PRs and issues are welcome!

## License
Apache-2.0 License © 2025 [LemonBrandy](https://github.com/tenngoxars)
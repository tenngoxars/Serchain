<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="200"/>
</p>

<h1 align="center">Serchain</h1>
<h3 align="center">🔍 Modern Ethereum Transfer Explorer</h3>

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=for-the-badge" alt="License"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.10%2B-blue?style=for-the-badge" alt="Python"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-18.x-green?style=for-the-badge" alt="Node.js"></a>
  <a href="https://railway.app/"><img src="https://img.shields.io/badge/deploy-railway-purple?style=for-the-badge" alt="Railway"></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/flask-3.x-lightgrey?style=for-the-badge" alt="Flask"></a>
</p>

<p align="center">
  <a href="README_CN.md">简体中文</a> | <strong>English</strong>
</p>

---

**Serchain** is a modern, open-source Ethereum transfer explorer that provides both web-based and command-line interfaces for tracking on-chain transfers. Built with Flask and Tailwind CSS, it offers a sleek, responsive UI with real-time data from Ethereum mainnet.

## ✨ Key Features

- 🔍 **Real-time Transfer Tracking** - Query any Ethereum address to view recent transfers
- 📊 **Comprehensive Data** - View transaction time, direction, addresses, value, asset type, and gas fees
- 📥 **One-Click CSV Export** - Download transfer data for local analysis and archiving
- 🌐 **Dual Interface** - Modern web UI and powerful CLI for different use cases
- 🎨 **Modern Design** - Built with Tailwind CSS featuring dark theme and responsive layout
- 🌍 **Multi-language Support** - Available in English and Chinese
- 📱 **Mobile Friendly** - Fully responsive design that works on all devices
- 🔒 **No Authentication Required** - No wallet connection or user login needed
- ⚡ **Fast & Reliable** - Powered by Alchemy API for accurate, up-to-date data
- 🛠️ **Developer Friendly** - REST API endpoints for integration

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** 18.x or higher
- **Alchemy API Key** (Get one at [alchemy.com](https://www.alchemy.com/))

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/tenngoxars/serchain.git
cd serchain

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
cd webapp
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
ALCHEMY_URL=https://eth-mainnet.g.alchemy.com/v2/[your-api-key-here]
```

> ⚠️ **Important**: Never commit your `.env` file to version control.

### 3. Build & Run

```bash
# Build Tailwind CSS
npm run build:css

# Run the web application
python webapp/app.py
```

Visit `http://127.0.0.1:8080` in your browser!

## 📁 Project Structure

```
Serchain/
├── webapp/                    # Web application
│   ├── templates/
│   │   └── index.html         # Main HTML template
│   ├── static/                # Static assets
│   │   ├── css/
│   │   │   ├── main.css       # Tailwind source
│   │   │   └── output.css     # Compiled CSS
│   │   └── js/                # JavaScript modules
│   │       ├── app.js         # Main application logic
│   │       ├── api.js         # API communication
│   │       ├── history.js     # Query history
│   │       └── i18n.js        # Internationalization
│   ├── app.py                 # Flask backend
│   └── package.json           # Node.js dependencies
├── data/                      # CSV export directory
├── serchain.py                # CLI application
├── requirements.txt           # Python dependencies
├── Procfile                   # Railway deployment config
└── .env                       # Environment variables
```

## 🖥️ Usage

### Web Interface

1. **Start the application** (if not already running):
   ```bash
   python webapp/app.py
   ```

2. **Open your browser** and navigate to `http://127.0.0.1:8080`

3. **Enter an Ethereum address** in the input field (must start with `0x` and be 42 characters long)

4. **View results** in the beautiful table interface with:
   - Transaction direction (Incoming/Outgoing)
   - Timestamp
   - From/To addresses
   - Value and asset type
   - Gas fees
   - Transaction hash

5. **Export data** by clicking the download button to get a CSV file

### Command Line Interface

For developers and automation, use the CLI:

```bash
python serchain.py
```

The CLI will prompt you for an Ethereum address and display results in the terminal, automatically saving them to a CSV file in the `data/` directory.

### API Endpoints

For integration with other applications:

- **POST** `/api/query` - Query transfers for an address
  ```json
  {
    "address": "0x1234..."
  }
  ```

- **GET** `/download?address=0x1234...` - Download CSV for an address

## 📊 Example Output

### CLI Example

```bash
python serchain.py
```

**Sample output:**
```
=== Serchain: On-Chain ETH Transfer Tracker ===
Enter an Ethereum address (0x...): 0x1234567890abcdef1234567890abcdef12345678

🔍 Fetching transfers for: 0x1234567890abcdef1234567890abcdef12345678 ...

📦 Found 2 transfers:

#1 📤 Sent
  🕒 Time:   2025-01-15T14:30:00.000Z
  💸 From:   0x1234567890abcdef1234567890abcdef12345678
  📥 To:     0xabcdefabcdefabcdefabcdefabcdefabcdef
  💰 Value:  1.23 ETH
  🔗 TxHash: 0xabc123...
  ⛽ Gas Fee: 0.001 ETH

#2 📥 Received
  🕒 Time:   2025-01-15T15:45:00.000Z
  💸 From:   0xabcdefabcdefabcdefabcdefabcdefabcdef
  📥 To:     0x1234567890abcdef1234567890abcdef12345678
  💰 Value:  0.45 ETH
  🔗 TxHash: 0xdef456...
  ⛽ Gas Fee: 0.0005 ETH

✅ Saved to: data/transfers_123456_20250115_154500.csv
```

### Web Interface

The web interface displays the same data in a beautiful, sortable table with:
- Real-time search and filtering
- Responsive design for mobile devices
- Dark theme with modern styling
- One-click CSV export
- Query history tracking

## 🚀 Deployment

### Railway (Recommended)

1. **Connect your repository** to Railway
2. **Set environment variables**:
   - `ALCHEMY_URL`: Your Alchemy API key
3. **Configure build settings**:
   - **Build Command**:
     ```bash
     pip install -r requirements.txt && cd webapp && npm ci --no-audit --no-fund && npm run build:css
     ```
   - **Start Command**:
     ```bash
     gunicorn -w 2 -k gthread -b 0.0.0.0:$PORT webapp.app:app
     ```
4. **Deploy** and monitor logs

### Other Platforms

The application can be deployed on any platform that supports Python and Node.js:

- **Heroku**: Use the included `Procfile`
- **Docker**: Create a Dockerfile with multi-stage build
- **VPS**: Direct deployment with nginx + gunicorn

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Web app not starting** | Check Python/Node.js versions and ensure all dependencies are installed |
| **CSS styles missing** | Run `npm run build:css` in the `webapp` directory |
| **API errors** | Verify your Alchemy API key is correct and has sufficient quota |
| **No data returned** | Check if the address is valid and has recent transactions |
| **CSV download fails** | Ensure the `data/` directory exists and is writable |

### Development

For development with live CSS updates:

```bash
cd webapp
npm run watch:css
```

This will watch for changes in `main.css` and automatically rebuild `output.css`.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Install development dependencies
pip install -r requirements.txt
cd webapp && npm install

# Run in development mode
npm run watch:css  # Terminal 1
python webapp/app.py  # Terminal 2
```

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Alchemy](https://www.alchemy.com/) for providing reliable Ethereum API access
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling framework
- [Flask](https://flask.palletsprojects.com/) for the lightweight web framework

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/tenngoxars">LemonBrandy</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
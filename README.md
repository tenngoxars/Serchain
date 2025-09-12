<p align="center">
  <img src="doc/logo.png" alt="Serchain Logo" width="200"/>
</p>

<h1 align="center">Serchain</h1>
<h3 align="center">🔍 Modern Ethereum Transfer Explorer</h3>

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/license-Apache--2.0-blue?style=for-the-badge" alt="License"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.10%2B-blue?style=for-the-badge" alt="Python"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node.js-18.x-green?style=for-the-badge" alt="Node.js"></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge" alt="Vercel"></a>
  <a href="https://flask.palletsprojects.com/"><img src="https://img.shields.io/badge/flask-3.x-lightgrey?style=for-the-badge" alt="Flask"></a>
</p>

<p align="center">
  <a href="README_CN.md">简体中文</a> | <strong>English</strong>
</p>

---

**Serchain** is a modern, open-source Ethereum transfer explorer that provides both web-based and command-line interfaces for tracking on-chain transfers. Built with Flask and Tailwind CSS, it offers a sleek, responsive UI with real-time data from Ethereum mainnet.

## ✨ Key Features

- 🔍 **Real-time Transfer Tracking** - Query any Ethereum address to view recent transfers
- 📊 **Comprehensive Data** - View transaction time, direction, addresses, value, and gas fees
- 📥 **Smart CSV Export** - Download filtered transfer data for local analysis
- 🏷️ **Smart Filtering** - Filter transfers by direction (all/received/sent)
- 📋 **One-Click Copy** - Copy addresses with a single click
- 🌐 **Dual Interface** - Modern web UI and powerful CLI
- 🎨 **Modern Design** - Glassmorphism UI with dark theme and smooth animations
- 🌍 **Multi-language Support** - Available in English and Chinese
- 📱 **Mobile Friendly** - Fully responsive design
- 🔒 **No Authentication Required** - No wallet connection or user login needed

## 🚀 Quick Start

### Prerequisites

- **Python** 3.12 or higher
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
ALCHEMY_API_KEY=your-api-key-here
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

## 🌐 Live Demo

**Try Serchain online**: [serchain.xyz](https://serchain.xyz)

No installation required - just enter an Ethereum address and start exploring!

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
   - Transaction direction (Incoming/Outgoing) with visual indicators
   - Timestamp with proper formatting
   - From/To addresses with one-click copy functionality
   - Value and asset type
   - Gas fees
   - Animated table rows with smooth transitions

5. **Filter data** using the smart filter tabs (All/Received/Sent)

6. **Load more data** by clicking "Query More" to fetch additional records

7. **Export data** by clicking the download button to get a filtered CSV file

8. **Copy addresses** by clicking on any address in the table

9. **View history** of your recent queries in the sidebar

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
- **POST** `/api/load_more` - Load more transfers for an address
  ```json
  {
    "address": "0x1234...",
    "pageKey": "cursor_string"
  }
  ```

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
- Dark theme with modern styling and interactive animations
- One-click CSV export
- Query history tracking
- Dynamic background effects and smooth transitions
- Language switching with persistent preferences

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   - `ALCHEMY_API_KEY`: Your Alchemy API key
3. **Deploy** - Vercel will automatically detect and configure the Python/Node.js build
4. **Add custom domain** (optional) in Vercel project settings

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
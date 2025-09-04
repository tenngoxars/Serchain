import requests
import json
import os
import csv
from dotenv import load_dotenv
from datetime import datetime

# === 配置 ===
load_dotenv()
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
ALCHEMY_URL = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"

# === 请求链上转账数据 ===
def get_asset_transfers(address):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "alchemy_getAssetTransfers",
        "params": [{
            "fromBlock": "0x0",
            "toBlock": "latest",
            "toAddress": address,
            "category": ["external", "internal", "erc20"],
            "maxCount": "0xa",
            "withMetadata": True
        }]
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(ALCHEMY_URL, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        return response.json().get("result", {}).get("transfers", [])
    else:
        print("❌ Error:", response.text)
        return []

# === 控制台输出转账记录（带方向） ===
def display_transfers(transfers, address):
    if not transfers:
        print("⚠️ No transfers found.")
        return

    print(f"\n📦 Found {len(transfers)} transfers:\n")
    for i, tx in enumerate(transfers, 1):
        time = tx['metadata']['blockTimestamp']
        _from = tx['from']
        _to = tx['to']
        value = tx['value']
        asset = tx['asset']
        tx_hash = tx['hash']

        # 🔄 判断方向
        if _to.lower() == address.lower():
            direction = "📥 Received"
        elif _from.lower() == address.lower():
            direction = "📤 Sent"
        else:
            direction = "🔁 Unknown"

        print(f"#{i} {direction}")
        print(f"  🕒 Time:   {time}")
        print(f"  💸 From:   {_from}")
        print(f"  📥 To:     {_to}")
        print(f"  💰 Value:  {value} {asset}")
        print(f"  🔗 TxHash: {tx_hash}\n")

# === 保存为 CSV 文件 ===
def save_to_csv(transfers, address):
    if not transfers:
        print("⚠️ No data to save.")
        return

    short_addr = address[:6]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"data/transfers_{short_addr}_{timestamp}.csv"

    with open(filename, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Direction", "Time", "From", "To", "Value", "Asset", "TxHash"])

        for tx in transfers:
            _from = tx['from']
            _to = tx['to']
            direction = "Received" if _to.lower() == address.lower() else \
                        "Sent" if _from.lower() == address.lower() else \
                        "Unknown"
            writer.writerow([
                direction,
                tx['metadata']['blockTimestamp'],
                _from,
                _to,
                tx['value'],
                tx['asset'],
                tx['hash']
            ])

    print(f"✅ Saved to: {filename}")

# === 主函数 ===
def main():
    print("=== Serchain: On-Chain ETH Transfer Tracker ===")
    address = input("Enter an Ethereum address (0x...): ").strip()

    if not address.startswith("0x") or len(address) != 42:
        print("❌ Invalid address format.")
        return

    print(f"\n🔍 Fetching transfers for: {address} ...")
    transfers = get_asset_transfers(address)
    display_transfers(transfers, address)
    save_to_csv(transfers, address)

if __name__ == "__main__":
    main()
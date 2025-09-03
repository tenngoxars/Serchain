import os
import csv
import json
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
ALCHEMY_URL = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_API_KEY}"

def get_asset_transfers(address):
    transfers = []
    page_key = None
    while True:
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "alchemy_getAssetTransfers",
            "params": [{
                "fromBlock": "0x0",
                "toBlock": "latest",
                "toAddress": address,
                "category": ["external", "internal"],
                "withMetadata": True,
                "maxCount": "0x3e8"
            }]
        }

        if page_key:
            payload["params"][0]["pageKey"] = page_key

        headers = {"Content-Type": "application/json"}
        response = requests.post(ALCHEMY_URL, headers=headers, data=json.dumps(payload))
        if response.status_code != 200:
            print(f"❌ Error fetching transfers: {response.status_code}")
            break

        result = response.json().get("result", {})
        batch = result.get("transfers", [])
        transfers.extend(batch)

        page_key = result.get("pageKey")
        if not page_key:
            break

    return transfers

def get_gas_fee(tx_hash):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_getTransactionReceipt",
        "params": [tx_hash]
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(ALCHEMY_URL, headers=headers, data=json.dumps(payload))
    if response.status_code != 200:
        return None
    receipt = response.json().get("result", {})
    if not receipt:
        return None

    gas_used = int(receipt.get("gasUsed", "0x0"), 16)
    gas_price = int(receipt.get("effectiveGasPrice", "0x0"), 16)
    gas_fee_eth = (gas_used * gas_price) / 1e18
    return round(gas_fee_eth, 8)

def display_transfers(transfers, address):
    if not transfers:
        print("📭 No transfers found.")
        return

    print(f"\n📦 Found {len(transfers)} transfers:\n")
    for i, tx in enumerate(transfers, start=1):
        _from = tx['from']
        _to = tx['to']
        time = tx['metadata']['blockTimestamp']
        value = tx['value']
        asset = tx['asset']
        tx_hash = tx['hash']
        gas_fee = get_gas_fee(tx_hash)

        direction = "📬 Received" if _to.lower() == address.lower() else \
                    "📤 Sent" if _from.lower() == address.lower() else \
                    "🔁 Other"

        print(f"#{i} {direction}")
        print(f"  🕒 Time:   {time}")
        print(f"  💸 From:   {_from}")
        print(f"  📥 To:     {_to}")
        print(f"  💰 Value:  {value} {asset}")
        print(f"  ⛽ Gas Fee: {gas_fee} ETH")
        print(f"  🔗 TxHash: {tx_hash}\n")

def save_to_csv(transfers, address):
    if not transfers:
        print("⚠️ No data to save.")
        return

    os.makedirs("data", exist_ok=True)
    now = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    short = address[:6]
    filename = f"data/transfers_{short}_{now}.csv"

    with open(filename, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Direction", "Time", "From", "To", "Value", "Asset", "Gas Fee (ETH)", "TxHash"])
        for tx in transfers:
            _from = tx['from']
            _to = tx['to']
            direction = "Received" if _to.lower() == address.lower() else \
                        "Sent" if _from.lower() == address.lower() else \
                        "Other"
            tx_hash = tx['hash']
            gas_fee = get_gas_fee(tx_hash)

            writer.writerow([
                direction,
                tx['metadata']['blockTimestamp'],
                _from,
                _to,
                tx['value'],
                tx['asset'],
                gas_fee,
                tx_hash
            ])
    print(f"✅ Saved to: {filename}")

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
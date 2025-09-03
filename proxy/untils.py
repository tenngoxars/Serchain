import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

ALCHEMY_KEY = os.getenv("ALCHEMY_KEY")
ALCHEMY_URL = f"https://eth-mainnet.g.alchemy.com/v2/{ALCHEMY_KEY}"

def get_asset_transfers(address):
    headers = {"Content-Type": "application/json"}
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
                "fromBlock": "0x0",
                "toBlock": "latest",
                "toAddress": address,
                "category": ["external", "internal"],
                "withMetadata": True,
                "excludeZeroValue": True,
                "maxCount": "0x3e8"  # 1000 in hex
            }
        ]
    }

    response = requests.post(ALCHEMY_URL, headers=headers, data=json.dumps(payload))
    response.raise_for_status()
    data = response.json()
    return data["result"]["transfers"]
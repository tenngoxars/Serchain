import sys
import os
import io
import csv
from flask import Flask, render_template, request, send_file, url_for
from datetime import datetime

# 时间格式化函数
def format_timestamp(iso_str):
    try:
        dt = datetime.strptime(iso_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except Exception:
        return iso_str

# 将项目根目录加入模块路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from serchain import get_asset_transfers  # 复用已有逻辑
from serchain import get_gas_fee

app = Flask(__name__, static_url_path='', static_folder='static')

# 确保生产环境中正确处理静态文件
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@app.route("/", methods=["GET", "POST"])
def index():
    transfers = None
    address = ""

    if request.method == "POST":
        address = request.form.get("address", "").strip()
        if address.startswith("0x") and len(address) == 42:
            transfers = get_asset_transfers(address)
            for tx in transfers:
                tx['metadata']['blockTimestamp'] = format_timestamp(tx['metadata']['blockTimestamp'])

    return render_template("index.html", address=address, transfers=transfers)

@app.route("/download")
def download_csv():
    address = request.args.get("address", "").strip()
    if not address.startswith("0x") or len(address) != 42:
        return "Invalid address", 400

    transfers = get_asset_transfers(address)
    if not transfers:
        return "No data found", 404

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Direction", "Time", "From", "To", "Value", "Asset", "Gas Fee (ETH)", "TxHash"])

    for tx in transfers:
        _from = tx['from']
        _to = tx['to']
        direction = "Received" if _to.lower() == address.lower() else "Sent"
        gas_fee = get_gas_fee(tx['hash'])
        writer.writerow([
            direction,
            tx['metadata']['blockTimestamp'],
            _from,
            _to,
            tx['value'],
            tx['asset'],
            gas_fee,
            tx['hash']
        ])

    output.seek(0)
    filename = f"transfers_{address[:6]}.csv"
    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype="text/csv",
        as_attachment=True,
        download_name=filename
    )

from flask import jsonify, request

@app.route("/api/query", methods=["POST"])
def api_query():
    data = request.get_json()
    address = data.get("address")

    if not address or not address.startswith("0x") or len(address) != 42:
        return jsonify({"error": "Invalid Ethereum address"}), 400

    try:
        transfers = get_asset_transfers(address)
        results = []
        for tx in transfers:
            results.append({
                "time": format_timestamp(tx['metadata']['blockTimestamp']),
                "from": tx['from'],
                "to": tx['to'],
                "value": tx['value'],
                "asset": tx['asset'],
                "gas_fee": tx.get('gas_fee'),
                "hash": tx['hash']
            })
        return jsonify({"transfers": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
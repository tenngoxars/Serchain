from fastapi import FastAPI, Query
from utils import get_asset_transfers
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 允许跨域访问，方便前端使用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/track")
def track_wallet(address: str = Query(..., description="Ethereum address to track")):
    try:
        transfers = get_asset_transfers(address)
        return {"status": "ok", "address": address, "transfers": transfers}
    except Exception as e:
        return {"status": "error", "message": str(e)}
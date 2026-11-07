# RegionalPulse

A Multimodal Spatio-Temporal Early-Warning System for Regional Hospital Bed Pressure Prediction.

> **Research prototype:** RegionalPulse uses deterministic simulated/demo data when real sources are unavailable. It does not provide medical diagnosis, treatment, or autonomous clinical decisions.

## Architecture
- Frontend: React + Vite + TypeScript + Tailwind CSS + React-Leaflet + Recharts
- Backend: FastAPI
- ML: deterministic mock inference with interfaces for TFT/GAT/fusion; scikit-learn compatible feature pipeline
- Storage: in-memory demo repository; SQLite/PostGIS can be added behind the same API contracts

## Run

### Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

The frontend proxies `/api` to `http://localhost:8000`.

## Demo data policy
All forecast, occupancy, risk, feature attribution, weather, event and disease values in the default prototype are explicitly marked `DEMO / SIMULATED`. The demo generator is deterministic for a given district and current date bucket; it does not randomly change on every refresh.

## ML extension points
`ml/model.py` contains interfaces for:
1. Temporal Fusion Transformer (TFT) temporal forecasting.
2. Graph Attention Network (GAT) spatial propagation.
3. Multimodal feature fusion.
4. Capacity-risk calculation.

Replace `DeterministicDemoModel` with trained models once validated datasets are available.

from fastapi import FastAPI, Depends, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from contextlib import asynccontextmanager

from models.database import connect_to_mongo, close_mongo_connection
from app.auth import router as auth_router
from app.analysis import router as analysis_router
from app.chat import router as chat_router
from app.reports import router as reports_router

app = FastAPI(
    title="Multimodal Radiology System API",
    description="API for diagnosing retinal and eye diseases using CNN and LLMs",
    version="1.0.0"
)

# Start DB connection in the background to avoid any startup hangs
import asyncio
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(connect_to_mongo())

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    db = get_database()
    return {
        "status": "online",
        "database": "connected" if db is not mock_db else "mock_mode_active",
        "timestamp": "2026-03-23"
    }

@app.get("/api/debug")
async def debug_db():
    from models.database import mock_db
    return {
        "mock_users_count": len(mock_db.users.data),
        "mock_reports_count": len(mock_db.reports.data)
    }

@app.middleware("http")
async def diagnostic_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        import traceback
        print(f"CRITICAL ERROR: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal Diagnostic Error: {str(e)}"}
        )

from fastapi.responses import JSONResponse

# --- Serve Static Assets (Images & Grad-CAM) ---
data_path = Path(__file__).parent / "data"
if not data_path.exists():
    data_path.mkdir(parents=True, exist_ok=True)
if not (data_path / "images").exists():
    (data_path / "images").mkdir()
if not (data_path / "gradcam").exists():
    (data_path / "gradcam").mkdir()

app.mount("/images", StaticFiles(directory=str(data_path / "images")), name="images")
app.mount("/gradcam", StaticFiles(directory=str(data_path / "gradcam")), name="gradcam")

# --- Serve Frontend ---
frontend_path = Path(__file__).parent.parent / "frontend" / "dist"

if frontend_path.exists():
    # Serve assets folder
    if (frontend_path / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(frontend_path / "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(request: Request, full_path: str):
        # Do not intercept API requests
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
            
        file_path = frontend_path / full_path
        if full_path != "" and file_path.exists():
            return FileResponse(file_path)
        
        # Default to index.html for SPA routing
        return FileResponse(frontend_path / "index.html")
else:
    @app.get("/")
    def read_root() -> Dict[str, str]:
        return {"status": "success", "message": "API is running. Frontend dist not found - build frontend to serve UI."}


# AI logic modules will strictly adhere to the no-fake-prediction policy.

if __name__ == "__main__":
    import uvicorn
    # Render assigns dynamic ports via $PORT, defaults to 10000
    port = int(os.getenv("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

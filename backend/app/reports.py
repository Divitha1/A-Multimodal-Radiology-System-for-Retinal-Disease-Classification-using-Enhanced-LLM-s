from fastapi import APIRouter, Depends
from typing import List
from models.database import get_database
from models.report import ClinicalReportInDB

from app.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Clinical Reports"])

@router.get("/", response_model=List[ClinicalReportInDB])
async def get_reports(current_user: dict = Depends(get_current_user)):
    db = get_database()
    if db is None:
        return []
    
    # Filter by user_id OR show global demo records
    cursor = db.reports.find({
        "$or": [
            {"user_id": current_user.get("id")},
            {"user_id": "demo_id"}
        ]
    })
    reports = await cursor.to_list(length=100)
    
    # Handle the fact that many old reports might not have user_id
    if not reports:
        # Fallback to show all reports ONLY if this is a radiologist (formerly 'doctor')
        if current_user.get("role") == "radiologist":
             cursor = db.reports.find({})
             reports = await cursor.to_list(length=100)

    for report in reports:
        report["_id"] = str(report["_id"])
        
    return reports
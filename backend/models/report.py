from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class ClinicalReportBase(BaseModel):
    report_id: str = Field(..., alias="report_id")
    patient_name: str = Field(..., alias="patient_name")
    age: int
    gender: str
    location: str
    hospital: str
    doctor: str
    analysis_date: str = Field(..., alias="analysis_date")
    diagnosis: str
    severity: str
    confidence: float
    image_url: str = Field(..., alias="image_url")
    gradcam_url: str = Field(..., alias="gradcam_url")

class ClinicalReportInDB(ClinicalReportBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True

import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

# Add backend to path to import models if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "radiology_db"

sample_reports = []
for i, (name, age, gender, loc, diag, sev, conf) in enumerate([
    ("Ramesh Kumawat", 45, "Male", "Banjara Hills", "Proliferative Diabetic Retinopathy", "Critical", 99),
    ("Sushila Devi", 62, "Female", "Gachibowli", "Normal Fundus", "Normal", 98),
    ("Anwar Siddiqui", 54, "Male", "Secunderabad", "Age-related Macular Degeneration", "Moderate", 91),
    ("Kavitha Reddy", 38, "Female", "Madhapur", "Early Stage Glaucoma", "Mild", 87),
    ("Praveen Rao", 41, "Male", "Jubilee Hills", "Normal Fundus", "Normal", 96),
    ("Lakshmi Narayana", 68, "Male", "Uppal", "Moderate Non-Proliferative DR", "Moderate", 94),
    ("Mohammed Ali", 52, "Male", "Charminar", "Choroidal Neovascularization", "Severe", 89),
    ("Deepika Singh", 29, "Female", "Kukatpally", "Normal Fundus", "Normal", 99),
    ("Srinivas Goud", 47, "Male", "Dilshuknagar", "Central Serous Chorioretinopathy", "Mild", 92),
    ("Anita Desai", 35, "Female", "Miyapur", "Cystoid Macular Edema", "Severe", 95),
    ("Vikram Singh", 50, "Male", "Secunderabad", "Normal Fundus", "Normal", 99),
    ("Priyanka Sharma", 43, "Female", "Ameerpet", "Severe Non-Proliferative DR", "Critical", 96),
    ("Rahul Verma", 31, "Male", "Begumpet", "Macular Hole", "Moderate", 93),
    ("Sangeetha Iyer", 55, "Female", "Kothapet", "Normal Fundus", "Normal", 98),
    ("Arjun Kapoor", 28, "Male", "Tarkari Mandi", "Branch Retinal Vein Occlusion", "Moderate", 90)
], 1):
    is_dr = "Diabetic Retinopathy" in diag or "DR" in diag
    sample_reports.append({
        "report_id": f"RPT-HYD-{i:03d}",
        "patient_name": name,
        "age": age,
        "gender": gender,
        "location": f"{loc}, Hyderabad",
        "hospital": "Hyderabad Diagnostic Hub",
        "doctor": "Dr. Radiology AI",
        "analysis_date": "2026-03-20",
        "diagnosis": diag,
        "severity": sev,
        "confidence": conf,
        "image_url": "/images/fundus_healthy.jpg",
        "gradcam_url": "/gradcam/fundus_dr.jpg",
        "source": "Manual Entry"
    })

async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    
    print(f"Seeding {len(sample_reports)} reports into MongoDB collection 'reports' in database '{DB_NAME}'...")
    
    # Clean existing
    await db.reports.delete_many({})
    
    # Insert new
    result = await db.reports.insert_many(sample_reports)
    print(f"Successfully inserted {len(result.inserted_ids)} records.")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())

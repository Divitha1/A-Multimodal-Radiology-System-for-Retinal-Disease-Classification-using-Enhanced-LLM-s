import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "radiology_db"

async def check():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DB_NAME]
    
    reports = await db.reports.find({"source": "PDF + AI"}).to_list(length=10)
    print(f"Found {len(reports)} PDF+AI reports:")
    for r in reports:
        print(f"ID: {r['report_id']} | Patient: {r['patient_name']} | Diagnosis: {r['diagnosis']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check())

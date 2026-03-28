from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Basic connection string; in production, use .env or environment variables
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = "radiology_db"

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.data = []
    async def find_one(self, query, sort=None):
        for item in self.data:
            match = True
            for k, v in query.items():
                if item.get(k) != v: match = False; break
            if match: return item
        return None
    async def insert_one(self, item):
        from bson import ObjectId
        if "_id" not in item: item["_id"] = ObjectId()
        self.data.append(item)
        class Result: 
            def __init__(self, id): self.inserted_id = id
        return Result(item["_id"])
    def find(self, query):
        class Cursor:
            def __init__(self, data): self.data = data
            async def to_list(self, length): return self.data[:length]
            def sort(self, key_or_list, direction=None): return self
        return Cursor(self.data)
    async def update_one(self, query, update):
        return None

class MockDB:
    def __init__(self):
        self.users = MockCollection("users")
        self.reports = MockCollection("reports")
        self.chat_history = MockCollection("chat_history")
        
        # Seed with a professional demo record that matches the strict Pydantic model
        from bson import ObjectId
        from datetime import datetime
        self.reports.data.append({
            "_id": ObjectId("65fbd3b2e4b0a1a2b3c4d5e6"),
            "report_id": "REPT-DEMO-001",
            "user_id": "demo_id",
            "patient_name": "John Doe",
            "age": 52,
            "gender": "Male",
            "location": "Hyderabad",
            "hospital": "L.V. Prasad Eye Institute",
            "doctor": "Dr. Srinivas",
            "analysis_date": datetime.now().strftime("%Y-%m-%d"),
            "diagnosis": "Moderate Non-Proliferative Diabetic Retinopathy",
            "severity": "Moderate",
            "confidence": 94.2,
            "image_url": "/api/images/sample_retina.jpg",
            "gradcam_url": "/api/gradcam/sample_heatmap.jpg",
            "finding": "Microaneurysms detected in the peripheral retina. Early signs of hard exudates.",
            "source": "AI Diagnostic Engine",
            "status": "Verified"
        })
        self.reports.data.append({
            "_id": ObjectId("65fbd3b2e4b0a1a2b3c4d5e7"),
            "report_id": "REPT-DEMO-002",
            "user_id": "demo_id",
            "patient_name": "Sarah Miller",
            "age": 64,
            "gender": "Female",
            "location": "Hyderabad",
            "hospital": "Apollo Health Center",
            "doctor": "Dr. Ananya",
            "analysis_date": datetime.now().strftime("%Y-%m-%d"),
            "diagnosis": "Diabetic Macular Edema (DME)",
            "severity": "Severe",
            "confidence": 91.5,
            "image_url": "/api/images/sample_oct_dme.jpg",
            "gradcam_url": "/api/gradcam/sample_heatmap_oct.jpg",
            "finding": "Significant intraretinal cystic spaces and increased central macular thickness.",
            "source": "Clinical Records",
            "status": "Verified"
        })
        self.reports.data.append({
            "_id": ObjectId("65fbd3b2e4b0a1a2b3c4d5e8"),
            "report_id": "REPT-DEMO-003",
            "user_id": "demo_id",
            "patient_name": "Aman Verma",
            "age": 45,
            "gender": "Male",
            "location": "Pune",
            "hospital": "Susrut Eye Clinic",
            "doctor": "Dr. Rajesh",
            "analysis_date": datetime.now().strftime("%Y-%m-%d"),
            "diagnosis": "Glaucomatous Optic Neuropathy",
            "severity": "Advanced",
            "confidence": 88.9,
            "image_url": "/api/images/sample_glaucoma.jpg",
            "gradcam_url": "/api/gradcam/sample_heatmap_glaucoma.jpg",
            "finding": "Thinning of the RNFL in the superior and inferior poles. Cup-to-disc ratio 0.8.",
            "source": "AI Diagnostic Engine",
            "status": "Verified"
        })
        self.reports.data.append({
            "_id": ObjectId("65fbd3b2e4b0a1a2b3c4d5e9"),
            "report_id": "REPT-DEMO-004",
            "user_id": "demo_id",
            "patient_name": "Elena Gilbert",
            "age": 70,
            "gender": "Female",
            "location": "Mumbai",
            "hospital": "Eye Care Plus",
            "doctor": "Dr. Smith",
            "analysis_date": datetime.now().strftime("%Y-%m-%d"),
            "diagnosis": "Wet Age-Related Macular Degeneration (AMD)",
            "severity": "Active",
            "confidence": 96.0,
            "image_url": "/api/images/sample_wet_amd.jpg",
            "gradcam_url": "/api/gradcam/sample_heatmap_amd.jpg",
            "finding": "Sub-retinal hyper-reflective material (SHRM) and fluid detected. Immediate Anti-VEGF suggested.",
            "source": "Clinical Records",
            "status": "Verified"
        })

mock_db = MockDB()

client = None
db = None

async def connect_to_mongo():
    global client, db
    try:
        logger.info(f"Connecting to MongoDB at {MONGODB_URL}...")
        # Reduce timeout to 500ms for quick fallback
        client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=500)
        
        # Explicit ping to verify connection immediately
        await client.admin.command('ping')
        db = client[DB_NAME]
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.warning(f"Falling back to MockDB. MongoDB connection failed: {e}")
        db = None
        client = None

async def close_mongo_connection():
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection.")

def get_database():
    return db if db is not None else mock_db
import requests
import os

BASE_URL = "http://localhost:8000"

def test_extract():
    print("Testing /api/analysis/extract-real-data...")
    file_path = "backend/test_report.pdf"
    with open(file_path, "rb") as f:
        files = {"file": ("test_report.pdf", f, "application/pdf")}
        response = requests.post(f"{BASE_URL}/api/analysis/extract-real-data", files=files)
        
    if response.status_code == 200:
        result = response.json()
        print("Extraction Result:", result)
        return result
    else:
        print("Extraction Failed:", response.status_code, response.text)
        return None

def test_save(result):
    print("\nTesting /api/analysis/save-combined-report...")
    response = requests.post(f"{BASE_URL}/api/analysis/save-combined-report", json=result)
    if response.status_code == 200:
        print("Save Result:", response.json())
    else:
        print("Save Failed:", response.status_code, response.text)

if __name__ == "__main__":
    res = test_extract()
    if res:
        test_save(res)

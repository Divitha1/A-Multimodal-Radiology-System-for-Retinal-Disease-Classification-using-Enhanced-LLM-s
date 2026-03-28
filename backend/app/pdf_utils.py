import pdfplumber
import re
import logging

logger = logging.getLogger(__name__)

def extract_pdf_data(file_path):
    """
    Extracts patient and scan details from a hospital PDF report.
    Matches names, IDs, hospitals, and dates using regex.
    """
    data = {
        "patient_name": "Unknown",
        "patient_id": "N/A",
        "hospital_name": "General Hospital",
        "date": "N/A",
        "scan_type": "Retinal Scan"
    }

    try:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"

            # Regex patterns for clinical reports (Enhanced for real-world variability)
            name_match = re.search(r"(?:Patient Name|Name|Patient):\s*([a-zA-Z\s\.]+)", text, re.IGNORECASE)
            id_match = re.search(r"(?:Patient ID|ID|Reg No|UHID|MRN):\s*([a-zA-Z0-9-]+)", text, re.IGNORECASE)
            hospital_match = re.search(r"(?:Hospital|Clinic|Center|Health Care|Institute):\s*([a-zA-Z\s\.-]+)", text, re.IGNORECASE)
            date_match = re.search(r"(?:Date|Analysis Date|Scan Date|Report Date):\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})", text, re.IGNORECASE)
            scan_match = re.search(r"(?:Scan Type|Modality|Procedure|Test):\s*([a-zA-Z\s\(\)]+)", text, re.IGNORECASE)
            
            # Additional fallback for hospital name (often at the top)
            if not hospital_match or "General" in data["hospital_name"]:
                # Try to find common hospital names if no explicit "Hospital:" label
                hosp_keywords = ["Yashoda", "Apollo", "L.V. Prasad", "LVPEI", "Care Hospital", "Rainbow", "Continental"]
                for kw in hosp_keywords:
                    if kw.lower() in text.lower():
                        data["hospital_name"] = kw
                        break

            if name_match: data["patient_name"] = name_match.group(1).strip()
            if id_match: data["patient_id"] = id_match.group(1).strip()
            if hospital_match and data["hospital_name"] == "General Hospital": 
                data["hospital_name"] = hospital_match.group(1).strip()
            if date_match: data["date"] = date_match.group(1).strip()
            if scan_match: data["scan_type"] = scan_match.group(1).strip()

            # If names are still unknown, try a broader search or use defaults
            logger.info(f"Extracted PDF Content (Sample): {text[:200]}...")

    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
    
    return data

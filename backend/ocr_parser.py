import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import re
import os

def extract_health_data(text):
    results = []
    lines = text.split('\n')
    for line in lines:
        match = re.match(r"([A-Za-z\s]+)\s+([\d.]+)\s*(\w+/?.*)?\s+(\d{1,3}[-–]\d{1,3})?", line)
        if match:
            param = match.group(1).strip()
            value = match.group(2)
            unit = match.group(3) if match.group(3) else ""
            normal_range = match.group(4) if match.group(4) else ""
            results.append({
                "parameter": param,
                "value": value,
                "unit": unit,
                "range": normal_range,
            })
    return results

def process_file(file_path):
    print(f"Processing file: {file_path}")
    
    # Step 1: Convert to image
    try:
        images = convert_from_path(file_path)
        print(f"PDF converted to {len(images)} image(s)")
    except Exception as e:
        print(f"PDF conversion error: {str(e)}")
        return []

    # Step 2: OCR
    text = ""
    for i, image in enumerate(images):
        text_part = pytesseract.image_to_string(image)
        print(f"OCR output for page {i+1}:\n{text_part}")
        text += text_part

    # Step 3: Parse health parameters (improved parsing)
    parameters = [
        {"name": "Hemoglobin", "unit": "g/dL", "range": "12.0-16.0"},
        {"name": "WBC Count", "unit": "/mm3", "range": "4000-11000"},
        {"name": "Platelet Count", "unit": "lakhs", "range": "1.5-4.0"},
        {"name": "Blood Glucose", "unit": "mg/dL", "range": "70-110"},
        {"name": "Cholesterol", "unit": "mg/dL", "range": "<200"},
        {"name": "HDL Cholesterol", "unit": "mg/dL", "range": ">40"},
        {"name": "LDL Cholesterol", "unit": "mg/dL", "range": "<130"},
        {"name": "Triglycerides", "unit": "mg/dL", "range": "<150"},
    ]
    results = []
    lines = text.splitlines()
    for param in parameters:
        for line in lines:
            if param["name"].lower() in line.lower():
                # Extract value using regex
                match = re.search(rf"{param['name']}[^\d]*([\d.]+)", line, re.IGNORECASE)
                value = match.group(1) if match else ""
                results.append({
                    "parameter": param["name"],
                    "value": value,
                    "unit": param["unit"],
                    "range": param["range"]
                })
                break  # Stop after first match for this parameter

    # Optionally, extract impression/remarks
    for line in lines:
        if "impression" in line.lower():
            results.append({
                "parameter": "Impression",
                "value": line.split(":", 1)[-1].strip() if ":" in line else line.strip(),
                "unit": "",
                "range": ""
            })

    return results

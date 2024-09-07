import cv2
import fitz  # PyMuPDF
import pytesseract
import numpy as np
import argparse
import re
import os
from pyzbar.pyzbar import decode
"""
# Configure Tesseract path if necessary
tesseract_cmd = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
pytesseract.pytesseract.tesseract_cmd = tesseract_cmd
"""
# PII detection patterns
PII_PATTERNS = {
    "Email": {
        "regex": r"[A-Za-z0-9._+\-']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}",
        "keywords": None
    },
    "Phone Number": {
        "regex": r"(\+?\d{1,4}[ -]?\(?\d{1,4}\)?[ -]?\d{1,9}[ -]?\d{1,9}|(?:\d{3}[-.\s]){2}\d{4})",
        "keywords": ["phone", "telephone", "tel", "contact", "whatsapp", "telegram", "sms"]
    },
    "Banking": {
        "regex": None,
        "keywords": ["bank", "bank account", "statement", "ifsc", "branch", "savings", "account number", "amount", "credit", "debit"]
    },
    "Payment Card": {
        "regex": r"\b(?:\d{4}[ -]?){3}\d{4}\b",
        "keywords": ["visa", "mastercard", "amex", "american express", "rupay", "debit card", "credit card", "atm card", "bank", "valid", "expires", "expiry", "thru", "cvv"]
    },
    "Aadhaar Card": {
        "regex": r"\b\d{4}[ -]?\d{4}[ -]?\d{4}\b",
        "keywords": ["Aadhaar", "UID", "UIDAI", "Unique", "Identification", "Authority", "Address", "Government of India"]
    },
    "Permanent Account Number": {
        "regex": "[A-Z]{5}?[0-9]{4}[A-Z]",
        "keywords": ["PAN", "income", "tax", "permanent", "account", "department", "India", "Govt."]
    },
    "Driving License": {
        "regex": r"\b[A-Z]{2}[ -]?\d{2}[ -]?\d{4}[ -]?\d{7}\b",
        "keywords": ["driving license", "DL", "license number"]
    },
    "Passport": {
        "regex": r"\b[A-Z]{1}[0-9]{7}\b",
        "keywords": ["passport", "passport number"]
    },
    "Address": {
        "regex": r"\d{1,5}\s[A-Za-z\s]+(?:\s(?:Street|St\.|Road|Rd\.|Avenue|Ave\.|Boulevard|Blvd\.|Lane|Ln\.|Drive|Dr\.|Sector|Block|Colony|Nagar|Garden|Park|Apartment|Tower|Building|Room|House))\b(?:,\s[A-Za-z\s]+(?:\s[A-Za-z\s]+)*(?:,\s(?:[A-Za-z\s]+))?)?(?:\s(?:\d{5}(?:[-\s]\d{4})?)?)?",
        "keywords": ["Street", "St.", "Road", "Rd.", "Avenue", "Ave.", "Boulevard", "Blvd.", "Lane", "Ln.", "Drive", "Dr.", "City", "State", "Zip Code", "Country", "Sector", "Block", "Colony", "Nagar", "Garden", "Park", "Apartment", "Tower", "Building", "Room", "House"]
    },
    "Date of Birth": {
        "regex":  r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{2}[/-]\d{2}|\d{2}[ ]\w{3}[ ]\d{4}|\b\d{2}/\d{2}/\d{4}\b)\b",
        "keywords": ["date of birth", "DOB", "birth date", "born on", "born", "dob", "Year of Birth"]
    },
    "Date of Issue": {
        "regex": r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{2}[/-]\d{2}|\d{2}[ ]\w{3}[ ]\d{4}|\b\d{2}/\d{2}/\d{4}\b)\b",
        "keywords": ["date of issue", "issue date", "DOI", "issued on","Date of Issue"]
    }
}

def extract_text_with_boxes(image_path):
    """Extract text and bounding boxes from an image file using OCR."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"Failed to load image: {image_path}")
        return []
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    d = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT)
    text_boxes = []
    num_boxes = len(d['text'])
    for i in range(num_boxes):
        if int(d['conf'][i]) > 0:  # Filter out low-confidence OCR results
            (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
            text_boxes.append((x, y, w, h, d['text'][i]))
    return text_boxes

def preprocess_image_for_qr_detection(img):
    """Preprocess image to improve QR code detection."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    binarized = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return binarized

def redact_qr_codes(img, redact_mode):
    """Redact QR codes in an image based on the chosen redaction mode."""
    preprocessed_img = preprocess_image_for_qr_detection(img)
    decoded_qrs = decode(preprocessed_img)
    
    if decoded_qrs:
        for qr in decoded_qrs:
            points = qr.polygon
            if len(points) == 4:
                pts = np.array([(point.x, point.y) for point in points], dtype=np.int32)
                x, y, w, h = cv2.boundingRect(pts)

                if redact_mode == 'blank':
                    # Black out the QR code
                    cv2.fillPoly(img, [pts], (0, 0, 0))
                    print(f"Redacted a QR code with black box at points: {pts.tolist()}")
                elif redact_mode == 'blur':
                    # Blur the QR code
                    apply_strong_blur(img, x, y, w, h)
                    print(f"Redacted a QR code with blur at points: {pts.tolist()}")
            else:
                print(f"QR code detected but not in polygon format: {points}")
    else:
        print("No QR code detected. Check if the QR code is clear and well-positioned.")

def redact_text(text):
    """Determine if the text matches any PII pattern and needs redaction."""
    # Priority: Check for dates first (DOB and DOI)
    for category in ["Date of Birth", "Date of Issue"]:
        data = PII_PATTERNS[category]
        if data["regex"] and re.search(data["regex"], text, re.IGNORECASE):
            if category == "Date of Birth":
                redact_dob = input("Date of Birth detected. Do you want to redact it? (yes/no): ").strip().lower()
                if redact_dob == 'yes':
                    return True, category
                else:
                    return False, None
            return True, category

    # Check other PII patterns after dates
    for category, data in PII_PATTERNS.items():
        if category in ["Date of Birth", "Date of Issue"]:
            continue  # Skip date patterns as they are already checked

        if data["regex"] and re.search(data["regex"], text, re.IGNORECASE):
            return True, category

    # Check for keywords if no regex match found
    for category, data in PII_PATTERNS.items():
        if data["keywords"]:
            for keyword in data["keywords"]:
                if keyword.lower() in text.lower():
                    return True, category

    return False, None

def redact_image(image_path, redact_mode):
    """Redact PII data from an image."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error loading image: {image_path}")
        return
    
    text_boxes = extract_text_with_boxes(image_path)
    for x, y, w, h, text in text_boxes:
        to_redact, category = redact_text(text)
        if to_redact:
            print(f"Redacting {category}: '{text}' at location {(x, y, w, h)}")
            if redact_mode == 'blank':
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 0), -1)
            elif redact_mode == 'blur':
                apply_strong_blur(img, x, y, w, h)
            print(f"Successfully redacted {category} in the specified area: {(x, y, w, h)}")

    redact_qr_codes(img, redact_mode)

    output_path = f"redacted_{os.path.basename(image_path)}"
    cv2.imwrite(output_path, img)
    print(f"Redacted image saved at {output_path}")

def apply_strong_blur(img, x, y, w, h, block_size=10):
    """Apply a strong blur effect by pixelation."""
    roi = img[y:y + h, x:x + w]
    temp = cv2.resize(roi, (block_size, block_size), interpolation=cv2.INTER_LINEAR)
    strong_blurred = cv2.resize(temp, (w, h), interpolation=cv2.INTER_NEAREST)
    img[y:y + h, x:x + w] = strong_blurred
    print(f"Pixelation applied to area: {(x, y, w, h)} with block size: {block_size}")

def redact_pdf(pdf_path, redact_mode):
    """Redact PII data from a PDF file."""
    doc = fitz.open(pdf_path)
    for page_num in range(doc.page_count):
        page = doc[page_num]
        pix = page.get_pixmap()
        img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)
        temp_img_path = f"temp_page_{page_num}.png"
        cv2.imwrite(temp_img_path, img_array)
        redact_image(temp_img_path, redact_mode)
        redacted_img = cv2.imread(f"redacted_{temp_img_path}")
        if redacted_img is not None:
            pix = fitz.Pixmap(fitz.csRGB, redacted_img.shape[1], redacted_img.shape[0], redacted_img)
            page.insert_image(page.rect, pixmap=pix)
    redacted_pdf_path = f"redacted_{os.path.basename(pdf_path)}"
    doc.save(redacted_pdf_path)
    doc.close()
    print(f"Redacted PDF saved at {redacted_pdf_path}")

def main():
    parser = argparse.ArgumentParser(description="PII Redaction Tool")
    parser.add_argument("file", help="Input image or PDF file to redact")
    args = parser.parse_args()

    redact_mode = input("Choose redaction mode ('blank' or 'blur'): ").strip().lower()
    if redact_mode not in ['blank', 'blur']:
        print("Invalid redaction mode. Please choose either 'blank' or 'blur'.")
        return

    if args.file.lower().endswith('.pdf'):
        redact_pdf(args.file, redact_mode)
    elif args.file.lower().endswith(('.png', '.jpg', '.jpeg')):
        redact_image(args.file, redact_mode)
    else:
        print("Unsupported file type. Please provide an image or PDF file.")

if __name__ == "__main__":
    main()


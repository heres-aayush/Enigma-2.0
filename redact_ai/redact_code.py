import cv2
import fitz  # PyMuPDF
import pytesseract
import numpy as np
import argparse
import re
import os
from pyzbar.pyzbar import decode

# Configure Tesseract path if necessary
tesseract_cmd = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

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
    for category, data in PII_PATTERNS.items():
        if data["regex"] and re.search(data["regex"], text, re.IGNORECASE):
            return True, category

    for category, data in PII_PATTERNS.items():
        if data["keywords"]:
            for keyword in data["keywords"]:
                if keyword.lower() in text.lower():
                    return True, category

    return False, None

def apply_strong_blur(img, x, y, w, h, kernel_size=(51, 51), sigma=30):
    """Apply a strong Gaussian blur to a specified area in the image."""
    # Extract the region of interest (ROI)
    roi = img[y:y + h, x:x + w]
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(roi, kernel_size, sigma)
    img[y:y + h, x:x + w] = blurred

def redact_image(image_path, output_path, redact_mode):
    """Redact PII data and QR codes in an image file and save the redacted image."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"Failed to load image: {image_path}")
        return
    
    # Redact PII data
    text_boxes = extract_text_with_boxes(image_path)
    for (x, y, w, h, text) in text_boxes:
        redact, category = redact_text(text)
        if redact:
            print(f"Redacting {category}: {text} at location {x}, {y}, {w}, {h}")
            if redact_mode == 'blank':
                cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 0), -1)  # Black out the text
            elif redact_mode == 'blur':
                apply_strong_blur(img, x, y, w, h, kernel_size=(51, 51), sigma=30)

    # Redact QR codes with the chosen mode
    redact_qr_codes(img, redact_mode)

    # Save the redacted image
    cv2.imwrite(output_path, img)
    print(f"Redacted image saved to {output_path}")

def redact_pdf(pdf_path, output_path, redact_mode):
    """Redact PII data in a PDF file and save the redacted PDF."""
    pdf_doc = fitz.open(pdf_path)
    for page_num in range(pdf_doc.page_count):
        page = pdf_doc[page_num]
        pix = page.get_pixmap()
        image_path = f"temp_page_{page_num}.png"
        pix.save(image_path)

        redacted_image_path = f"redacted_{image_path}"
        redact_image(image_path, redacted_image_path, redact_mode)

        img = fitz.open(redacted_image_path)
        rect = fitz.Rect(0, 0, img.width, img.height)
        page.insert_image(rect, filename=redacted_image_path)

        os.remove(image_path)
        os.remove(redacted_image_path)

    pdf_doc.save(output_path)
    pdf_doc.close()
    print(f"Redacted PDF saved to {output_path}")

def main():
    parser = argparse.ArgumentParser(description='Redact PII from images and PDFs.')
    parser.add_argument('input_file', type=str, help='Input image or PDF file')
    parser.add_argument('output_file', type=str, help='Output file for the redacted result')
    args = parser.parse_args()

    # Ask the user for redaction method
    redact_mode = input("Choose redaction method - 'blank' for black rectangle or 'blur' for blurring: ").strip().lower()
    while redact_mode not in ['blank', 'blur']:
        print("Invalid choice. Please enter 'blank' or 'blur'.")
        redact_mode = input("Choose redaction method - 'blank' for black rectangle or 'blur' for blurring: ").strip().lower()

    if args.input_file.lower().endswith(('.png', '.jpg', '.jpeg')):
        redact_image(args.input_file, args.output_file, redact_mode)
    elif args.input_file.lower().endswith('.pdf'):
        redact_pdf(args.input_file, args.output_file, redact_mode)
    else:
        print("Unsupported file format. Please provide an image or PDF file.")

if __name__ == "__main__":
    main()

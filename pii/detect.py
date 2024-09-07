import cv2
import fitz  # PyMuPDF
import pytesseract
import numpy as np
import argparse
import re
import os
from pyzbar.pyzbar import decode
import spacy
from spacy import displacy
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

    print(text_boxes)
    return text_boxes

def redact_image(image_path, redact_mode):
    """Extract PII data from an image and save the output."""
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error loading image: {image_path}")
        return
    
    text_boxes = extract_text_with_boxes(image_path)
    with open('output.txt', 'w') as file:
        for item in text_boxes:
            file.write(str(item) + '\n')

def visualize_entities(file_path):
    """Visualize named entities from text extracted from the file."""
    # Load the SpaCy model
    nlp = spacy.load('en_core_web_sm')

    # Read the text content from the file
    with open(file_path, 'r') as file:
        text = file.read()

    # Process the text
    doc = nlp(text)

    # Visualize named entities and save to an HTML file
    html = displacy.render(doc, style='ent')  # Get the HTML content
    output_path = "entities.html"  # Specify the output file path
    with open(output_path, "w") as file:
        file.write(html)

    print(f"Named entities visualization saved to {output_path}")

    # Display explanation for a specific entity label
    print(spacy.explain("PERSON"))  # Example: Explanation for a specific label

    # Print all entity labels in the model
    for label in nlp.get_pipe("ner").labels:
        print(f"{label}: {spacy.explain(label)}")

def extract_last_column(file_path):
    """Extract the last column from each line in the file."""
    last_column = []
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line:
                tuple_data = eval(line)
                last_column.append(tuple_data[-1])

    for value in last_column:
        print(value)

def main():
    parser = argparse.ArgumentParser(description="PII Extraction Tool")
    parser.add_argument("file", help="Input image or PDF file to extract text")
    args = parser.parse_args()

    if args.file.lower().endswith(('.png', '.jpg', '.jpeg')):
        redact_image(args.file, 'blank')  # We only extract text; mode is not used
    else:
        print("Unsupported file type. Please provide an image file.")

    # Visualize the named entities
    visualize_entities('output.txt')
    extract_last_column('output.txt')

if __name__ == "__main__":
    main()
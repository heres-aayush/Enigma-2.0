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

# Configure Tesseract path if necessary
tesseract_cmd = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

# PII detection patterns
PII_PATTERNS = {
    # Your regex and keyword patterns here...
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

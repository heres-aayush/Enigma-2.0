"""from flask import Flask, request, jsonify, send_file
import os
import cv2
import pytesseract
import spacy
from spacy import displacy

app = Flask(__name__)

# Configure Tesseract path if necessary
#tesseract_cmd = os.getenv('TESSERACT_CMD', '/usr/bin/tesseract')
#pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

def extract_text_with_boxes(image_path):
    #Extract text and bounding boxes from an image file using OCR."""
"""   img = cv2.imread(image_path)
    if img is None:
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

@app.route('/process', methods=['POST'])
def process_file():
    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)
    
    text_boxes = extract_text_with_boxes(file_path)
    
    output_txt_path = 'output.txt'
    with open(output_txt_path, 'w') as f:
        for item in text_boxes:
            f.write(str(item) + '\n')
    
    return send_file(output_txt_path, as_attachment=True)

@app.route('/visualize', methods=['POST'])
def visualize_entities():
    nlp = spacy.load('en_core_web_sm')
    
    with open('output.txt', 'r') as f:
        text = f.read()
    
    doc = nlp(text)
    html = displacy.render(doc, style='ent')
    
    output_html_path = 'entities.html'
    with open(output_html_path, 'w') as f:
        f.write(html)
    
    return send_file(output_html_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)"""
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import detect.py # Import your existing redaction code
from unittest.mock import patch

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['REDACTED_FOLDER'] = 'redacted/'

# Ensure the folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['REDACTED_FOLDER'], exist_ok=True)

@app.route('/redact_image', methods=['POST'])
def redact_image_api():
    try:
        # Ensure the file is provided
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        redact_mode = request.form.get('redact_mode', 'blank')  # Default redaction mode to 'blank'
        dob_redact = request.form.get('dob_redact', 'no')  # Form value for redacting DOB

        # Save the uploaded file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Mock input for Date of Birth redaction decision using patch
        def mock_input(prompt):
            if "Date of Birth" in prompt:
                return dob_redact  # Return the form value as the user's response
            return "no"

        # Patch the built-in input() function to simulate the decision
        with patch('builtins.input', mock_input):
            detect.redact_image(file_path, redact_mode)  # Call the existing redaction function

        # Move the redacted file to the redacted folder
        redacted_filename = f"redacted_{filename}"
        redacted_file_path = os.path.join(app.config['REDACTED_FOLDER'], redacted_filename)
        
        # Check if the redacted file exists and move it
        if os.path.exists(f"redacted_{filename}"):
            os.rename(f"redacted_{filename}", redacted_file_path)
            return jsonify({'message': 'Image redacted successfully', 'file': f'/redacted/{redacted_filename}'}), 200
        else:
            return jsonify({'error': 'Redacted file not found'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Serve redacted files
@app.route('/redacted/<filename>', methods=['GET'])
def get_redacted_file(filename):
    return send_from_directory(app.config['REDACTED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import redact_code  # Import your existing redaction code
from unittest.mock import patch
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'uploads/'

"""# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])"""

# Directory to store processed files
PROCESSED_FOLDER = os.path.join(os.getcwd())
if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

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
            redact_code.redact_image(file_path, redact_mode)  # Call the existing redaction function

        # Check if the redacted file exists
        redacted_file_path = f"redacted_{filename}"
        if os.path.exists(redacted_file_path):
            return jsonify({'message': 'Image redacted successfully', 'file': redacted_file_path}), 200
        else:
            return jsonify({'error': 'Redacted file not found'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
from flask import send_file

from flask import send_from_directory
"""
# Assuming 'processed_files' folder is in the root directory of your Flask project
PROCESSED_FOLDER = os.path.join(os.getcwd(), 'processed_files')
if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)

# Route to download the file
@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)
"""

# Route to download the file
@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(PROCESSED_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, jsonify,  send_file, request
from  flask_cors import CORS
import os
from ultralytics import YOLO
import tempfile

model = YOLO('best.pt')  

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    try:
        with open("traffic.txt", "r") as file:
            data = file.read().splitlines()
        filtered_data = [line for line in data if line.strip()]
        return jsonify(filtered_data)
    except FileNotFoundError:
        return jsonify({"error": "File traffic.txt not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
img_dir = "./static"
@app.route('/im2')
def myapp():
    img_path = os.path.join("static", "output1.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404
    

@app.route('/im1')
def myapp1():
    img_path = os.path.join("static", "output2.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404
    
@app.route("/send", methods=['POST'])
def process_img():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        image_file = request.files['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            image_path = tmp.name
            image_file.save(image_path)
        results = model.predict(image_path, save=False)
        detections = []
        for box in results[0].boxes:
            detection = {
                'class': int(box.cls[0]),
                'confidence': float(box.conf[0]),
                'bbox': [float(coord) for coord in box.xyxy[0]]
            }
            detections.append(detection)
            print(f"Detected class: {detection['class']}, Confidence: {detection['confidence']}, BBox: {detection['bbox']}")

        os.remove(image_path)

        return jsonify({'results': detections})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
img_dir = "./static"
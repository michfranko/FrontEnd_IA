from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
from datetime import datetime
import os
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO
import psycopg2
import tempfile

# --- Model and App Initialization ---
model = YOLO('best.pt')
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- Database Connection ---
def get_db_connection():
    return psycopg2.connect(
        dbname="midb",
        user="usuario",
        password="123",
        host="localhost",
        port="5432"
    )

def save_analysis(image1, image2, count_a, count_b, traffic_signal):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO analysis_history (image_url_1, image_url_2, vehicle_count_a, vehicle_count_b, traffic_signal)
            VALUES (%s, %s, %s, %s, %s)
        """, (image1, image2, count_a, count_b, traffic_signal))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error saving analysis to DB: {e}")

# --- Image Processing Helper ---
def process_image_in_memory(image_file):
    """Reads an image file from the request, decodes it, and runs prediction."""
    image_data = image_file.read()
    nparr = np.frombuffer(image_data, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img_np is None:
        return None, None
        
    results = model.predict(img_np, save=False, verbose=False)
    
    detections = []
    for box in results[0].boxes:
        detection = {
            'class': int(box.cls[0]),
            'confidence': float(box.conf[0]),
            'bbox': [float(coord) for coord in box.xyxy[0]]
        }
        detections.append(detection)
        
    img_with_boxes = results[0].plot()
    if isinstance(img_with_boxes, Image.Image):
        img_with_boxes = np.array(img_with_boxes)
        
    return detections, img_with_boxes

# --- API Endpoints ---
@app.route("/api/")
def hello_world():
    try:
        with open("traffic.txt", "r") as file:
            data = file.read().splitlines()
        return jsonify([line for line in data if line.strip()])
    except FileNotFoundError:
        return jsonify({"error": "File traffic.txt not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/send1", methods=['POST'])
def process_img1():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    detections, img_with_boxes = process_image_in_memory(request.files['image'])
    if detections is None:
        return jsonify({'error': 'Could not decode image'}), 400

    output_path = os.path.join("static", "output1.png")
    cv2.imwrite(output_path, cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR))
    
    try:
        with open("traffic.txt", "r+") as f:
            lines = f.readlines()
            while len(lines) < 5:
                lines.append("\n")
            lines[1] = str(model.names) + "\n"
            lines[3] = str(len(detections)) + "\n"
            f.seek(0)
            f.writelines(lines)
            f.truncate()
    except FileNotFoundError:
        # Create the file if it doesn't exist
        with open("traffic.txt", "w") as f:
            f.write("\n" * 5) # Create 5 empty lines
            f.seek(0)
            lines = ["\n"]*5
            lines[1] = str(model.names) + "\n"
            lines[3] = str(len(detections)) + "\n"
            f.writelines(lines)


    return jsonify({'results': detections, 'url': '/api/image/output1.png'})

@app.route("/api/send2", methods=['POST'])
def process_img2():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    detections, img_with_boxes = process_image_in_memory(request.files['image'])
    if detections is None:
        return jsonify({'error': 'Could not decode image'}), 400

    output_path = os.path.join("static", "output2.png")
    cv2.imwrite(output_path, cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR))

    try:
        with open("traffic.txt", "r+") as f:
            lines = f.readlines()
            while len(lines) < 5:
                lines.append("\n")
            
            lines[2] = str(model.names) + "\n"
            lines[4] = str(len(detections)) + "\n"

            countA = int(lines[3].strip() or 0)
            countB = int(lines[4].strip() or 0)

            if countA > countB:
                lines[0] = "13\n"
            elif countA < countB:
                lines[0] = "23\n"
            else:
                lines[0] = "12\n"
            
            f.seek(0)
            f.writelines(lines)
            f.truncate()
            
            save_analysis(
                image1="output1.png",
                image2="output2.png",
                count_a=countA,
                count_b=countB,
                traffic_signal=lines[0].strip()
            )
    except (FileNotFoundError, IndexError, ValueError) as e:
        return jsonify({'error': f'Error processing traffic.txt: {e}'}), 500

    return jsonify({'results': detections, 'url': '/api/im2'})

# --- Static File Endpoints ---
@app.route('/api/im1')
def get_image1():
    return send_file(os.path.join("static", "output1.png"), mimetype='image/png')

@app.route('/api/im2')
def get_image2():
    return send_file(os.path.join("static", "output2.png"), mimetype='image/png')

@app.route('/api/image/<filename>')
def get_image(filename):
    return send_file(os.path.join("static", filename), mimetype='image/png')

@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, analysis_date, image_url_1, image_url_2, vehicle_count_a, vehicle_count_b, traffic_signal
            FROM analysis_history ORDER BY analysis_date DESC
        """)
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        result = [dict(zip(columns, row)) for row in rows]

        for r in result:
            r["image_url_1"] = f"/api/image/{r['image_url_1']}"
            r["image_url_2"] = f"/api/image/{r['image_url_2']}"

        cur.close()
        conn.close()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)

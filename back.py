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





model = YOLO('best.pt')

app = Flask(__name__)
CORS(app)

filename1 = "output1.png"


def generate_filename(prefix="image"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    return f"{prefix}_{timestamp}.png"


# Configura tu conexión a PostgreSQL
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





@app.route("/api/")
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


@app.route('/api/im2')
def get_image2():
    img_path = os.path.join("static", "output2.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404


@app.route('/api/im1')
def get_image1():
    img_path = os.path.join("static", "output1.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404

#Dinamico a las imagenes para el historial
@app.route('/api/image/<filename>')
def get_image(filename):
    img_path = os.path.join("static", filename)
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": f"Image '{filename}' not found"}), 404


@app.route("/api/send", methods=['POST'])
def process_img():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        # Guardar temporalmente la imagen recibida
        image_file = request.files['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            image_path = tmp.name
            image_file.save(image_path)

        # Realizar la predicción
        results = model.predict(image_path, save=False)
        detections = []
        for box in results[0].boxes:
            detection = {
                'class': int(box.cls[0]),
                'confidence': float(box.conf[0]),
                'bbox': [float(coord) for coord in box.xyxy[0]]
            }
            detections.append(detection)

        # Dibujar los resultados en la imagen
        img_with_boxes = results[0].plot()

        # Convertir a formato OpenCV
        if isinstance(img_with_boxes, Image.Image):
            img_with_boxes = np.array(img_with_boxes)

        # Guardar la imagen procesada en static
        output_path = os.path.join("static", "output.png")
        cv2.imwrite(output_path, cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR))

        # Limpiar archivo temporal
        os.remove(image_path)

        return jsonify({'results': detections})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



import json  # para convertir objetos a texto plano

@app.route("/api/send1", methods=['POST'])
def process_img1():
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

        img_with_boxes = results[0].plot()
        if isinstance(img_with_boxes, Image.Image):
            img_with_boxes = np.array(img_with_boxes)

        filename1 = generate_filename("output1")
        output_path = os.path.join("static", filename1)

        cv2.imwrite(output_path, cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR))

        # Leer archivo existente
        traffic_file = "traffic.txt"
        with open(traffic_file, "r", encoding="utf-8") as f:
            lineas = f.readlines()

        # Asegurar al menos 5 líneas
        while len(lineas) < 5:
            lineas.append("\n")

        # Modificar línea 2 y 4 (índice 1 y 3)
        lineas[1] = str(results[0].names) + "\n"
        lineas[3] = str(len(detections)) + "\n"
        print(results)

        # Escribir de vuelta
        with open(traffic_file, "w", encoding="utf-8") as f:
            f.writelines(lineas)

        os.remove(image_path)

        return jsonify({'results': detections})

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route("/api/send2", methods=['POST'])
def process_img2():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        # Guardar temporalmente la imagen recibida
        image_file = request.files['image']
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            image_path = tmp.name
            image_file.save(image_path)

        # Realizar la predicción
        results = model.predict(image_path, save=False)
        detections = []
        for box in results[0].boxes:
            detection = {
                'class': int(box.cls[0]),
                'confidence': float(box.conf[0]),
                'bbox': [float(coord) for coord in box.xyxy[0]]
            }
            detections.append(detection)

        # Dibujar los resultados en la imagen
        img_with_boxes = results[0].plot()

        # Convertir a formato OpenCV
        if isinstance(img_with_boxes, Image.Image):
            img_with_boxes = np.array(img_with_boxes)

         # Leer archivo existente
        traffic_file = "traffic.txt"
        with open(traffic_file, "r", encoding="utf-8") as f:
            lineas = f.readlines()

        # Asegurar al menos 5 líneas
        while len(lineas) < 5:
            lineas.append("\n")

        # Modificar línea 2 y 4 (índice 1 y 3)
        lineas[2] = str(results[0].names) + "\n"
        lineas[4] = str(len(detections)) + "\n"
        print(results)
        
        # Guardar la imagen procesada en static
        filename2 = generate_filename("output2")
        output_path = os.path.join("static", filename2)

        cv2.imwrite(output_path, cv2.cvtColor(img_with_boxes, cv2.COLOR_RGB2BGR))

        # Limpiar archivo temporal
        os.remove(image_path)

        # Asegúrate de convertir a enteros para comparar correctamente
        countA = int(lineas[3].strip())
        countB = int(lineas[4].strip())

        if countA > countB:
            lineas[0] = "13\n"  # Encender verde calle A
        elif countA < countB:
            lineas[0] = "23\n"  # Encender verde calle B
        else:
            lineas[0] = "12\n"  # Ambos en amarillo o modo espera


        # Escribir de vuelta
        with open(traffic_file, "w", encoding="utf-8") as f:
            f.writelines(lineas)

        save_analysis(
            image1=filename1,
            image2=filename2,
            count_a=countA,
            count_b=countB,
            traffic_signal=lineas[0].strip()
        )

        return jsonify({'results': detections})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/imTest')
def get_processed_image():
    img_path = os.path.join("static", "output.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404

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

        # Añade la URL completa para cada imagen
        for r in result:
            r["image_url_1"] = f"/api/image/{r['image_url_1']}"
            r["image_url_2"] = f"/api/image/{r['image_url_2']}"


        cur.close()
        conn.close()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)

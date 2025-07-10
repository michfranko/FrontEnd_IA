from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
import os
import cv2
import numpy as np
from PIL import Image
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


@app.route('/im2')
def get_image2():
    img_path = os.path.join("static", "output2.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404


@app.route('/im1')
def get_image1():
    img_path = os.path.join("static", "output1.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404


@app.route("/send", methods=['POST'])
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

@app.route("/send1", methods=['POST'])
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

        output_path = os.path.join("static", "output1.png")
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



@app.route("/send2", methods=['POST'])
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
        output_path = os.path.join("static", "output2.png")
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

        return jsonify({'results': detections})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/imTest')
def get_processed_image():
    img_path = os.path.join("static", "output.png")
    try:
        return send_file(img_path, mimetype='image/png')
    except FileNotFoundError:
        return jsonify({"error": "Image not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)

from flask import Flask, jsonify,  send_file
from  flask_cors import CORS
import os


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
    
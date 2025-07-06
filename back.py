from flask import Flask, jsonify
from  flask_cors import CORS

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
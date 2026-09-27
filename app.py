import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

from agents.supervisor import SupervisorAgent

load_dotenv()

app = Flask(__name__)
supervisor = SupervisorAgent()


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/scan")
def scan():
    payload = request.get_json(silent=True) or {}
    url = (payload.get("url") or "").strip()

    if not url:
        return jsonify({"error": "Please enter a URL."}), 400

    try:
        result = supervisor.run(url)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
    )

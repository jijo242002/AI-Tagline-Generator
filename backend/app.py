import os
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")
HF_MODEL_NAME = os.getenv("HF_MODEL_NAME", "gpt2")  # fallback model

app = Flask(__name__)
CORS(app)

DB_NAME = "taglines.db"


# ---------- Database ----------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Create table with all necessary fields
    c.execute("""
        CREATE TABLE IF NOT EXISTS taglines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            description TEXT,
            audience TEXT,
            tone TEXT,
            tagline TEXT
        )
    """)
    conn.commit()
    conn.close()


def add_tagline(product_name, description, audience, tone, tagline):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute(
        "INSERT INTO taglines (product_name, description, audience, tone, tagline) VALUES (?, ?, ?, ?, ?)",
        (product_name, description, audience, tone, tagline),
    )
    conn.commit()
    conn.close()


def get_history():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT id, product_name, description, audience, tone, tagline FROM taglines ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    return [
        {
            "id": row[0],
            "product_name": row[1],
            "description": row[2],
            "audience": row[3],
            "tone": row[4],
            "tagline": row[5],
        }
        for row in rows
    ]


# ---------- Hugging Face ----------
def generate_taglines(prompt, count=3):
    url = f"https://api-inference.huggingface.co/models/{HF_MODEL_NAME}"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": prompt}

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        print("HF API error:", response.text)
        return [f"Error: {response.text}"]

    data = response.json()

    # Handle HF response format
    outputs = []
    if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
        text = data[0]["generated_text"]
        outputs = [line.strip("-• \n") for line in text.split("\n") if line.strip()]
    elif isinstance(data, dict) and "generated_text" in data:
        outputs = [data["generated_text"]]

    return outputs[:count]


# ---------- Routes ----------
@app.route("/tagline", methods=["POST"])
def tagline():
    data = request.json
    name = data.get("name", "")
    description = data.get("description", "")
    audience = data.get("audience", "")
    tone = data.get("tone", "Casual")
    count = int(data.get("count", 3))

    prompt = f"""
    Suggest {count} catchy marketing taglines for the following product.
    Name: {name}
    Description: {description}
    Target Audience: {audience}
    Tone: {tone}
    Return only the taglines as a list.
    """

    taglines = generate_taglines(prompt, count)

    for tagline in taglines:
        add_tagline(name, description, audience, tone, tagline)

    return jsonify({"taglines": taglines})


@app.route("/history", methods=["GET"])
def history():
    return jsonify({"history": get_history()})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)

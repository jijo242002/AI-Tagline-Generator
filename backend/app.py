import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

HF_API_KEY = os.getenv("HF_API_KEY")

# Use full Hugging Face model paths
MODELS = ["openai-community/gpt2", "openai-community/distilgpt2"]

HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}


def generate_with_hf(model, inputs):
    """Send request to Hugging Face Inference API"""
    try:
        response = requests.post(
            f"https://api-inference.huggingface.co/models/{model}",
            headers=HEADERS,
            json={"inputs": inputs},
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        # Hugging Face returns a list with generated_text
        if isinstance(data, list) and "generated_text" in data[0]:
            return data[0]["generated_text"]
        else:
            return None
    except Exception as e:
        print(f"Error with model {model}: {e}")
        return None


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    product = data.get("product", "")
    description = data.get("description", "")
    audience = data.get("audience", "")
    tone = data.get("tone", "professional")
    num_taglines = int(data.get("numTaglines", 3))

    prompt = (
        f"Generate {num_taglines} catchy, {tone} taglines for a product.\n"
        f"Product: {product}\n"
        f"Description: {description}\n"
        f"Target Audience: {audience}\n\nTaglines:\n"
    )

    # Try models in order
    for model in MODELS:
        print(f"Trying model: {model}")
        output = generate_with_hf(model, prompt)
        if output:
            taglines = [
                line.strip(" -•\n")
                for line in output.split("\n")
                if line.strip() and not line.lower().startswith("taglines")
            ][:num_taglines]

            return jsonify({"taglines": taglines})

    return jsonify({"error": "❌ All Hugging Face models failed"}), 500


if __name__ == "__main__":
    app.run(debug=True)

from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables (optional if you hardcode API key)
load_dotenv()

compare_bp = Blueprint("compare_bp", __name__)

# Use environment variable if available, otherwise fallback to hardcoded (not recommended for production)
API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDtbe2b0_xF_9QCb1L0ZNhoQvp9oCC51aA")

genai.configure(api_key=API_KEY)

# Initialize the model with a system instruction
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction=(
        "You are an expert automotive engineer specializing in classic muscle cars. "
        "Provide clear, concise, and technically accurate explanations about car components—"
        "such as engines (V6, V7, V8), transmissions, brakes, suspension, exhaust, and wheels. "
        "Tailor responses to the specific part and car context mentioned in the user's question. "
        "Avoid markdown. Use professional yet accessible language."
    )
)

# In your Flask blueprint file

@compare_bp.route("/api/part-insight", methods=["POST"])
def get_part_insight():
    """
    Accepts JSON: { "carKey": "Mustang1968", "part": "engine" }
    Returns: { "answer": "..." }
    """
    data = request.get_json()
    if not data or "carKey" not in data or "part" not in data:
        return jsonify({"error": "Missing 'carKey' or 'part' in request body"}), 400

    car_key = data["carKey"]
    part = data["part"].lower()

    # Simulate known car info (should ideally come from shared config or DB)
    CAR_INFO = {
        "Car": {"name": "Classic Car", "model": "1965", "engine": "V6", "brake": "BRAKE1"},
        "Gt": {"name": "GT Sports", "model": "1967", "engine": "V7", "brake": "BRAKE1"},
        "Mustang1968": {"name": "Mustang 1968", "model": "1968", "engine": "V8", "brake": "BRAKE1"},
    }

    if car_key not in CAR_INFO:
        return jsonify({"error": "Unknown car key"}), 400

    car = CAR_INFO[car_key]
    car_display = f"{car['name']} ({car['model']})"

    # Build part-specific prompt
    if part == "engine":
        prompt = f"What is special or notable about the {car['engine']} engine in the {car_display}? Explain its design, performance, and historical significance in classic muscle cars."
    elif part == "brakes":
        prompt = f"Describe the braking system ({car['brake']}) used in the {car_display}. How does it perform for a classic muscle car of its era?"
    elif part == "transmission":
        prompt = f"What type of transmission was typically used in the {car_display}, and how did it affect driving dynamics?"
    elif part == "suspension":
        prompt = f"Explain the suspension setup of the {car_display}. How did it handle road conditions and cornering for its time?"
    elif part == "exhaust":
        prompt = f"Describe the exhaust system of the {car_display}. What sound and performance characteristics did it provide?"
    elif part == "wheels":
        prompt = f"What wheels and tires were standard on the {car_display}, and how did they contribute to its aesthetics and performance?"
    else:
        prompt = f"Explain the {part} system of the {car_display} in the context of classic 1960s muscle cars."

    try:
        response = model.generate_content(prompt)
        answer = response.text.strip() if response.text else "No details available."
    except Exception as e:
        print(f"AI Generation Error: {e}")
        answer = "Sorry, I couldn't generate a response at this time."

    return jsonify({"answer": answer})
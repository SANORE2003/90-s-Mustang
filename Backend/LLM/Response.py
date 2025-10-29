from flask import Blueprint, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Create Blueprint
response_bp = Blueprint("response_bp", __name__)

# Configure Gemini API key from environment variable
API_KEY = "AIzaSyDtbe2b0_xF_9QCb1L0ZNhoQvp9oCC51aA"

genai.configure(api_key=API_KEY)

# Define the model with a persona and generation settings
model = genai.GenerativeModel(
    "gemini-2.5-flash", 
    system_instruction=(
        "You are a knowledgeable and friendly AI assistant who will ONLY answer questions related to cars and nothing else. "
        "You provide clear, structured, and technically accurate responses. "
        "Keep explanations concise but complete. If the question is not about cars, politely decline to answer."
    )
)

def ask_gemini(prompt: str) -> str:
    """Send a user prompt to the Gemini model and return its response."""
    try:
        response = model.generate_content(prompt)
        # Handle cases where response is blocked or empty
        if not response.text:
            return "I'm unable to answer that question about cars right now."
        return response.text.strip()
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"

@response_bp.route("/ask", methods=["POST"])
def ask_car_question():
    """
    Accepts a JSON payload with a 'question' field,
    validates it, and returns an AI-generated response about cars.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body must be valid JSON"}), 400

        question = data.get("question")
        if not question or not isinstance(question, str) or not question.strip():
            return jsonify({"error": "Missing or invalid 'question' field"}), 400

        # Send to Gemini
        answer = ask_gemini(question.strip())

        return jsonify({
            "success": True,
            "question": question.strip(),
            "answer": answer
        }), 200

    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
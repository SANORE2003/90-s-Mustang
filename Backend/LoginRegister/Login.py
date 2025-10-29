from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import check_password_hash
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get environment variables
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB")

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db["users"]

# Create Blueprint
login_bp = Blueprint("login_bp", __name__)

# Route for user login
@login_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Validate inputs
    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    # Check if user exists
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401

    # Verify password
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password."}), 401

    # Success
    return jsonify({
        "message": "Login successful!",
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }), 200

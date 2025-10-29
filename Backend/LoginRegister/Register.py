from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
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
register_bp = Blueprint("register_bp", __name__)

@register_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not name or not email or not password:
        return jsonify({"error": "All fields (name, email, password) are required."}), 400

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already registered."}), 400

    # Hash password before saving
    hashed_password = generate_password_hash(password)

    # Insert new user
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password
    }
    users_collection.insert_one(user_data)

    return jsonify({"message": "User registered successfully!"}), 201

from dotenv import load_dotenv
import os
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# Get environment variables
PORT = os.getenv("PORT")
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB")
FRONTEND_URL = os.getenv("FRONTEND_URL")

# Connect to MongoDB
try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]  # use the DB name from environment
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
    db = None

class Config:
    PORT = PORT
    MONGO_URI = MONGO_URI
    FRONTEND_URL = FRONTEND_URL
    DB = db

import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

MONGODB_URI = os.environ.get("MONGODB_URI")
MONGODB_DB = os.environ.get("MONGODB_DB", "Deepfake_Detection_Project")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is not configured in backend/.env")

mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
database = mongo_client[MONGODB_DB]
users_collection = database["users"]

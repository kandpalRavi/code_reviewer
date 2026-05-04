from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "code_reviewer")

# Global variable to store database connection
db_client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    """Connect to MongoDB"""
    global db_client, database
    try:
        db_client = AsyncIOMotorClient(MONGODB_URL)
        database = db_client[DATABASE_NAME]
        # Test connection
        await database.command('ping')
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
    except Exception as e:
        print(f"❌ Error connecting to MongoDB: {e}")
        print("⚠️  Running without database - some features will be limited")

async def close_mongo_connection():
    """Close MongoDB connection"""
    global db_client
    if db_client:
        db_client.close()
        print("🔌 MongoDB connection closed")

def get_database():
    """Get database instance"""
    return database

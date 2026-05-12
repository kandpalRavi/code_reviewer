from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from datetime import datetime
from app.database import get_database
from pydantic import BaseModel

router = APIRouter()

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


def verify_password(plain_password, hashed_password):
    """Verify password"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hash password"""
    return pwd_context.hash(password)


@router.post("/register")
async def register(request: RegisterRequest):
    """Register new user"""
    db = get_database()

    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    # Check if username exists
    existing_user = await db.users.find_one({"username": request.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check if email exists
    existing_email = await db.users.find_one({"email": request.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    hashed_password = get_password_hash(request.password)
    user_data = {
        "username": request.username,
        "email": request.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }

    result = await db.users.insert_one(user_data)

    return {
        "message": "User registered successfully",
        "user": {
            "id": str(result.inserted_id),
            "username": request.username,
            "email": request.email
        }
    }


@router.post("/login")
async def login(request: LoginRequest):
    """Login with username and password"""
    db = get_database()

    if db is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    user = await db.users.find_one({"username": request.username})

    if not user or not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    return {
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    }

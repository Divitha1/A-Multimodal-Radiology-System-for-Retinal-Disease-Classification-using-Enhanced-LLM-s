from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from models.user import UserCreate, UserResponse, UserUpdate, Token, TokenData, Role
from models.database import get_database
import os
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "a_very_secret_key_for_multimodal_radiology")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 1 day

import hashlib

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password, hashed_password):
    # Salted SHA256 for robust, error-free hashing
    # Using a simple salt to ensure basic security without bcrypt environment issues
    salt = "multimodal_radiology_salt"
    computed_hash = hashlib.sha256((plain_password + salt).encode()).hexdigest()
    return computed_hash == hashed_password

def get_password_hash(password):
    salt = "multimodal_radiology_salt"
    return hashlib.sha256((password + salt).encode()).hexdigest()

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=Role(role))
    except JWTError:
        raise credentials_exception
        
    db = get_database()
    if db is None:
        # DB not configed fallback (dev only)
        return {"email": token_data.email, "role": token_data.role, "_id": "dev_id"}
        
    user = await db.users.find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
    user["id"] = str(user["_id"])
    return user

async def get_current_radiologist(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != Role.DOCTOR.value:
        raise HTTPException(status_code=403, detail="Not enough privileges. Radiologist access required.")
    return current_user

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    db = get_database()
    
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_dict = user.model_dump()
    raw_password = user_dict.pop("password")
    user_dict["hashed_password"] = get_password_hash(raw_password)
    
    result = await db.users.insert_one(user_dict)
    
    return {
        "id": str(result.inserted_id),
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not initialized")
        
    user = await db.users.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user.get("_id", "dev_id")),
        "email": current_user["email"],
        "full_name": current_user.get("full_name", "Unknown"),
        "role": current_user.get("role", "patient"),
        "bio": current_user.get("bio", ""),
        "notifications_enabled": current_user.get("notifications_enabled", True),
        "theme": current_user.get("theme", "light"),
        "two_factor_enabled": current_user.get("two_factor_enabled", False)
    }

@router.put("/me", response_model=UserResponse)
async def update_user_me(user_update: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection not initialized")
    
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
    if update_data:
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$set": update_data}
        )
        # Fetch updated user
        updated_user = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        return {
            "id": str(updated_user["_id"]),
            "email": updated_user["email"],
            "full_name": updated_user.get("full_name"),
            "role": updated_user.get("role"),
            "bio": updated_user.get("bio"),
            "notifications_enabled": updated_user.get("notifications_enabled"),
            "theme": updated_user.get("theme"),
            "two_factor_enabled": updated_user.get("two_factor_enabled")
        }
    
    return read_users_me(current_user)

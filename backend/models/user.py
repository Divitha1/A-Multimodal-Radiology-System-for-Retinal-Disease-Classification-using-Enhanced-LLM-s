from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class Role(str, Enum):
    DOCTOR = "radiologist"
    PATIENT = "patient"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Role
    bio: Optional[str] = "Radiologist with experience in retinal imaging."
    notifications_enabled: bool = True
    theme: str = "light"
    two_factor_enabled: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    theme: Optional[str] = None
    two_factor_enabled: Optional[bool] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str

class UserResponse(UserBase):
    id: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[Role] = None

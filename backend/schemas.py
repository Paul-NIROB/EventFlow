from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Registration Schemas
class RegistrationBase(BaseModel):
    event_id: int

class RegistrationResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    registered_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    date: datetime
    type: str
    description: str

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int
    creator_id: int
    created_at: datetime
    registration_count: int
    is_registered: bool
    creator: UserResponse

    class Config:
        from_attributes = True

# Auth response combined
class AuthResponse(BaseModel):
    token: str
    user: UserResponse

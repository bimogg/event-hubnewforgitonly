from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.USER
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    role: UserRole | None = None
    is_active: bool | None = None


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime


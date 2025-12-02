from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate


class AuthService:
    def __init__(self, user_repo: UserRepository | None = None) -> None:
        self.user_repo = user_repo or UserRepository()

    async def register_user(self, db: AsyncSession, user_in: UserCreate) -> User:
        existing = await self.user_repo.get_by_email(db, user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists",
            )
        hashed_password = get_password_hash(user_in.password)
        user = await self.user_repo.create(
            db,
            {
                "email": user_in.email,
                "hashed_password": hashed_password,
                "role": UserRole.USER.value,
                "resume_path": user_in.resume_path,
            },
        )
        return user

    async def authenticate_user(
        self, db: AsyncSession, email: str, password: str
    ) -> User:
        user = await self.user_repo.get_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user",
            )
        return user

    async def create_tokens(self, user: User) -> dict:
        payload = {"role": user.role}
        access_token = create_access_token(str(user.id), payload)
        refresh_token = create_refresh_token(str(user.id), payload)
        return {"access_token": access_token, "refresh_token": refresh_token}


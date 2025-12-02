import os
import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.db import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserRead
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["auth"])

# Папка для хранения резюме
RESUMES_DIR = Path("uploads/resumes")
RESUMES_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    email: str = Form(...),
    password: str = Form(...),
    resume: UploadFile = File(...),  # Теперь обязательное поле
    db: AsyncSession = Depends(get_db),
) -> User:
    """Регистрация пользователя с обязательной загрузкой резюме"""
    service = AuthService()
    
    # Проверяем, что резюме загружено
    if not resume or not resume.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Резюме обязательно для регистрации. Пожалуйста, загрузите файл резюме.",
        )
    
    # Сохраняем резюме
    resume_path = None
    if resume.filename:
        # Проверяем расширение файла
        allowed_extensions = {".pdf", ".doc", ".docx"}
        file_ext = Path(resume.filename).suffix.lower()
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Неподдерживаемый формат файла. Разрешенные форматы: {', '.join(allowed_extensions)}",
            )
        
        # Генерируем уникальное имя файла
        file_id = uuid4().hex
        file_name = f"{file_id}{file_ext}"
        file_path = RESUMES_DIR / file_name
        
        # Сохраняем файл (быстро, без буферизации)
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(resume.file, buffer, length=8192)  # Буфер 8KB для быстрой записи
            resume_path = str(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка при сохранении файла: {str(e)}",
            )
    
    # Создаем пользователя
    user_in = UserCreate(email=email, password=password, resume_path=resume_path)
    user = await service.register_user(db, user_in)
    await db.commit()
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> Token:
    service = AuthService()
    user = await service.authenticate_user(db, form_data.username, form_data.password)
    tokens = await service.create_tokens(user)
    return Token(**tokens)


@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_token: str) -> Token:
    try:
        payload = decode_token(refresh_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    access = create_access_token(user_id, {"role": payload.get("role")})
    refresh = create_refresh_token(user_id, {"role": payload.get("role")})
    return Token(access_token=access, refresh_token=refresh)



@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    return current_user

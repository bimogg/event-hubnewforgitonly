#!/usr/bin/env python3
"""
Скрипт для добавления тестового пользователя "алина" в базу данных
"""
import asyncio
import sys
from pathlib import Path

# Добавляем корневую директорию проекта в путь
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.db import get_async_session
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from sqlalchemy import select


async def add_user_alina():
    """Добавляет тестового пользователя alina@example.com"""
    async for session in get_async_session():
        try:
            # Проверяем, существует ли пользователь
            result = await session.execute(
                select(User).where(User.email == "alina@example.com")
            )
            existing_user = result.scalar_one_or_none()
            
            if existing_user:
                print(f"Пользователь {existing_user.email} уже существует (ID: {existing_user.id})")
                # Обновляем пароль на всякий случай
                existing_user.hashed_password = get_password_hash("password123")
                await session.commit()
                print("Пароль обновлен")
                return
            
            # Создаем нового пользователя
            hashed_password = get_password_hash("password123")
            new_user = User(
                email="alina@example.com",
                hashed_password=hashed_password,
                role=UserRole.USER.value,
                is_active=True,
                resume_path=None,
            )
            
            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            
            print(f"✅ Пользователь успешно создан!")
            print(f"   Email: {new_user.email}")
            print(f"   ID: {new_user.id}")
            print(f"   Пароль: password123")
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            await session.rollback()
        finally:
            await session.close()
        break


if __name__ == "__main__":
    asyncio.run(add_user_alina())


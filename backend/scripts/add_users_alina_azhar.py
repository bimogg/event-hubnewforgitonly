"""
Скрипт для добавления пользователей Алина и Ажар в базу данных
"""
import asyncio
import sys
from pathlib import Path

# Добавляем корневую директорию в путь
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.db import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from sqlalchemy import select


async def add_users():
    """Добавляет пользователей Алина и Ажар"""
    async with AsyncSessionLocal() as db:
        try:
            # Проверяем, существуют ли уже пользователи
            stmt_alina = select(User).where(User.email == "alina@eventhub.kz")
            result_alina = await db.execute(stmt_alina)
            existing_alina = result_alina.scalar_one_or_none()
            
            stmt_azhar = select(User).where(User.email == "azhar@eventhub.kz")
            result_azhar = await db.execute(stmt_azhar)
            existing_azhar = result_azhar.scalar_one_or_none()
            
            # Добавляем Алину
            if not existing_alina:
                alina = User(
                    email="alina@eventhub.kz",
                    hashed_password=get_password_hash("alina123"),
                    role=UserRole.USER.value,
                    is_active=True,
                    resume_path=None,  # Можно добавить позже
                )
                db.add(alina)
                print("✅ Пользователь Алина добавлен")
                print("   Email: alina@eventhub.kz")
                print("   Пароль: alina123")
            else:
                print("⚠️ Пользователь Алина уже существует")
            
            # Добавляем Ажар
            if not existing_azhar:
                azhar = User(
                    email="azhar@eventhub.kz",
                    hashed_password=get_password_hash("azhar123"),
                    role=UserRole.USER.value,
                    is_active=True,
                    resume_path=None,  # Можно добавить позже
                )
                db.add(azhar)
                print("✅ Пользователь Ажар добавлен")
                print("   Email: azhar@eventhub.kz")
                print("   Пароль: azhar123")
            else:
                print("⚠️ Пользователь Ажар уже существует")
            
            await db.commit()
            print("\n✅ Готово! Пользователи добавлены в базу данных.")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Ошибка: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(add_users())


#!/usr/bin/env python3
"""
Скрипт для прямого добавления событий в базу данных
Запуск: python scripts/add_events_direct.py
"""
import asyncio
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Добавляем корневую директорию в путь
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.event import Event
from app.models.user import User


async def add_events():
    # Создаем подключение к БД
    engine = create_async_engine(
        settings.DATABASE_URL,
        echo=False,
    )
    
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Получаем системного пользователя или создаем его
        result = await session.execute(
            select(User).where(User.email == "system@eventhub.kz")
        )
        system_user = result.scalar_one_or_none()
        
        if not system_user:
            # Создаем системного пользователя
            from app.core.security import get_password_hash
            system_user = User(
                email="system@eventhub.kz",
                hashed_password=get_password_hash("system_password_123"),
                full_name="System",
                role="admin",
            )
            session.add(system_user)
            await session.flush()
        
        # События за последний месяц (от 1 до 30 дней назад)
        now = datetime.now()
        
        events_data = [
            # События от Nazarbayev University
            {
                "title": "NU Winter Hackathon 2024",
                "description": "Зимний хакатон от Nazarbayev University. Разработка решений для образования и здравоохранения. Призовой фонд 3,000,000 ₸.",
                "type": "hackathon",
                "date_start": now - timedelta(days=5),
                "date_end": now - timedelta(days=3),
                "city": "Астана",
                "is_online": False,
                "requirements": "Студенты и выпускники. Команды 2-5 человек.",
                "source": "external",
                "source_url": "https://nu.edu.kz/events/winter-hackathon",
                "banner": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png",
            },
            {
                "title": "NU Data Science Workshop",
                "description": "Практический воркшоп по Data Science и машинному обучению. Работа с реальными датасетами.",
                "type": "seminar",
                "date_start": now - timedelta(days=12),
                "date_end": now - timedelta(days=12),
                "city": "Астана",
                "is_online": False,
                "requirements": "Базовые знания Python и математики",
                "source": "external",
                "source_url": "https://nu.edu.kz/events/data-science",
                "banner": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png",
            },
            {
                "title": "NU Startup Pitch Day",
                "description": "День презентаций стартапов от студентов NU. Инвесторы, менторы, нетворкинг.",
                "type": "seminar",
                "date_start": now - timedelta(days=18),
                "date_end": now - timedelta(days=18),
                "city": "Астана",
                "is_online": False,
                "requirements": "Для студентов и выпускников NU",
                "source": "external",
                "source_url": "https://nu.edu.kz/events/pitch-day",
                "banner": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png",
            },
            {
                "title": "NU Blockchain Conference",
                "description": "Конференция о блокчейне и криптовалютах. Доклады от экспертов индустрии.",
                "type": "seminar",
                "date_start": now - timedelta(days=25),
                "date_end": now - timedelta(days=25),
                "city": "Астана",
                "is_online": False,
                "requirements": "Открыто для всех",
                "source": "external",
                "source_url": "https://nu.edu.kz/events/blockchain",
                "banner": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Nazarbayev_University_logo.svg/200px-Nazarbayev_University_logo.svg.png",
            },
            # События от Astana Hub
            {
                "title": "Astana Hub Tech Meetup",
                "description": "Ежемесячная встреча tech-сообщества. Доклады о новых технологиях и трендах.",
                "type": "seminar",
                "date_start": now - timedelta(days=7),
                "date_end": now - timedelta(days=7),
                "city": "Астана",
                "is_online": False,
                "requirements": "Регистрация обязательна",
                "source": "external",
                "source_url": "https://astanahub.com/events/meetup",
                "banner": "https://astanahub.com/static/images/logo.svg",
            },
            {
                "title": "Astana Hub AI Bootcamp",
                "description": "Интенсивный курс по искусственному интеллекту. Практические задания и проекты.",
                "type": "seminar",
                "date_start": now - timedelta(days=14),
                "date_end": now - timedelta(days=10),
                "city": "Астана",
                "is_online": False,
                "requirements": "Базовые знания программирования",
                "source": "external",
                "source_url": "https://astanahub.com/events/ai-bootcamp",
                "banner": "https://astanahub.com/static/images/logo.svg",
            },
            {
                "title": "Astana Hub Startup Battle",
                "description": "Соревнование стартапов. Презентации перед жюри из инвесторов и экспертов.",
                "type": "tournament",
                "date_start": now - timedelta(days=20),
                "date_end": now - timedelta(days=20),
                "city": "Астана",
                "is_online": False,
                "requirements": "Для резидентов Astana Hub",
                "source": "external",
                "source_url": "https://astanahub.com/events/startup-battle",
                "banner": "https://astanahub.com/static/images/logo.svg",
            },
            {
                "title": "Astana Hub Web3 Summit",
                "description": "Саммит о Web3, NFT и метавселенных. Встречи с лидерами индустрии.",
                "type": "seminar",
                "date_start": now - timedelta(days=28),
                "date_end": now - timedelta(days=28),
                "city": "Астана",
                "is_online": False,
                "requirements": "Открыто для всех",
                "source": "external",
                "source_url": "https://astanahub.com/events/web3-summit",
                "banner": "https://astanahub.com/static/images/logo.svg",
            },
        ]
        
        added_count = 0
        for event_data in events_data:
            # Проверяем, нет ли уже такого события
            result = await session.execute(
                select(Event).where(
                    Event.title == event_data["title"],
                    Event.date_start == event_data["date_start"],
                )
            )
            existing = result.scalar_one_or_none()
            
            if not existing:
                event = Event(
                    organizer_id=system_user.id,
                    **event_data,
                )
                session.add(event)
                added_count += 1
                print(f"✓ Добавлено: {event_data['title']}")
            else:
                print(f"⊘ Пропущено (уже существует): {event_data['title']}")
        
        await session.commit()
        print(f"\n✅ Всего добавлено событий: {added_count}")
    
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(add_events())


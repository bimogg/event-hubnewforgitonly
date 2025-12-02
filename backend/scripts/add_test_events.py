"""
Скрипт для добавления тестовых событий из NU и Astana Hub
"""
import asyncio
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Добавляем корневую директорию в путь
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import text
from app.core.config import get_settings
import bcrypt

settings = get_settings()

# Создаем engine и session
engine = create_async_engine(settings.database.url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def add_test_events():
    """Добавляет тестовые события из NU и Astana Hub"""
    async with AsyncSessionLocal() as session:
        try:
            # Получаем или создаем системного пользователя для внешних событий
            result = await session.execute(
                text("SELECT id FROM users WHERE email = 'system@eventhub.kz'")
            )
            row = result.first()
            
            if row:
                system_user_id = row[0]
            else:
                # Создаем системного пользователя
                hashed = bcrypt.hashpw("system".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
                result = await session.execute(
                    text("""
                        INSERT INTO users (email, hashed_password, full_name, role, created_at, updated_at)
                        VALUES ('system@eventhub.kz', :password, 'System', 'admin', NOW(), NOW())
                        RETURNING id
                    """),
                    {"password": hashed}
                )
                system_user_id = result.scalar_one()
                await session.commit()

            # События из NU
            nu_events = [
                {
                    "title": "HackNU 2025",
                    "description": "Крупнейший хакатон в Казахстане от Nazarbayev University. Соревнование по разработке инновационных решений в области AI, HealthTech и FinTech.",
                    "type": "hackathon",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=30),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=32),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Студенты и выпускники университетов Казахстана. Команды 2-5 человек.",
                    "source": "external",
                    "source_url": "https://nu.edu.kz/hackathon",
                },
                {
                    "title": "NU Tech Summit 2025",
                    "description": "Ежегодная конференция о технологиях и инновациях. Доклады от ведущих экспертов, воркшопы и нетворкинг.",
                    "type": "seminar",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=45),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=45),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Открыто для всех",
                    "source": "external",
                    "source_url": "https://nu.edu.kz/tech-summit",
                },
                {
                    "title": "NU AI Challenge",
                    "description": "Соревнование по машинному обучению и искусственному интеллекту. Решайте реальные задачи от индустриальных партнеров.",
                    "type": "tournament",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=20),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=60),
                    "city": "Астана",
                    "is_online": True,
                    "requirements": "Знание Python, базовые навыки ML",
                    "source": "external",
                    "source_url": "https://nu.edu.kz/ai-challenge",
                },
            ]

            # События из Astana Hub
            astana_hub_events = [
                {
                    "title": "Astana Hub Hackathon 2025",
                    "description": "Международный хакатон от Astana Hub. Разработайте решение для цифровизации государственных услуг. Призовой фонд 5,000,000 ₸.",
                    "type": "hackathon",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=25),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=27),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Команды 3-6 человек. Опыт разработки приветствуется.",
                    "source": "external",
                    "source_url": "https://astanahub.com/hackathon",
                },
                {
                    "title": "Startup Weekend Astana",
                    "description": "54 часа на создание стартапа. От идеи до MVP за выходные. Менторы, инвесторы, призы.",
                    "type": "hackathon",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=15),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=17),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Любой желающий. Команды формируются на месте.",
                    "source": "external",
                    "source_url": "https://astanahub.com/startup-weekend",
                },
                {
                    "title": "TechTalks Astana Hub",
                    "description": "Еженедельные встречи разработчиков. Доклады о новых технологиях, обмен опытом, нетворкинг.",
                    "type": "seminar",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=7),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=7),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Регистрация обязательна",
                    "source": "external",
                    "source_url": "https://astanahub.com/techtalks",
                },
                {
                    "title": "Blockchain Workshop",
                    "description": "Практический воркшоп по разработке на блокчейне. Создайте свой первый смарт-контракт.",
                    "type": "seminar",
                    "date_start": datetime.now(timezone.utc) + timedelta(days=12),
                    "date_end": datetime.now(timezone.utc) + timedelta(days=12),
                    "city": "Астана",
                    "is_online": False,
                    "requirements": "Базовые знания программирования",
                    "source": "external",
                    "source_url": "https://astanahub.com/blockchain-workshop",
                },
            ]

            all_events = nu_events + astana_hub_events

            # Проверяем, не существуют ли уже такие события
            existing_titles = set()
            result = await session.execute(
                text("SELECT title, date_start FROM events")
            )
            for row in result:
                existing_titles.add((row[0], row[1]))

            added_count = 0
            for event_data in all_events:
                # Проверяем дубликаты
                if (event_data["title"], event_data["date_start"]) not in existing_titles:
                    await session.execute(
                        text("""
                            INSERT INTO events (
                                title, description, type, date_start, date_end, city, 
                                is_online, requirements, source, source_url, organizer_id,
                                created_at, updated_at
                            ) VALUES (
                                :title, :description, :type, :date_start, :date_end, :city,
                                :is_online, :requirements, :source, :source_url, :organizer_id,
                                NOW(), NOW()
                            )
                        """),
                        {
                            **event_data,
                            "organizer_id": system_user_id,
                        }
                    )
                    added_count += 1
                    print(f"✅ Добавлено: {event_data['title']}")

            await session.commit()
            print(f"\n🎉 Успешно добавлено {added_count} событий из NU и Astana Hub!")
            
        except Exception as e:
            await session.rollback()
            print(f"❌ Ошибка: {e}")
            import traceback
            traceback.print_exc()
            raise


if __name__ == "__main__":
    asyncio.run(add_test_events())

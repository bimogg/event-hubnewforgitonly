import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import AsyncSessionLocal
from app.models.event import Event
from app.repositories.event_repository import EventRepository
from app.utils.http_client import HttpClient

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Базовый класс для всех скраперов событий"""

    def __init__(self, name: str, base_url: str):
        self.name = name
        self.base_url = base_url
        self.event_repo = EventRepository()
        # Используем HttpClient с таймаутом 5 секунд и 3 ретраями
        self.http_client = HttpClient(
            timeout=5.0,
            max_retries=3,
            retry_delay=1.0,
        )

    async def fetch_html(self, url: str) -> Optional[str]:
        """
        Асинхронно получает HTML содержимое страницы с автоматическими ретраями.
        
        Returns:
            str: HTML содержимое или None в случае ошибки
        """
        return await self.http_client.get(url)

    @abstractmethod
    def parse(self, html: str) -> list[dict[str, Any]]:
        """Парсит HTML и возвращает список словарей с данными событий"""
        pass

    def normalize_event(self, data: dict[str, Any]) -> dict[str, Any]:
        """Нормализует данные события для сохранения в БД"""
        normalized = {
            "title": data.get("title", "").strip(),
            "description": data.get("description", "").strip() or None,
            "date_start": data.get("start_date"),
            "date_end": data.get("end_date"),
            "city": data.get("location", "").strip() or None,
            "type": data.get("category", "other"),
            "banner": data.get("image_url") or None,
            "source": "external",
            "source_url": data.get("source_url", "").strip() or None,
            "organizer_id": None,  # Внешние события не имеют организатора
            "is_online": data.get("is_online", False),
            "tags": data.get("tags", []),
        }

        # Валидация обязательных полей
        if not normalized["title"]:
            raise ValueError("Event title is required")
        if not normalized["date_start"]:
            raise ValueError("Event start_date is required")
        if not isinstance(normalized["date_start"], datetime):
            raise ValueError("start_date must be a datetime object")

        return normalized

    async def save_or_update(self, event_data: dict[str, Any], db: AsyncSession) -> Event:
        """Сохраняет или обновляет событие в БД (UPSERT)"""
        try:
            normalized = self.normalize_event(event_data)

            # Ищем существующее событие по source_url или title + start_date
            conditions = [Event.source == "external"]
            
            if normalized["source_url"]:
                # Если есть source_url, ищем по нему
                conditions.append(Event.source_url == normalized["source_url"])
            else:
                # Иначе ищем по title + start_date
                conditions.append(Event.title == normalized["title"])
                conditions.append(Event.date_start == normalized["date_start"])
            
            stmt = select(Event).where(and_(*conditions))
            result = await db.execute(stmt)
            existing_event = result.scalar_one_or_none()

            if existing_event:
                # Обновляем существующее событие
                logger.info(f"[{self.name}] Updating event: {normalized['title']}")
                for key, value in normalized.items():
                    setattr(existing_event, key, value)
                await db.flush()
                await db.refresh(existing_event)
                return existing_event
            else:
                # Создаем новое событие
                logger.info(f"[{self.name}] Creating new event: {normalized['title']}")
                event = await self.event_repo.create(db, normalized)
                return event

        except Exception as e:
            logger.error(f"[{self.name}] Error saving event: {e}")
            raise

    async def scrape(self) -> int:
        """
        Основной метод для запуска парсинга.
        Возвращает количество обработанных событий или 0 в случае ошибки.
        """
        logger.info(f"[{self.name}] 🚀 Starting scraping from {self.base_url}")
        count = 0

        try:
            # Получаем HTML с автоматическими ретраями
            html = await self.fetch_html(self.base_url)
            
            # Если не удалось получить HTML, возвращаем 0
            if not html:
                logger.warning(f"[{self.name}] ⚠️ Failed to fetch HTML, skipping...")
                return 0
            
            logger.info(f"[{self.name}] ✅ HTML fetched, length: {len(html)} chars")
            
            # Парсим события
            try:
                events_data = self.parse(html)
                logger.info(f"[{self.name}] ✅ Parsed {len(events_data)} events from HTML")
            except Exception as e:
                logger.error(f"[{self.name}] ❌ Error parsing HTML: {e}", exc_info=True)
                return 0

            # Сохраняем события в БД
            if events_data:
                async with AsyncSessionLocal() as db:
                    for i, event_data in enumerate(events_data, 1):
                        try:
                            await self.save_or_update(event_data, db)
                            count += 1
                            if i <= 3:  # Логируем первые 3 для диагностики
                                logger.info(f"[{self.name}] 💾 Saved event {i}: {event_data.get('title', 'Unknown')[:50]}")
                        except Exception as e:
                            logger.error(f"[{self.name}] ❌ Error processing event {i}: {e}")
                            continue

                    await db.commit()
                    logger.info(f"[{self.name}] ✅ Successfully saved {count}/{len(events_data)} events to DB")
            else:
                logger.warning(f"[{self.name}] ⚠️ No events found in HTML")

        except Exception as e:
            logger.error(f"[{self.name}] ❌ Error during scraping: {e}", exc_info=True)
            # Возвращаем 0 вместо проброса исключения
            return 0

        return count

    async def close(self):
        """Закрывает HTTP клиент"""
        if hasattr(self, "http_client"):
            try:
                await self.http_client.close()
            except Exception as e:
                logger.warning(f"[{self.name}] Error closing HTTP client: {e}")


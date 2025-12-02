from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event, EventRegistration
from app.repositories.base import BaseRepository


class EventRepository(BaseRepository[Event]):
    def __init__(self) -> None:
        super().__init__(Event)

    async def search(
        self,
        db: AsyncSession,
        *,
        city: Optional[str] = None,
        is_online: Optional[bool] = None,
        type: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[Event]:
        from sqlalchemy import or_, func
        
        stmt = select(Event)
        conditions = []
        
        # Показываем ВСЕ события (включая прошедшие), если не указан date_from
        # Это нужно для отображения всех парсированных событий
        # Если нужно фильтровать только будущие - используйте параметр date_from
        if date_from is None:
            # Не фильтруем по дате - показываем все события
            pass
        
        if city:
            conditions.append(Event.city == city)
        if is_online is not None:
            conditions.append(Event.is_online == is_online)
        if type:
            conditions.append(Event.type == type)
        if date_from:
            conditions.append(Event.date_start >= date_from)
        if date_to:
            conditions.append(Event.date_end <= date_to)
        
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        # Сортируем по дате начала (ближайшие события первыми)
        stmt = stmt.order_by(Event.date_start.asc())
        stmt = stmt.offset(offset).limit(limit)
        
        try:
            result = await db.execute(stmt)
            events = result.scalars().all()
            return events if events else []  # Всегда возвращаем список
        except Exception as e:
            # Логируем ошибку, но возвращаем пустой список
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in event repository search: {e}", exc_info=True)
            return []  # Всегда возвращаем список, даже при ошибке

    async def get_participants(self, db: AsyncSession, event_id: int) -> Sequence[EventRegistration]:
        stmt = select(EventRegistration).where(EventRegistration.event_id == event_id)
        result = await db.execute(stmt)
        return result.scalars().all()


class EventRegistrationRepository(BaseRepository[EventRegistration]):
    def __init__(self) -> None:
        super().__init__(EventRegistration)

    async def get_by_event_and_user(
        self, db: AsyncSession, event_id: int, user_id: int
    ) -> Optional[EventRegistration]:
        stmt = select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == user_id,
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


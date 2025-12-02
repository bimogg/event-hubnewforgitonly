from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event, EventRegistration, EventRegistrationStatus
from app.models.user import User
from app.repositories.event_repository import (
    EventRegistrationRepository,
    EventRepository,
)
from app.schemas.event import EventCreate, EventUpdate


class EventService:
    def __init__(
        self,
        event_repo: EventRepository | None = None,
        registration_repo: EventRegistrationRepository | None = None,
    ) -> None:
        self.event_repo = event_repo or EventRepository()
        self.registration_repo = registration_repo or EventRegistrationRepository()

    async def create_event(
        self, db: AsyncSession, organizer: User, event_in: EventCreate
    ) -> Event:
        event = await self.event_repo.create(
            db,
            {
                **event_in.dict(),
                "organizer_id": organizer.id,
            },
        )
        return event

    async def update_event(
        self, db: AsyncSession, organizer: User, event_id: int, event_in: EventUpdate
    ) -> Event:
        event = await self.event_repo.get(db, event_id)
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        if event.organizer_id != organizer.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not event organizer")
        data = event_in.dict(exclude_unset=True)
        event = await self.event_repo.update(db, event, data)
        return event

    async def get_event(self, db: AsyncSession, event_id: int) -> Event:
        event = await self.event_repo.get(db, event_id)
        if not event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
        return event

    async def search_events(
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
    ) -> List[Event]:
        """
        Безопасный поиск событий из БД.
        Всегда возвращает список, даже если пустой.
        """
        try:
            events = await self.event_repo.search(
                db,
                city=city,
                is_online=is_online,
                type=type,
                date_from=date_from,
                date_to=date_to,
                offset=offset,
                limit=limit,
            )
            return list(events) if events else []
        except Exception as e:
            # Логируем ошибку, но возвращаем пустой список
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error in search_events: {e}", exc_info=True)
            return []  # Всегда возвращаем список, даже при ошибке

    async def register_for_event(
        self, db: AsyncSession, user: User, event_id: int
    ) -> EventRegistration:
        event = await self.get_event(db, event_id)
        existing = await self.registration_repo.get_by_event_and_user(
            db, event_id=event.id, user_id=user.id
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already registered for this event",
            )
        registration = await self.registration_repo.create(
            db,
            {
                "event_id": event.id,
                "user_id": user.id,
                "status": EventRegistrationStatus.REGISTERED.value,
            },
        )
        return registration

    async def list_participants(
        self, db: AsyncSession, organizer: User, event_id: int
    ) -> List[EventRegistration]:
        event = await self.get_event(db, event_id)
        if event.organizer_id != organizer.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not event organizer")
        return list(await self.event_repo.get_participants(db, event_id))


from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.core.db import get_db
from app.models.user import User, UserRole
from app.schemas.event import EventRead, EventRegistrationRead
from app.services.event_service import EventService


router = APIRouter(
    prefix="/organizer",
    tags=["organizer"],
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)


@router.get("/events", response_model=List[EventRead])
async def list_my_events(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[EventRead]:
    service = EventService()
    events = await service.search_events(db, city=None, is_online=None, type=None)
    own_events = [e for e in events if e.organizer_id == current_user.id]
    return [EventRead.model_validate(e) for e in own_events]


@router.get("/events/{event_id}/registrations", response_model=List[EventRegistrationRead])
async def event_registrations(
    event_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[EventRegistrationRead]:
    service = EventService()
    regs = await service.list_participants(db, current_user, event_id)
    return [EventRegistrationRead.model_validate(r) for r in regs]


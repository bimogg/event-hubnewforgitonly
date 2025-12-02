import logging
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.core.db import get_db
from app.models.user import User, UserRole
from app.models.event import Event
from app.repositories.user_repository import UserRepository
from app.repositories.event_repository import EventRepository
from app.services.scraper_service import run_all_scrapers
from app.schemas.auth import UserRead
from app.schemas.event import EventRead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
) -> Dict:
    """Получить статистику системы"""
    try:
        # Статистика пользователей
        user_repo = UserRepository()
        total_users = await db.execute(select(func.count(User.id)))
        total_users_count = total_users.scalar() or 0
        
        active_users = await db.execute(
            select(func.count(User.id)).where(User.is_active == True)
        )
        active_users_count = active_users.scalar() or 0
        
        # Статистика событий
        event_repo = EventRepository()
        total_events = await db.execute(select(func.count(Event.id)))
        total_events_count = total_events.scalar() or 0
        
        return {
            "users": {
                "total": total_users_count,
                "active": active_users_count,
            },
            "events": {
                "total": total_events_count,
            },
        }
    except Exception as e:
        logger.error(f"Error getting stats: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting stats: {str(e)}",
        )


@router.get("/users", response_model=List[UserRead])
async def list_users(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
    offset: int = 0,
    limit: int = 50,
) -> List[UserRead]:
    """Получить список всех пользователей"""
    try:
        user_repo = UserRepository()
        stmt = select(User).offset(offset).limit(limit).order_by(User.created_at.desc())
        result = await db.execute(stmt)
        users = result.scalars().all()
        return [UserRead.model_validate(user) for user in users]
    except Exception as e:
        logger.error(f"Error listing users: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing users: {str(e)}",
        )


@router.get("/events", response_model=List[EventRead])
async def list_all_events(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
    offset: int = 0,
    limit: int = 100,
) -> List[EventRead]:
    """Получить список всех событий"""
    try:
        event_repo = EventRepository()
        events = await event_repo.search(db, offset=offset, limit=limit)
        return [EventRead.model_validate(event) for event in events]
    except Exception as e:
        logger.error(f"Error listing events: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error listing events: {str(e)}",
        )


@router.post(
    "/run-scraper",
    response_model=Dict[str, int],
    status_code=status.HTTP_200_OK,
)
async def run_scraper(
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, int]:
    """
    Ручной запуск всех скраперов событий.
    Доступно только для администраторов.
    """
    try:
        logger.info(f"Manual scraper run triggered by user {current_user.id}")
        results = await run_all_scrapers()
        return results
    except Exception as e:
        logger.error(f"Error running scrapers: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error running scrapers: {str(e)}",
        )


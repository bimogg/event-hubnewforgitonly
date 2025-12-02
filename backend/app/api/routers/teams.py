from typing import List, Optional

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.schemas.team import (
    TeamCreate,
    TeamOpenPositionCreate,
    TeamOpenPositionRead,
    TeamOpenPositionUpdate,
    TeamRead,
    TeamUpdate,
)
from app.services.team_service import TeamService


router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("/", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_in: TeamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TeamRead:
    service = TeamService()
    team = await service.create_team(db, current_user, team_in)
    await db.commit()
    return TeamRead.model_validate(team)


@router.get("/{team_id}", response_model=TeamRead)
async def get_team(
    team_id: int,
    db: AsyncSession = Depends(get_db),
) -> TeamRead:
    service = TeamService()
    team = await service.get_team(db, team_id)
    return TeamRead.model_validate(team)


@router.patch("/{team_id}", response_model=TeamRead)
async def update_team(
    team_id: int,
    team_in: TeamUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TeamRead:
    service = TeamService()
    team = await service.update_team(db, current_user, team_id, team_in)
    await db.commit()
    return TeamRead.model_validate(team)


@router.get("/", response_model=List[TeamRead])
async def search_teams(
    name: Optional[str] = None,
    offset: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
) -> List[TeamRead]:
    service = TeamService()
    teams = await service.search_teams(db, name=name, offset=offset, limit=limit)
    return [TeamRead.model_validate(t) for t in teams]


@router.post("/{team_id}/positions", response_model=TeamOpenPositionRead)
async def create_open_position(
    team_id: int,
    position_in: TeamOpenPositionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TeamOpenPositionRead:
    service = TeamService()
    position = await service.create_open_position(
        db, current_user, team_id, position_in
    )
    await db.commit()
    return TeamOpenPositionRead.model_validate(position)


@router.patch("/positions/{position_id}", response_model=TeamOpenPositionRead)
async def update_open_position(
    position_id: int,
    position_in: TeamOpenPositionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TeamOpenPositionRead:
    service = TeamService()
    position = await service.update_open_position(
        db, current_user, position_id, position_in
    )
    await db.commit()
    return TeamOpenPositionRead.model_validate(position)


@router.get("/{team_id}/positions", response_model=List[TeamOpenPositionRead])
async def list_open_positions(
    team_id: int,
    db: AsyncSession = Depends(get_db),
) -> List[TeamOpenPositionRead]:
    service = TeamService()
    positions = await service.list_open_positions(db, team_id)
    return [TeamOpenPositionRead.model_validate(p) for p in positions]


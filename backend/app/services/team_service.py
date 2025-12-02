from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team import Team, TeamMember, TeamOpenPosition
from app.models.user import User
from app.repositories.team_repository import (
    TeamMemberRepository,
    TeamOpenPositionRepository,
    TeamRepository,
)
from app.schemas.team import (
    TeamCreate,
    TeamOpenPositionCreate,
    TeamOpenPositionUpdate,
    TeamUpdate,
)


class TeamService:
    def __init__(
        self,
        team_repo: TeamRepository | None = None,
        member_repo: TeamMemberRepository | None = None,
        position_repo: TeamOpenPositionRepository | None = None,
    ) -> None:
        self.team_repo = team_repo or TeamRepository()
        self.member_repo = member_repo or TeamMemberRepository()
        self.position_repo = position_repo or TeamOpenPositionRepository()

    async def create_team(
        self, db: AsyncSession, owner: User, team_in: TeamCreate
    ) -> Team:
        team = await self.team_repo.create(
            db,
            {
                **team_in.dict(),
                "owner_id": owner.id,
            },
        )
        member = TeamMember(team_id=team.id, user_id=owner.id, role_name="owner")
        db.add(member)
        await db.flush()
        await db.refresh(team)
        return team

    async def get_team(self, db: AsyncSession, team_id: int) -> Team:
        team = await self.team_repo.get(db, team_id)
        if not team:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
        return team

    async def update_team(
        self, db: AsyncSession, current_user: User, team_id: int, team_in: TeamUpdate
    ) -> Team:
        team = await self.get_team(db, team_id)
        if team.owner_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not team owner")
        data = team_in.dict(exclude_unset=True)
        team = await self.team_repo.update(db, team, data)
        return team

    async def search_teams(
        self, db: AsyncSession, *, name: Optional[str] = None, offset: int = 0, limit: int = 50
    ) -> List[Team]:
        return list(await self.team_repo.search(db, name=name, offset=offset, limit=limit))

    async def add_member(
        self, db: AsyncSession, owner: User, team_id: int, user_id: int, role_name: str
    ) -> TeamMember:
        team = await self.get_team(db, team_id)
        if team.owner_id != owner.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not team owner")
        existing = await self.member_repo.get_by_team_and_user(db, team_id, user_id)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already in team",
            )
        member = await self.member_repo.create(
            db,
            {
                "team_id": team.id,
                "user_id": user_id,
                "role_name": role_name,
            },
        )
        return member

    async def create_open_position(
        self,
        db: AsyncSession,
        owner: User,
        team_id: int,
        position_in: TeamOpenPositionCreate,
    ) -> TeamOpenPosition:
        team = await self.get_team(db, team_id)
        if team.owner_id != owner.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not team owner")
        position = await self.position_repo.create(
            db,
            {
                **position_in.dict(),
                "team_id": team.id,
            },
        )
        return position

    async def update_open_position(
        self,
        db: AsyncSession,
        owner: User,
        position_id: int,
        position_in: TeamOpenPositionUpdate,
    ) -> TeamOpenPosition:
        position = await self.position_repo.get(db, position_id)
        if not position:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Open position not found"
            )
        team = await self.get_team(db, position.team_id)
        if team.owner_id != owner.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not team owner")
        data = position_in.dict(exclude_unset=True)
        position = await self.position_repo.update(db, position, data)
        return position

    async def list_open_positions(
        self, db: AsyncSession, team_id: int
    ) -> List[TeamOpenPosition]:
        return list(await self.position_repo.list_by_team(db, team_id))


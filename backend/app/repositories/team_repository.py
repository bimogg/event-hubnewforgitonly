from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team import Team, TeamMember, TeamOpenPosition
from app.repositories.base import BaseRepository


class TeamRepository(BaseRepository[Team]):
    def __init__(self) -> None:
        super().__init__(Team)

    async def search(
        self,
        db: AsyncSession,
        *,
        name: Optional[str] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[Team]:
        stmt = select(Team)
        if name:
            stmt = stmt.where(Team.name.ilike(f"%{name}%"))
        stmt = stmt.offset(offset).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()


class TeamMemberRepository(BaseRepository[TeamMember]):
    def __init__(self) -> None:
        super().__init__(TeamMember)

    async def get_by_team_and_user(
        self, db: AsyncSession, team_id: int, user_id: int
    ) -> Optional[TeamMember]:
        stmt = select(TeamMember).where(
            TeamMember.team_id == team_id, TeamMember.user_id == user_id
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


class TeamOpenPositionRepository(BaseRepository[TeamOpenPosition]):
    def __init__(self) -> None:
        super().__init__(TeamOpenPosition)

    async def list_by_team(
        self, db: AsyncSession, team_id: int
    ) -> Sequence[TeamOpenPosition]:
        stmt = select(TeamOpenPosition).where(TeamOpenPosition.team_id == team_id)
        result = await db.execute(stmt)
        return result.scalars().all()


from typing import List, Optional, Sequence

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import (
    Interest,
    Profile,
    ProfileInterest,
    ProfileSkill,
    Skill,
)
from app.repositories.base import BaseRepository


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self) -> None:
        super().__init__(Profile)

    async def search(
        self,
        db: AsyncSession,
        *,
        city: Optional[str] = None,
        experience_level: Optional[str] = None,
        interest_names: Optional[List[str]] = None,
        skill_names: Optional[List[str]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[Profile]:
        stmt = select(Profile)

        conditions = []
        if city:
            conditions.append(Profile.city == city)
        if experience_level:
            conditions.append(Profile.experience_level == experience_level)

        if conditions:
            stmt = stmt.where(and_(*conditions))

        if interest_names:
            stmt = stmt.join(ProfileInterest).join(Interest).where(
                Interest.name.in_(interest_names)
            )
        if skill_names:
            stmt = stmt.join(ProfileSkill).join(Skill).where(Skill.name.in_(skill_names))

        stmt = stmt.offset(offset).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().unique().all()

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Optional[Profile]:
        stmt = select(Profile).where(Profile.user_id == user_id)
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


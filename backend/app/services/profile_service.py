from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import (
    Interest,
    Profile,
    ProfileInterest,
    ProfileSkill,
    Skill,
)
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import ProfileUpdate


class ProfileService:
    def __init__(self, repo: ProfileRepository | None = None) -> None:
        self.repo = repo or ProfileRepository()

    async def get_or_create_profile(self, db: AsyncSession, user_id: int) -> Profile:
        stmt = select(Profile).where(Profile.user_id == user_id)
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()
        if profile:
            return profile
        profile = Profile(user_id=user_id)
        db.add(profile)
        await db.flush()
        await db.refresh(profile)
        return profile

    async def get_profile(self, db: AsyncSession, user_id: int) -> Profile:
        stmt = select(Profile).where(Profile.user_id == user_id)
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
            )
        return profile

    async def update_profile(
        self, db: AsyncSession, user_id: int, profile_in: ProfileUpdate
    ) -> Profile:
        stmt = select(Profile).where(Profile.user_id == user_id)
        result = await db.execute(stmt)
        db_profile = result.scalar_one_or_none()
        if not db_profile:
            db_profile = Profile(user_id=user_id)
            db.add(db_profile)

        data = profile_in.dict(exclude_unset=True)
        interests_names: Optional[List[str]] = data.pop("interests", None)
        skills_data: Optional[List[dict]] = data.pop("skills", None)

        for field, value in data.items():
            setattr(db_profile, field, value)

        if interests_names is not None:
            await self._set_interests(db, db_profile, interests_names)
        if skills_data is not None:
            await self._set_skills(db, db_profile, skills_data)

        await db.flush()
        await db.refresh(db_profile)
        return db_profile

    async def _set_interests(
        self, db: AsyncSession, profile: Profile, interests: List[str]
    ) -> None:
        await db.execute(
            ProfileInterest.__table__.delete().where(
                ProfileInterest.profile_id == profile.id
            )
        )
        for name in interests:
            existing = await db.execute(
                Interest.__table__.select().where(Interest.name == name)
            )
            interest = existing.scalar_one_or_none()
            if not interest:
                interest = Interest(name=name)
                db.add(interest)
                await db.flush()
            db.add(ProfileInterest(profile_id=profile.id, interest_id=interest.id))

    async def _set_skills(
        self, db: AsyncSession, profile: Profile, skills: List[dict]
    ) -> None:
        await db.execute(
            ProfileSkill.__table__.delete().where(
                ProfileSkill.profile_id == profile.id
            )
        )
        for item in skills:
            name = item.get("skill")
            level = int(item.get("level", 1))
            existing = await db.execute(
                Skill.__table__.select().where(Skill.name == name)
            )
            skill = existing.scalar_one_or_none()
            if not skill:
                skill = Skill(name=name)
                db.add(skill)
                await db.flush()
            db.add(
                ProfileSkill(
                    profile_id=profile.id,
                    skill_id=skill.id,
                    level=level,
                )
            )

    async def search_profiles(
        self,
        db: AsyncSession,
        *,
        city: Optional[str] = None,
        experience_level: Optional[str] = None,
        interests: Optional[List[str]] = None,
        skills: Optional[List[str]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> List[Profile]:
        return list(
            await self.repo.search(
                db,
                city=city,
                experience_level=experience_level,
                interest_names=interests,
                skill_names=skills,
                offset=offset,
                limit=limit,
            )
        )


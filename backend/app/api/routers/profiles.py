from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.schemas.profile import ProfileRead, ProfileUpdate
from app.services.profile_service import ProfileService


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/me", response_model=ProfileRead)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    service = ProfileService()
    profile = await service.get_or_create_profile(db, current_user.id)
    await db.commit()
    return ProfileRead.model_validate(profile)


@router.patch("/me", response_model=ProfileRead)
async def update_my_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    service = ProfileService()
    profile = await service.update_profile(db, current_user.id, profile_in)
    await db.commit()
    return ProfileRead.model_validate(profile)


@router.get("/{profile_id}", response_model=ProfileRead)
async def get_profile(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    service = ProfileService()
    profile = await service.repo.get(db, profile_id)
    return ProfileRead.model_validate(profile)


@router.get("/", response_model=List[ProfileRead])
async def search_profiles(
    city: Optional[str] = None,
    experience_level: Optional[str] = None,
    interests: Optional[List[str]] = None,
    skills: Optional[List[str]] = None,
    offset: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
) -> List[ProfileRead]:
    service = ProfileService()
    profiles = await service.search_profiles(
        db,
        city=city,
        experience_level=experience_level,
        interests=interests,
        skills=skills,
        offset=offset,
        limit=limit,
    )
    return [ProfileRead.model_validate(p) for p in profiles]


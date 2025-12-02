from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.profile import ExperienceLevel, ProfileStatus


class InterestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class SkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class ProfileSkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    skill: SkillRead
    level: int


class ProfileBase(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    city: Optional[str] = None
    experience_level: Optional[ExperienceLevel] = None
    status: Optional[ProfileStatus] = None
    interests: Optional[List[str]] = None
    skills: Optional[List[dict]] = None


class ProfileUpdate(ProfileBase):
    pass


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: Optional[str]
    username: Optional[str]
    avatar: Optional[str]
    bio: Optional[str]
    city: Optional[str]
    experience_level: Optional[ExperienceLevel]
    status: Optional[ProfileStatus]
    interests: list[InterestRead] = []
    skills: list[ProfileSkillRead] = []


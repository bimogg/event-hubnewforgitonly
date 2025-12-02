from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    skills_matrix: Optional[Dict[str, Any]] = None
    achievements: Optional[List[str]] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    skills_matrix: Optional[Dict[str, Any]] = None
    achievements: Optional[List[str]] = None


class TeamRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    name: str
    description: Optional[str]
    skills_matrix: Optional[Dict[str, Any]]
    achievements: Optional[List[str]]


class TeamMemberRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    team_id: int
    user_id: int
    role_name: Optional[str]


class TeamOpenPositionBase(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: Optional[Dict[str, Any]] = None
    is_open: bool = True


class TeamOpenPositionCreate(TeamOpenPositionBase):
    pass


class TeamOpenPositionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[Dict[str, Any]] = None
    is_open: Optional[bool] = None


class TeamOpenPositionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    team_id: int
    title: str
    description: Optional[str]
    required_skills: Optional[Dict[str, Any]]
    is_open: bool


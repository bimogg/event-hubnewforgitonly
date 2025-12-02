from datetime import datetime
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.internship import SlotStatus, ApplicationStatus, CompletionStatus


class InternshipSlotBase(BaseModel):
    title: str
    description: str
    operation: str
    required_skills: Optional[List[str]] = None
    required_skills_level: Optional[Dict[str, int]] = None
    slot_start: datetime
    slot_end: datetime
    duration_hours: float = Field(ge=1.0, le=8.0)
    address: str
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    payment: Optional[float] = None
    bonus: Optional[str] = None
    max_applicants: int = Field(default=1, ge=1)
    checklist: Optional[List[str]] = None


class InternshipSlotCreate(InternshipSlotBase):
    pass


class InternshipSlotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    operation: Optional[str] = None
    required_skills: Optional[List[str]] = None
    required_skills_level: Optional[Dict[str, int]] = None
    slot_start: Optional[datetime] = None
    slot_end: Optional[datetime] = None
    duration_hours: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    payment: Optional[float] = None
    bonus: Optional[str] = None
    status: Optional[SlotStatus] = None
    max_applicants: Optional[int] = None
    checklist: Optional[List[str]] = None


class InternshipSlotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    operation: str
    required_skills: Optional[List[str]]
    required_skills_level: Optional[Dict[str, int]]
    slot_start: datetime
    slot_end: datetime
    duration_hours: float
    address: str
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    payment: Optional[float]
    bonus: Optional[str]
    status: str
    max_applicants: int
    current_applicants: int
    checklist: Optional[List[str]]
    company_id: int
    created_at: datetime
    updated_at: datetime


class SlotApplicationCreate(BaseModel):
    slot_id: int
    motivation: Optional[str] = None


class SlotApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slot_id: int
    student_id: int
    status: str
    motivation: Optional[str]
    applied_at: datetime
    created_at: datetime
    updated_at: datetime


class SlotCompletionCreate(BaseModel):
    application_id: int
    checklist_completed: Optional[List[bool]] = None
    photos: Optional[List[str]] = None
    completion_time_minutes: Optional[int] = None


class SlotCompletionUpdate(BaseModel):
    status: Optional[CompletionStatus] = None
    master_feedback: Optional[str] = None
    master_rating: Optional[int] = Field(None, ge=1, le=5)
    is_ready: Optional[bool] = None
    quality_score: Optional[float] = Field(None, ge=0.0, le=1.0)


class SlotCompletionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    status: str
    checklist_completed: Optional[List[bool]]
    photos: Optional[List[str]]
    master_id: Optional[int]
    master_feedback: Optional[str]
    master_rating: Optional[int]
    is_ready: Optional[bool]
    completion_time_minutes: Optional[int]
    quality_score: Optional[float]
    confirmed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


class MatchingRequest(BaseModel):
    """Запрос на матчинг слотов для студента"""
    student_id: int
    available_time_windows: List[Dict[str, datetime]]  # [{"start": datetime, "end": datetime}]
    student_skills: Optional[Dict[str, int]] = None  # {"skill": level}
    max_distance_km: Optional[float] = None
    city: Optional[str] = None


class MatchedSlot(BaseModel):
    """Результат матчинга"""
    slot: InternshipSlotRead
    match_score: float
    skills_match: float
    time_match: float
    distance_km: Optional[float] = None


from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.event import EventType, EventRegistrationStatus


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date_start: datetime
    date_end: Optional[datetime] = None
    city: Optional[str] = None
    is_online: bool = False
    type: EventType = EventType.OTHER
    banner: Optional[str] = None
    requirements: Optional[str] = None
    tags: Optional[List[str]] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None
    city: Optional[str] = None
    is_online: Optional[bool] = None
    type: Optional[EventType] = None
    banner: Optional[str] = None
    requirements: Optional[str] = None
    tags: Optional[List[str]] = None


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    organizer_id: Optional[int]
    title: str
    description: Optional[str]
    date_start: datetime
    date_end: Optional[datetime]
    city: Optional[str]
    is_online: bool
    type: EventType
    banner: Optional[str]
    requirements: Optional[str]
    tags: Optional[List[str]]
    source: Optional[str]
    source_url: Optional[str]


class EventRegistrationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    user_id: int
    status: EventRegistrationStatus
    created_at: datetime


from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.models.chat import ChatType


class ChatBase(BaseModel):
    type: ChatType
    team_id: Optional[int] = None
    event_id: Optional[int] = None


class ChatRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: ChatType
    team_id: Optional[int]
    event_id: Optional[int]


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    pass


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    chat_id: int
    sender_id: int
    content: str
    created_at: datetime


class ChatWithMessages(ChatRead):
    messages: List[MessageRead]


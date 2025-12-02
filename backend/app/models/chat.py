from enum import Enum

from sqlalchemy import DateTime, ForeignKey, String, Text
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class ChatType(str, Enum):
    PERSONAL = "personal"
    TEAM = "team"
    EVENT = "event"


class Chat(Base, TimestampMixin):
    __tablename__ = "chats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(50))
    team_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("teams.id", ondelete="CASCADE"), nullable=True
    )
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), nullable=True
    )

    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="chat", cascade="all,delete-orphan"
    )
    participants: Mapped[list["ChatParticipant"]] = relationship(
        "ChatParticipant", back_populates="chat", cascade="all,delete-orphan"
    )
    team: Mapped["Team | None"] = relationship("Team", backref="chats")
    event: Mapped["Event | None"] = relationship("Event", back_populates="chats")


class ChatParticipant(Base):
    __tablename__ = "chat_participants"

    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id", ondelete="CASCADE"), primary_key=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )

    chat: Mapped["Chat"] = relationship("Chat", back_populates="participants")
    user: Mapped["User"] = relationship("User")


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id", ondelete="CASCADE"), index=True
    )
    sender_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    content: Mapped[str] = mapped_column(Text)
    sent_at: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)

    chat: Mapped["Chat"] = relationship("Chat", back_populates="messages")
    sender: Mapped["User"] = relationship("User", back_populates="messages")


from app.models.team import Team  # noqa: E402
from app.models.event import Event  # noqa: E402
from app.models.user import User  # noqa: E402


from enum import Enum

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from typing import Optional
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class EventType(str, Enum):
    HACKATHON = "hackathon"
    QUEST = "quest"
    TOURNAMENT = "tournament"
    SEMINAR = "seminar"
    OTHER = "other"


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date_start: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True))
    date_end: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_online: Mapped[Optional[bool]] = mapped_column(Boolean, default=False)
    type: Mapped[str] = mapped_column(String(50), default=EventType.OTHER.value)
    organizer_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True
    )
    banner: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    requirements: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # internal / external
    source_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    organizer: Mapped["User | None"] = relationship("User", back_populates="events_organized")
    registrations: Mapped[list["EventRegistration"]] = relationship(
        "EventRegistration", back_populates="event", cascade="all,delete-orphan"
    )
    chats: Mapped[list["Chat"]] = relationship("Chat", back_populates="event")


class EventRegistrationStatus(str, Enum):
    REGISTERED = "registered"
    APPROVED = "approved"
    CANCELED = "canceled"


class EventRegistration(Base, TimestampMixin):
    __tablename__ = "event_registrations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), default=EventRegistrationStatus.REGISTERED.value
    )

    event: Mapped["Event"] = relationship("Event", back_populates="registrations")
    user: Mapped["User"] = relationship("User")


from app.models.user import User  # noqa: E402
from app.models.chat import Chat  # noqa: E402


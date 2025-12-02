from enum import Enum
from typing import Optional

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class UserRole(str, Enum):
    USER = "user"
    TEAM_OWNER = "team_owner"
    ORGANIZER = "organizer"
    ADMIN = "admin"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default=UserRole.USER.value)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    resume_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="user", uselist=False
    )
    teams_owned: Mapped[list["Team"]] = relationship(
        "Team", back_populates="owner", cascade="all,delete-orphan"
    )
    teams_memberships: Mapped[list["TeamMember"]] = relationship(
        "TeamMember", back_populates="user", cascade="all,delete-orphan"
    )
    events_organized: Mapped[list["Event"]] = relationship(
        "Event", back_populates="organizer"
    )
    messages: Mapped[list["Message"]] = relationship(
        "Message", back_populates="sender", cascade="all,delete-orphan"
    )


from app.models.profile import Profile  # noqa: E402
from app.models.team import Team, TeamMember  # noqa: E402
from app.models.event import Event  # noqa: E402
from app.models.chat import Message  # noqa: E402


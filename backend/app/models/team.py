from sqlalchemy import ForeignKey, String, Text
from typing import Optional
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Team(Base, TimestampMixin):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    skills_matrix: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    achievements: Mapped[list[str]] = mapped_column(JSONB, nullable=True)

    owner: Mapped[Optional["User"]] = relationship("User", back_populates="teams_owned")
    members: Mapped[list["TeamMember"]] = relationship(
        "TeamMember", back_populates="team", cascade="all,delete-orphan"
    )
    roles: Mapped[list["TeamRole"]] = relationship(
        "TeamRole", back_populates="team", cascade="all,delete-orphan"
    )
    open_positions: Mapped[list["TeamOpenPosition"]] = relationship(
        "TeamOpenPosition", back_populates="team", cascade="all,delete-orphan"
    )


class TeamMember(Base, TimestampMixin):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    role_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    team: Mapped[Optional["Team"]] = relationship("Team", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="teams_memberships")


class TeamRole(Base):
    __tablename__ = "team_roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    team: Mapped[Optional["Team"]] = relationship("Team", back_populates="roles")


class TeamOpenPosition(Base, TimestampMixin):
    __tablename__ = "team_open_positions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    team_id: Mapped[int] = mapped_column(
        ForeignKey("teams.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    required_skills: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    is_open: Mapped[bool] = mapped_column(default=True)

    team: Mapped["Team"] = relationship("Team", back_populates="open_positions")


from app.models.user import User  # noqa: E402


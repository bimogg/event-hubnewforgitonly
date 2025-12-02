from enum import Enum

from sqlalchemy import ForeignKey, String, Text
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class ExperienceLevel(str, Enum):
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"


class ProfileStatus(str, Enum):
    LOOKING_FOR_TEAM = "looking_for_team"
    LOOKING_FOR_PEOPLE = "looking_for_people"
    READY_TO_JOIN = "ready_to_join"
    NOT_LOOKING = "not_looking"


class Profile(Base, TimestampMixin):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    username: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True)
    avatar: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    experience_level: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True, default=ExperienceLevel.JUNIOR.value
    )
    status: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True, default=ProfileStatus.NOT_LOOKING.value
    )

    user: Mapped["User"] = relationship("User", back_populates="profile")
    interests: Mapped[list["ProfileInterest"]] = relationship(
        "ProfileInterest", back_populates="profile", cascade="all,delete-orphan"
    )
    skills: Mapped[list["ProfileSkill"]] = relationship(
        "ProfileSkill", back_populates="profile", cascade="all,delete-orphan"
    )


class Interest(Base):
    __tablename__ = "interests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    profiles: Mapped[list["ProfileInterest"]] = relationship(
        "ProfileInterest", back_populates="interest", cascade="all,delete-orphan"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    profile_skills: Mapped[list["ProfileSkill"]] = relationship(
        "ProfileSkill", back_populates="skill", cascade="all,delete-orphan"
    )


class ProfileInterest(Base):
    __tablename__ = "profile_interests"

    profile_id: Mapped[int] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )
    interest_id: Mapped[int] = mapped_column(
        ForeignKey("interests.id", ondelete="CASCADE"), primary_key=True
    )

    profile: Mapped["Profile"] = relationship("Profile", back_populates="interests")
    interest: Mapped["Interest"] = relationship("Interest", back_populates="profiles")


class ProfileSkill(Base):
    __tablename__ = "profile_skills"

    profile_id: Mapped[int] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True
    )
    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True
    )
    level: Mapped[int] = mapped_column(default=1)

    profile: Mapped["Profile"] = relationship("Profile", back_populates="skills")
    skill: Mapped["Skill"] = relationship("Skill", back_populates="profile_skills")


from app.models.user import User  # noqa: E402


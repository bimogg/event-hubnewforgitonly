from enum import Enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, Float, func
from typing import Optional
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class SlotStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    FILLED = "filled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ApplicationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CompletionStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class InternshipSlot(Base, TimestampMixin):
    """Слот микро-стажировки (2-4 часа)"""
    __tablename__ = "internship_slots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    
    # Предприятие
    company_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    
    # Микрозадача
    operation: Mapped[str] = mapped_column(String(255))  # Контроль размеров, отбор проб и т.д.
    required_skills: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String), nullable=True)
    required_skills_level: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)  # {"skill": "level"}
    
    # Временное окно
    slot_start: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True))
    slot_end: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    duration_hours: Mapped[float] = mapped_column(Float)  # 2-4 часа
    
    # Локация
    address: Mapped[str] = mapped_column(String(512))
    city: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Оплата и бонусы
    payment: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # Оплата за слот
    bonus: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Бонусы/льготы
    
    # Статус и метрики
    status: Mapped[Optional[str]] = mapped_column(String(50), default=SlotStatus.DRAFT.value)
    max_applicants: Mapped[int] = mapped_column(Integer, default=1)
    current_applicants: Mapped[int] = mapped_column(Integer, default=0)
    
    # Чек-лист для выполнения
    checklist: Mapped[Optional[list[str]]] = mapped_column(ARRAY(Text), nullable=True)
    
    # Метрики качества
    quality_metrics: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)  # {"speed": 0.9, "accuracy": 0.95}
    
    # Связи
    company: Mapped[Optional["User"]] = relationship("User", foreign_keys=[company_id])
    applications: Mapped[list["SlotApplication"]] = relationship(
        "SlotApplication", back_populates="slot", cascade="all,delete-orphan"
    )


class SlotApplication(Base, TimestampMixin):
    """Заявка студента на слот"""
    __tablename__ = "slot_applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slot_id: Mapped[int] = mapped_column(
        ForeignKey("internship_slots.id", ondelete="CASCADE"), index=True
    )
    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    
    status: Mapped[str] = mapped_column(
        String(50), default=ApplicationStatus.PENDING.value
    )
    
    # Мотивация студента
    motivation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Время подачи заявки
    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    
    # Связи
    slot: Mapped["InternshipSlot"] = relationship("InternshipSlot", back_populates="applications")
    student: Mapped["User"] = relationship("User", foreign_keys=[student_id])
    completion: Mapped["SlotCompletion | None"] = relationship(
        "SlotCompletion", back_populates="application", uselist=False
    )


class SlotCompletion(Base, TimestampMixin):
    """Завершение и подтверждение слота"""
    __tablename__ = "slot_completions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    application_id: Mapped[int] = mapped_column(
        ForeignKey("slot_applications.id", ondelete="CASCADE"), index=True, unique=True
    )
    
    # Статус подтверждения
    status: Mapped[str] = mapped_column(
        String(50), default=CompletionStatus.PENDING.value
    )
    
    # Чек-лист выполнения
    checklist_completed: Mapped[Optional[list[bool]]] = mapped_column(ARRAY(Boolean), nullable=True)
    photos: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)  # URL фото-доказательств
    
    # Оценка мастера
    master_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    master_feedback: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    master_rating: Mapped[int] = mapped_column(Integer, nullable=True)  # 1-5
    is_ready: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)  # Готов/не готов
    
    # Метрики выполнения
    completion_time_minutes: Mapped[int] = mapped_column(Integer, nullable=True)
    quality_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)  # 0.0-1.0
    
    # Время подтверждения
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Связи
    application: Mapped["SlotApplication"] = relationship("SlotApplication", back_populates="completion")
    master: Mapped["User | None"] = relationship("User", foreign_keys=[master_id])


from app.models.user import User  # noqa: E402


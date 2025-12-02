from datetime import datetime
from typing import Optional, Sequence

from sqlalchemy import and_, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.internship import InternshipSlot, SlotApplication, SlotCompletion, SlotStatus, ApplicationStatus
from app.repositories.base import BaseRepository


class InternshipSlotRepository(BaseRepository[InternshipSlot]):
    def __init__(self) -> None:
        super().__init__(InternshipSlot)

    async def search(
        self,
        db: AsyncSession,
        *,
        city: Optional[str] = None,
        status: Optional[SlotStatus] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        skills: Optional[list[str]] = None,
        offset: int = 0,
        limit: int = 50,
    ) -> Sequence[InternshipSlot]:
        stmt = select(InternshipSlot)
        conditions = []

        if city:
            conditions.append(InternshipSlot.city == city)
        if status:
            conditions.append(InternshipSlot.status == status.value)
        if date_from:
            conditions.append(InternshipSlot.slot_start >= date_from)
        if date_to:
            conditions.append(InternshipSlot.slot_end <= date_to)
        if skills:
            # Поиск по требуемым навыкам (хотя бы один совпадает)
            conditions.append(
                InternshipSlot.required_skills.overlap(skills)
            )

        if conditions:
            stmt = stmt.where(and_(*conditions))

        stmt = stmt.order_by(InternshipSlot.slot_start).offset(offset).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_company(
        self, db: AsyncSession, company_id: int
    ) -> Sequence[InternshipSlot]:
        stmt = select(InternshipSlot).where(InternshipSlot.company_id == company_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_available_slots(
        self, db: AsyncSession, date_from: Optional[datetime] = None
    ) -> Sequence[InternshipSlot]:
        """Получить доступные слоты (опубликованные и не заполненные)"""
        stmt = select(InternshipSlot).where(
            and_(
                InternshipSlot.status == SlotStatus.PUBLISHED.value,
                InternshipSlot.current_applicants < InternshipSlot.max_applicants,
            )
        )
        if date_from:
            stmt = stmt.where(InternshipSlot.slot_start >= date_from)
        stmt = stmt.order_by(InternshipSlot.slot_start)
        result = await db.execute(stmt)
        return result.scalars().all()


class SlotApplicationRepository(BaseRepository[SlotApplication]):
    def __init__(self) -> None:
        super().__init__(SlotApplication)

    async def get_by_student(
        self, db: AsyncSession, student_id: int
    ) -> Sequence[SlotApplication]:
        stmt = select(SlotApplication).where(SlotApplication.student_id == student_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_slot(
        self, db: AsyncSession, slot_id: int
    ) -> Sequence[SlotApplication]:
        stmt = select(SlotApplication).where(SlotApplication.slot_id == slot_id)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def get_by_student_and_slot(
        self, db: AsyncSession, student_id: int, slot_id: int
    ) -> Optional[SlotApplication]:
        stmt = select(SlotApplication).where(
            and_(
                SlotApplication.student_id == student_id,
                SlotApplication.slot_id == slot_id,
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()


class SlotCompletionRepository(BaseRepository[SlotCompletion]):
    def __init__(self) -> None:
        super().__init__(SlotCompletion)

    async def get_by_application(
        self, db: AsyncSession, application_id: int
    ) -> Optional[SlotCompletion]:
        stmt = select(SlotCompletion).where(
            SlotCompletion.application_id == application_id
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_student(
        self, db: AsyncSession, student_id: int
    ) -> Sequence[SlotCompletion]:
        stmt = (
            select(SlotCompletion)
            .join(SlotApplication)
            .where(SlotApplication.student_id == student_id)
        )
        result = await db.execute(stmt)
        return result.scalars().all()


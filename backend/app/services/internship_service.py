import logging
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.internship import (
    InternshipSlot,
    SlotApplication,
    SlotCompletion,
    SlotStatus,
    ApplicationStatus,
    CompletionStatus,
)
from app.models.user import User
from app.repositories.internship_repository import (
    InternshipSlotRepository,
    SlotApplicationRepository,
    SlotCompletionRepository,
)
from app.schemas.internship import (
    InternshipSlotCreate,
    InternshipSlotUpdate,
    SlotApplicationCreate,
    SlotCompletionCreate,
    SlotCompletionUpdate,
)

logger = logging.getLogger(__name__)


class InternshipService:
    def __init__(self):
        self.slot_repo = InternshipSlotRepository()
        self.application_repo = SlotApplicationRepository()
        self.completion_repo = SlotCompletionRepository()

    async def create_slot(
        self, db: AsyncSession, company: User, slot_in: InternshipSlotCreate
    ) -> InternshipSlot:
        """Создание слота стажировки"""
        slot_data = {
            **slot_in.dict(),
            "company_id": company.id,
            "status": SlotStatus.DRAFT.value,
            "current_applicants": 0,
        }
        slot = await self.slot_repo.create(db, slot_data)
        return slot

    async def update_slot(
        self,
        db: AsyncSession,
        company: User,
        slot_id: int,
        slot_in: InternshipSlotUpdate,
    ) -> InternshipSlot:
        """Обновление слота"""
        slot = await self.slot_repo.get(db, slot_id)
        if not slot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
            )
        if slot.company_id != company.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not slot owner",
            )

        data = slot_in.dict(exclude_unset=True)
        slot = await self.slot_repo.update(db, slot, data)
        return slot

    async def publish_slot(
        self, db: AsyncSession, company: User, slot_id: int
    ) -> InternshipSlot:
        """Публикация слота"""
        slot = await self.slot_repo.get(db, slot_id)
        if not slot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
            )
        if slot.company_id != company.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not slot owner"
            )

        slot.status = SlotStatus.PUBLISHED.value
        await db.flush()
        await db.refresh(slot)
        return slot

    async def apply_for_slot(
        self, db: AsyncSession, student: User, application_in: SlotApplicationCreate
    ) -> SlotApplication:
        """Подача заявки на слот"""
        slot = await self.slot_repo.get(db, application_in.slot_id)
        if not slot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
            )

        if slot.status != SlotStatus.PUBLISHED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Slot is not available for applications",
            )

        if slot.current_applicants >= slot.max_applicants:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Slot is full",
            )

        # Проверяем, не подал ли уже заявку
        existing = await self.application_repo.get_by_student_and_slot(
            db, student.id, application_in.slot_id
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already applied for this slot",
            )

        application = await self.application_repo.create(
            db,
            {
                "slot_id": application_in.slot_id,
                "student_id": student.id,
                "motivation": application_in.motivation,
                "status": ApplicationStatus.PENDING.value,
            },
        )

        # Увеличиваем счетчик заявок
        slot.current_applicants += 1
        await db.flush()

        return application

    async def approve_application(
        self, db: AsyncSession, company: User, application_id: int
    ) -> SlotApplication:
        """Одобрение заявки компанией"""
        application = await self.application_repo.get(db, application_id)
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        slot = await self.slot_repo.get(db, application.slot_id)
        if slot.company_id != company.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not slot owner"
            )

        application.status = ApplicationStatus.APPROVED.value
        await db.flush()
        await db.refresh(application)
        return application

    async def complete_slot(
        self,
        db: AsyncSession,
        student: User,
        completion_in: SlotCompletionCreate,
    ) -> SlotCompletion:
        """Завершение слота студентом"""
        application = await self.application_repo.get(db, completion_in.application_id)
        if not application:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Application not found",
            )

        if application.student_id != student.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not your application",
            )

        if application.status != ApplicationStatus.APPROVED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application is not approved",
            )

        completion = await self.completion_repo.create(
            db,
            {
                "application_id": completion_in.application_id,
                "checklist_completed": completion_in.checklist_completed,
                "photos": completion_in.photos,
                "completion_time_minutes": completion_in.completion_time_minutes,
                "status": CompletionStatus.PENDING.value,
            },
        )

        return completion

    async def confirm_completion(
        self,
        db: AsyncSession,
        master: User,
        completion_id: int,
        completion_in: SlotCompletionUpdate,
    ) -> SlotCompletion:
        """Подтверждение завершения мастером (1 клик)"""
        completion = await self.completion_repo.get(db, completion_id)
        if not completion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Completion not found",
            )

        application = await self.application_repo.get(db, completion.application_id)
        slot = await self.slot_repo.get(db, application.slot_id)

        if slot.company_id != master.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Not slot owner"
            )

        data = completion_in.dict(exclude_unset=True)
        if data.get("status") == CompletionStatus.CONFIRMED.value:
            data["confirmed_at"] = datetime.now(timezone.utc)
            # Обновляем статус заявки
            application.status = ApplicationStatus.COMPLETED.value
            slot.status = SlotStatus.COMPLETED.value

        completion = await self.completion_repo.update(db, completion, data)
        return completion


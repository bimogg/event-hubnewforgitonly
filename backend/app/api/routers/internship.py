import logging
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_roles
from app.core.db import get_db
from app.models.internship import SlotStatus, ApplicationStatus
from app.models.user import User, UserRole
from app.schemas.internship import (
    InternshipSlotCreate,
    InternshipSlotRead,
    InternshipSlotUpdate,
    SlotApplicationCreate,
    SlotApplicationRead,
    SlotCompletionCreate,
    SlotCompletionRead,
    SlotCompletionUpdate,
    MatchingRequest,
    MatchedSlot,
)
from app.services.internship_service import InternshipService
from app.services.matching_service import MatchingService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/internship", tags=["internship"])


@router.post(
    "/slots",
    response_model=InternshipSlotRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)
async def create_slot(
    slot_in: InternshipSlotCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InternshipSlotRead:
    """Создание слота стажировки (для компаний)"""
    service = InternshipService()
    slot = await service.create_slot(db, current_user, slot_in)
    await db.commit()
    return InternshipSlotRead.model_validate(slot)


@router.get("/slots", response_model=List[InternshipSlotRead])
async def list_slots(
    city: Optional[str] = Query(None),
    status: Optional[SlotStatus] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    skills: Optional[List[str]] = Query(None),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> List[InternshipSlotRead]:
    """Список доступных слотов"""
    service = InternshipService()
    slots = await service.slot_repo.search(
        db,
        city=city,
        status=status,
        date_from=date_from,
        date_to=date_to,
        skills=skills,
        offset=offset,
        limit=limit,
    )
    return [InternshipSlotRead.model_validate(slot) for slot in slots]


@router.get("/slots/{slot_id}", response_model=InternshipSlotRead)
async def get_slot(
    slot_id: int,
    db: AsyncSession = Depends(get_db),
) -> InternshipSlotRead:
    """Получение информации о слоте"""
    service = InternshipService()
    slot = await service.slot_repo.get(db, slot_id)
    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
        )
    return InternshipSlotRead.model_validate(slot)


@router.patch(
    "/slots/{slot_id}",
    response_model=InternshipSlotRead,
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)
async def update_slot(
    slot_id: int,
    slot_in: InternshipSlotUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InternshipSlotRead:
    """Обновление слота"""
    service = InternshipService()
    slot = await service.update_slot(db, current_user, slot_id, slot_in)
    await db.commit()
    return InternshipSlotRead.model_validate(slot)


@router.post(
    "/slots/{slot_id}/publish",
    response_model=InternshipSlotRead,
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)
async def publish_slot(
    slot_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InternshipSlotRead:
    """Публикация слота"""
    service = InternshipService()
    slot = await service.publish_slot(db, current_user, slot_id)
    await db.commit()
    return InternshipSlotRead.model_validate(slot)


@router.post(
    "/slots/apply",
    response_model=SlotApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
async def apply_for_slot(
    application_in: SlotApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SlotApplicationRead:
    """Подача заявки на слот (для студентов)"""
    service = InternshipService()
    application = await service.apply_for_slot(db, current_user, application_in)
    await db.commit()
    return SlotApplicationRead.model_validate(application)


@router.post(
    "/applications/{application_id}/approve",
    response_model=SlotApplicationRead,
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)
async def approve_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SlotApplicationRead:
    """Одобрение заявки компанией"""
    service = InternshipService()
    application = await service.approve_application(
        db, current_user, application_id
    )
    await db.commit()
    return SlotApplicationRead.model_validate(application)


@router.post(
    "/slots/complete",
    response_model=SlotCompletionRead,
    status_code=status.HTTP_201_CREATED,
)
async def complete_slot(
    completion_in: SlotCompletionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SlotCompletionRead:
    """Завершение слота студентом"""
    service = InternshipService()
    completion = await service.complete_slot(db, current_user, completion_in)
    await db.commit()
    return SlotCompletionRead.model_validate(completion)


@router.post(
    "/completions/{completion_id}/confirm",
    response_model=SlotCompletionRead,
    dependencies=[Depends(require_roles(UserRole.ORGANIZER, UserRole.ADMIN))],
)
async def confirm_completion(
    completion_id: int,
    completion_in: SlotCompletionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SlotCompletionRead:
    """Подтверждение завершения мастером (1 клик)"""
    service = InternshipService()
    completion = await service.confirm_completion(
        db, current_user, completion_id, completion_in
    )
    await db.commit()
    return SlotCompletionRead.model_validate(completion)


@router.post("/slots/match", response_model=List[MatchedSlot])
async def match_slots(
    matching_request: MatchingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[MatchedSlot]:
    """Матчинг слотов для студента по навыкам, времени и расстоянию"""
    if matching_request.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only match for yourself",
        )

    matching_service = MatchingService()
    matches = await matching_service.match_slots_for_student(
        db,
        matching_request.student_id,
        matching_request.available_time_windows,
        matching_request.student_skills,
        matching_request.max_distance_km,
        matching_request.city,
    )

    return [
        MatchedSlot(
            slot=InternshipSlotRead.model_validate(slot),
            match_score=score,
            skills_match=breakdown["skills_match"],
            time_match=breakdown["time_match"],
            distance_km=breakdown.get("distance_km"),
        )
        for slot, score, breakdown in matches
    ]


@router.get("/my/applications", response_model=List[SlotApplicationRead])
async def get_my_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[SlotApplicationRead]:
    """Получение моих заявок"""
    service = InternshipService()
    applications = await service.application_repo.get_by_student(
        db, current_user.id
    )
    return [SlotApplicationRead.model_validate(app) for app in applications]


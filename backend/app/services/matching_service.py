import logging
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import math

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.internship import InternshipSlot
from app.models.profile import Profile, ProfileSkill, Skill
from app.repositories.internship_repository import InternshipSlotRepository
from app.repositories.profile_repository import ProfileRepository

logger = logging.getLogger(__name__)


class MatchingService:
    """Сервис матчинга слотов стажировок по навыкам, времени и расстоянию"""

    def __init__(self):
        self.slot_repo = InternshipSlotRepository()
        self.profile_repo = ProfileRepository()

    def calculate_distance(
        self, lat1: float, lon1: float, lat2: float, lon2: float
    ) -> float:
        """Вычисляет расстояние между двумя точками в километрах (формула гаверсинуса)"""
        if not all([lat1, lon1, lat2, lon2]):
            return float("inf")

        R = 6371  # Радиус Земли в км
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.asin(math.sqrt(a))
        return R * c

    def calculate_skills_match(
        self,
        required_skills: Optional[List[str]],
        required_levels: Optional[Dict[str, int]],
        student_skills: Optional[Dict[str, int]],
    ) -> float:
        """Вычисляет совпадение навыков (0.0 - 1.0)"""
        if not required_skills:
            return 0.5  # Если навыки не требуются, средний балл

        if not student_skills:
            return 0.0

        matched_skills = 0
        total_level_match = 0.0
        total_required_level = 0

        for skill in required_skills:
            if skill in student_skills:
                matched_skills += 1
                student_level = student_skills[skill]
                required_level = required_levels.get(skill, 1) if required_levels else 1
                total_required_level += required_level
                # Бонус за превышение требуемого уровня
                if student_level >= required_level:
                    total_level_match += 1.0
                else:
                    # Штраф за недостаточный уровень
                    total_level_match += student_level / required_level

        if not required_skills:
            return 0.0

        # Процент совпадения навыков
        skills_coverage = matched_skills / len(required_skills)
        # Средний уровень совпадения
        level_match = (
            total_level_match / len(required_skills) if required_skills else 0.0
        )

        # Комбинированный балл
        return (skills_coverage * 0.6) + (level_match * 0.4)

    def calculate_time_match(
        self,
        slot_start: datetime,
        slot_end: datetime,
        available_windows: List[Dict[str, datetime]],
    ) -> float:
        """Вычисляет совпадение по времени (0.0 - 1.0)"""
        if not available_windows:
            return 0.0

        best_match = 0.0

        for window in available_windows:
            window_start = window.get("start")
            window_end = window.get("end")

            if not window_start or not window_end:
                continue

            # Проверяем, входит ли слот в окно
            if slot_start >= window_start and slot_end <= window_end:
                # Полное совпадение
                overlap = (slot_end - slot_start).total_seconds()
                window_duration = (window_end - window_start).total_seconds()
                match = overlap / window_duration if window_duration > 0 else 0.0
                best_match = max(best_match, match)
            elif slot_start < window_end and slot_end > window_start:
                # Частичное совпадение
                overlap_start = max(slot_start, window_start)
                overlap_end = min(slot_end, window_end)
                overlap = (overlap_end - overlap_start).total_seconds()
                slot_duration = (slot_end - slot_start).total_seconds()
                match = overlap / slot_duration if slot_duration > 0 else 0.0
                best_match = max(best_match, match)

        return best_match

    def calculate_distance_score(
        self, distance_km: float, max_distance_km: Optional[float] = None
    ) -> float:
        """Вычисляет балл по расстоянию (0.0 - 1.0)"""
        if math.isinf(distance_km):
            return 0.0

        if max_distance_km:
            if distance_km > max_distance_km:
                return 0.0
            return 1.0 - (distance_km / max_distance_km) * 0.5  # Штраф до 50%

        # Без ограничения расстояния - штраф за большие расстояния
        if distance_km < 5:
            return 1.0
        elif distance_km < 20:
            return 0.8
        elif distance_km < 50:
            return 0.6
        else:
            return 0.3

    async def match_slots_for_student(
        self,
        db: AsyncSession,
        student_id: int,
        available_windows: List[Dict[str, datetime]],
        student_skills: Optional[Dict[str, int]] = None,
        max_distance_km: Optional[float] = None,
        city: Optional[str] = None,
        limit: int = 20,
    ) -> List[Tuple[InternshipSlot, float, Dict[str, float]]]:
        """
        Находит подходящие слоты для студента
        Возвращает список (slot, total_score, breakdown)
        """
        # Получаем профиль студента для навыков и локации
        profile = await self.profile_repo.get_by_user_id(db, student_id)
        if not profile:
            logger.warning(f"Profile not found for student {student_id}")
            return []

        # Если навыки не переданы, получаем из профиля
        if not student_skills and profile:
            skills = await db.execute(
                select(ProfileSkill)
                .join(Skill)
                .where(ProfileSkill.profile_id == profile.id)
            )
            student_skills = {
                skill.skill.name: skill.level for skill in skills.scalars().all()
            }

        # Получаем доступные слоты
        slots = await self.slot_repo.get_available_slots(db)
        if city:
            slots = [s for s in slots if s.city == city]

        matches = []

        for slot in slots:
            # Вычисляем совпадение навыков
            skills_match = self.calculate_skills_match(
                slot.required_skills,
                slot.required_skills_level,
                student_skills,
            )

            # Вычисляем совпадение времени
            time_match = self.calculate_time_match(
                slot.slot_start, slot.slot_end, available_windows
            )

            # Вычисляем расстояние
            distance_km = float("inf")
            distance_score = 0.0
            if profile.city and slot.latitude and slot.longitude:
                # Упрощенная логика - если города совпадают, расстояние 0
                if profile.city == slot.city:
                    distance_km = 0.0
                    distance_score = 1.0
                elif slot.latitude and slot.longitude:
                    # Здесь нужна геолокация профиля, упрощенно
                    distance_score = self.calculate_distance_score(
                        distance_km, max_distance_km
                    )

            # Общий балл (взвешенная сумма)
            total_score = (
                skills_match * 0.4 + time_match * 0.4 + distance_score * 0.2
            )

            matches.append(
                (
                    slot,
                    total_score,
                    {
                        "skills_match": skills_match,
                        "time_match": time_match,
                        "distance_km": distance_km if not math.isinf(distance_km) else None,
                        "distance_score": distance_score,
                    },
                )
            )

        # Сортируем по общему баллу
        matches.sort(key=lambda x: x[1], reverse=True)

        return matches[:limit]


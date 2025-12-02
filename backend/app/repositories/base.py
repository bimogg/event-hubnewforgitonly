from typing import Generic, Optional, Sequence, Type, TypeVar

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base


ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id_: int) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id_))
        return result.scalar_one_or_none()

    async def list(self, db: AsyncSession, offset: int = 0, limit: int = 100) -> Sequence[ModelType]:
        result = await db.execute(
            select(self.model).offset(offset).limit(limit)
        )
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: dict) -> ModelType:
        obj = self.model(**obj_in)
        db.add(obj)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, db_obj: ModelType, obj_in: dict) -> ModelType:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, db_obj: ModelType) -> None:
        await db.delete(db_obj)
        await db.flush()


from typing import Optional, Sequence

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import Chat, ChatParticipant, ChatType, Message
from app.repositories.base import BaseRepository


class ChatRepository(BaseRepository[Chat]):
    def __init__(self) -> None:
        super().__init__(Chat)

    async def get_personal_chat(
        self, db: AsyncSession, user1_id: int, user2_id: int
    ) -> Optional[Chat]:
        stmt = (
            select(Chat)
            .join(ChatParticipant)
            .where(
                Chat.type == ChatType.PERSONAL.value,
                ChatParticipant.user_id.in_([user1_id, user2_id]),
            )
            .group_by(Chat.id)
        )
        result = await db.execute(stmt)
        # Additional filtering in Python to ensure exactly two participants
        for chat in result.scalars().all():
            participants = {p.user_id for p in chat.participants}
            if participants == {user1_id, user2_id}:
                return chat
        return None


class ChatParticipantRepository(BaseRepository[ChatParticipant]):
    def __init__(self) -> None:
        super().__init__(ChatParticipant)


class MessageRepository(BaseRepository[Message]):
    def __init__(self) -> None:
        super().__init__(Message)

    async def list_by_chat(
        self, db: AsyncSession, chat_id: int, offset: int = 0, limit: int = 100
    ) -> Sequence[Message]:
        stmt = (
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.asc())
            .offset(offset)
            .limit(limit)
        )
        result = await db.execute(stmt)
        return result.scalars().all()


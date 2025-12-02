from typing import List

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import Chat, ChatParticipant, ChatType, Message
from app.models.user import User
from app.repositories.chat_repository import (
    ChatParticipantRepository,
    ChatRepository,
    MessageRepository,
)
from app.schemas.chat import MessageCreate


class ChatService:
    def __init__(
        self,
        chat_repo: ChatRepository | None = None,
        participant_repo: ChatParticipantRepository | None = None,
        message_repo: MessageRepository | None = None,
    ) -> None:
        self.chat_repo = chat_repo or ChatRepository()
        self.participant_repo = participant_repo or ChatParticipantRepository()
        self.message_repo = message_repo or MessageRepository()

    async def get_chat(self, db: AsyncSession, chat_id: int) -> Chat:
        chat = await self.chat_repo.get(db, chat_id)
        if not chat:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat not found")
        return chat

    async def get_or_create_personal_chat(
        self, db: AsyncSession, current_user: User, other_user_id: int
    ) -> Chat:
        chat = await self.chat_repo.get_personal_chat(
            db, current_user.id, other_user_id
        )
        if chat:
            return chat
        chat = await self.chat_repo.create(
            db,
            {
                "type": ChatType.PERSONAL.value,
                "team_id": None,
                "event_id": None,
            },
        )
        db.add(ChatParticipant(chat_id=chat.id, user_id=current_user.id))
        db.add(ChatParticipant(chat_id=chat.id, user_id=other_user_id))
        await db.flush()
        await db.refresh(chat)
        return chat

    async def create_message(
        self, db: AsyncSession, chat_id: int, sender: User, message_in: MessageCreate
    ) -> Message:
        chat = await self.get_chat(db, chat_id)
        if sender.id not in {p.user_id for p in chat.participants}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not a participant of this chat",
            )
        message = await self.message_repo.create(
            db,
            {
                "chat_id": chat.id,
                "sender_id": sender.id,
                "content": message_in.content,
            },
        )
        return message

    async def list_messages(
        self, db: AsyncSession, chat_id: int, offset: int = 0, limit: int = 100
    ) -> List[Message]:
        return list(await self.message_repo.list_by_chat(db, chat_id, offset, limit))


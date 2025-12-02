from typing import List

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.db import get_db
from app.core.redis import get_redis
from app.models.user import User
from app.schemas.chat import ChatRead, MessageCreate, MessageRead
from app.services.chat_service import ChatService


router = APIRouter(prefix="/chats", tags=["chats"])


@router.post("/personal/{user_id}", response_model=ChatRead)
async def create_personal_chat(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatRead:
    service = ChatService()
    chat = await service.get_or_create_personal_chat(db, current_user, user_id)
    await db.commit()
    return ChatRead.model_validate(chat)


@router.get("/{chat_id}/messages", response_model=List[MessageRead])
async def list_messages(
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[MessageRead]:
    service = ChatService()
    messages = await service.list_messages(db, chat_id)
    return [MessageRead.model_validate(m) for m in messages]


@router.post("/{chat_id}/messages", response_model=MessageRead)
async def send_message(
    chat_id: int,
    message_in: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageRead:
    service = ChatService()
    message = await service.create_message(db, chat_id, current_user, message_in)
    await db.commit()
    return MessageRead.model_validate(message)


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, chat_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        connections = self.active_connections.setdefault(chat_id, [])
        connections.append(websocket)

    def disconnect(self, chat_id: int, websocket: WebSocket) -> None:
        connections = self.active_connections.get(chat_id, [])
        if websocket in connections:
            connections.remove(websocket)

    async def broadcast(self, chat_id: int, message: dict) -> None:
        connections = self.active_connections.get(chat_id, [])
        for connection in connections:
            await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/ws/{chat_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    chat_id: int,
    db: AsyncSession = Depends(get_db),
    redis=Depends(get_redis),
) -> None:
    await manager.connect(chat_id, websocket)
    await redis.set(f"chat:{chat_id}:online", "1", ex=60)
    service = ChatService()
    try:
        while True:
            data = await websocket.receive_json()
            user_id = data.get("user_id")
            content = data.get("content")
            if not user_id or not content:
                continue
            user = await db.get(User, user_id)
            if not user:
                continue
            msg = await service.create_message(
                db, chat_id, user, MessageCreate(content=content)
            )
            await db.commit()
            await manager.broadcast(
                chat_id,
                {
                    "id": msg.id,
                    "chat_id": msg.chat_id,
                    "sender_id": msg.sender_id,
                    "content": msg.content,
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(chat_id, websocket)


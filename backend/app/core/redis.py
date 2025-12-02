from typing import AsyncGenerator

from redis.asyncio import Redis

from app.core.config import get_settings


settings = get_settings()

redis_client: Redis | None = None


async def get_redis() -> AsyncGenerator[Redis, None]:
    global redis_client
    if redis_client is None:
        redis_client = Redis.from_url(settings.redis.url, decode_responses=True)
    try:
        yield redis_client
    finally:
        # Keep connection for reuse; do not close here
        pass


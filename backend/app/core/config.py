from functools import lru_cache

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseModel):
    # По умолчанию Docker-сервис; для локальной разработки переопредели в .env:
    # EVENTHUB_DATABASE__URL=postgresql+asyncpg://user:pass@localhost:5432/dbname
    url: str = "postgresql+asyncpg://eventhub:eventhub@db:5432/eventhub"


class RedisSettings(BaseModel):
    # Для локального запуска без Docker: redis://localhost:6379/0
    url: str = "redis://redis:6379/0"


class SecuritySettings(BaseModel):
    # IMPORTANT: Set EVENTHUB_SECURITY__SECRET_KEY in .env file for production!
    secret_key: str = "CHANGE_ME_SECRET_KEY"  # Change this in production!
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_minutes: int = 60 * 24 * 7


class AppSettings(BaseModel):
    project_name: str = "EventHub"
    debug: bool = False


class Settings(BaseSettings):
    database: DatabaseSettings = DatabaseSettings()
    redis: RedisSettings = RedisSettings()
    security: SecuritySettings = SecuritySettings()
    app: AppSettings = AppSettings()

    model_config = SettingsConfigDict(
        env_nested_delimiter="__",
        env_prefix="EVENTHUB_",
        env_file=".env",
        env_file_encoding="utf-8",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()

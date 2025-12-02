from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import bcrypt
import jwt

from app.core.config import get_settings


settings = get_settings()


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except ValueError:
        return False


def _create_token(
    subject: str,
    expires_delta: timedelta,
    token_type: str,
    additional_data: Optional[dict[str, Any]] = None,
) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    if additional_data:
        payload.update(additional_data)

    encoded_jwt = jwt.encode(
        payload, settings.security.secret_key, algorithm=settings.security.algorithm
    )
    return encoded_jwt


def create_access_token(subject: str, additional_data: Optional[dict[str, Any]] = None) -> str:
    expires_delta = timedelta(minutes=settings.security.access_token_expire_minutes)
    return _create_token(subject, expires_delta, "access", additional_data)


def create_refresh_token(subject: str, additional_data: Optional[dict[str, Any]] = None) -> str:
    expires_delta = timedelta(minutes=settings.security.refresh_token_expire_minutes)
    return _create_token(subject, expires_delta, "refresh", additional_data)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        settings.security.secret_key,
        algorithms=[settings.security.algorithm],
    )


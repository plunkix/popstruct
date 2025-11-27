from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from app.core.security import verify_token
from app.models.user import User
from app.core.database import SessionLocal


# Security scheme
security = HTTPBearer()


def get_db():
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = verify_token(token, token_type="access")

    if payload is None:
        raise credentials_exception

    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current admin user."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user


def check_user_limits(user: User, file_size_mb: float) -> None:
    """Check if user can perform the operation based on their subscription."""
    max_file_size = (
        settings.PREMIUM_MAX_FILE_SIZE_MB
        if user.subscription_tier == "premium"
        else settings.FREE_MAX_FILE_SIZE_MB
    )

    if file_size_mb > max_file_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds limit of {max_file_size}MB for {user.subscription_tier} tier"
        )

    # Check daily job limit (would need to query jobs created today)
    from datetime import datetime, timedelta
    from app.models.job import Job

    today = datetime.utcnow().date()
    jobs_today = db.query(Job).filter(
        Job.user_id == user.id,
        Job.created_at >= datetime.combine(today, datetime.min.time())
    ).count()

    max_jobs = (
        settings.PREMIUM_MAX_JOBS_PER_DAY
        if user.subscription_tier == "premium"
        else settings.FREE_MAX_JOBS_PER_DAY
    )

    if jobs_today >= max_jobs:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily job limit of {max_jobs} reached for {user.subscription_tier} tier"
        )


from app.core.config import settings

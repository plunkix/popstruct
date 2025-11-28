from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import os


class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "PopStruct"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://popstruct:popstruct_password@localhost:5432/popstruct"
    )

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    ALLOWED_ORIGINS: List[str] = []

    @field_validator('ALLOWED_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        # If nothing provided, use default localhost
        if not v or v == []:
            env_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
            v = env_origins

        if isinstance(v, str):
            # Handle single string or comma-separated
            if v == "*":
                return ["*"]
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Redis and Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

    # File Upload
    MAX_FILE_SIZE_MB: int = 100
    UPLOAD_DIR: str = "./app/static/uploads"
    RESULTS_DIR: str = "./app/static/results"
    ALLOWED_EXTENSIONS: List[str] = [".vcf", ".vcf.gz", ".csv", ".txt"]

    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_BASIC_PRICE_ID: str = os.getenv("STRIPE_BASIC_PRICE_ID", "")

    # Usage Limits
    FREE_MAX_FILE_SIZE_MB: int = 50
    FREE_MAX_JOBS_PER_DAY: int = 10
    FREE_MAX_STORAGE_GB: int = 1

    PREMIUM_MAX_FILE_SIZE_MB: int = 500
    PREMIUM_MAX_JOBS_PER_DAY: int = 100
    PREMIUM_MAX_STORAGE_GB: int = 50

    # Email (for password reset)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = 587
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM: str = os.getenv("SMTP_FROM", "noreply@popstruct.com")

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    class Config:
        case_sensitive = True
        env_file = ".env"


# Create global settings instance
settings = Settings()

# Create upload directories if they don't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.RESULTS_DIR, exist_ok=True)

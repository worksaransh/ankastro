import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AnkJyotish AI Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("INTERNAL_API_SECRET", "ankjyotish_super_secret_internal_key_2026")
    ALLOWED_HOSTS: list[str] = ["*"]
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

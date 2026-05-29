from __future__ import annotations

import logging

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    DATABASE_URL: str = "sqlite:///./data/library.db"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


settings = Settings()

if not settings.DATABASE_URL.startswith("sqlite") and all(
    "localhost" in o for o in settings.CORS_ORIGINS
):
    logger.warning(
        "CORS_ORIGINS only contains localhost origins but DATABASE_URL points to a remote database. "
        "Set CORS_ORIGINS to your production frontend URL (e.g. https://your-app.vercel.app)."
    )

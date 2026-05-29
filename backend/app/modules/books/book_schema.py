from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

_CURRENT_YEAR = datetime.now().year


class BookCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    author: str = Field(..., min_length=1, max_length=300)
    isbn: str | None = Field(None, pattern=r"^\d{10}(\d{3})?$")
    published_year: int | None = Field(None, ge=1000, le=_CURRENT_YEAR)
    description: str | None = Field(None, max_length=5000)
    cover_url: str | None = Field(None, max_length=2000)


class BookUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=500)
    author: str | None = Field(None, min_length=1, max_length=300)
    isbn: str | None = Field(None, pattern=r"^\d{10}(\d{3})?$")
    published_year: int | None = Field(None, ge=1000, le=_CURRENT_YEAR)
    description: str | None = Field(None, max_length=5000)
    cover_url: str | None = Field(None, max_length=2000)


class BookResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    isbn: str | None
    published_year: int | None
    description: str | None
    cover_url: str | None
    created_at: datetime
    updated_at: datetime

from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import (
    BookNotFoundError,
    DuplicateIsbnError,
    book_not_found_handler,
    duplicate_isbn_handler,
    internal_error_handler,
    validation_exception_handler,
)
from app.routers.index import router


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    yield


app = FastAPI(
    title="Digital Library API",
    version="1.0.0",
    description="CRUD API for managing books in a digital library.",
    lifespan=lifespan,
)

# CORS — origins read from settings, not hard-coded
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(BookNotFoundError, book_not_found_handler)
app.add_exception_handler(DuplicateIsbnError, duplicate_isbn_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, internal_error_handler)

# Routers
app.include_router(router)


@app.get("/health", tags=["health"])
def health_check() -> dict:
    """Render health check endpoint — returns 200 when the service is up."""
    return {"status": "ok"}

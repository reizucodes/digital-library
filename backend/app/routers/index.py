from __future__ import annotations

from fastapi import APIRouter

from app.routers.v1.books import router as books_router

router = APIRouter(prefix="/api/v1")

router.include_router(books_router)

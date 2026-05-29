from __future__ import annotations

from fastapi import Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.modules.books.book_repository import BookRepository
from app.modules.books.book_service import BookService


def get_book_service(db: Session = Depends(get_db)) -> BookService:
    repository = BookRepository(db)
    return BookService(repository)

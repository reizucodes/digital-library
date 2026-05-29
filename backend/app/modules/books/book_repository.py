from __future__ import annotations

from sqlalchemy.orm import Session

from app.modules.books.book_model import Book
from app.modules.books.book_repository_contract import BookRepositoryContract
from app.repositories.base_repository import BaseRepository


class BookRepository(BaseRepository[Book], BookRepositoryContract):
    model = Book

    def __init__(self, db: Session) -> None:
        super().__init__(db)

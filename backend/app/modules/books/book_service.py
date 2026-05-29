from __future__ import annotations

from sqlalchemy.exc import IntegrityError

from app.core.exceptions import BookNotFoundError, DuplicateIsbnError
from app.modules.books.book_repository_contract import BookRepositoryContract
from app.modules.books.book_schema import BookCreate, BookResponse, BookUpdate


class BookService:
    """Domain service for Book CRUD use-cases."""

    def __init__(self, repository: BookRepositoryContract) -> None:
        self.repository = repository

    def list_books(self) -> list[BookResponse]:
        books = self.repository.list()
        return [BookResponse.model_validate(book) for book in books]

    def get_book(self, book_id: int) -> BookResponse:
        book = self.repository.get(book_id)
        if book is None:
            raise BookNotFoundError(book_id)
        return BookResponse.model_validate(book)

    def create_book(self, data: BookCreate) -> BookResponse:
        try:
            book = self.repository.create(data.model_dump())
        except IntegrityError:
            isbn = data.isbn or ""
            raise DuplicateIsbnError(isbn) from None
        return BookResponse.model_validate(book)

    def update_book(self, book_id: int, data: BookUpdate) -> BookResponse:
        book = self.repository.get(book_id)
        if book is None:
            raise BookNotFoundError(book_id)
        # Only pass fields that were explicitly set (exclude_unset) to support partial updates
        updates = data.model_dump(exclude_unset=True)
        try:
            book = self.repository.update(book, updates)
        except IntegrityError:
            isbn = data.isbn or ""
            raise DuplicateIsbnError(isbn) from None
        return BookResponse.model_validate(book)

    def delete_book(self, book_id: int) -> None:
        book = self.repository.get(book_id)
        if book is None:
            raise BookNotFoundError(book_id)
        self.repository.delete(book)

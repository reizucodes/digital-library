from __future__ import annotations

from datetime import datetime
from unittest.mock import MagicMock

import pytest

from app.core.exceptions import BookNotFoundError
from app.modules.books.book_model import Book
from app.modules.books.book_schema import BookCreate, BookUpdate
from app.modules.books.book_service import BookService


def _make_book(**kwargs) -> Book:
    defaults = {
        "id": 1,
        "title": "Test Book",
        "author": "Test Author",
        "isbn": None,
        "published_year": None,
        "description": None,
        "cover_url": None,
        "created_at": datetime(2026, 1, 1, 0, 0, 0),
        "updated_at": datetime(2026, 1, 1, 0, 0, 0),
    }
    defaults.update(kwargs)
    book = Book()
    for k, v in defaults.items():
        setattr(book, k, v)
    return book


@pytest.fixture
def mock_repo() -> MagicMock:
    return MagicMock()


@pytest.fixture
def service(mock_repo: MagicMock) -> BookService:
    return BookService(repository=mock_repo)


class TestListBooks:
    def test_list_books_delegates_to_repository_list(
        self, service: BookService, mock_repo: MagicMock
    ):
        mock_repo.list.return_value = [_make_book()]
        result = service.list_books()
        mock_repo.list.assert_called_once()
        assert len(result) == 1
        assert result[0].title == "Test Book"


class TestGetBook:
    def test_get_book_returns_book_response_for_existing_id(
        self, service: BookService, mock_repo: MagicMock
    ):
        mock_repo.get.return_value = _make_book(id=5)
        result = service.get_book(5)
        mock_repo.get.assert_called_once_with(5)
        assert result.id == 5

    def test_get_book_raises_not_found_when_repository_returns_none(
        self, service: BookService, mock_repo: MagicMock
    ):
        mock_repo.get.return_value = None
        with pytest.raises(BookNotFoundError) as exc_info:
            service.get_book(999)
        assert exc_info.value.book_id == 999


class TestCreateBook:
    def test_create_book_calls_repository_create_and_returns_response(
        self, service: BookService, mock_repo: MagicMock
    ):
        data = BookCreate(title="New Book", author="New Author")
        created = _make_book(title="New Book", author="New Author")
        mock_repo.create.return_value = created
        result = service.create_book(data)
        mock_repo.create.assert_called_once_with(data.model_dump())
        assert result.title == "New Book"


class TestUpdateBook:
    def test_update_book_merges_partial_fields(self, service: BookService, mock_repo: MagicMock):
        existing = _make_book(id=1, title="Old Title")
        updated = _make_book(id=1, title="New Title")
        mock_repo.get.return_value = existing
        mock_repo.update.return_value = updated
        data = BookUpdate(title="New Title")
        result = service.update_book(1, data)
        mock_repo.update.assert_called_once_with(existing, {"title": "New Title"})
        assert result.title == "New Title"

    def test_update_book_raises_not_found_when_book_absent(
        self, service: BookService, mock_repo: MagicMock
    ):
        mock_repo.get.return_value = None
        with pytest.raises(BookNotFoundError):
            service.update_book(999, BookUpdate(title="X"))


class TestDeleteBook:
    def test_delete_book_calls_repository_delete(self, service: BookService, mock_repo: MagicMock):
        existing = _make_book(id=1)
        mock_repo.get.return_value = existing
        service.delete_book(1)
        mock_repo.delete.assert_called_once_with(existing)

    def test_delete_book_raises_not_found_when_book_absent(
        self, service: BookService, mock_repo: MagicMock
    ):
        mock_repo.get.return_value = None
        with pytest.raises(BookNotFoundError):
            service.delete_book(999)

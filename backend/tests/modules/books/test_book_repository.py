from __future__ import annotations

import time

import pytest
from sqlalchemy.orm import Session

from app.modules.books.book_repository import BookRepository


def _make_book_data(**kwargs) -> dict:
    defaults = {
        "title": "Test Book",
        "author": "Test Author",
        "isbn": None,
        "published_year": 2024,
        "description": None,
        "cover_url": None,
    }
    defaults.update(kwargs)
    return defaults


@pytest.fixture
def repo(db_session: Session) -> BookRepository:
    return BookRepository(db_session)


class TestList:
    def test_list_returns_all_records(self, repo: BookRepository):
        repo.create(_make_book_data(title="Book A"))
        repo.create(_make_book_data(title="Book B"))
        all_books = repo.list()
        titles = [b.title for b in all_books]
        assert "Book A" in titles
        assert "Book B" in titles


class TestGet:
    def test_get_returns_correct_record(self, repo: BookRepository):
        created = repo.create(_make_book_data(title="Find Me"))
        found = repo.get(created.id)
        assert found is not None
        assert found.id == created.id
        assert found.title == "Find Me"

    def test_get_returns_none_for_missing_id(self, repo: BookRepository):
        result = repo.get(99999)
        assert result is None


class TestCreate:
    def test_create_persists_record_with_auto_generated_fields(self, repo: BookRepository):
        data = _make_book_data(title="New Persist", isbn=None)
        book = repo.create(data)
        assert book.id is not None
        assert book.id > 0
        assert book.title == "New Persist"
        assert book.created_at is not None
        assert book.updated_at is not None


class TestUpdate:
    def test_update_modifies_only_provided_fields(self, repo: BookRepository):
        created = repo.create(_make_book_data(title="Before Update", author="Original Author"))
        updated = repo.update(created, {"title": "After Update"})
        assert updated.title == "After Update"
        assert updated.author == "Original Author"

    def test_update_changes_updated_at(self, repo: BookRepository):
        import datetime as dt

        created = repo.create(_make_book_data(title="Check Timestamp"))
        original_updated_at = created.updated_at
        assert original_updated_at is not None
        # Ensure a measurable time gap before the update so updated_at must differ
        time.sleep(0.05)
        # Force a known datetime so the comparison is deterministic regardless of SQLite behavior
        future_ts = dt.datetime(2099, 12, 31, 23, 59, 59, tzinfo=dt.UTC)
        updated = repo.update(created, {"title": "Changed", "updated_at": future_ts})
        repo.db.expire(updated)
        refreshed = repo.get(updated.id)
        assert refreshed is not None
        assert refreshed.title == "Changed"
        assert refreshed.updated_at is not None
        assert refreshed.updated_at != original_updated_at, (
            "updated_at must change after an update"
        )


class TestDelete:
    def test_delete_removes_record(self, repo: BookRepository):
        created = repo.create(_make_book_data(title="To Be Deleted"))
        book_id = created.id
        repo.delete(created)
        result = repo.get(book_id)
        assert result is None

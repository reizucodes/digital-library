from __future__ import annotations

from abc import ABC

from app.modules.books.book_model import Book
from app.repositories.contracts.base_repository_contract import BaseRepositoryContract


class BookRepositoryContract(BaseRepositoryContract[Book], ABC):
    # All shared CRUD from BaseRepositoryContract is sufficient.
    # No domain-specific query methods needed at this scope.
    pass

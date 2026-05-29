from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class BaseRepositoryContract(ABC, Generic[T]):
    @abstractmethod
    def get(self, entity_id: int) -> T | None:
        """Retrieve a single record by primary key; returns None if not found."""
        ...

    @abstractmethod
    def list(self) -> list[T]:
        """Retrieve all records."""
        ...

    @abstractmethod
    def create(self, data: dict) -> T:
        """Persist a new record and return it."""
        ...

    @abstractmethod
    def update(self, entity: T, data: dict) -> T:
        """Apply partial updates to an existing record and return it."""
        ...

    @abstractmethod
    def delete(self, entity: T) -> None:
        """Remove a record from the database."""
        ...

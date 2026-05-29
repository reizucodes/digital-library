from __future__ import annotations

from typing import Generic, TypeVar

from sqlalchemy.orm import Session

from app.repositories.contracts.base_repository_contract import BaseRepositoryContract

T = TypeVar("T")


class BaseRepository(BaseRepositoryContract[T], Generic[T]):
    model: type[T]

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, entity_id: int) -> T | None:
        return self.db.get(self.model, entity_id)

    def list(self) -> list[T]:
        return self.db.query(self.model).all()

    def create(self, data: dict) -> T:
        instance = self.model(**data)
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def update(self, entity: T, data: dict) -> T:
        for key, value in data.items():
            setattr(entity, key, value)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        self.db.delete(entity)
        self.db.commit()

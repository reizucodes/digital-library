"""Seed the database with sample books. Safe to re-run — skips existing titles."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.modules.books.book_model import Book

SAMPLE_BOOKS = [
    {
        "title": "The Pragmatic Programmer",
        "author": "David Thomas, Andrew Hunt",
        "isbn": "9780135957059",
        "published_year": 2019,
        "description": "A guide to becoming a more effective programmer through a collection of tips, best practices, and real-world advice.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9780132350884",
        "published_year": 2008,
        "description": "A handbook of agile software craftsmanship, covering principles, patterns, and practices for writing clean, maintainable code.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    },
    {
        "title": "Design Patterns",
        "author": "Gang of Four",
        "isbn": "9780201633610",
        "published_year": 1994,
        "description": "The classic book on software design patterns, introducing 23 foundational patterns for object-oriented design.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
    },
    {
        "title": "The Hitchhiker's Guide to the Galaxy",
        "author": "Douglas Adams",
        "isbn": "9780345391803",
        "published_year": 1979,
        "description": "A comedic science fiction series following the adventures of Arthur Dent after Earth is demolished to make way for a hyperspace bypass.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg",
    },
    {
        "title": "Dune",
        "author": "Frank Herbert",
        "isbn": "9780441013593",
        "published_year": 1965,
        "description": "An epic science fiction novel set on the desert planet Arrakis, exploring politics, religion, ecology, and human potential.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg",
    },
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "isbn": "9780062316097",
        "published_year": 2011,
        "description": "A sweeping history of the human species from the Stone Age through to the twenty-first century.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    },
    {
        "title": "Thinking, Fast and Slow",
        "author": "Daniel Kahneman",
        "isbn": "9780374533557",
        "published_year": 2011,
        "description": "An exploration of the two systems that drive the way we think — and how they shape our judgments and decisions.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "isbn": "9780451524935",
        "published_year": 1949,
        "description": "A dystopian novel set in a totalitarian society ruled by Big Brother, exploring surveillance, propaganda, and the destruction of truth.",
        "cover_url": "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
    },
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        existing_titles = {title for (title,) in db.query(Book.title).all()}
        to_insert = [b for b in SAMPLE_BOOKS if b["title"] not in existing_titles]

        if not to_insert:
            print("All sample books already present — nothing to seed.")
            return

        for data in to_insert:
            db.add(Book(**data))

        db.commit()
        print(f"Seeded {len(to_insert)} book(s).")


if __name__ == "__main__":
    seed()

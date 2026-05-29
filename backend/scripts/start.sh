#!/bin/bash
set -e

uv run --active alembic upgrade head

# Seed only on initial deploy — skipped if books table already has data
BOOK_COUNT=$(uv run --active python -c "
from app.database.session import SessionLocal
from app.modules.books.book_model import Book
with SessionLocal() as db:
    print(db.query(Book).count())
")

if [ "$BOOK_COUNT" = "0" ]; then
    uv run --active python scripts/seed.py
else
    echo "Database already seeded — skipping."
fi

.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $PORT

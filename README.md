# Digital Library

A full-stack CRUD application for managing a personal book collection.

Stack: FastAPI + SQLAlchemy + SQLite (backend) and Vue 3 + Pinia + Tailwind CSS (frontend).

---

## Prerequisites

- Python 3.12+
- Node 20+
- UV package manager — `pip install uv` or `brew install uv`

---

## Backend Setup

```bash
cd backend
uv venv
uv sync
cp .env.example .env
uv run alembic upgrade head
uv run fastapi dev app/main.py
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

---

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

- Frontend: http://localhost:5173

---

## Running Tests

```bash
# Backend
cd backend && uv run pytest

# Frontend
cd frontend && npm run test:run
```

---

## Linting

```bash
# Backend
uv run ruff check . && uv run ruff format .

# Frontend
npm run lint  (if configured)
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./data/library.db` | SQLAlchemy connection string. Swap to a PostgreSQL URL for production — no code changes required. |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed CORS origins. Tighten before deploying to production. |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Base URL for all API calls. Read via `import.meta.env.VITE_API_BASE_URL` in `src/api/client.ts`. |

---

## Architecture Overview

### Layer Stack

```
Router  →  Service  →  Repository  →  Model (SQLAlchemy)
```

- **Router** (`app/routers/v1/books.py`) — HTTP boundary. Validates input, delegates to service, formats response envelope.
- **Service** (`app/modules/books/book_service.py`) — Business logic. Raises domain errors (`BookNotFoundError`).
- **Repository** (`app/modules/books/book_repository.py`) — Data access via SQLAlchemy ORM only. No raw SQL.
- **Model** (`app/modules/books/book_model.py`) — SQLAlchemy declarative model with `books` table.

### Error Envelope

All error responses share this shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Book with id 99 not found.",
    "detail": []
  }
}
```

`code` values in use: `VALIDATION_ERROR`, `NOT_FOUND`, `DUPLICATE_ISBN`, `INTERNAL_ERROR`.

A duplicate ISBN on create or update returns **409** with `code: DUPLICATE_ISBN`.

### API Base URL

```
http://localhost:8000/api/v1/books
```

All endpoints are prefixed `/api/v1` per ADR-002.

### Field Notes

- **ISBN**: 10 or 13 digits only. Hyphens are not accepted by the API and must be stripped before submission.
- **`published_year`**: integer in the range 1000 to the current calendar year (inclusive). Validated dynamically — the upper bound updates automatically each year.
- **`cover_url`**: optional string up to 2000 characters. No URL format validation is enforced server-side at this scope.

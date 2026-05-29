from __future__ import annotations

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class BookNotFoundError(Exception):
    def __init__(self, book_id: int) -> None:
        self.book_id = book_id
        super().__init__(f"Book with id={book_id} not found")


class DuplicateIsbnError(Exception):
    def __init__(self, isbn: str) -> None:
        self.isbn = isbn
        super().__init__(f"A book with ISBN '{isbn}' already exists")


async def book_not_found_handler(request: Request, exc: BookNotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={
            "error": {
                "code": "NOT_FOUND",
                "message": str(exc),
                "detail": [],
            }
        },
    )


async def duplicate_isbn_handler(request: Request, exc: DuplicateIsbnError) -> JSONResponse:
    return JSONResponse(
        status_code=409,
        content={
            "error": {
                "code": "DUPLICATE_ISBN",
                "message": str(exc),
                "detail": [],
            }
        },
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "detail": exc.errors(),
            }
        },
    )


async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
                "detail": [],
            }
        },
    )

from __future__ import annotations

from fastapi import APIRouter, Depends, Response

from app.dependencies.services import get_book_service
from app.modules.books.book_schema import BookCreate, BookUpdate
from app.modules.books.book_service import BookService

router = APIRouter(prefix="/books", tags=["books"])


@router.get("", response_model=dict)
def list_books(
    service: BookService = Depends(get_book_service),
) -> dict:
    books = service.list_books()
    return {"data": [book.model_dump() for book in books]}


@router.post("", response_model=dict, status_code=201)
def create_book(
    body: BookCreate,
    service: BookService = Depends(get_book_service),
) -> dict:
    book = service.create_book(body)
    return {"data": book.model_dump()}


@router.get("/{book_id}", response_model=dict)
def get_book(
    book_id: int,
    service: BookService = Depends(get_book_service),
) -> dict:
    book = service.get_book(book_id)
    return {"data": book.model_dump()}


@router.put("/{book_id}", response_model=dict)
def update_book(
    book_id: int,
    body: BookUpdate,
    service: BookService = Depends(get_book_service),
) -> dict:
    book = service.update_book(book_id, body)
    return {"data": book.model_dump()}


@router.delete("/{book_id}", status_code=204)
def delete_book(
    book_id: int,
    service: BookService = Depends(get_book_service),
) -> Response:
    service.delete_book(book_id)
    return Response(status_code=204)

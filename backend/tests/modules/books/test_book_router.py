from __future__ import annotations

from fastapi.testclient import TestClient

VALID_BOOK = {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "published_year": 2008,
    "description": "A handbook of agile software craftsmanship.",
    "cover_url": "https://example.com/clean-code.jpg",
}

MINIMAL_BOOK = {
    "title": "Minimal Book",
    "author": "Author Name",
}


def _create_book(client: TestClient, data: dict | None = None) -> dict:
    response = client.post("/api/v1/books", json=data or VALID_BOOK)
    assert response.status_code == 201
    return response.json()["data"]


class TestListBooks:
    def test_list_returns_empty_array_on_fresh_db(self, client: TestClient):
        response = client.get("/api/v1/books")
        assert response.status_code == 200
        body = response.json()
        assert "data" in body
        assert body["data"] == []

    def test_list_returns_created_books(self, client: TestClient):
        _create_book(client, MINIMAL_BOOK)
        response = client.get("/api/v1/books")
        assert response.status_code == 200
        body = response.json()
        assert len(body["data"]) >= 1
        titles = [b["title"] for b in body["data"]]
        assert "Minimal Book" in titles


class TestCreateBook:
    def test_create_valid_book_returns_201_with_all_fields(self, client: TestClient):
        response = client.post("/api/v1/books", json=VALID_BOOK)
        assert response.status_code == 201
        data = response.json()["data"]
        assert data["title"] == VALID_BOOK["title"]
        assert data["author"] == VALID_BOOK["author"]
        assert data["isbn"] == VALID_BOOK["isbn"]
        assert data["published_year"] == VALID_BOOK["published_year"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_missing_required_field_title_returns_422_with_error_envelope(
        self, client: TestClient
    ):
        response = client.post("/api/v1/books", json={"author": "Someone"})
        assert response.status_code == 422
        body = response.json()
        # Verify full error envelope shape: error.code, error.message, error.detail
        assert "error" in body
        error = body["error"]
        assert error["code"] == "VALIDATION_ERROR"
        assert isinstance(error["message"], str) and error["message"]
        assert isinstance(error["detail"], list)

    def test_create_invalid_isbn_format_returns_422(self, client: TestClient):
        response = client.post(
            "/api/v1/books",
            json={"title": "Test", "author": "Author", "isbn": "123-456"},
        )
        assert response.status_code == 422

    def test_create_published_year_out_of_range_returns_422(self, client: TestClient):
        response = client.post(
            "/api/v1/books",
            json={"title": "Test", "author": "Author", "published_year": 500},
        )
        assert response.status_code == 422

    def test_create_duplicate_isbn_returns_409_with_error_envelope(self, client: TestClient):
        isbn_book = {
            "title": "First Book",
            "author": "Author One",
            "isbn": "9780132350884",
        }
        # First create succeeds
        first = client.post("/api/v1/books", json=isbn_book)
        assert first.status_code == 201
        # Second create with same ISBN must return 409
        second = client.post(
            "/api/v1/books",
            json={"title": "Second Book", "author": "Author Two", "isbn": "9780132350884"},
        )
        assert second.status_code == 409
        body = second.json()
        assert "error" in body
        assert body["error"]["code"] == "DUPLICATE_ISBN"
        assert isinstance(body["error"]["message"], str)


class TestGetBook:
    def test_get_existing_book_returns_200(self, client: TestClient):
        created = _create_book(client, MINIMAL_BOOK)
        response = client.get(f"/api/v1/books/{created['id']}")
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["id"] == created["id"]

    def test_get_non_existent_book_returns_404_with_error_envelope(self, client: TestClient):
        response = client.get("/api/v1/books/99999")
        assert response.status_code == 404
        body = response.json()
        # Verify full error envelope shape: error.code, error.message, error.detail
        assert "error" in body
        error = body["error"]
        assert error["code"] == "NOT_FOUND"
        assert isinstance(error["message"], str) and error["message"]
        assert isinstance(error["detail"], list)


class TestUpdateBook:
    def test_update_existing_book_partial_returns_200(self, client: TestClient):
        created = _create_book(client, MINIMAL_BOOK)
        response = client.put(
            f"/api/v1/books/{created['id']}",
            json={"title": "Updated Title"},
        )
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["title"] == "Updated Title"
        assert data["author"] == MINIMAL_BOOK["author"]

    def test_update_non_existent_book_returns_404(self, client: TestClient):
        response = client.put(
            "/api/v1/books/99999",
            json={"title": "Updated"},
        )
        assert response.status_code == 404

    def test_update_with_invalid_field_value_returns_422(self, client: TestClient):
        created = _create_book(client, MINIMAL_BOOK)
        response = client.put(
            f"/api/v1/books/{created['id']}",
            json={"published_year": 100},
        )
        assert response.status_code == 422


class TestDeleteBook:
    def test_delete_existing_book_returns_204_no_body(self, client: TestClient):
        created = _create_book(client, {"title": "To Delete", "author": "Author"})
        response = client.delete(f"/api/v1/books/{created['id']}")
        assert response.status_code == 204
        assert response.content == b""

    def test_delete_non_existent_book_returns_404(self, client: TestClient):
        response = client.delete("/api/v1/books/99999")
        assert response.status_code == 404

    def test_delete_then_get_returns_404(self, client: TestClient):
        created = _create_book(client, {"title": "Delete Then Get", "author": "Author"})
        book_id = created["id"]
        client.delete(f"/api/v1/books/{book_id}")
        response = client.get(f"/api/v1/books/{book_id}")
        assert response.status_code == 404

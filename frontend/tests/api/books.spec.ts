import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listBooks, getBook, createBook, updateBook, deleteBook } from '../../src/api/books'
import { ApiRequestError } from '../../src/api/client'
import type { Book, BookCreate, BookUpdate } from '../../src/types/book'

const mockBook: Book = {
  id: 1,
  title: 'Test Book',
  author: 'Test Author',
  isbn: null,
  published_year: 2020,
  description: null,
  cover_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

function mockFetch(status: number, body: unknown, headers?: Record<string, string>) {
  const responseBody = status === 204 ? null : JSON.stringify(body)
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers ?? { 'Content-Type': 'application/json' }),
    json: () => Promise.resolve(body),
  })
}

describe('books API client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listBooks', () => {
    it('makes GET to /api/v1/books and returns unwrapped array', async () => {
      global.fetch = mockFetch(200, { data: [mockBook] })

      const result = await listBooks()

      expect(result).toEqual([mockBook])
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books'),
        expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) }),
      )
    })
  })

  describe('getBook', () => {
    it('makes GET to /api/v1/books/:id', async () => {
      global.fetch = mockFetch(200, { data: mockBook })

      const result = await getBook(1)

      expect(result).toEqual(mockBook)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.any(Object),
      )
    })

    it('throws ApiRequestError with NOT_FOUND code on 404', async () => {
      global.fetch = mockFetch(404, { error: { code: 'NOT_FOUND', message: 'Book not found' } })

      await expect(getBook(999)).rejects.toThrow(ApiRequestError)
      await expect(getBook(999)).rejects.toMatchObject({
        apiError: { code: 'NOT_FOUND' },
      })
    })
  })

  describe('createBook', () => {
    it('makes POST with correct body and returns unwrapped book', async () => {
      global.fetch = mockFetch(201, { data: mockBook })

      const data: BookCreate = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: null,
        published_year: 2020,
        description: null,
        cover_url: null,
      }
      const result = await createBook(data)

      expect(result).toEqual(mockBook)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        }),
      )
    })

    it('throws ApiRequestError with VALIDATION_ERROR on 422', async () => {
      global.fetch = mockFetch(422, {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          detail: [{ field: 'title', msg: 'required' }],
        },
      })

      const data: BookCreate = {
        title: '',
        author: 'Author',
        isbn: null,
        published_year: null,
        description: null,
        cover_url: null,
      }

      await expect(createBook(data)).rejects.toThrow(ApiRequestError)
      await expect(createBook(data)).rejects.toMatchObject({
        apiError: { code: 'VALIDATION_ERROR' },
      })
    })
  })

  describe('updateBook', () => {
    it('makes PUT with partial body', async () => {
      const updated: Book = { ...mockBook, title: 'New Title' }
      global.fetch = mockFetch(200, { data: updated })

      const data: BookUpdate = { title: 'New Title' }
      const result = await updateBook(1, data)

      expect(result).toEqual(updated)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(data),
        }),
      )
    })
  })

  describe('deleteBook', () => {
    it('makes DELETE and resolves void for 204 response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => { throw new Error('No body on 204') },
      })

      await expect(deleteBook(1)).resolves.toBeUndefined()
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/books/1'),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })
})

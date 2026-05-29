import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from '../../src/stores/books'
import type { Book, BookCreate, BookUpdate } from '../../src/types/book'

// Mock the API module
vi.mock('../../src/api/books', () => ({
  listBooks: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  getBook: vi.fn(),
}))

import * as booksApi from '../../src/api/books'

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

describe('useBooksStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchBooks', () => {
    it('sets books array from mocked API response', async () => {
      vi.mocked(booksApi.listBooks).mockResolvedValue([mockBook])
      const store = useBooksStore()

      await store.fetchBooks()

      expect(store.books).toEqual([mockBook])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('sets loading to true before API call and false after', async () => {
      let capturedLoading = false
      vi.mocked(booksApi.listBooks).mockImplementation(async () => {
        capturedLoading = useBooksStore().loading
        return [mockBook]
      })
      const store = useBooksStore()

      await store.fetchBooks()

      expect(capturedLoading).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('sets error on API failure', async () => {
      vi.mocked(booksApi.listBooks).mockRejectedValue(new Error('Network error'))
      const store = useBooksStore()

      await store.fetchBooks()

      expect(store.error).toBe('Network error')
      expect(store.books).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('createBook', () => {
    it('appends new book to books array', async () => {
      vi.mocked(booksApi.createBook).mockResolvedValue(mockBook)
      const store = useBooksStore()

      const data: BookCreate = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: null,
        published_year: 2020,
        description: null,
        cover_url: null,
      }
      const result = await store.createBook(data)

      expect(result).toEqual(mockBook)
      expect(store.books).toHaveLength(1)
      expect(store.books[0]).toEqual(mockBook)
    })
  })

  describe('updateBook', () => {
    it('replaces matching book in books array', async () => {
      const updatedBook: Book = { ...mockBook, title: 'Updated Title' }
      vi.mocked(booksApi.updateBook).mockResolvedValue(updatedBook)
      const store = useBooksStore()
      store.books = [mockBook]

      const data: BookUpdate = { title: 'Updated Title' }
      const result = await store.updateBook(1, data)

      expect(result).toEqual(updatedBook)
      expect(store.books[0]).toEqual(updatedBook)
    })
  })

  describe('deleteBook', () => {
    it('removes matching book from books array', async () => {
      vi.mocked(booksApi.deleteBook).mockResolvedValue(undefined)
      const store = useBooksStore()
      store.books = [mockBook]

      await store.deleteBook(1)

      expect(store.books).toHaveLength(0)
    })
  })

  describe('bookById getter', () => {
    it('returns correct book by id', () => {
      const store = useBooksStore()
      store.books = [mockBook]

      expect(store.bookById(1)).toEqual(mockBook)
    })

    it('returns undefined for unknown id', () => {
      const store = useBooksStore()
      store.books = [mockBook]

      expect(store.bookById(999)).toBeUndefined()
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useBook } from '../../src/composables/useBook'
import type { Book, BookUpdate } from '../../src/types/book'

vi.mock('../../src/api/books', () => ({
  getBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  listBooks: vi.fn(),
  createBook: vi.fn(),
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

describe('useBook composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('load()', () => {
    it('calls getBook and sets book', async () => {
      vi.mocked(booksApi.getBook).mockResolvedValue(mockBook)
      const id = ref(1)
      const { book, loading, error, load } = useBook(id)

      await load()

      expect(book.value).toEqual(mockBook)
      expect(error.value).toBeNull()
      expect(loading.value).toBe(false)
    })

    it('sets loading to true during call and false after', async () => {
      let capturedLoading = false
      vi.mocked(booksApi.getBook).mockImplementation(async () => {
        capturedLoading = true
        return mockBook
      })
      const id = ref(1)
      const { loading, load } = useBook(id)

      const promise = load()
      // loading should be true immediately while the promise is pending
      expect(loading.value).toBe(true)
      await promise
      expect(loading.value).toBe(false)
      expect(capturedLoading).toBe(true)
    })

    it('sets error when API call fails', async () => {
      vi.mocked(booksApi.getBook).mockRejectedValue(new Error('Not found'))
      const id = ref(1)
      const { book, error, load } = useBook(id)

      await load()

      expect(error.value).toBe('Not found')
      expect(book.value).toBeNull()
    })
  })

  describe('save()', () => {
    it('calls updateBook and sets book', async () => {
      const updated: Book = { ...mockBook, title: 'New Title' }
      vi.mocked(booksApi.updateBook).mockResolvedValue(updated)
      const id = ref(1)
      const { book, save } = useBook(id)

      const data: BookUpdate = { title: 'New Title' }
      await save(data)

      expect(book.value).toEqual(updated)
    })

    it('sets error when save fails', async () => {
      vi.mocked(booksApi.updateBook).mockRejectedValue(new Error('Update failed'))
      const id = ref(1)
      const { error, save } = useBook(id)

      await expect(save({ title: 'x' })).rejects.toThrow()
      expect(error.value).toBe('Update failed')
    })
  })

  describe('remove()', () => {
    it('calls deleteBook and clears book', async () => {
      vi.mocked(booksApi.deleteBook).mockResolvedValue(undefined)
      const id = ref(1)
      const { book, remove } = useBook(id)
      book.value = mockBook

      await remove()

      expect(book.value).toBeNull()
    })

    it('sets error when delete fails', async () => {
      vi.mocked(booksApi.deleteBook).mockRejectedValue(new Error('Delete failed'))
      const id = ref(1)
      const { error, remove } = useBook(id)

      await expect(remove()).rejects.toThrow()
      expect(error.value).toBe('Delete failed')
    })
  })
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Book, BookCreate, BookUpdate } from '../types/book'
import * as booksApi from '../api/books'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const bookById = computed(() => (id: number): Book | undefined => {
    return books.value.find((b) => b.id === id)
  })

  async function fetchBooks(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      books.value = await booksApi.listBooks()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load books'
    } finally {
      loading.value = false
    }
  }

  async function createBook(data: BookCreate): Promise<Book> {
    loading.value = true
    error.value = null
    try {
      const book = await booksApi.createBook(data)
      books.value.push(book)
      return book
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create book'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBook(id: number, data: BookUpdate): Promise<Book> {
    loading.value = true
    error.value = null
    try {
      const updated = await booksApi.updateBook(id, data)
      const index = books.value.findIndex((b) => b.id === id)
      if (index !== -1) {
        books.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update book'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBook(id: number): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await booksApi.deleteBook(id)
      books.value = books.value.filter((b) => b.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete book'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    books,
    loading,
    error,
    bookById,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  }
})

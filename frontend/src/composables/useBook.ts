import { ref, type Ref } from 'vue'
import type { Book, BookUpdate } from '../types/book'
import * as booksApi from '../api/books'

export function useBook(id: Ref<number>) {
  const book = ref<Book | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      book.value = await booksApi.getBook(id.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load book'
    } finally {
      loading.value = false
    }
  }

  async function save(data: BookUpdate): Promise<void> {
    loading.value = true
    error.value = null
    try {
      book.value = await booksApi.updateBook(id.value, data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update book'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function remove(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await booksApi.deleteBook(id.value)
      book.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete book'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { book, loading, error, load, save, remove }
}

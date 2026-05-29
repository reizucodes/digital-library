import { apiFetch } from './client'
import type { Book, BookCreate, BookUpdate, ApiResponse } from '../types/book'

export async function listBooks(): Promise<Book[]> {
  const response = await apiFetch<ApiResponse<Book[]>>('/api/v1/books')
  return response.data
}

export async function getBook(id: number): Promise<Book> {
  const response = await apiFetch<ApiResponse<Book>>(`/api/v1/books/${id}`)
  return response.data
}

export async function createBook(data: BookCreate): Promise<Book> {
  const response = await apiFetch<ApiResponse<Book>>('/api/v1/books', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateBook(id: number, data: BookUpdate): Promise<Book> {
  const response = await apiFetch<ApiResponse<Book>>(`/api/v1/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function deleteBook(id: number): Promise<void> {
  await apiFetch<void>(`/api/v1/books/${id}`, {
    method: 'DELETE',
  })
}

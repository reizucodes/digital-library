export interface Book {
  id: number
  title: string
  author: string
  isbn: string | null
  published_year: number | null
  description: string | null
  cover_url: string | null
  created_at: string
  updated_at: string
}

export type BookCreate = Omit<Book, 'id' | 'created_at' | 'updated_at'>
export type BookUpdate = Partial<BookCreate>

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  code: string
  message: string
  detail?: unknown[]
}

import type { ApiError } from '../types/book'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? ''

export class ApiRequestError extends Error {
  readonly apiError: ApiError

  constructor(apiError: ApiError) {
    super(apiError.message)
    this.name = 'ApiRequestError'
    this.apiError = apiError
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const json = await response.json()

  if (!response.ok) {
    const err: ApiError = json?.error ?? {
      code: 'INTERNAL_ERROR',
      message: `HTTP ${response.status}`,
    }
    throw new ApiRequestError(err)
  }

  return json as T
}

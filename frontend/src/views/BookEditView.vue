<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '../composables/useBook'
import BookForm from '../components/BookForm.vue'
import type { BookCreate } from '../types/book'

const route = useRoute()
const router = useRouter()

const bookId = computed(() => Number(route.params.id))
const { book, loading, error, load, save } = useBook(bookId)

const formError = ref<string | null>(null)

onMounted(() => {
  load()
})

const initialData = computed<BookCreate | undefined>(() => {
  if (!book.value) return undefined
  return {
    title: book.value.title,
    author: book.value.author,
    isbn: book.value.isbn,
    published_year: book.value.published_year,
    description: book.value.description,
    cover_url: book.value.cover_url,
  }
})

async function handleSubmit(data: BookCreate) {
  formError.value = null
  try {
    await save(data)
    router.push({ name: 'books-detail', params: { id: bookId.value } })
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Failed to update book'
  }
}
</script>

<template>
  <div class="space-y-5">
    <RouterLink
      :to="{ name: 'books-detail', params: { id: bookId } }"
      class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Book
    </RouterLink>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Book</h1>

    <div v-if="loading && !book" class="flex flex-col items-center py-16 text-gray-400 dark:text-gray-500 gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span class="text-sm">Loading…</span>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <BookForm
        :initial-data="initialData"
        :loading="loading"
        :error="formError ?? error"
        @submit="handleSubmit"
        @dismiss-error="formError = null; error = null"
      />
    </div>
  </div>
</template>

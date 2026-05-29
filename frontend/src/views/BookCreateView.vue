<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '../stores/books'
import BookForm from '../components/BookForm.vue'
import type { BookCreate } from '../types/book'

const router = useRouter()
const store = useBooksStore()

const formError = ref<string | null>(null)

async function handleSubmit(data: BookCreate) {
  formError.value = null
  try {
    const book = await store.createBook(data)
    router.push({ name: 'books-detail', params: { id: book.id } })
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Failed to create book'
  }
}
</script>

<template>
  <div class="space-y-5">
    <RouterLink
      :to="{ name: 'books-list' }"
      class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Library
    </RouterLink>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Book</h1>
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <BookForm
        :loading="store.loading"
        :error="formError"
        @submit="handleSubmit"
        @dismiss-error="formError = null"
      />
    </div>
  </div>
</template>

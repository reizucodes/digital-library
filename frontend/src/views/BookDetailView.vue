<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBook } from '../composables/useBook'
import AppErrorBanner from '../components/AppErrorBanner.vue'

const route = useRoute()
const router = useRouter()

const bookId = computed(() => Number(route.params.id))
const { book, loading, error, load, remove } = useBook(bookId)

onMounted(() => {
  load()
})

async function handleDelete() {
  if (!window.confirm('Are you sure you want to delete this book?')) {
    return
  }
  try {
    await remove()
    router.push({ name: 'books-list' })
  } catch {
    // error is set in composable
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

    <AppErrorBanner :message="error" @dismiss="error = null" />

    <div v-if="loading" class="flex flex-col items-center py-16 text-gray-400 dark:text-gray-500 gap-3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <span class="text-sm">Loading…</span>
    </div>

    <div v-else-if="book" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div class="flex items-start gap-6">
        <img
          v-if="book.cover_url"
          :src="book.cover_url"
          :alt="`Cover of ${book.title}`"
          class="w-36 flex-shrink-0 rounded shadow-md object-cover"
        />
        <div
          v-else
          class="flex w-24 h-32 flex-shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ book.title }}</h1>
          <p class="mt-1 text-base text-gray-500 dark:text-gray-400">{{ book.author }}</p>
          <p v-if="book.published_year" class="mt-0.5 text-sm text-gray-400 dark:text-gray-500">{{ book.published_year }}</p>
        </div>
      </div>

      <dl class="mt-6 grid gap-4 sm:grid-cols-2 border-t border-gray-100 dark:border-gray-700 pt-5">
        <div v-if="book.isbn">
          <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">ISBN</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ book.isbn }}</dd>
        </div>
        <div v-if="book.published_year">
          <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Published</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ book.published_year }}</dd>
        </div>
        <div v-if="book.description" class="sm:col-span-2">
          <dt class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Description</dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{{ book.description }}</dd>
        </div>
      </dl>

      <div class="mt-6 flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-5">
        <RouterLink
          :to="{ name: 'books-edit', params: { id: book.id } }"
          class="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Edit
        </RouterLink>
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center rounded-md bg-red-600 dark:bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 transition-colors"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

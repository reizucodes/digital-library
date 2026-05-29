<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useBooksStore } from '../stores/books'
import BookCard from '../components/BookCard.vue'
import AppErrorBanner from '../components/AppErrorBanner.vue'
import BookCreateModal from '../components/BookCreateModal.vue'
import { useDebounce } from '../composables/useDebounce'

const store = useBooksStore()

const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 300)

const filteredBooks = computed(() => {
  const query = debouncedQuery.value.trim().toLowerCase()
  if (!query) return store.books
  return store.books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query),
  )
})

const isModalOpen = ref(false)
const previousFocus = ref<HTMLElement | null>(null)

function openModal() {
  previousFocus.value = document.activeElement as HTMLElement
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  previousFocus.value?.focus()
}

onMounted(() => {
  store.fetchBooks()
})
</script>

<template>
  <div>
    <div :class="['space-y-5', isModalOpen && 'blur-sm pointer-events-none select-none transition-[filter] duration-200']">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Library</h1>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 dark:bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-colors"
          @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Book
        </button>
      </div>

      <AppErrorBanner
        :message="store.error"
        @dismiss="store.error = null"
      />

      <div v-if="!store.loading && store.books.length > 0" class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title or author…"
          class="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pl-4 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow"
        />
        <button
          v-if="searchQuery"
          type="button"
          aria-label="Clear search"
          class="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          @click="searchQuery = ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center py-16 text-gray-400 dark:text-gray-500 gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="text-sm">Loading books…</span>
      </div>

      <div
        v-else-if="store.books.length === 0"
        class="flex flex-col items-center py-16 gap-4 text-gray-400 dark:text-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <div class="text-center">
          <p class="text-base font-medium text-gray-500 dark:text-gray-400">No books yet</p>
          <p class="mt-1 text-sm">
            <button
              type="button"
              class="text-blue-500 dark:text-blue-400 hover:underline font-medium"
              @click="openModal"
            >
              Add the first one
            </button>
            to get started.
          </p>
        </div>
      </div>

      <div
        v-else-if="filteredBooks.length === 0 && searchQuery"
        class="flex flex-col items-center py-16 gap-3 text-gray-400 dark:text-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-sm text-gray-500 dark:text-gray-400">No books match your search.</p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <BookCard v-for="book in filteredBooks" :key="book.id" :book="book" />
      </div>
    </div>

    <BookCreateModal v-if="isModalOpen" :open="isModalOpen" @close="closeModal" />
  </div>
</template>

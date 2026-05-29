<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Book } from '../types/book'

const props = defineProps<{
  book: Book
}>()
</script>

<template>
  <article
    class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all border-l-4 border-l-blue-500 dark:border-l-blue-400"
  >
    <RouterLink
      :to="{ name: 'books-detail', params: { id: props.book.id } }"
      class="flex items-center gap-4 p-4"
    >
      <img
        v-if="props.book.cover_url"
        :src="props.book.cover_url"
        :alt="`Cover of ${props.book.title}`"
        class="h-20 w-14 flex-shrink-0 rounded object-cover shadow-sm"
      />
      <div
        v-else
        class="flex h-20 w-14 flex-shrink-0 items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <h2 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {{ props.book.title }}
        </h2>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ props.book.author }}</p>
        <p v-if="props.book.published_year" class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {{ props.book.published_year }}
        </p>
        <p
          v-if="props.book.description"
          class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
        >
          {{ props.book.description }}
        </p>
      </div>
    </RouterLink>
  </article>
</template>

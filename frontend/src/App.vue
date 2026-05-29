<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav
        class="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        <RouterLink
          :to="{ name: 'books-list' }"
          class="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Digi-Lib
        </RouterLink>

        <div class="flex items-center gap-4">
          <div class="flex gap-4 text-sm">
            <RouterLink
              :to="{ name: 'books-list' }"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
            >
              Books
            </RouterLink>
            <RouterLink
              :to="{ name: 'books-create' }"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              active-class="text-blue-600 dark:text-blue-400"
            >
              Add Book
            </RouterLink>
          </div>

          <button
            type="button"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            @click="toggle"
          >
            <!-- Sun icon (shown in dark mode to switch to light) -->
            <svg
              v-if="isDark"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 18.364l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon (shown in light mode to switch to dark) -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

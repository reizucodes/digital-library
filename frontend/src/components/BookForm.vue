<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BookCreate } from '../types/book'
import AppErrorBanner from './AppErrorBanner.vue'

const props = defineProps<{
  initialData?: BookCreate
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [data: BookCreate]
  dismissError: []
}>()

const title = ref(props.initialData?.title ?? '')
const author = ref(props.initialData?.author ?? '')
const isbn = ref(props.initialData?.isbn ?? '')
const publishedYear = ref<string>(
  props.initialData?.published_year != null
    ? String(props.initialData.published_year)
    : ''
)
const description = ref(props.initialData?.description ?? '')
const coverUrl = ref(props.initialData?.cover_url ?? '')

// Sync when initialData changes (e.g. edit view loads data)
watch(
  () => props.initialData,
  (val) => {
    if (val) {
      title.value = val.title
      author.value = val.author
      isbn.value = val.isbn ?? ''
      publishedYear.value = val.published_year != null ? String(val.published_year) : ''
      description.value = val.description ?? ''
      coverUrl.value = val.cover_url ?? ''
    }
  },
)

const validationError = ref<string | null>(null)

function handleSubmit() {
  validationError.value = null

  if (!title.value.trim()) {
    validationError.value = 'Title is required'
    return
  }
  if (!author.value.trim()) {
    validationError.value = 'Author is required'
    return
  }

  const payload: BookCreate = {
    title: title.value.trim(),
    author: author.value.trim(),
    isbn: isbn.value.trim() || null,
    published_year: publishedYear.value ? Number(publishedYear.value) : null,
    description: description.value.trim() || null,
    cover_url: coverUrl.value.trim() || null,
  }

  emit('submit', payload)
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
    <AppErrorBanner
      :message="validationError ?? (props.error ?? null)"
      @dismiss="validationError = null; emit('dismissError')"
    />

    <div>
      <label for="book-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Title <span aria-hidden="true" class="text-red-500">*</span>
      </label>
      <input
        id="book-title"
        v-model="title"
        type="text"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Book title"
      />
    </div>

    <div>
      <label for="book-author" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Author <span aria-hidden="true" class="text-red-500">*</span>
      </label>
      <input
        id="book-author"
        v-model="author"
        type="text"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Author name"
      />
    </div>

    <div>
      <label for="book-isbn" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ISBN</label>
      <input
        id="book-isbn"
        v-model="isbn"
        type="text"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="10 or 13 digit ISBN"
      />
    </div>

    <div>
      <label for="book-year" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Published Year</label>
      <input
        id="book-year"
        v-model="publishedYear"
        type="number"
        min="1000"
        :max="new Date().getFullYear()"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="e.g. 1984"
      />
    </div>

    <div>
      <label for="book-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <textarea
        id="book-description"
        v-model="description"
        rows="4"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Brief description"
      />
    </div>

    <div>
      <label for="book-cover" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover URL</label>
      <input
        id="book-cover"
        v-model="coverUrl"
        type="url"
        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="https://example.com/cover.jpg"
      />
    </div>

    <button
      type="submit"
      :disabled="props.loading"
      class="inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <span v-if="props.loading">Saving…</span>
      <span v-else>Save</span>
    </button>
  </form>
</template>

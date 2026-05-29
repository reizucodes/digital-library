<script setup lang="ts">
import { ref } from 'vue'
import { useBooksStore } from '../stores/books'
import BaseModal from './BaseModal.vue'
import BookForm from './BookForm.vue'
import type { BookCreate } from '../types/book'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useBooksStore()
const formError = ref<string | null>(null)

async function handleSubmit(data: BookCreate) {
  formError.value = null
  try {
    await store.createBook(data)
    emit('close')
  } catch (err) {
    formError.value = err instanceof Error ? err.message : 'Failed to create book'
  }
}
</script>

<template>
  <BaseModal :open="open" title="Add Book" @close="emit('close')">
    <BookForm
      :loading="store.loading"
      :error="formError"
      @submit="handleSubmit"
      @dismiss-error="formError = null"
    />
  </BaseModal>
</template>

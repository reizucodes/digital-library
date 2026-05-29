<script setup lang="ts">
import { watch, nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

const panelRef = ref<HTMLDivElement | null>(null)
const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function handleKeydown(event: KeyboardEvent) {
  if (!props.open) return

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key === 'Tab' && panelRef.value) {
    const focusable = Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('overflow-hidden')
})

// immediate: true ensures scroll lock and focus fire on mount (supports v-if usage)
watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      await nextTick()
      panelRef.value?.focus()
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  },
  { immediate: true },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 z-[60] bg-black/50"
        aria-hidden="true"
        @click="emit('close')"
      />
      <!-- Panel -->
      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4 focus:outline-none"
        @click.self="emit('close')"
      >
        <div class="w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2
              :id="titleId"
              class="text-xl font-bold text-gray-900 dark:text-white"
            >
              {{ title }}
            </h2>
            <button
              type="button"
              aria-label="Close dialog"
              class="rounded-md p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              @click="emit('close')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Modal body -->
          <div class="px-6 py-5">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

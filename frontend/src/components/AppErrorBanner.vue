<script setup lang="ts">
const props = defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  dismiss: []
}>()

function handleDismiss() {
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="props.message"
    role="alert"
    class="flex items-center justify-between rounded-md bg-red-600 dark:bg-red-800 px-4 py-3 text-white"
  >
    <span class="text-sm">{{ props.message }}</span>
    <button
      type="button"
      aria-label="Dismiss error"
      class="ml-4 text-white/80 hover:text-white font-bold text-lg leading-none focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
      @click="handleDismiss"
    >
      &times;
    </button>
  </div>
</template>

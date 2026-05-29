import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debounced = ref<T>(value.value) as Ref<T>

  watch(value, (newValue, _oldValue, onCleanup) => {
    const timer = setTimeout(() => {
      debounced.value = newValue
    }, delay)

    onCleanup(() => {
      clearTimeout(timer)
    })
  })

  return debounced
}

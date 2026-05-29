import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const STORAGE_KEY = 'theme'

function getInitialDark(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyDark(dark: boolean): void {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const isDark: Ref<boolean> = ref(getInitialDark())
applyDark(isDark.value)

watch(isDark, (val) => {
  applyDark(val)
  localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
})

export function useDarkMode() {
  function toggle(): void {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}

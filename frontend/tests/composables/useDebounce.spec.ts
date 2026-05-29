import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '../../src/composables/useDebounce'

describe('useDebounce composable', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounced ref does not update immediately when source changes', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)

    expect(debounced.value).toBe('hello')

    source.value = 'world'
    await nextTick()

    // Timer has not elapsed — debounced should still be the original value
    expect(debounced.value).toBe('hello')
  })

  it('debounced ref updates after the delay elapses', async () => {
    const source = ref('hello')
    const debounced = useDebounce(source, 300)

    source.value = 'world'
    await nextTick()

    vi.advanceTimersByTime(300)
    await nextTick()

    expect(debounced.value).toBe('world')
  })

  it('debounced ref resets the timer on rapid changes — only the last value applies', async () => {
    const source = ref('a')
    const debounced = useDebounce(source, 300)

    source.value = 'b'
    await nextTick()
    vi.advanceTimersByTime(100)

    source.value = 'c'
    await nextTick()
    vi.advanceTimersByTime(100)

    source.value = 'd'
    await nextTick()
    vi.advanceTimersByTime(100)

    // Only 300ms total has elapsed since the last change, timer not done
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(200)
    await nextTick()

    // Now 300ms after the last change — only 'd' should be applied
    expect(debounced.value).toBe('d')
  })
})

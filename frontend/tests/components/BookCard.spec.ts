import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import BookCard from '../../src/components/BookCard.vue'
import type { Book } from '../../src/types/book'

const mockBook: Book = {
  id: 42,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald',
  isbn: '9780743273565',
  published_year: 1925,
  description: 'A novel about the American Dream',
  cover_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/books/:id', name: 'books-detail', component: { template: '<div />' } },
    ],
  })
}

describe('BookCard', () => {
  it('renders the book title', async () => {
    const router = createTestRouter()
    const wrapper = mount(BookCard, {
      props: { book: mockBook },
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.text()).toContain('The Great Gatsby')
  })

  it('renders the book author', async () => {
    const router = createTestRouter()
    const wrapper = mount(BookCard, {
      props: { book: mockBook },
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.text()).toContain('F. Scott Fitzgerald')
  })

  it('renders the published year when present', async () => {
    const router = createTestRouter()
    const wrapper = mount(BookCard, {
      props: { book: mockBook },
      global: { plugins: [router] },
    })
    await router.isReady()

    expect(wrapper.text()).toContain('1925')
  })

  it('title link points to the detail route', async () => {
    const router = createTestRouter()
    const wrapper = mount(BookCard, {
      props: { book: mockBook },
      global: { plugins: [router] },
    })
    await router.isReady()

    const link = wrapper.find('a')
    expect(link.attributes('href')).toContain('/books/42')
  })
})

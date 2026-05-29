import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BookForm from '../../src/components/BookForm.vue'
import type { BookCreate } from '../../src/types/book'

// Ensure the books API module is NOT called by BookForm — all API calls must go
// through the parent view or composable via the emitted 'submit' event.
vi.mock('../../src/api/books', () => ({
  listBooks: vi.fn(),
  getBook: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
}))

describe('BookForm', () => {
  it('renders all form fields', () => {
    const wrapper = mount(BookForm)

    expect(wrapper.find('#book-title').exists()).toBe(true)
    expect(wrapper.find('#book-author').exists()).toBe(true)
    expect(wrapper.find('#book-isbn').exists()).toBe(true)
    expect(wrapper.find('#book-year').exists()).toBe(true)
    expect(wrapper.find('#book-description').exists()).toBe(true)
    expect(wrapper.find('#book-cover').exists()).toBe(true)
  })

  it('emits submit with correct payload when form is valid', async () => {
    const wrapper = mount(BookForm)

    await wrapper.find('#book-title').setValue('My Book')
    await wrapper.find('#book-author').setValue('My Author')
    await wrapper.find('#book-year').setValue('2022')
    await wrapper.find('form').trigger('submit.prevent')

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    const payload = emitted![0][0] as BookCreate
    expect(payload.title).toBe('My Book')
    expect(payload.author).toBe('My Author')
    expect(payload.published_year).toBe(2022)
  })

  it('does not emit submit when title is empty', async () => {
    const wrapper = mount(BookForm)

    await wrapper.find('#book-author').setValue('Author')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('shows validation error when title is missing', async () => {
    const wrapper = mount(BookForm)

    await wrapper.find('#book-author').setValue('Author')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Title is required')
  })

  it('does not emit submit when author is empty', async () => {
    const wrapper = mount(BookForm)

    await wrapper.find('#book-title').setValue('Title')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('disables submit button when loading prop is true', () => {
    const wrapper = mount(BookForm, {
      props: { loading: true },
    })

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('shows loading text on submit button when loading', () => {
    const wrapper = mount(BookForm, {
      props: { loading: true },
    })

    expect(wrapper.find('button[type="submit"]').text()).toContain('Saving')
  })

  it('pre-fills fields from initialData', async () => {
    const initialData: BookCreate = {
      title: 'Pre-filled Title',
      author: 'Pre-filled Author',
      isbn: '9780743273565',
      published_year: 1984,
      description: 'Some description',
      cover_url: null,
    }
    const wrapper = mount(BookForm, {
      props: { initialData },
    })

    expect((wrapper.find('#book-title').element as HTMLInputElement).value).toBe('Pre-filled Title')
    expect((wrapper.find('#book-author').element as HTMLInputElement).value).toBe('Pre-filled Author')
  })

  it('shows external error from error prop', () => {
    const wrapper = mount(BookForm, {
      props: { error: 'Server error occurred' },
    })

    expect(wrapper.text()).toContain('Server error occurred')
  })

  it('does not call the API directly — API calls must go through the emitted submit event', async () => {
    // Import the mocked API to spy on it
    const booksApi = await import('../../src/api/books')
    const wrapper = mount(BookForm)

    await wrapper.find('#book-title').setValue('My Book')
    await wrapper.find('#book-author').setValue('My Author')
    await wrapper.find('form').trigger('submit.prevent')

    // The form should emit 'submit' but must NOT call any API function directly
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(booksApi.createBook).not.toHaveBeenCalled()
    expect(booksApi.updateBook).not.toHaveBeenCalled()
    expect(booksApi.listBooks).not.toHaveBeenCalled()
    expect(booksApi.deleteBook).not.toHaveBeenCalled()
    expect(booksApi.getBook).not.toHaveBeenCalled()
  })
})

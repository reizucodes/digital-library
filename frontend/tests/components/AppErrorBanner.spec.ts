import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppErrorBanner from '../../src/components/AppErrorBanner.vue'

describe('AppErrorBanner', () => {
  it('renders when message is non-null', () => {
    const wrapper = mount(AppErrorBanner, {
      props: { message: 'Something went wrong' },
    })

    expect(wrapper.text()).toContain('Something went wrong')
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
  })

  it('renders nothing when message is null', () => {
    const wrapper = mount(AppErrorBanner, {
      props: { message: null },
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
  })

  it('emits dismiss when dismiss button is clicked', async () => {
    const wrapper = mount(AppErrorBanner, {
      props: { message: 'An error' },
    })

    await wrapper.find('button[aria-label="Dismiss error"]').trigger('click')

    expect(wrapper.emitted('dismiss')).toBeTruthy()
  })

  it('dismiss button has accessible label', () => {
    const wrapper = mount(AppErrorBanner, {
      props: { message: 'An error' },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-label')).toBe('Dismiss error')
  })
})

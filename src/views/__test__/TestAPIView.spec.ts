import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TestAPIView from '../TestAPIView.vue'

describe('ExampleView', () => {
    it('test message', async () => {
        const wrapper = mount(TestAPIView)
        expect(wrapper.text()).toContain('switch message')
        expect(wrapper.vm.currentMsg).toBe('')

        const enable = wrapper
            .findAll('button')
            .find((b) => b.text().match('hello'))
        expect(enable && enable.exists()).toBeTruthy()

        if (enable) {
            await enable.trigger('click')
        }

        // long polling
        await flushPromises()
        expect(wrapper.vm.currentMsg).toBe('hello world')
    })
})

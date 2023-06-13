import {
    describe,
    it,
    expect,
    beforeAll,
    beforeEach,
    afterEach,
    vi,
} from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
// import { mountPropsToStore } from '@/utils/commonUtils'
import { ExtraPreferenceView } from '@/views'
import { useLoading, viewPropsStore } from '@/stores'
import type { ExtraTypePropsData } from '@/types'
import { sleep } from '@/utils/commonUtils'

describe('ExtraPreferenceView test', () => {
    const fakeProps = JSON.parse(
        '{"data":{"id":"extra_preference","seq":"7","type":"","show":true,"required":false,"validations":[],"name_l1":"pref 1","name_l2":"\u984d\u5916\u504f\u597d","name_l3":"\u989d\u5916\u504f\u597d","name_l4":"\u8ffd\u52a0\u8a2d\u5b9a","name_l5":"\ucd94\uac00 \uae30\ubcf8 \uc124\uc815","params":{"mem_attribute_types_options":{"type":"","value":"3"},"mem_attribute_types":{"type":"","value":"4,2,3"},"terms_n_services_options":{"type":"","value":"2"}},"childType":"e","outletId":"1","fieldId":"extraPreference7"},"translation":{"this_field_is_required":"This field is required","yours":"Yours","your_guests":"Your Guests","your_selected_preferences":"Your Selected Preferences","guest_selected_preferences":"Guest Selected Preferences","selected":"Selected","i_agree":"I Agree","select_extra_preferences":"Select Extra Preferences"},"config":{"customStyle":{"font_size":{"heading":"18","normal_text":"14"},"background_color":{"outlet_logo":"ffffff","transparent":"0","body":"ffffff"},"general_text_color":{"font":"000000","special_font":"7284aa","background":"eeeeee","border":"d2dfef"},"header_bar_color":{"font":"000000","hover_text":"FFFFFF","background":"dcc8a7","background_for_selected_item":"ad9d83","border":"e7e7e7"},"dropdown_list_color":{"font":"444444","hover_text":"ffffff","border":"b0b0b0","background_for_selected_item":"3875d7","option_group_background":"dddddd"},"calendar_color":{"font":"666666","disabled_font":"f2f2f2","week_font":"ffffff","outer_border":"cccccc","border_for_selected_week":"DCC8A7","background_for_selected_date":"DCC8A7"},"checkbox_color":{"font":"333333","border":"b0b0b0","checked":"333333"},"button_color":{"font":"666666","special_background":"ad9d83","background":"dcc8a7"},"textarea_color":{"placeholder_font":"b0b0b0","input_text_font":"6a6a6a","area_code_font":"b0b0b0","border":"b0b0b0","background_for_selected_item":"f8f8f8"},"link_color":{"font":"0055b8","hover_text":"2b517e"},"dialog_color_new_reservation":{"font":"000000","border":"e5e5e5","background":"ffffff","button_font":"333333","button_border":"cccccc","button_hover_border":"adadad","gradient_background_button_color1":"ffffff","gradient_background_button_color2":"e0e0e0","button_hover_background":"e0e0e0"},"dialog_color_edit_reservation":{"font":"8a6d3b","border":"eea236","gradient_background_color1":"fcf8e3","gradient_background_color2":"f8efc0","button_font":"ffffff","button_border":"e38d13","gradient_background_button_color1":"f0ad4e","gradient_background_button_color2":"eb9316","button_hover_background":"eb9316"},"error_page":{"error_message_font":"b22b22","button_font":"ffffff","button_border":"245580","button_hover_border":"204d74","gradient_background_button_color1":"337ab7","gradient_background_button_color2":"265a88","button_hover_background":"286090"},"tooltip_box_color":{"font":"ffffff","background":"AD9D83"},"deposit_charge":{"font":"000000","background":"fefea2"},"button_group":{"font":"000000","background":"dcc8a7","font_for_selected_item":"000000","background_for_selected_item":"dcc8a7"}},"langKey":1,"baseUrl":""},"view":"ExtraPreferenceView","selector":"#vue-6481496fcb74f"}',
    )

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('ExtraPreference View mounting', async () => {
        viewPropsStore<ExtraTypePropsData>().setAll(fakeProps)
        const wrapper = mount(ExtraPreferenceView)
        expect(viewPropsStore<ExtraTypePropsData>().data.id).toBe(
            fakeProps.data.id,
        )

        await flushPromises()
        expect(wrapper.vm.extraTypes[0].type).toBe('Chinese')
    })

    it('watch effect update', async () => {
        viewPropsStore<ExtraTypePropsData>().setAll(fakeProps)
        const wrapper = mount(ExtraPreferenceView)

        wrapper.vm.form = {
            selectedSet: new Set<number>([]),
            guestSelectedSet: new Set<number>([]),
            agree: false,
        }
        wrapper.vm.$emit('update:form', {
            selectedSet: new Set<number>([]),
            guestSelectedSet: new Set<number>([]),
            agree: false,
        })
        expect(wrapper.emitted()['update:form']).toBeTruthy()

        await sleep(100)

        wrapper.vm.form = {
            selectedSet: new Set<number>([1]),
            guestSelectedSet: new Set<number>([1]),
            agree: false,
        }
        wrapper.vm.$emit('update:form', {
            selectedSet: new Set<number>([1]),
            guestSelectedSet: new Set<number>([1]),
            agree: false,
        })
        expect(wrapper.emitted()['update:form']).toBeTruthy()

        expect(
            wrapper.vm.form.selectedSet.size > 0 &&
                wrapper.vm.form.guestSelectedSet.size > 0,
        ).toBeTruthy()

        await flushPromises()

        const checkbox = wrapper.find('.checkbox-override')
        expect(checkbox.exists()).toBeTruthy()
        await (checkbox as any).setChecked()
        expect(wrapper.vm.form.agree).toBeTruthy()
    })

    it('open dialog', async () => {
        viewPropsStore<ExtraTypePropsData>().setAll(fakeProps)
        const wrapper = mount(ExtraPreferenceView)

        const openDialog = wrapper.find('.open-dialog')

        expect(openDialog.text()).toContain('pref 1')
        const mockLoad = vi.fn(useLoading().setLoading)
        mockLoad(true)
        expect(mockLoad).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.isLoading).toBe(true)
        mockLoad(false)
        expect(mockLoad).toHaveBeenCalledTimes(2)
        expect(wrapper.vm.isLoading).toBe(false)

        const dialog = wrapper.find('.dialog-hard')
        expect(dialog.exists()).toBeTruthy()

        expect(dialog.attributes('style')).toBe('display: none; opacity: 0;')

        // wait for isloading = false
        await flushPromises()

        expect(wrapper.vm.apiError || wrapper.vm.isLoading).toBe(false)
        await openDialog.trigger('click')
        expect(wrapper.vm.show).toBe(true)

        // wait for button transition
        await sleep(300)
        expect(dialog.attributes('style')).toBe('display: flex; opacity: 1;')

        const option = dialog.find('.option-btn')
        expect(option.exists()).toBeTruthy()
        await option.trigger('click')
        expect(wrapper.vm.form.selectedSet.size).toBe(1)
        await option.trigger('click')
        expect(wrapper.vm.form.selectedSet.size).toBe(0)

        const clearBtn = dialog.find('.clear-btn')
        expect(clearBtn.exists()).toBeTruthy()
        await option.trigger('click')
        expect(wrapper.vm.form.selectedSet.size).toBe(1)
        await clearBtn.trigger('click')
        expect(wrapper.vm.form.selectedSet.size).toBe(0)

        const switchBtn = dialog.findAll('.switch-btn').find((_, i) => i === 1)
        // console.log(switchBtn)
        expect(switchBtn).toBeTruthy()
        if (switchBtn) {
            await switchBtn.trigger('click')
            expect(wrapper.vm.activeTab).toBe('YOUR GUESTS')
            await option.trigger('click')
            expect(wrapper.vm.form.guestSelectedSet.size).toBe(1)
            await option.trigger('click')
            expect(wrapper.vm.form.guestSelectedSet.size).toBe(0)

            const clearBtn = dialog.find('.clear-btn')
            expect(clearBtn.exists()).toBeTruthy()
            await option.trigger('click')
            expect(wrapper.vm.form.guestSelectedSet.size).toBe(1)
            await clearBtn.trigger('click')
            expect(wrapper.vm.form.guestSelectedSet.size).toBe(0)
        }

        const closeBtn = dialog.find('.close')
        await closeBtn.trigger('click')
        // wait for close action complete
        await sleep(300)
        expect(wrapper.vm.show).toBe(false)
    })
})

<script setup lang="ts">
import { getMessage, updateMessage } from '@/api'
import { onMounted, ref } from 'vue'

const currentMsg = ref('')

defineExpose({
    currentMsg
})

onMounted(async () => {
    try {
        const res = await getMessage()
        currentMsg.value = res.message
    } catch (error) {
        console.log('error geting message', error)
    }
})

const updateMsg = async (msg: string) => {
    try {
        const res = await updateMessage(msg)
        currentMsg.value = res.message
    } catch (error) {
        console.log('error updating message', error)
    }
}
</script>

<template>
    <div class="flex items-center p-2 bg-slate-300">
        switch message:
        <button
            class="ml-2"
            :disabled="currentMsg === 'hello world'"
            @click="updateMsg('hello world')"
        >
            hello
        </button>
        <button
            class="ml-2"
            :disabled="currentMsg === 'goodbye world'"
            @click="updateMsg('goodbye world')"
        >
            goodbye
        </button>
    </div>
</template>

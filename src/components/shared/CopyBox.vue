<template>
  <div
    class="px-4 py-2.5 border !border-neutral-400 rounded flex items-center justify-between gap-3"
    :title="text"
  >
    <div class="flex-1 min-w-0 truncate">{{ text }}</div>
    <div
      class="flex items-center text-[18px] cursor-pointer"
      @click="handleCopy"
    >
      <CheckOutlined v-if="copied" />
      <CopyOutlined v-else />
    </div>
  </div>
</template>

<script setup>
import { CopyOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})
const { t } = useI18n()
const copied = ref(false)

const handleCopy = () => {
  if (copied.value) return
  toClipboard(props.text)
  copied.value = true
  message.success(t('register.copy_success'))
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

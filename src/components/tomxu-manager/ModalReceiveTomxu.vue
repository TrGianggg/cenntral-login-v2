<template>
  <div class="w-full">
    <a-button
      type="gray"
      class="w-full"
      style="height: 36px !important"
      @click="() => (states.visible = !states.visible)"
    >
      <div class="flex flex-row w-full justify-center gap-2">
        <span class="text-neutral-800-1">{{ $t('tomxu.received') }}</span>
        <img :src="Receiver" />
      </div>
    </a-button>
    <a-modal
      centered
      wrapClassName="modal-transfer-tomxu"
      v-model:visible="states.visible"
    >
      <div class="flex flex-col items-center justify-between mt-16 gap-4">
        <p class="text-gold-150 text-body-2 !font-bold">
          {{ $t('tomxu.modal_receive_tomxu.title_qr') }}
        </p>
        <div class="border-2 border-solid border-gold-150-1">
          <QrcodeVue
            class="w-[197px] h-[197px]"
            :value="userInfo.email"
            :render-as="'svg'"
            level="H"
            :background="isDark ? '#E8D6A1' : '#fff'"
          ></QrcodeVue>
        </div>
        <p class="text-body-3 text-neutral-400">{{ $t('tomxu.modal_receive_tomxu.title_qr_1') }}</p>
        <div
          class="min-h-[46px] rounded w-full px-4 border border-solid border-neutral-600 flex mb-4 items-center justify-between"
        >
          <p class="!text-gold-150-1 !font-bold max-w-[80%] mb-0 break-all">
            {{ userInfo.email }}
          </p>
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="cursor-pointer text-gold-150-1"
            @click="handleCopy"
          >
            <path
              d="M6.00024 11.5004C6.00024 8.67191 6.00024 7.25764 6.87896 6.37892C7.75767 5.50021 9.17194 5.50021 12.0005 5.50021H15.0006C17.8291 5.50021 19.2434 5.50021 20.1221 6.37892C21.0008 7.25764 21.0008 8.67191 21.0008 11.5004V16.5006C21.0008 19.3292 21.0008 20.7435 20.1221 21.6222C19.2434 22.5009 17.8291 22.5009 15.0006 22.5009H12.0005C9.17194 22.5009 7.75767 22.5009 6.87896 21.6222C6.00024 20.7435 6.00024 19.3292 6.00024 16.5006V11.5004Z"
              stroke="currentColor"
              stroke-width="1.50006"
            />
            <path
              d="M6.00036 19.5008C4.34344 19.5008 3.00024 18.1576 3.00024 16.5006V10.5004C3.00024 6.72903 3.00024 4.84333 4.17186 3.67171C5.34348 2.5001 7.22918 2.5001 11.0006 2.5001H15.0007C16.6576 2.5001 18.0008 3.84329 18.0008 5.50021"
              stroke="currentColor"
              stroke-width="1.50006"
            />
          </svg>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, reactive } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { userStore } from '@/stores/userStore'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import Receiver from '@/assets/icons/tomxu/receiver.svg'
import { useThemeStore } from '@/stores/themeStore'

const { t } = useI18n()

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

const userInfo = computed(() => {
  return userStore().userInfo
})
const packageName = JSON.parse(localStorage.getItem('userInfo')).package.name

const states = reactive({
  visible: false
})
const handleCopy = () => {
  navigator.clipboard
    .writeText(userInfo.value.email)
    .then(() => {
      message.success(t('register.copy_success'))
    })
    .catch((err) => {
      message.error(t('register.copy_fail') + err)
    })
}
</script>

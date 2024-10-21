<template>
  <div class="bg-neutral-850 max-w-[715px] w-full px-6 py-7 mb-10 rounded-xl border-light">
    <div class="flex flex-col gap-6">
      <div class="font-bold text-white">Mã giới thiệu của bạn</div>
      <div class="flex flex-col gap-4">
        <div>
          <span class="text-white font-bold">Cách 1:</span>
          Gửi mã giới thiệu đến người dùng để họ nhập thủ công
        </div>
        <div class="md:max-w-[300px]">
          <CopyBox
            :text="userInfo.refCode"
            class="h-[44px]"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div>
          <span class="text-white font-bold">Cách 2:</span>
          Gửi đường dẫn phía dưới để người dùng đăng ký trên mẫu đã có sẵn mã giới thiệu của bạn
        </div>
        <div class="flex md:items-center gap-3 flex-col md:flex-row">
          <div class="md:max-w-[300px]">
            <CopyBox
              :text="refUrl"
              class="h-[44px]"
            />
          </div>
          <a-popover
            trigger="click"
            class="cs-popup"
          >
            <template #content>
              <div class="flex flex-col gap-4">
                <div
                  class="flex items-center gap-3 hover:text-white cursor-pointer"
                  @click="shareFacebook"
                >
                  <span>Facebook</span>
                </div>
                <div
                  class="flex items-center gap-3 hover:text-white cursor-pointer"
                  @click="shareTwitter"
                >
                  <span>Twitter</span>
                </div>
                <div
                  class="flex items-center gap-3 hover:text-white cursor-pointer"
                  @click="shareTelegram"
                >
                  <span>Telegram</span>
                </div>
              </div>
            </template>
            <a-button type="primary">Chia sẻ</a-button>
          </a-popover>
        </div>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <div class="mb-4">Bạn cũng có thể quét mã QR code phía dưới để đi đến trang đăng ký</div>
        <qrcode-vue
          :value="refUrl"
          :size="200"
          :background="isDark ? '#A1A1A1' : '#fff'"
          foreground="rgb(23 23 23 / 1)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import CopyBox from '@/components/shared/CopyBox.vue'
import QrcodeVue from 'qrcode.vue'
import { userStore } from '@/stores/userStore'
import { computed } from 'vue'
import {useThemeStore} from "@/stores/themeStore";

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

const store = userStore()
const userInfo = computed(() => {
  return store.userInfo
})

const refUrl = computed(() => {
  if (userInfo && userInfo.value) {
    return `https://app.tomiru.com/register?ref=${userInfo.value.refCode}`
  }
  return ''
})

const shareTelegram = () => {
  window.open(`https://t.me/share/url?url=${refUrl.value}&text=${document.title}`, 'sharer')
}

const shareTwitter = () => {
  window.open(`http://twitter.com/intent/tweet?url=${refUrl.value}`)
}

const shareFacebook = () => {
  const width = 500
  const height = 500
  let leftPosition, topPosition
  leftPosition = window.screen.width / 2 - (width / 2 + 10)
  topPosition = window.screen.height / 2 - (height / 2 + 50)
  let windowFeatures =
    'status=no,height=' +
    height +
    ',width=' +
    width +
    ',resizable=yes,left=' +
    leftPosition +
    ',top=' +
    topPosition +
    ',screenX=' +
    leftPosition +
    ',screenY=' +
    topPosition +
    ',toolbar=no,menubar=no,scrollbars=no,location=no,directories=no'
  const u = refUrl.value
  const t = document.title
  window.open(
    'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(t),
    'sharer',
    windowFeatures
  )
  return false
}
</script>

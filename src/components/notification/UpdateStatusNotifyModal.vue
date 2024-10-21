<template>
  <a-modal
    v-model:visible="visible"
    :footer="false"
    :width="480"
    wrap-class-name="cs-modal"
  >
    <template #title>
      <div class="flex items-center gap-2.5 font-bold">
        <IconSetting />
        <span>Cài đặt thông báo</span>
      </div>
    </template>
    <div class="text-white flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div class="flex gap-2.5 items-center w-[220px]">
          <IconCoin :size="20" />
          <span>Nhận thông báo CP</span>
        </div>
        <a-switch v-model:checked="checkedStatus.isTomxu" />
      </div>
      <div class="flex items-center gap-2">
        <div class="flex gap-2.5 items-center w-[220px]">
          <IconUser :size="20" />
          <span>Nhận thông báo tài khoản</span>
        </div>
        <a-switch v-model:checked="checkedStatus.isAccount" />
      </div>
      <div class="flex items-center gap-2">
        <div class="flex gap-2.5 items-center w-[220px]">
          <IconChat :size="20" />
          <span>Nhận thông báo tương tác</span>
        </div>
        <a-switch v-model:checked="checkedStatus.isSocial" />
      </div>
    </div>
    <div class="flex gap-4 items-center justify-end mt-6">
      <a-button
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSaveConfig"
      >
        Lưu
      </a-button>
      <a-button
        type="only-border"
        size="small"
        style="padding: 0 35px !important"
        @click="close"
      >
        Huỷ
      </a-button>
    </div>
  </a-modal>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  getConfigStatusNotificationApi,
  updateConfigStatusNotificationApi
} from '@/api/notification'
import { message } from 'ant-design-vue'
import IconSetting from '@/components/shared/icons/IconSetting.vue'
import IconCoin from '@/components/shared/icons/IconCoin.vue'
import IconUser from '@/components/shared/icons/IconUser.vue'
import IconChat from '@/components/shared/icons/IconChat.vue'

const visible = ref(false)

const checked = ref(false)
const checkedStatus = ref({
  isSocial: true,
  isTomxu: true,
  isAccount: true
})
const open = () => {
  visible.value = true
}
const close = () => {
  visible.value = false
}

watch(visible, () => {
  if (!visible.value) {
    fetchConfigStatus()
  }
})

const fetchConfigStatus = () => {
  getConfigStatusNotificationApi().then((resp) => {
    checkedStatus.value = {
      isSocial: resp.toggleAbility.includes('toggle_receive_notification_social'),
      isTomxu: resp.toggleAbility.includes('toggle_receive_notification_tomxu'),
      isAccount: resp.toggleAbility.includes('toggle_receive_notification_account')
    }
  })
}
fetchConfigStatus()

const loading = ref(false)
const handleSaveConfig = () => {
  loading.value = true
  updateConfigStatusNotificationApi(checkedStatus.value).then(
    () => {
      loading.value = false
      message.success('Lưu cài đặt thành công')
      close()
    },
    () => {
      loading.value = false
    }
  )
}

defineExpose({
  open
})
</script>

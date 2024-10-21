<template>
  <a-modal
    width="600px"
    class="modal-support"
    v-model:visible="openModal"
  >
    <div class="helper-page-detail w-full">
      <div
        class="helper-page__header flex flex-row justify-center md:justify-start gap-3 text-gold-150 pb-[17px]"
      >
        <IconHelp
          type="black"
          class="cursor-pointer w-6 h-6"
        ></IconHelp>
        <p class="text-body-3 font-bold max-w-[80%]">{{ compOptionActive?.title }}</p>
      </div>
      <div class="helper-page__option p-3 px-0 xl:py-6">
        <iframe
          width="100%"
          class="aspect-video rounded-xl"
          :src="compOptionActive?.link_video"
          :title="compOptionActive?.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <div class="flex flex-row items-center gap-4">
        <a-checkbox v-model:checked="states.isAccept" />
        <span class="text-body-3 mt-1 text-gold-150">Không hiển thị hướng dẫn này cho lần sau</span>
      </div>
    </div>
    <template #footer>
      <div class="flex flex-row md:justify-end gap-3 justify-center">
        <a-button
          class="!h-10"
          type="primary"
          @click="handleOk"
          >Lưu</a-button
        >
        <a-button
          @click="() => (openModal = false)"
          class="!h-10 w-[90px]"
          type="only-border"
          >Hủy</a-button
        >
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue'
import IconHelp from '@/components/shared/icons/IconHelp.vue'
import { supportStore } from '@/stores/support'

const openModal = ref(false)
const support = supportStore()
const states = reactive({
  isAccept: false
})
const compKeySupport = computed(() => {
  return support.key
})
const listOptionHelper = {
  kyc: {
    link_video: 'https://youtube.com/embed/qbqChWpDwmo',
    title: 'Hướng dẫn KYC trên ứng dụng TOMIRU',
    subtitle: 'Hướng dẫn KYC trên ứng dụng TOMIRU'
  },
  'ref-code': {
    link_video: 'https://www.youtube.com/embed/fnaVpsGPZbY',
    title: 'Hướng dẫn cách gửi mã mời cho người được mời',
    subtitle: 'Hướng dẫn cách gửi mã mời cho người được mời'
  },
  'change-password': {
    link_video: 'https://www.youtube.com/embed/zSr41KMrXVY',
    title: 'Hướng dẫn lấy lại mật khẩu',
    subtitle: 'TOMIRU - Hướng dẫn lấy lại mật khẩu trên ứng dụng TOMIRU'
  },
  'transaction-tomxu': {
    link_video: 'https://youtube.com/embed/Yxsl8wcvoXE',
    title: 'Hướng dẫn chuyển và nhận CP',
    subtitle: 'Hướng dẫn "Chuyển" và "Nhận" CP'
  }
}

const compOptionActive = computed(() => {
  return listOptionHelper[compKeySupport.value]
})

const handleOk = () => {
  localStorage.setItem(compKeySupport.value, JSON.stringify(states.isAccept))
  openModal.value = false
}

watch(
  () => openModal.value,
  () => {
    if (!openModal.value) {
      support.setKey('')
    }
  }
)

watch(
  () => compKeySupport.value,
  () => {
    const key = JSON.parse(localStorage.getItem(compKeySupport.value))
    if (!key && compKeySupport.value) {
      openModal.value = true
    }
  }
)
</script>
<style lang="scss">
.dark-theme {
  .modal-support {
    width: 100% !important;
    max-width: 600px !important;
    .ant-modal-content {
      width: 100%;
      background: var(--neutral-850);
    }
  }
}

.modal-support {
  width: 100% !important;
  max-width: 600px;

  .ant-modal-body {
    padding: 22px 26px 0 26px;
    @media screen and (max-width: 767px) {
      padding: 18px 8px 0 8px;
    }
  }

  .ant-modal-close-x {
    position: relative;

    .anticon-close {
      position: absolute;
      top: 20px;
      right: 12px;
      @apply md:top-5 md:right-5;
    }
  }
  .ant-modal-footer {
    border-top: unset;
    @apply py-[37px] pt-[26px] md:py-[25px];
  }
}
</style>

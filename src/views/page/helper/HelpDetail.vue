<template>
  <div class="helper-page-detail w-full">
    <TomixuCard> </TomixuCard>
    <div
      class="helper-page__header pt-[25px] xl:pt-[76px] pb-[30px] px-3 xl:px-[33px] gap-3 flex flex-row items-center"
    >
      <IconArrowLeft
        @click="handleBack"
        class="cursor-pointer w-8 h-8"
      ></IconArrowLeft>
      <p class="text-heading-4 md:text-2xl text-lg">{{ compOptionActive.title }}</p>
    </div>
    <div class="helper-page__option p-3 xl:p-6 xl:!pt-4">
      <iframe
        width="100%"
        class="aspect-video rounded-xl"
        :src="compOptionActive.link_video"
        :title="compOptionActive.title"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <p class="text-body-3 mt-5">{{ compOptionActive.subtitle }}</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import router from '@/router'
import IconArrowLeft from '@/components/shared/icons/IconArrowLeft.vue'
import TomixuCard from '@/components/feed/TomixuCard.vue'
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
  return listOptionHelper[router.currentRoute.value.query.type]
})

const handleBack = () => {
  router.push({
    name: 'support'
  })
}
</script>
<style lang="scss">
@import '@/design/base.scss';
.helper-page-detail {
  .helper-page__header {
    border-bottom: 0.5px solid var(--border-cart-support);
  }
}
</style>

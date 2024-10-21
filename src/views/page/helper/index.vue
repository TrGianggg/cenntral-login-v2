<template>
  <div class="helper-page w-full">
    <TomixuCard> </TomixuCard>
    <div class="helper-page__header pt-[25px] xl:pt-[76px] pb-[30px] px-3 xl:px-[33px]">
      <p class="text-heading-4 md:text-2xl text-lg">Chúng tôi có thể giúp gì cho bạn ?</p>
    </div>
    <div class="helper-page__option p-3 xl:p-6 px-0">
      <div
        class="helper-page__option-list grid grid-cols-1 ssm:grid-cols-2 gap-3 xl:gap-x-6 xl:gap-y-5 pt-3"
      >
        <div
          v-for="item in listOptionHelper"
          :key="item.title"
          class="p-2.5 flex item-helper flex-col w-full items-center xl:pb-[46px] xl:pt-[24px] py-4 gap-6 ssm:gap-0 md:gap-[35px] justify-start rounded-2xl"
          @click="handleViewDetail(item.link)"
        >
          <div class="w-full">
            <img
              :src="item.image"
              class="max-h-[155px] max-w-[90px] w-full md:max-w-[266px] aspect-square m-auto"
              alt=""
            />
          </div>
          <div>
            <p class="text-body-3 text-center">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ImageItem1 from '@/assets/images/helper/item_1.svg'
import ImageItem2 from '@/assets/images/helper/item_2.svg'
import ImageItem3 from '@/assets/images/helper/item_3.svg'
import ImageItem4 from '@/assets/images/helper/item_4.svg'
import TomixuCard from '@/components/feed/TomixuCard.vue'
import { ref } from 'vue'
import router from '@/router'
const listOptionHelper = ref([
  {
    image: ImageItem1,
    title: 'Hướng dẫn về KYC',
    link: 'kyc'
  },
  {
    image: ImageItem2,
    title: 'Hướng dẫn gửi mã giới thiệu',
    link: 'ref-code'
  },
  {
    image: ImageItem3,
    title: 'Hướng dẫn lấy lại mật khẩu',
    link: 'change-password'
  },
  {
    image: ImageItem4,
    title: 'Hướng dẫn chuyển nhận CP',
    link: 'transaction-tomxu'
  }
])

const handleViewDetail = (path) => {
  router.push({
    name: 'support-detail',
    query: {
      type: path
    }
  })
}
</script>
<style lang="scss">
@import '@/design/base.scss';
.helper-page {
  .helper-page__header {
    border-bottom: 1px solid var(--border-cart-p2p);
  }
  .helper-page__option-list {
    .item-helper {
      border: 1px solid var(--border-cart-p2p);
      cursor: pointer;
      &:hover {
        background: var(--neutral-850-2);
      }
    }
  }
}

.dark-theme {
  .helper-page {
    .helper-page__option-list {
      .item-helper {
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
}
</style>

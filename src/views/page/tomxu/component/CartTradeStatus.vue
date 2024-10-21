<template>
  <div
    class="comp-cart-market p-4 pb-0 w-full px-6 hover:lg:scale-[1.02] transition-300 cursor-pointer rounded-lg flex flex-col items-center"
  >
    <div class="grid comp-cart-market__content grid-cols-6 gap-4 w-full pb-4">
      <div class="w-full flex flex-col gap-4 col-span-4">
        <p class="font-black">{{ dataCart.agency_name }}</p>
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row gap-1 text-body-4 items-end">
            <span>{{ dataCart.count_transaction }}</span>
            <span class="text-neutral-500">{{ $t('tomxu.transaction') }}</span>
          </div>
          <div class="h-[16px] w-[1px] bg-neutral-400"></div>
          <div class="flex flex-row gap-1 items-center">
            <span class="text-body-4">{{ dataCart.value_transaction }}</span>
            <span class="text-body-4">CP</span>
          </div>
        </div>
      </div>
      <div class="col-span-2">
        <TagsLabelCustom :type="dataCart.status"></TagsLabelCustom>
      </div>
    </div>
    <div class="grid-cols-2 grid w-full py-3">
      <a
        :href="`https://zalo.me/${dataCart.number_phone}`"
        target="_blank"
        class="flex flex-row gap-2 items-center group w-full justify-start"
      >
        <img :src="IconZalo" />
        <span
          class="text-neutral-500 group-hover:text-white transition-300 text-body-4 line-clamp-1 break-all"
          >{{ dataCart.number_phone }}</span
        >
      </a>
      <a
        :href="`https://t.me/${dataCart.link_telegram}`"
        class="flex flex-row gap-2 items-center group"
        target="_blank"
      >
        <img :src="Telegram" />
        <span
          class="text-neutral-500 text-body-4 group-hover:text-white transition-300 line-clamp-1 break-all"
          >t.me/{{ dataCart.link_telegram }}</span
        >
      </a>
    </div>
  </div>
</template>
<script setup>
import IconZalo from '@/assets/icons/tomxu/icon-zalo.svg'
import Telegram from '@/assets/icons/tomxu/icon-telegram.svg'
import { defineProps } from 'vue'
import TagsLabelCustom from '@/components/app/TagsLabelCustom.vue'
const props = defineProps({
  dataCart: {
    type: Object,
    default: () => {
      return {
        status: 'offline',
        agency_name: 'Đại lý Hoàng văn hưng',
        count_transaction: 123,
        value_transaction: 123454.55,
        number_phone: '0969985433',
        link_telegram: 'T.me/123124'
      }
    }
  }
})
</script>
<style lang="scss">
@import '@/design/base.scss';
.comp-cart-market {
  background: var(--neutral-850-2);
  border: 1px solid var(--border-cart-p2p);
  .comp-cart-market__content {
    border-bottom: 1px solid var(--border-cart-p2p);
  }
}

.dark-theme {
  .comp-cart-market {
    background: var(--neutral-800-1);
  }
}
</style>

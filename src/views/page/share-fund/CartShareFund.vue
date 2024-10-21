<template>
  <!--  Desktop-->
  <div class="cart-share-fund hidden md:flex flex-col">
    <p class="flex flex-row gap-2 items-center justify-center text-heading-4">
      <span>{{ data.name }}</span
      ><IconHelp
        class="cursor-pointer"
        @click="
          () => {
            openModal = true
          }
        "
      ></IconHelp>
    </p>
    <div class="flex flex-1 w-full justify-center items-end mb-6">
      <img
        :src="data.icon"
        alt=""
      />
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex flex-row items-end justify-start gap-2">
        <span class="text-heading-3 !leading-[100%] text-gold-150"
          ><Vue3autocounter
            ref="counter"
            :startAmount="0"
            :endAmount="data.amount"
            :duration="3"
            separator=","
            decimalSeparator="."
            :decimals="data.amount > 0 ? 2 : 0"
            :autoinit="true"
            @finished="alert(`Counting finished!`)"
        /></span>

        <span class="text-body-3 text-gold-150">CP</span>
        <img
          class="w-3 mb-1"
          :src="tokenLogo"
          alt=""
        />
      </div>
      <p class="text-body-5">
        <span class="text-body-3 text-color-custom font-bold">{{ data.number_member }}</span> thành
        viên hợp lệ sẽ được nhận thưởng
      </p>
      <vue-countdown
        :time="timeSpace"
        v-slot="{ days, hours, minutes, seconds }"
      >
        <div class="text-body-4 flex flex-row items-center gap-2">
          <IconClock /><span class="text-gray-1 text-color-custom"
            >{{ days }}d : {{ hours }}h : {{ minutes }}m : {{ seconds }}s</span
          >
        </div>
      </vue-countdown>
    </div>
  </div>
  <!--  mobile-->
  <div class="cart-share-fund flex md:hidden justify-center flex-row gap-[31px]">
    <div class="flex flex-col gap-1">
      <div class="flex flex-1 w-full justify-center items-center">
        <img
          :src="data.icon"
          alt=""
        />
      </div>
      <div class="cart-share-fund__value flex flex-col items-center justify-center gap-2">
        <span class="text-heading-3 text-[20px] text-gold-150 !leading-[100%]">
          <Vue3autocounter
            ref="counter"
            :startAmount="0"
            :endAmount="data.amount"
            :duration="3"
            separator=","
            decimalSeparator="."
            :decimals="data.amount > 0 ? 2 : 0"
            :autoinit="true"
            @finished="alert(`Counting finished!`)"
        /></span>
        <div class="flex flex-row gap-2">
          <span class="text-body-3 text-gold-150">CP</span>
          <img
            class="w-3 mb-1"
            :src="tokenLogo"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="flex-1 flex-col items-start justify-center gap-3 flex">
      <p class="flex flex-row gap-2 items-center text-heading-4">
        <span class="text-[18px]">{{ data.name }}</span
        ><IconHelp
          class="cursor-pointer"
          @click="
            () => {
              openModal = true
            }
          "
        ></IconHelp>
      </p>
      <p class="text-base text-color-custom">
        <span class="font-bold">{{ data.number_member }}</span> thành viên hợp lệ sẽ được nhận
        thưởng
      </p>
      <vue-countdown
        :time="timeSpace"
        v-slot="{ days, hours, minutes, seconds }"
      >
        <div class="text-[14px] flex flex-row items-center gap-2">
          <IconClock /><span class="text-gray-1 text-color-custom"
            >{{ days }}d : {{ hours }}h : {{ minutes }}m : {{ seconds }}s</span
          >
        </div>
      </vue-countdown>
    </div>
  </div>
  <a-modal
    width="600px"
    class="modal-share-fund"
    v-model:visible="openModal"
  >
    <template #title>
      <div class="flex flex-row items-center gap-3">
        <IconShareFunActive></IconShareFunActive>
        <span class="font-bold text-body-1">{{ data.name }}</span>
      </div>
    </template>
    <div>
      <ul
        v-if="data.contentDetail"
        class="text-body-3 list-disc px-6 flex flex-col gap-1"
      >
        <li
          class="!leading-[150%]"
          v-for="item in data.contentDetail"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
      <a-skeleton
        v-else
        active
      />
    </div>
  </a-modal>
</template>
<script setup>
import { computed, defineProps, ref } from 'vue'
import IconHelp from '@/components/shared/icons/IconHelp.vue'
import { masterDataStore } from '@/stores/masterDataStore'
import VueCountdown from '@chenfengyuan/vue-countdown'
import IconClock from '@/components/shared/icons/IconClock.vue'
import IconShareFunActive from '@/components/shared/icons/sidebar/IconShareFunActive.vue'
import dayjs from 'dayjs'
import Vue3autocounter from 'vue3-autocounter'

defineProps({
  data: {
    type: Array,
    default: {}
  }
})

const timeSpace = computed(() => {
  const currentDate = dayjs()
  const endOfMonth = dayjs().endOf('month')
  return endOfMonth - currentDate
})

const masterData = masterDataStore()
const tokenLogo = computed(() => {
  return masterData.masterData.tokens?.[0].logo
})

const openModal = ref(false)
</script>
<style lang="scss">
.cart-share-fund {
  border: 1px solid var(--border-cart-p2p);
  &:hover {
    background: var(--background-cart-share-fund);
  }
  @apply w-full rounded-2xl p-2 md:px-[30px] md:py-[19px];

  .text-color-custom {
    @media screen and (max-width: 767px) {
      color: #474747;
    }
  }
}

.dark-theme {
  .cart-share-fund {
    .text-color-custom {
      color: #faf6eb;
    }
  }
}

.modal-share-fund {
  .ant-modal-footer {
    display: none;
  }

  .ant-modal-header {
    @apply mx-6 px-0;
  }
  .ant-modal-close-x {
    .anticon-close {
      position: absolute;
      top: 13px;
      right: 13px;
    }
  }
}

@media screen and (max-width: 767px) {
  .modal-share-fund {
    width: 100% !important;
  }
}

.dark-theme {
  .modal-share-fund {
    .ant-modal-content,
    .ant-modal-header {
      background: #141414;
    }

    .ant-modal-header {
      border-bottom: 1px solid #ddd;
    }

    .ant-modal-title,
    .ant-modal-close-icon,
    .ant-modal-body {
      color: #faf6eb;
    }
  }
}
</style>

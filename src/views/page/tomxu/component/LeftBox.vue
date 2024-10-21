<template>
  <div
    class="left-box-tomxu px-3 py-3 md:px-6 md:py-5 bg-neutral-850-2 rounded-2xl flex flex-col gap-4 sticky top-[100px]"
  >
    <div class="grid-cols-1 ssm12:grid-cols-2 grid md:grid-cols-1 gap-6">
      <div class="flex flex-col gap-6">
        <div class="flex flex-row items-end gap-2">
          <p class="text-token text-body-3 leading-[90%] !font-bold">{{ LIST_TOKEN.tomxu }}</p>
          <img
            :src="userInfo?.usersBalances?.[0]?.token.logo"
            class="w-3"
            alt
          />
        </div>
        <div class="flex flex-row items-center justify-between gap-4">
          <p class="text-gold-150 text-heading-3 font-normal break-all">
            {{
              isShowToken2
                ? userInfo?.usersBalances?.[0]?.balance
                  ? formatNumber(userInfo?.usersBalances?.[0]?.balance)
                  : 0
                : '*****'
            }}
          </p>
          <div
            @click="toggleToken2"
            class="flex items-center text-[24px] cursor-pointer"
          >
            <eye-outlined v-if="isShowToken2" />
            <eye-invisible-outlined v-else />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6">
        <div class="flex flex-row items-center gap-2">
          <div class="flex flex-row items-end gap-2">
            <p class="text-token text-body-3 leading-[90%] !font-bold">
              {{ LIST_TOKEN.p_tomxu }}
            </p>
            <img
              :src="userInfo?.usersBalances?.[0]?.token.logo"
              class="w-3"
              alt
            />
          </div>
          <modal-detail-p-tomxu></modal-detail-p-tomxu>
        </div>
        <div class="flex flex-row items-center justify-between gap-4">
          <p class="text-gold-150 text-heading-3 font-normal break-all">
            {{
              isShowToken
                ? userInfo?.usersBalances?.[1]?.balance
                  ? formatNumber(userInfo?.usersBalances?.[1]?.balance)
                  : 0
                : '*****'
            }}
          </p>
          <div
            @click="toggleToken"
            class="flex items-center text-[24px] cursor-pointer"
          >
            <eye-outlined v-if="isShowToken" />
            <eye-invisible-outlined v-else />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-row gap-3">
      <ModalTransferTomxu> </ModalTransferTomxu>
      <ModalReceiveTomxu> </ModalReceiveTomxu>
    </div>
    <!--    <ModalSwapToken> </ModalSwapToken>-->
  </div>
</template>
<script setup>
import { computed, ref, createVNode } from 'vue'
import { ExclamationCircleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { formatDecimalNumber } from '@/helper'
import { formatNumber } from '@/helper/ultil'
import ModalTransferTomxu from '@/components/tomxu-manager/ModalTransferTomxu.vue'
import ModalReceiveTomxu from '@/components/tomxu-manager/ModalReceiveTomxu.vue'
import ModalSwapToken from '@/components/tomxu-manager/ModalSwapToken.vue'
import { userStore } from '@/stores/userStore'
import { Modal } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { LIST_TOKEN } from '@/helper/const'
import ModalDetailPTomxu from '@/components/app/ModalDetailPTomxu.vue'

const { t } = useI18n()
const isShowToken = ref(true)
const isShowToken2 = ref(true)
const userInfo = computed(() => {
  return userStore().userInfo
})

const toggleToken = () => {
  isShowToken.value = !isShowToken.value
}
const toggleToken2 = () => {
  isShowToken2.value = !isShowToken2.value
}
</script>
<style lang="scss">
.left-box-tomxu {
  .text-token {
    color: var(--color-white);
  }
}
</style>

<template>
  <div class="lg:hidden flex w-full justify-start rounded-xl">
    <div
      :class="[
        'right-content pt-4 w-full border-r h-max sticky top-0 bg-neutral-850 md:px-0',
        checkStyleBackground ? 'px-4' : 'px-3'
      ]"
    >
      <div
        :class="[
          'flex flex-col gap-5 md:px-4',
          checkStyleBackground ? 'cart-tomxu-action p-6 rounded-[7px] mb-3' : ''
        ]"
      >
        <div class="grid grid-cols-1 ssm12:grid-cols-2 gap-4">
          <div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-white font-bold">{{ LIST_TOKEN.tomxu }}</span>
              <img
                :src="userInfo?.usersBalances?.[0]?.token.logo"
                class="w-4"
              />
            </div>
            <div class="flex gap-4 items-center">
              <span class="text-heading-3 text-primary-color">
                {{ isShowToken ? formatNumber(userInfo?.usersBalances?.[0]?.balance) : '******' }}
              </span>
              <div
                @click="toggleToken"
                class="flex items-center text-[24px] cursor-pointer"
              >
                <eye-outlined v-if="isShowToken" />
                <eye-invisible-outlined v-else />
              </div>
            </div>
          </div>
          <div>
            <div class="text-white-4 font-bold flex flex-row items-center gap-2">
              <div class="flex flex-row items-center gap-2">
                <span class="text-white font-bold">{{ LIST_TOKEN.p_tomxu }}</span>
                <img
                  :src="userInfo?.usersBalances?.[0]?.token.logo"
                  class="w-4"
                />
              </div>
              <ModalDetailPTomxu></ModalDetailPTomxu>
            </div>
            <div class="flex gap-4 items-center">
              <span class="text-heading-3 text-primary-color">
                {{ isShowToken2 ? formatNumber(userInfo?.usersBalances?.[1]?.balance) : '******' }}
              </span>
              <div
                @click="() => (isShowToken2 = !isShowToken2)"
                class="flex items-center text-[24px] cursor-pointer"
              >
                <eye-outlined v-if="isShowToken2" />
                <eye-invisible-outlined v-else />
              </div>
            </div>
            <!-- Sua mobile them doan code duoi -->
            <div class="flex gap-4 items-center">
              <span class="text-heading-3 text-primary-color">
                {{
                  isShowToken2 ? formatNumber(userInfo?.usersBalances?.[1]?.lock_amount) : '******'
                }}
              </span>
              <div
                @click="() => (isShowToken2 = !isShowToken2)"
                class="flex items-center text-[24px] cursor-pointer"
              >
                <eye-outlined v-if="isShowToken2" />
                <eye-invisible-outlined v-else />
              </div>
            </div>
            <!-- Ket thuc code -->
          </div>
        </div>
        <div class="flex flex-col gap-3 mb-3 text-center">
          <div class="grid grid-cols-2 gap-3 w-full">
            <ModalTransferTomxu> </ModalTransferTomxu>
            <ModalReceiveTomxu> </ModalReceiveTomxu>
          </div>
          <h1
            v-if="isPackageDefaultOrTrial"
            class="text-red-400"
          >
            Vui lòng mua gói để sử dụng tính năng chuyển TOMXU
          </h1>
        </div>
        <!--          <ModalSwapToken> </ModalSwapToken>-->
      </div>
      <div
        class="flex text-white border-b gap-[15%] md:gap-4 justify-evenly ssm:justify-between border-t px-4 py-2"
        :class="[hiddenBottomAction ? 'hidden' : '']"
      >
        <router-link
          :to="{ name: 'tomxu-manager', query: { tab: 'TabManagerTransaction' } }"
          tag="div"
          class="flex items-center gap-4 h-[48px] cursor-pointer text-white"
        >
          <IconTime />
          <span class="text-body-2 hidden ssm:block">{{ $t('tomxu.transaction_history') }}</span>
        </router-link>
        <router-link
          :to="{ name: 'tomxu-manager', query: { tab: 'TabMarket' } }"
          class="flex items-center gap-4 h-[48px] cursor-pointer text-white"
        >
          <IconAgency />
          <span class="text-body-2 hidden ssm:block">{{
            $t('layout.menu_main.market_tomxu')
          }}</span>
        </router-link>
      </div>
      <Attendance v-if="userInfo.package.name === 'Business'"></Attendance>
    </div>
  </div>
</template>
<script>
import { Layout, Modal } from 'ant-design-vue'
import { userStore } from '@/stores/userStore'
import { computed, createVNode, onMounted, ref } from 'vue'
import Sidebar from '@/layout/component/Sidebar.vue'
import { LIST_TOKEN } from '@/helper/const'
import Attendance from '@/components/user/Attendance.vue'
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  DownOutlined,
  SwapOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { formatNumber } from '@/helper/ultil'
import IconTime from '@/components/shared/icons/IconTime.vue'
import IconAgency from '@/components/shared/icons/IconAgency.vue'
import ModalTransferTomxu from '@/components/tomxu-manager/ModalTransferTomxu.vue'
import ModalReceiveTomxu from '@/components/tomxu-manager/ModalReceiveTomxu.vue'
import ModalSwapToken from '@/components/tomxu-manager/ModalSwapToken.vue'
import { useI18n } from 'vue-i18n'
import HeaderSidebarMobile from '@/layout/component/HeaderSidebarMobile.vue'
import router from '@/router'
import ModalDetailPTomxu from '@/components/app/ModalDetailPTomxu.vue'

export default {
  name: 'LayoutContent',

  methods: { formatNumber },
  components: {
    ModalSwapToken,
    Attendance,
    ModalDetailPTomxu,
    SwapOutlined,
    PageContent: Layout.Content,
    Sidebar,
    EyeOutlined,
    EyeInvisibleOutlined,
    ModalTransferTomxu,
    ModalReceiveTomxu,
    DownOutlined,
    IconTime,
    IconAgency,
    HeaderSidebarMobile
  },
  setup() {
    const { t } = useI18n()
    onMounted(async () => {
      await userStore().getUserInfo()
    })
    const userInfo = computed(() => {
      return userStore().userInfo
    })

    const hiddenBottomAction = computed(() => {
      const listRoute = ['share-fund', 'member']
      return listRoute.includes(router.currentRoute.value.name)
    })

    const checkStyleBackground = computed(() => {
      const listRoute = ['share-fund']
      return listRoute.includes(router.currentRoute.value.name)
    })
    const isShowToken = ref(true)
    const isShowToken2 = ref(true)
    const toggleToken = () => {
      isShowToken.value = !isShowToken.value
    }
    const packageName = JSON.parse(localStorage.getItem('userInfo')).package.name
    const isPackageDefaultOrTrial = packageName === 'Default' || packageName === 'Trial'
    return {
      isShowToken,
      checkStyleBackground,
      isShowToken2,
      toggleToken,
      LIST_TOKEN,
      hiddenBottomAction,
      userInfo,
      isPackageDefaultOrTrial
    }
  }
}
</script>
<style lang="scss">
.cart-tomxu-action {
  background: var(--neutral-850-2);
}
</style>

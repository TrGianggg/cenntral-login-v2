<template>
  <div id="recaptcha-container"></div>
  <div
    class="layout-basic hidden max-w-1920 lg:flex flex-col mx-auto items-center shadow-lg fixed top-0 left-0 z-[1000] bg-neutral-900 h-[60px]"
  >
    <header class="bg-neutral-900 items-center wrap-layout-sidebar">
      <AppLogo></AppLogo>
      <div></div>
      <div class="flex flex-row items-center gap-5">
        <router-link
          :to="{ name: 'notification' }"
          class="item"
        >
          <IconNotification />
        </router-link>
        <router-link
          :to="{ name: 'message' }"
          class="item"
        >
          <IconMessage />
        </router-link>
        <AppUserInfo />
      </div>
    </header>
  </div>
  <PageContent
    class="wrap-layout-sidebar mt-[60px]"
    :class="[{ 'post-detail-layout': isPostDetailPage }, { 'message-layout': isMessagePage }]"
  >
    <HeaderSidebarMobile />
    <div class="lg:flex hidden w-full justify-end sidebar-container">
      <Sidebar />
    </div>
    <div
      class="layout-sidebar-content border-l border-r"
      :class="{ 'layout-sidebar-content-no-padding': isNoPaddingContent }"
    >
      <router-view />
    </div>
    <div
      v-if="!isMessagePage"
      class="lg:flex hidden w-full justify-start"
    >
      <div class="right-content pt-5 w-[280px] border-r h-max sticky top-0">
        <!-- sua Pc tu day -->
        <div class="flex flex-col gap-5 px-5">
          <div class="flex flex-row items-center gap-2 justify-between">
            <div class="flex items-center justify-between gap-2">
              <span class="text-white font-bold">{{ LIST_TOKEN.tomxu }}</span>
              <img
                :src="userInfo?.usersBalances?.[0]?.token.logo"
                class="w-4"
              />
            </div>
            <div
              @click="toggleToken"
              class="flex items-center text-[24px] cursor-pointer"
            >
              <eye-outlined v-if="isShowToken" />
              <eye-invisible-outlined v-else />
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-heading-3 text-primary-color">
              {{ isShowToken ? formatNumber(userInfo?.usersBalances?.[0]?.balance) : '******' }}
            </span>
          </div>
          <div class="text-white font-bold flex flex-row items-center gap-2 justify-between">
            <div class="flex gap-2 items-center">
              <div class="flex flex-row items-center gap-2">
                <span class="text-white font-bold">{{ LIST_TOKEN.p_tomxu }}</span>
                <img
                  :src="userInfo?.usersBalances?.[0]?.token.logo"
                  class="w-4"
                />
              </div>
              <ModalDetailPTomxu></ModalDetailPTomxu>
            </div>
            <div
              @click="() => (isShowToken2 = !isShowToken2)"
              class="flex items-center text-[24px] cursor-pointer"
            >
              <eye-outlined v-if="isShowToken2" />
              <eye-invisible-outlined v-else />
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-heading-3 text-primary-color">
              {{ isShowToken2 ? formatNumber(userInfo?.usersBalances?.[1]?.balance) : '******' }}
            </span>
            <span class="text-1">Số dư khả dụng</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-heading-3 text-primary-color">
              {{
                isShowToken2 ? formatNumber(userInfo?.usersBalances?.[1]?.lock_amount) : '******'
              }}
            </span>
            <span class="text-1">Số dư khóa</span>
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
              Vui lòng mua gói để sử dụng tính năng chuyển CP
            </h1>
          </div>
          <!--            <ModalSwapToken> </ModalSwapToken>-->
        </div>
        <!-- ket thuc sua  PC-->
        <div class="flex flex-col text-white border-b border-t px-5 pr-0 py-5 transaction-wrapper">
          <router-link
            :to="{ name: 'tomxu-manager', query: { tab: 'TabManagerTransaction' } }"
            tag="div"
            class="flex items-center gap-4 h-[60px] cursor-pointer text-white"
          >
            <IconTime />
            <span class="text-body-1">{{ $t('tomxu.transaction_history') }}</span>
          </router-link>
          <router-link
            :to="{ name: 'tomxu-manager', query: { tab: 'TabMarket' } }"
            class="flex items-center gap-4 h-[60px] cursor-pointer text-white hover:text-white"
          >
            <IconAgency />
            <span class="text-body-1">{{ $t('layout.menu_main.market_tomxu') }}</span>
          </router-link>
        </div>
        <div class="px-5 pr-0">
          <Attendance v-if="userInfo.package.name === 'Business'"></Attendance>
        </div>
      </div>
      <ModalComingsoon></ModalComingsoon>
    </div>
  </PageContent>
  <ModalSupport></ModalSupport>
</template>
<script>
import ModalComingsoon from '@/components/app/ModalComingsoon.vue'
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
  SwapOutlined
} from '@ant-design/icons-vue'
import { formatNumber } from '@/helper/ultil'
import IconTime from '@/components/shared/icons/IconTime.vue'
import IconAgency from '@/components/shared/icons/IconAgency.vue'
import ModalTransferTomxu from '@/components/tomxu-manager/ModalTransferTomxu.vue'
import ModalReceiveTomxu from '@/components/tomxu-manager/ModalReceiveTomxu.vue'
import ModalSwapToken from '@/components/tomxu-manager/ModalSwapToken.vue'
import { useI18n } from 'vue-i18n'
import HeaderSidebarMobile from '@/layout/component/HeaderSidebarMobile.vue'
import { masterDataStore } from '@/stores/masterDataStore'
import { useSocket } from '@/hooks/useSocket'
import ModalSupport from '@/components/support/ModalSupport.vue'
import { useFirebase } from '@/hooks/useFirebase'
import ModalDetailPTomxu from '@/components/app/ModalDetailPTomxu.vue'
import AppUserInfo from '@/components/app/AppUserInfo.vue'
import IconNotification from '@/components/shared/icons/sidebar/IconNotification.vue'
import IconMessage from '@/components/shared/icons/sidebar/IconMessage.vue'
import AppLogo from '@/components/app/AppLogo.vue'

export default {
  name: 'LayoutContent',

  computed: {
    isNoPaddingContent() {
      return ['notification', 'support-detail', 'share-fund'].includes(this.$route.name)
    },
    isPostDetailPage() {
      return this.$route.name === 'PostDetail'
    },
    isMessagePage() {
      return this.$route.name === 'message'
    }
  },

  methods: { formatNumber },
  components: {
    ModalSupport,
    Attendance,
    ModalDetailPTomxu,
    ModalSwapToken,
    SwapOutlined,
    PageContent: Layout.Content,
    Sidebar,
    EyeOutlined,
    EyeInvisibleOutlined,
    ModalTransferTomxu,
    ModalReceiveTomxu,
    DownOutlined,
    ModalComingsoon,
    IconTime,
    IconAgency,
    HeaderSidebarMobile,
    AppLogo,
    AppUserInfo,
    IconNotification,
    IconMessage
  },
  setup() {
    const { t } = useI18n()
    useSocket()
    // useFirebase()
    onMounted(async () => {
      await userStore().getUserInfo()
      await masterDataStore().getMasterData()
    })
    const packageName = JSON.parse(localStorage.getItem('userInfo')).package.name
    const isPackageDefaultOrTrial = packageName === 'Default' || packageName === 'Trial'
    const userInfo = computed(() => {
      return userStore().userInfo
    })

    const isShowToken = ref(true)
    const isShowToken2 = ref(true)
    const toggleToken = () => {
      isShowToken.value = !isShowToken.value
    }

    return {
      isShowToken,
      isShowToken2,
      toggleToken,
      LIST_TOKEN,
      userInfo,
      isPackageDefaultOrTrial
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.light-theme {
  .transaction-wrapper {
    a {
      &:hover {
        background: #6fc4fc;
      }
    }
  }
}

.item {
  height: 55px;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-white);
  font-size: 20px;
}

.dark-theme {
  .transaction-wrapper {
    a {
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #cbb472;
      }
    }
  }
}
.transaction-wrapper {
  padding: 16px;
  a {
    padding: 0 20px;
    border: 1px solid #a1a1a1;
    border-radius: 999px;
    margin-bottom: 10px;
    &:hover {
      color: var(--color-white);
    }
  }
}

.wrap-layout-sidebar {
  display: grid;
  grid-template-columns: 1fr 680px 1fr;
  &.message-layout {
    display: flex;
    justify-content: center;
    height: calc(var(--vh, 1vh) * 100);
    .sidebar-container {
      width: auto;
    }
    .layout-sidebar-content {
      width: 960px;
      padding: 0;
    }
  }
  .layout-sidebar-content {
    display: flex;
    justify-content: center;
    min-width: 1px;
    padding: 0 1rem;
    &.layout-sidebar-content-no-padding {
      padding: 0;
    }
  }
}

.light-theme {
  .wrap-layout-sidebar {
    .layout-sidebar-content {
      border: 0;
      box-shadow: 0 7px 5px 0 rgba(0, 0, 0, 0.25);
    }
    .right-content {
      border: 0;
    }
    .transaction-wrapper {
      border-bottom: 0;
    }
  }
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .wrap-layout-sidebar {
    grid-template-columns: 1fr auto 1fr;
  }
}
@media (max-width: 1024px) {
  .wrap-layout-sidebar {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    min-height: calc(var(--vh, 1vh) * 100);
    .layout-sidebar-content {
      flex: 1;
      min-height: 1px;
    }
    &.message-layout {
      display: flex;
      justify-content: center;
      height: calc(var(--vh, 1vh) * 100);
      .layout-sidebar-content {
        width: 100%;
        padding: 0;
      }
    }
    &.post-detail-layout {
      height: calc(var(--vh, 1vh) * 100);
    }
  }
  .right-content {
    border-right: none;
  }
  .light-theme {
    .wrap-layout-sidebar {
      .layout-sidebar-content {
        box-shadow: none;
      }
    }
  }
}
@media (max-width: 768px) {
  .wrap-layout-sidebar {
    .layout-sidebar-content {
      border: none;
    }
  }
}
</style>

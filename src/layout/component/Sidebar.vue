<template>
  <div class="sidebar-wrapper cs-scroll-bar">
    <div class="sidebar-content !w-full">
      <div class="px-6 lg:hidden">
        <AppLogo />
      </div>
      <div class="sidebar-list mt-8 w-full pr-4">
        <router-link
          v-for="(item, index) in sidebarItems"
          :key="index"
          :to="
            item.name === 'tomxu-manager'
              ? {
                  name: 'tomxu-manager',
                  query: {
                    tab: 'TabMarket'
                  }
                }
              : item.name === 'profile'
                ? {
                    name: 'ProfileUser',
                    params: {
                      username: userInfo && userInfo.username ? userInfo.username : '-'
                    }
                  }
                : {
                    name: item.name
                  }
          "
          @click="handleClickMenu(item)"
          :class="[
            'sidebar-item',
            item.name === 'tomxu-manager' ? 'xl:!hidden' : '',
            { 'sidebar-item-active': currentRoute === item.name }
          ]"
        >
          <component :is="currentRoute === item.name ? { ...item.iconActive } : { ...item.icon }">
          </component>
          <span
            class="flex items-center gap-2"
            :class="currentRoute === item.name ? 'font-normal' : 'font-normal text-white'"
          >
            {{ item.label }}
            <span
              v-if="countData.countAll && item.name === 'notification'"
              class="count-item font-normal"
            >
              {{ countData.countAll > 99 ? '99+' : countData.countAll }}
            </span>
            <span
              v-if="countMessageDataStore.countNewAll && item.name === 'message'"
              class="count-item font-normal"
            >
              {{
                countMessageDataStore.countNewAll > 99 ? '99+' : countMessageDataStore.countNewAll
              }}
            </span>
          </span>
        </router-link>
      </div>
    </div>
    <div class="lg:hidden py-8 pl-6 flex flex-col gap-8 w-[250px]">
      <AppUserInfo></AppUserInfo>
    </div>
  </div>
</template>
<script setup>
import AppLogo from '@/components/app/AppLogo.vue'
import IconHome from '@/components/shared/icons/sidebar/IconHome.vue'
import IconSearch from '@/components/shared/icons/sidebar/IconSearch.vue'
import IconNotification from '@/components/shared/icons/sidebar/IconNotification.vue'
import IconNotificationActive from '@/components/shared/icons/sidebar/IconNotificationActive.vue'
import IconMap from '@/components/shared/icons/sidebar/IconMap.vue'
import IconMapActive from '@/components/shared/icons/sidebar/IconMapActive.vue'
import IconMessage from '@/components/shared/icons/sidebar/IconMessage.vue'
import IconMessageActive from '@/components/shared/icons/sidebar/IconMessageActive.vue'
import IconStore from '@/components/shared/icons/sidebar/IconStore.vue'
import IconProfile from '@/components/shared/icons/sidebar/IconProfile.vue'
import IconNetwork from '@/components/shared/icons/sidebar/IconNetwork.vue'
import IconMember from '@/components/shared/icons/sidebar/IconMember.vue'
import IconMemberActive from '@/components/shared/icons/sidebar/IconMemberActive.vue'
import IconAgencySidebar from '@/components/shared/icons/sidebar/IconAgencySidebar.vue'
import IconAgencySidebarActive from '@/components/shared/icons/sidebar/IconAgencySidebarActive.vue'
import IconExplore from '@/components/shared/icons/sidebar/IconExplore.vue'
import IconDocument from '@/components/shared/icons/sidebar/IconDocument.vue'
import IconPeople from '@/components/shared/icons/sidebar/IconPeople.vue'
import IconSocial from '@/components/shared/icons/sidebar/IconSocial.vue'
import IconWork from '@/components/shared/icons/sidebar/IconWork.vue'
import IconShareFun from '@/components/shared/icons/sidebar/IconShareFun.vue'
import IconShareFunActive from '@/components/shared/icons/sidebar/IconShareFunActive.vue'
import { useI18n } from 'vue-i18n'
import AppUserInfo from '@/components/app/AppUserInfo.vue'
import { computed, inject, ref, watch } from 'vue'
import CreatePostModal from '@/components/feed/CreatePostModal.vue'
import router from '@/router'
import { userStore } from '@/stores/userStore'
import { countNotificationApi } from '@/api/notification'
import { useNotificationStore } from '@/stores/notificationStore'
import { useMessageStore } from '@/stores/messageStore'
import { getCountMessageApi } from '@/api/message'

// Define URL shop

const { t } = useI18n()
const currentRoute = computed(() => {
  return router.currentRoute.value.name
})
const userInfo = computed(() => {
  return userStore().userInfo
})

const sidebarItems = ref([
  {
    label: 'Trang chủ',
    name: 'feed',
    icon: IconHome,
    iconActive: IconHome
  },
  {
    label: 'Trao đổi CP',
    name: 'tomxu-manager',
    icon: IconAgencySidebar,
    iconActive: IconAgencySidebarActive
  },

  {
    label: 'Mạng xã hội',
    icon: IconExplore,
    iconActive: IconExplore,
    name: 'discover'
  },
  {
    label: 'Dịch vụ KH',
    name: 'member',
    icon: IconMember,
    iconActive: IconMemberActive
  },
  {
    label: 'Quản trị KH',
    name: 'network',
    icon: IconNetwork,
    iconActive: IconNetwork
  },
  {
    label: 'Quỹ đồng chia',
    name: 'share-fund',
    icon: IconShareFun,
    iconActive: IconShareFunActive
  },
  {
    label: 'Tài liệu SP',
    name: 'products-docs',
    icon: IconDocument,
    iconActive: IconDocument
  },
  {
    label: 'Tìm kiếm',
    name: 'search',
    icon: IconSearch,
    iconActive: IconSearch
  },
  {
    label: 'Cửa hàng',
    name: 'store',
    icon: IconStore,
    iconActive: IconStore
  },

  {
    label: 'Link giới thiệu',
    name: 'profile',
    icon: IconProfile,
    iconActive: IconProfile
  },
  {
    label: 'Thành viên',
    name: 'people',
    icon: IconPeople,
    iconActive: IconPeople
  },
  {
    label: 'Cộng đồng',
    name: 'group',
    icon: IconSocial,
    iconActive: IconSocial
  },
  {
    label: 'Công việc',
    name: 'work',
    icon: IconWork,
    iconActive: IconWork
  }
])

const createModal = ref(null)

const openCreateModal = () => {
  createModal.value.open()
}

const emitter = inject('emitter')
const handleClickMenu = (item) => {
  if (item.name === 'feed') {
    emitter.emit('ON_RESET_FEED')
  }
}

const countData = ref({})
const notificationStore = useNotificationStore()
const countDataStore = computed(() => notificationStore.countData)
watch(
  countDataStore,
  () => {
    countData.value = countDataStore.value
  },
  { immediate: true }
)
const countNotify = async () => {
  try {
    countData.value = await countNotificationApi()
    notificationStore.setCountData(countData.value)
  } catch (e) {
    console.log(e)
  }
}
countNotify()

const countMessageData = ref({})
const messageStore = useMessageStore()
const countMessageDataStore = computed(() => messageStore.countData)
watch(
  countDataStore,
  () => {
    countData.value = countDataStore.value
  },
  { immediate: true }
)
const countMessage = async () => {
  try {
    countMessageData.value = await getCountMessageApi()
    messageStore.setCountData(countMessageData.value)
  } catch (e) {
    console.log(e)
  }
}
countMessage()
</script>

<style lang="scss">
.sidebar-wrapper {
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  .sidebar-content {
    // padding: 32px 0 0 0;
    width: 250px;
  }
  .sidebar-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    .sidebar-item {
      height: 55px;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--color-white);
      font-size: 20px;
    }
  }
  .sidebar-footer {
    padding: 32px 0 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 250px;
  }
  .sidebar-item {
    padding: 0 24px;
    border-radius: 37px;
    transition: 0.3s;
    &:hover {
      background: var(--bg-menu-item-active);
      color: white;
    }
  }
  .sidebar-item-active {
    background: var(--bg-menu-item-active);
    color: white !important;
    svg {
      fill: white;
      stroke: white;
    }
  }
}
</style>

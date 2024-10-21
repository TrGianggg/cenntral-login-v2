<template>
  <div class="w-full">
    <div class="notification-header flex flex-col justify-end border-b-thin">
      <div class="flex justify-between items-center">
        <span class="text-primary-color text-heading-3"> Thông báo</span>
        <a-popover
          trigger="click"
          v-model:visible="isOpenPopup"
          placement="bottomRight"
          overlayClassName="cs-popup"
        >
          <template #content>
            <div class="flex flex-col py-2">
              <div
                class="select-item"
                @click="readAll"
              >
                <IconSeen />
                <span>Đánh dấu tất cả là đã đọc</span>
              </div>
              <div
                class="select-item"
                @click="openUpdateModal"
              >
                <IconSetting />
                <span>Cài đặt thông báo</span>
              </div>
            </div>
          </template>
          <HoverBox>
            <IconMore />
          </HoverBox>
        </a-popover>
      </div>
    </div>
    <div class="w-full overflow-auto scrollbar-hide px-4">
      <div class="flex flex-row justify-between select-none sm:w-full w-max">
        <div
          v-for="tab in listTab"
          :key="tab.value"
          :class="[
            'px-3 md:px-4 cursor-pointer py-4 border-b-2 border-solid flex',
            activeTab === tab.value ? 'border-white text-white' : 'border-transparent'
          ]"
          @click="handleSelectTab(tab)"
        >
          <div class="text-body-3 flex items-center gap-2">
            <span :class="{ 'font-bold': activeTab === tab.value }">
              {{ tab.label }}
            </span>
            <div
              v-if="countData[tab.countKey]"
              class="count-item"
            >
              {{ countData[tab.countKey] > 99 ? '99+' : countData[tab.countKey] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="loading && notificationList.length === 0"
      class="flex flex-col gap-2 px-4 mt-4"
    >
      <BaseLoader
        v-for="n in 7"
        height="60"
      />
    </div>
    <div
      v-if="!loading && notificationList.length === 0"
      class="flex justify-center gap-2 px-4 py-8 text-no-data font-semibold"
    >
      Không có thông báo
    </div>
    <div class="notify-list">
      <NotificationItem
        v-for="item in notificationList"
        :key="item.id"
        :notify="item"
        @on-delete="handleDeleteNotify"
      />
    </div>
    <div
      v-if="loading && notificationList.length > 0"
      class="flex flex-col gap-2 px-4 mt-4"
    >
      <BaseLoader
        v-for="n in 5"
        height="60"
      />
    </div>
    <div
      v-if="afterCursor && !loading"
      class="text-primary-color-only hover:underline cursor-pointer text-center py-4"
      @click="fetchNotification"
    >
      Xem thêm
    </div>
    <InfiniteLoading
      v-if="notificationList && notificationList.length"
      class="invisible"
      @infinite="loadMoreNotification"
    />
    <UpdateStatusNotifyModal ref="updateModal" />
  </div>
</template>
<script setup>
import IconMore from '@/components/shared/icons/IconMore.vue'
import HoverBox from '@/components/shared/HoverBox.vue'
import { computed, inject, onMounted, ref, watch } from 'vue'
import NotificationItem from '@/components/notification/NotificationItem.vue'
import IconSeen from '@/components/shared/icons/IconSeen.vue'
import UpdateStatusNotifyModal from '@/components/notification/UpdateStatusNotifyModal.vue'
import IconSetting from '@/components/shared/icons/IconSetting.vue'
import {
  countNotificationApi,
  getNotificationApi,
  readAllNotificationApi
} from '@/api/notification'
import BaseLoader from '@/components/shared/BaseLoader.vue'
import InfiniteLoading from 'v3-infinite-loading'
import { useNotificationStore } from '@/stores/notificationStore'
import { scrollToTop } from '@/helper'

onMounted(() => {
  scrollToTop()
})

const emitter = inject('emitter')
const activeTab = ref('ALL')
const listTab = computed(() => {
  return [
    {
      value: 'ALL',
      countKey: 'countAll',
      label: 'Tất cả'
    },
    {
      value: 'TomXu',
      countKey: 'countTomXu',
      label: 'CP'
    },
    {
      value: 'interact',
      countKey: 'countInteract',
      label: 'Tương tác'
    },
    {
      value: 'account',
      countKey: 'countAccount',
      label: 'Tài khoản'
    }
  ]
})

const isOpenPopup = ref(false)

const afterCursor = ref('')
const notificationList = ref([])
const loading = ref(false)
const fetchNotification = async (setLoading = true) => {
  try {
    const query = {
      after: afterCursor.value
    }
    if (activeTab.value !== 'ALL') {
      query.group = activeTab.value
    }
    if (setLoading) {
      loading.value = true
    }
    const resp = await getNotificationApi(query)
    loading.value = false
    afterCursor.value = resp.cursor.afterCursor
    notificationList.value = [...notificationList.value, ...resp.data]
  } catch (e) {
    loading.value = false
  }
}
fetchNotification()

const resetNotification = async () => {
  try {
    const query = {}
    if (activeTab.value !== 'ALL') {
      query.group = activeTab.value
    }
    const resp = await getNotificationApi(query)
    afterCursor.value = resp.cursor.afterCursor
    notificationList.value = resp.data
  } catch (e) {
    loading.value = false
  }
}

emitter.on('ON_NOTIFY', () => {
  resetNotification()
  countNotify()
})

const handleSelectTab = (tab) => {
  activeTab.value = tab.value
  notificationList.value = []
  afterCursor.value = ''
  fetchNotification()
}

const updateModal = ref(null)
const openUpdateModal = () => {
  isOpenPopup.value = false
  updateModal.value.open()
}

const handleDeleteNotify = (notify) => {
  notificationList.value = notificationList.value.filter((o) => o.id !== notify.id)
}

const notificationStore = useNotificationStore()
const readAll = () => {
  isOpenPopup.value = false
  notificationList.value = notificationList.value.map((o) => {
    return {
      ...o,
      status: 'read'
    }
  })
  readAllNotificationApi()
  notificationStore.setCountData({
    countTomXu: 0,
    countInteract: 0,
    countAccount: 0,
    countAll: 0
  })
}

const loadMoreNotification = ($state) => {
  if (loading.value || !afterCursor.value) return
  fetchNotification()
}

const countDataStore = computed(() => notificationStore.countData)
const countData = ref({})
watch(
  countDataStore,
  () => {
    countData.value = countDataStore.value
  },
  { immediate: true }
)
const countNotify = async () => {
  try {
    const resp = await countNotificationApi()
    notificationStore.setCountData(resp)
  } catch (e) {}
}
countNotify()
</script>

<style>
.notification-header {
  height: 123px;
  padding: 24px 16px 24px 16px;
}

.count-item {
  @apply h-5 rounded-full bg-red-color-1;
  min-width: 20px;
  display: inline-flex;
  align-items: center;
  text-align: center;
  color: white;
  width: max-content;
  padding: 0 6px;
  font-size: 14px;
  line-height: 1;
  justify-content: center;
}
@media (max-width: 768px) {
  .notification-header {
    height: auto;
    padding: 10px 16px;
  }
}
</style>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

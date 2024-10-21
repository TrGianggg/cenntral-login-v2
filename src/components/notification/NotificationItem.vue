<template>
  <div class="notify-item border-b-thin"
       :class="[
           notifyData.status === 'new' ? 'notify-item-not-seen' : '',
       ]"
       @click="handleNotifyClick">
    <AvatarUser :size="56"
                :size-mobile="42"
                :src="notifyAvatar"/>
    <div class="flex justify-between w-full">
      <div class="flex flex-col gap-1">
        <div v-html="notify.content" class="leading-normal whitespace-pre-line"></div>
        <div :title="formatFullTime(notify.updatedAt)"
             class="sm:text-[14px] text-[12px] leading-normal">
          {{ formatTimeAgo(notify.updatedAt) }}
        </div>
      </div>
      <a-popover
          trigger="click"
          v-model:visible="isOpenPopup"
          placement="topRight"
          overlayClassName="cs-popup"
      >
        <template #content>
          <div class="flex flex-col py-2">
            <div
                class="select-item"
                @click.stop="seenNotification"
            >
              <IconSeen/>
              <span>Đánh dấu là đã đọc</span>
            </div>
            <div
                class="select-item"
                @click.stop="removeNotification"
            >
              <IconDelete/>
              <span>Xoá thông báo này</span>
            </div>
          </div>
        </template>
        <HoverBox @click.stop="() => {}"
                  :size="24">
          <IconMore :size="16"/>
        </HoverBox>
      </a-popover>
    </div>
  </div>
</template>
<script setup>
import IconMore from "@/components/shared/icons/IconMore.vue";
import HoverBox from "@/components/shared/HoverBox.vue";
import AvatarUser from "@/components/shared/AvatarUser.vue";
import {computed, ref, toRefs, watch} from "vue";
import IconDelete from "@/components/shared/icons/IconDelete.vue";
import IconSeen from "@/components/shared/icons/IconSeen.vue";
import {formatFullTime, formatTime, formatTimeAgo, timePostAgo} from "@/helper/ultil";
import {removeNotificationApi, updateNotificationApi} from "@/api/notification";
import {message} from "ant-design-vue";
import {useNotificationStore} from "@/stores/notificationStore";
import {useRoute, useRouter} from "vue-router";
import {ACCOUNT_TYPES, REACTIVE_TYPES, TOMXU_TYPES} from "@/helper/const-notify";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-delete'])
const props = defineProps({
  notify: {
    type: Object
  }
})
const {notify} = toRefs(props)

const userInfo = computed(() => {
  return userStore().userInfo
})

const notifyAvatar = computed(() => {
  if (notify.value && notify.value.from) {
    return notify.value.from.profileImage
  }
  if (userInfo.value) {
    return userInfo.value.profileImage
  }
  return '-'
})

const notifyData = ref(null);
watch(notify, () => {
  notifyData.value = notify.value
}, {immediate: true})
const isOpenPopup = ref(false);

const router = useRouter();
const notificationStore = useNotificationStore()
const countData = computed(() => notificationStore.countData)

const decreaseCount = (type, count) => {
  notificationStore.setCountData({
    ...countData.value,
    [type]: countData.value[type] - count
  });
};

const handleNotifyClick = () => {
  if (notify.value.status !== 'read') {
    seenNotification()
  }
  if (notify.value.type === 'add_group_chat') {
    return router.push({
      name: 'message',
      query: {
        room: notify.value.room && notify.value.room.slug || ''
      }
    })
  }
  if (notify.value.type === 'premium_expired') {
    return router.push({
      name: 'member',
    })
  }
  if (
      notify.value.type === 'like'
      || notify.value.type === 'comment'
      || notify.value.type === 'like_comment'
      || notify.value.type === 'share_post'
      || notify.value.type === 'share'
      || notify.value.type === 'reply_comment'
  ) {
    const query = {};
    if (notify.value.type === 'comment'
        || notify.value.type === 'reply_comment'
        || notify.value.type === 'like_comment') {
      if (notify.value.comment) {
        query.comment = notify.value.comment.slug
      }
    }
    return router.push({
      name: 'PostDetail',
      params: {
        slug: notify.value.post.slug
      },
      query
    })
  }
  if (TOMXU_TYPES.includes(notify.value.type)) {
    if (notify.value.type === 'reset_pxu') {
      return router.push({
        name: 'member',
      })
    }
    return router.push({
      name: 'tomxu-manager',
      query: {
        tab: 'TabManagerTransaction'
      }
    })
  }
  if (notify.value.type === 'create_friend'
      || notify.value.type === 'follow'
      || notify.value.type === 'kyc_success'
      || notify.value.type === 'accept_friend') {
    return router.push({
      name: 'ProfileUser',
      params: {
        username: notify.value.from.username
      }
    })
  }
}

const removeNotification = () => {
  emit('on-delete', notify.value)
  message.success('Xoá thông báo thành công')
  isOpenPopup.value = false;
  if (notifyData.value.status !== 'read') {
    handleCountNotify()
  }
  removeNotificationApi({
    id: notify.value.id
  })
}

const handleCountNotify = () => {
  decreaseCount('countAll', 1);
  const type = notify.value.type
  if (REACTIVE_TYPES.includes(type)) {
    decreaseCount('countInteract', 1);
  }
  if (ACCOUNT_TYPES.includes(type)) {
    decreaseCount('countAccount', 1);
  }
  if (TOMXU_TYPES.includes(type)) {
    decreaseCount('countTomXu', 1);
  }
}

const seenNotification = () => {
  isOpenPopup.value = false;
  if (notifyData.value.status === 'read') return;
  notifyData.value.status = 'read'
  handleCountNotify()
  updateNotificationApi({
    status: 'read',
    id: [notify.value.id]
  })
}
</script>
<style lang="scss" scoped>
.notify-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 9px 16px 9px 27px;
  cursor: pointer;
  transition: .3s;
  color: rgba(250, 246, 235, 0.6);

  &.notify-item-not-seen {
    color: white;
  }

  &:hover {
    background: var(--color-white-05);
  }
}

.light-theme {
  .notify-item {
    color: rgba(15, 20, 25, 0.6);

    &.notify-item-not-seen {
      color: initial;
    }
  }
}

@media (max-width: 586px) {
  .notify-item {
    padding: 9px 16px;
    font-size: 14px;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
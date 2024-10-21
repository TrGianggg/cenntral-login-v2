<template>
  <div v-if="isShowBtn"
       class="flex items-center gap-4 flex-wrap btn-action-wrap md:mb-0 mb-6">
    <a-button v-if="isShowBtnAddFriend"
              type="primary"
              size="small"
              @click="addFriend">
      <div class="flex items-center gap-2">
        <AddFriendIcon/>
        <span>Thêm bạn bè</span>
      </div>
    </a-button>
    <a-button v-if="userData.statusFriend === 'accept'"
              size="small"
              type="cs-primary"
              style="padding: 0 30px !important;"
              @click="handleChat">
      <div class="flex items-center gap-2">
        <IconMessage :size="16" />
        <span>Nhắn tin</span>
      </div>
    </a-button>
    <a-popover v-if="userData.statusFriend === 'pending'"
               trigger="click"
               v-model:visible="isOpenCancelInvitePopup"
               overlayClassName="cs-popup">
      <template #content>
        <div class="py-2">
          <div class="select-item"
               @click="cancelInvite">
            <IconClose />
            <span>Huỷ lời mời</span>
          </div>
        </div>
      </template>
      <a-button size="small"
                type="cs-primary">
        <div class="flex items-center gap-2">
          <CheckOutlined />
          <span>Đã gửi lời mời</span>
        </div>
      </a-button>
    </a-popover>
<!--    cancelInvite-->
    <a-popover v-if="userData.statusFriend === 'confirm'"
               trigger="click"
               v-model:visible="isOpenConfirmPopup"
               overlayClassName="cs-popup">
      <template #content>
        <div class="py-2">
          <div class="select-item"
               @click="acceptFriend">
            <IconUserCheck />
            <span>Xác nhận lời mời</span>
          </div>
          <div class="select-item"
               @click="rejectFriend">
            <IconClose />
            <span>Xoá lời mời</span>
          </div>
        </div>
      </template>
      <a-button size="small"
                type="primary"
                style="padding: 0 30px !important;">
        <div class="flex items-center gap-2">
          <IconFriend />
          <span>Phản hồi lời mời kết bạn</span>
        </div>
      </a-button>
    </a-popover>
    <a-popover v-if="userData.statusFriend === 'accept'"
               trigger="click"
               v-model:visible="isOpenUnfriendPopup"
               overlayClassName="cs-popup">
      <template #content>
        <div class="py-2">
          <div class="select-item"
               @click="openConfirmUnfriend">
            <UserDeleteOutlined />
            <span>Huỷ kết bạn</span>
          </div>
        </div>
      </template>
      <a-button size="small"
                type="cs-primary"
                style="padding: 0 30px !important;">
        <div class="flex items-center gap-2">
          <IconFriend />
          <span>Bạn bè</span>
        </div>
      </a-button>
    </a-popover>
    <a-popover v-if="userData.statusFollow"
               trigger="click"
               v-model:visible="isOpenFollowPopup"
               overlayClassName="cs-popup">
      <template #content>
        <div class="py-2">
          <div class="select-item"
               @click="unFollow">
            <UserDeleteOutlined />
            <span>Huỷ theo dõi</span>
          </div>
        </div>
      </template>
      <a-button size="small"
                type="cs-primary"
                style="padding: 0 18px !important;">
        <div class="flex items-center gap-2">
          <IconFollowed />
          <span>Đang theo dõi</span>
        </div>
      </a-button>
    </a-popover>
    <a-button v-if="!userData.statusFollow"
              size="small"
              type="cs-primary"
              style="padding: 0 18px !important;"
              @click="followUser">
      <div class="flex items-center gap-2">
        <IconFollow />
        <span>Theo dõi</span>
      </div>
    </a-button>
    <a-modal v-model:visible="isOpenConfirmModal"
             title="Xác nhận huỷ kết bạn"
             wrap-class-name="cs-modal"
             :footer="null">
      <div v-if="userInfo">
        Bạn có chắc chắn muốn hủy kết bạn với
        <span class="text-white font-semibold">"{{ getFullNameUser(userInfo)}}"</span> không?
      </div>
      <div class="flex gap-2 justify-center mt-10">
        <a-button size="small"
                  type="only-border"
                  @click="isOpenConfirmModal = false">
          <span>Đóng</span>
        </a-button>
        <a-button size="small"
                  type="primary"
                  @click="unfriend">
          <span>Xác nhận</span>
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {CheckOutlined, UserDeleteOutlined} from "@ant-design/icons-vue";
import AddFriendIcon from "@/components/shared/icons/AddFriendIcon.vue";
import IconFriend from "@/components/shared/icons/IconFriend.vue";
import IconFollow from "@/components/shared/icons/IconFollow.vue";
import IconFollowed from "@/components/shared/icons/IconFollowed.vue";
import IconUserCheck from "@/components/shared/icons/IconUserCheck.vue";
import {
  acceptFriendsApi,
  addFriendApi, cancelInviteApi,
  followUserApi,
  rejectFriendsApi,
  unFollowUserApi,
  unFriendsApi
} from "@/api/friend";
import {computed, ref, toRefs, watch} from "vue";
import {getFullNameUser} from "@/helper/ultil";
import {useUserProfile} from "@/components/hooks/useUserProfile";
import IconMessage from "@/components/shared/icons/IconMessage.vue";
import IconClose from "@/components/shared/icons/IconClose.vue";
import {useRouter} from "vue-router";
import {createRoomApi} from "@/api/message";

const emit = defineEmits(['on-add-friend'])
const props = defineProps({
  userInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})
const { isMe } = useUserProfile()
const { userInfo } = toRefs(props)
const userData = ref({});
watch(userInfo, () => {
  userData.value = userInfo.value
}, { immediate: true })

const isShowBtn = computed(() => {
  return userInfo.value && userInfo.value.email && !isMe.value
})

const isShowBtnAddFriend = computed(() => {
  if (userData.value) {
    const allowStatus = ['not_friend', 'reject', 'unfriend']
    const { statusFriend } = userData.value;
    return allowStatus.includes(statusFriend)
  }
  return false
})

const router = useRouter();
const loadingChat = ref(false);
const handleChat = () => {
  if (userData.value && userData.value.slugRoom) {
    return router.push({
      name: 'message',
      query: {
        room: userData.value.slugRoom
      }
    })
  }
  if (loadingChat.value) return;
  loadingChat.value = true;
  createRoomApi({
    username: [userData.value.username],
    name: getFullNameUser(userData.value),
    type : 'chat'
  }).then(resp => {
    loadingChat.value = false;
    console.log('createRoomApi: ', resp);
    router.push({
      name: 'message',
      query: {
        room: resp.slug
      }
    })
  }, () => {
    loadingChat.value = false;
    router.push({
      name: 'message',
    })
  })
}

const isOpenCancelInvitePopup = ref(false);
const cancelInvite = () => {
  isOpenCancelInvitePopup.value = false;
  userData.value.statusFriend = 'not_friend';
  cancelInviteApi({
    slug: userData.value.slug
  }).catch(error => {
    // if (error && error.statusCode && error.statusCode === 400) {
    //   userData.value.statusFriend = 'accept';
    //   message.info(error.statusCode)
    // }
  })
}


const isOpenConfirmPopup = ref(false);
const acceptFriend = () => {
  userData.value.statusFriend = 'accept';
  acceptFriendsApi({
    slug: userData.value.slug
  }).then(() => {})
}

const rejectFriend = () => {
  userData.value.statusFriend = 'reject';
  rejectFriendsApi({
    slug: userData.value.slug
  }).then(() => {})
}

const isOpenUnfriendPopup = ref(false)
const isOpenConfirmModal = ref(false)
const openConfirmUnfriend = () => {
  isOpenConfirmModal.value = true;
  isOpenUnfriendPopup.value = false;
}

const unfriend = () => {
  isOpenConfirmModal.value = false;
  userData.value.isFriend = false;
  unFriendsApi({
    slug: userInfo.value.slug
  }).finally(() => {
    userData.value.statusFriend = 'unfriend'
  })
}

const addFriend = () => {
  emit('on-add-friend')
  userData.value.statusFriend = 'pending'
  addFriendApi({
    slug: userData.value.slug
  }).then(() => {})
}

const loadingFollow = ref(false);
const followUser = () => {
  if (loadingFollow.value) return;
  userData.value.statusFollow = true;
  loadingFollow.value = true;
  followUserApi({
    slug: userData.value.slug
  }).catch(() => {
    userData.value.statusFollow = false;
  }).finally(() => {
    loadingFollow.value = false;
  })
}

const isOpenFollowPopup = ref(false)
const unFollow = () => {
  if (loadingFollow.value) return;
  loadingFollow.value = true;
  userData.value.statusFollow = false;
  isOpenFollowPopup.value = false;
  unFollowUserApi({
    slug: userData.value.slug
  }).catch(() => {
    userData.value.statusFollow = true;
  }).finally(() => {
    loadingFollow.value = false;
  })
}
</script>

<style lang="scss">
.btn-action-wrap {
  .ant-btn {
    padding: 0 16px !important;
  }
}
</style>
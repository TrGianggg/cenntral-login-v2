<template>
  <div class="friend-card overflow-hidden border"
       @click="goUserProfilePage(friend)">
    <img :src="friend.user1.profileImage || '/default-avatar.png'"
         class="md:w-20 md:h-20 w-14 h-14 object-cover md:rounded-2xl rounded-full"
         alt="">
    <div class="flex gap-3 px-3 flex-1 min-w-0 items-center">
      <div class="flex-1 flex md:flex-col max-md:items-center justify-between gap-3 min-w-0">
        <div class="text-primary-color font-semibold cursor-pointer">
          {{ getFullNameUser(friend.user1) }}
        </div>
        <div v-if="!isMyFriend"
             class="flex flex-col gap-3">
          <div>
            <a-popover v-if="friendData.user1.statusFriend === 'pending'"
                       trigger="click"
                       placement="topRight"
                       v-model:visible="isOpenPendingPopup"
                       overlayClassName="cs-popup">
              <template #content>
                <div class="py-2">
                  <div class="select-item"
                       @click.stop="cancelInvite">
                    <UserDeleteOutlined />
                    <span>Huỷ lời mời</span>
                  </div>
                </div>
              </template>
              <a-button type="cs-primary"
                        size="small" @click.stop="() => {}">
                <div class="flex gap-2 items-center">
                  <CheckOutlined />
                  <span>Đã gửi lời mời</span>
                </div>
              </a-button>
            </a-popover>
            <a-button v-else
                      size="small"
                      type="primary"
                      @click.stop="inviteUser(friendData)">
              <div class="flex items-center gap-2 justify-center">
                <AddFriendIcon/>
                <span>Thêm bạn</span>
              </div>
            </a-button>
          </div>
        </div>
      </div>
      <a-popover v-if="isMyFriend && isMe"
                 trigger="click"
                 placement="topRight"
                 v-model:visible="isOpenPopup"
                 overlayClassName="cs-popup">
        <template #content>
          <div class="py-2">
            <div v-if="isMyFriend"
                 class="select-item"
                 @click.stop="openConfirmModal(friendData)">
              <UserDeleteOutlined />
              <span>Huỷ kết bạn</span>
            </div>
          </div>
        </template>
        <HoverBox @click.stop="() => {}">
          <MoreOutlined class="rotate-90" />
        </HoverBox>
      </a-popover>
    </div>
    <a-modal v-model:visible="isOpenConfirmModal"
             title="Xác nhận huỷ kết bạn"
             wrap-class-name="cs-modal"
             :footer="null">
      <div v-if="selectedUser">
        Bạn có chắc chắn muốn hủy kết bạn với
        <span class="text-white font-semibold">"{{ getFullNameUser(selectedUser)}}"</span> không?
      </div>
      <div class="flex gap-2 justify-center mt-5">
        <a-button size="small"
                  type="only-border"
                  style="width: 130px"
                  @click="isOpenConfirmModal = false">
          <span>Đóng</span>
        </a-button>
        <a-button size="small"
                  type="primary"
                  style="width: 130px; padding: 0 24px !important;"
                  @click="unfriend">
          <span>Xác nhận</span>
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import {getFullNameUser} from "@/helper/ultil";
import {CheckOutlined, MoreOutlined, UserDeleteOutlined} from "@ant-design/icons-vue";
import {computed, ref, toRefs, watch} from "vue";
import HoverBox from "@/components/shared/HoverBox.vue";
import {addFriendApi, cancelInviteApi, unFriendsApi} from "@/api/friend";
import AddFriendIcon from "@/components/shared/icons/AddFriendIcon.vue";
import {useUserProfile} from "@/components/hooks/useUserProfile";

const props = defineProps({
  friend: {
    type: Object
  }
})
const { isMe } = useUserProfile()

const {friend} = toRefs(props)

const friendData = ref(null);
watch(friend, () => {
  friendData.value = {
    ...friend.value,
  };
}, { immediate: true })

const isMyFriend = computed(() => {
  return friendData.value.user1 && friendData.value.user1.statusFriend === 'accept'
})

const isOpenPopup = ref(false)

const isOpenConfirmModal = ref(false);
const selectedUser = ref(null);
const openConfirmModal = (item) => {
  isOpenConfirmModal.value = true;
  isOpenPopup.value = false;
  selectedUser.value = item.user1;
}

const isOpenPendingPopup = ref(false);
const cancelInvite = () => {
  isOpenPendingPopup.value = false;
  friendData.value.user1.statusFriend = 'not_friend';
  cancelInviteApi({
    slug: friendData.value.user1.slug
  })
}


const unfriend = () => {
  isOpenConfirmModal.value = false;
  friendData.value.user1.statusFriend = 'not_friend'
  unFriendsApi({
    slug: selectedUser.value.slug
  })
}

const inviteUser = (item) => {
  friendData.value.user1.statusFriend = 'pending'
  addFriendApi({
    slug: item.user1.slug
  })
}

const goUserProfilePage = (item) => {
  window.open(`/${item.user1.username}`)
}
</script>

<style lang="scss">
.friend-card {
  .ant-btn {
    padding: 0 16px !important;
  }
}
@media (max-width: 768px) {
  .friend-card {
    border: none;
  }
}
</style>
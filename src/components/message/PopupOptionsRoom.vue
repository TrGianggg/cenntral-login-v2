<template>
  <div>
    <a-popover
        v-model:visible="isOpenPopup"
        trigger="click"
        placement="topRight"
        overlayClassName="cs-popup"
    >
      <template #content>
        <div v-if="room.type === 'group'"
             class="flex flex-col py-3">
          <div
              v-if="isRoomMaster"
              @click="openChangeNameModal"
              class="select-item"
          >
            <IconEdit />
            <span>Đổi tên nhóm chat</span>
          </div>
          <div
              @click="viewMembers"
              class="select-item"
          >
            <IconGroupOutline />
            <span>Thành viên</span>
          </div>
          <div
              v-if="isRoomMaster"
              class="select-item"
              @click="openChangeBackgroundModal"
          >
            <IconChangeBackground />
            <span>Đổi hình nền</span>
          </div>
          <div
              @click="leaveGroup"
              class="select-item"
              :class="{'select-item--disable': isRoomMaster}"
              :title="isRoomMaster ? 'Trưởng nhóm không được rời khỏi nhóm' : ''"
          >
            <IconLogout />
            <span>Rời nhóm</span>
          </div>
          <div
              v-if="isRoomMaster"
              class="select-item"
              @click="openConfirmDeleteModal"
          >
            <IconDelete />
            <span>Xoá nhóm</span>
          </div>
        </div>
        <div v-else
             class="flex flex-col py-3">
          <div
              @click="viewProfile"
              class="select-item"
          >
            <IconUser />
            <span>Xem trang cá nhân</span>
          </div>
          <div
              class="select-item"
              @click="openChangeBackgroundModal"
          >
            <IconChangeBackground />
            <span>Đổi hình nền</span>
          </div>
          <div
              class="select-item"
              @click="openConfirmDeleteModal"
          >
            <IconDelete />
            <span>Xoá tin nhắn</span>
          </div>
        </div>
      </template>
      <HoverBox :size="hoverIconSize" @click.stop="() => {}">
        <IconMore :size="iconSize" />
      </HoverBox>
    </a-popover>
    <ChangeNameGroupModal ref="changeNameGroupModal"
                          @on-update="handleChangeNameGroup"/>
    <ConfirmLeaveGroupModal ref="confirmLeaveModal"
                            @on-leave="handleLeaveGroup"/>
    <ConfirmDeleteRoomModal ref="confirmDeleteModal"
                            @on-ok="handleRemoveRoom">
      <div>
        Bạn không thể hoàn tác sau khi xóa cuộc trò chuyện này.
      </div>
    </ConfirmDeleteRoomModal>

    <GroupMembersModal ref="groupMemberModal"
                       @on-change-master="handleChangeMaster"
                       @on-add-members="handleMembersAdded"/>

    <ChangeBackgroundChatModal ref="changeBackgroundModal"
                               @on-upload="handleChangeBgChat"/>
  </div>
</template>
<script setup>
import IconMore from "@/components/shared/icons/IconMore.vue";
import IconChangeBackground from "@/components/shared/icons/IconChangeBackground.vue";
import IconLogout from "@/components/shared/icons/IconLogout.vue";
import IconUser from "@/components/shared/icons/IconUser.vue";
import IconGroupOutline from "@/components/shared/icons/IconGroupOutline.vue";
import IconDelete from "@/components/shared/icons/IconDelete.vue";
import HoverBox from "@/components/shared/HoverBox.vue";
import IconEdit from "@/components/shared/icons/IconEdit.vue";
import {computed, ref, toRefs, watch} from "vue";
import ConfirmLeaveGroupModal from '@/components/message/ConfirmLeaveGroupModal.vue';
import ConfirmDeleteRoomModal from '@/components/message/ConfirmDeleteRoomModal.vue';
import ChangeBackgroundChatModal from '@/components/message/ChangeBackgroundChatModal.vue';
import {useRouter} from "vue-router";
import ChangeNameGroupModal from "@/components/message/ChangeNameGroupModal.vue";
import GroupMembersModal from "@/components/message/GroupMembersModal.vue";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-change-name', 'on-leave', 'on-remove', 'on-add-members', 'on-change-background'])
const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  iconSize: {
    type: Number,
    default: 24
  },
  hoverIconSize: {
    type: Number,
    default: 32
  }
})

const { room } = toRefs(props);

const roomData = ref(null)

watch(room, () => {
  if (room.value) {
    roomData.value = {...room.value}
  }
}, { immediate: true, deep: true })

const userInfo = computed(() => {
  return userStore().userInfo
})
const isRoomMaster = computed(() => {
  if (room.value.type === 'group' && room.value.roomMaster) {
    return room.value.roomMaster.username === userInfo.value.username
  }
  return false
})

const handleChangeMaster = (newMaster) => {
  room.value.roomMaster = newMaster
}

const isOpenPopup = ref(false);

const router = useRouter();
const viewProfile = () => {
  isOpenPopup.value = false;
  router.push({
    name: 'ProfileUser',
    params: {
      username: room.value.toUser.username
    }
  })
}

const changeBackgroundModal = ref(null);
const openChangeBackgroundModal = () => {
  isOpenPopup.value = false;
  changeBackgroundModal.value.open(room.value);
}

const handleChangeBgChat = (imageUrl) => {
  emit('on-change-background', imageUrl)
}

const groupMemberModal = ref(null);
const viewMembers = () => {
  isOpenPopup.value = false;
  groupMemberModal.value.open(room.value);
}

const changeNameGroupModal = ref(null);
const openChangeNameModal = () => {
  isOpenPopup.value = false;
  changeNameGroupModal.value.open(roomData.value);
}


const confirmDeleteModal = ref(null)
const openConfirmDeleteModal = () => {
  isOpenPopup.value = false;
  confirmDeleteModal.value.open(room.value)
}
const handleRemoveRoom = () => {
  emit('on-remove', room.value)
}

const handleMembersAdded = (newMembers) => {
  emit('on-add-members', newMembers)
}

const handleChangeNameGroup = (newName) => {
  emit('on-change-name', newName)
  roomData.value.name = newName;
}

const confirmLeaveModal = ref(null);
const leaveGroup = () => {
  isOpenPopup.value = false;
  confirmLeaveModal.value.open(room.value)
}

const handleLeaveGroup = () => {
  emit('on-leave')
}
</script>
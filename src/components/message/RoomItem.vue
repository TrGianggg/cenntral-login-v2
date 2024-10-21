<template>
  <div class="room-item flex gap-2 px-4 py-3.5 cursor-pointer"
       :class="{ 'room-item-active': selectedRoom && selectedRoom.slug === room.slug }"
       @click="handleJoinRoom">
    <RoomAvatar :room="room"/>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between gap-3 items-center">
        <span v-if="room.type === 'group'"
              class="font-bold text-[14px] truncate">
          {{ room.name }}
        </span>
        <span v-else
              class="font-bold text-[14px] truncate">
          {{ getFullNameUser(room.toUser) }}
        </span>
        <PopupOptionsRoom :room="room"
                          :hover-icon-size="24"
                          :iconSize="20"
                          @on-leave="handleLeaveGroup"
                          @on-remove="handleDeleteRoom"
                          @on-change-background="handleChangeBackground"
                          @on-change-name="handleChangeName"/>
      </div>
      <TypingUi v-if="typingUsers && typingUsers.length"
                :typing-users="typingUsers"
                :room-type="room.type"/>
      <div v-else>
        <div v-if="room.lastMessage"
             class="flex justify-between gap-2 items-center">
          <div class="flex-1 min-w-0 flex items-center gap-2">
            <div v-if="room.lastMessage && room.lastMessage.images && room.lastMessage.images.length"
                 class="flex gap-1">
              <div v-for="(url, index) in room.lastMessage.images"
                   :key="index">
                <img :src="url" alt="" class="w-4 h-4 object-cover">
              </div>
            </div>
            <div class="flex-1 min-w-0 truncate text-[12px] last-message-content pointer-events-none"
                 :class="isLastMessageSeen ? 'room-item-seen' : 'font-bold'"
                 v-html="removeAllHtmlTags(room.lastMessage.content)">
            </div>
          </div>
          <div class="text-[11px]">
            {{ formatTimeAgo(room.lastMessage.updatedAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {formatTimeAgo, getFullNameUser, removeAllHtmlTags} from "@/helper/ultil";
import TypingAnimation from "@/components/message/TypingAnimation.vue";
import RoomAvatar from "@/components/message/RoomAvatar.vue";
import {computed, onBeforeUnmount, ref, toRefs} from "vue";
import PopupOptionsRoom from '@/components/message/PopupOptionsRoom.vue'
import {userStore} from "@/stores/userStore";
import {useSocketStore} from "@/stores/socketStore";
import TypingUi from "@/components/message/TypingUi.vue";

const props = defineProps({
  room: {
    type: Object
  },
  selectedRoom: {
    type: Object,
    default() {
      return null
    }
  }
})
const { room } = toRefs(props)
const emit = defineEmits(['on-click', 'on-leave', 'on-change-background'])

const socketStore = useSocketStore()
const socket = computed(() => socketStore.socket).value
const typingUsers = ref([]);
socket.on('typing', (data) => {
  if (data.slugRoom === room.value.slug) {
    if (!data.data.user) return;
    if (data.type === 'typing') {
      typingUsers.value.push(data.data.user)
    }
    if (data.type === 'non_typing') {
      typingUsers.value = typingUsers.value.filter(o => o.username !== data.data.user.username)
    }
  }
})

const userInfo = computed(() => {
  return userStore().userInfo
})

const isLastMessageSeen = computed(() => {
  if (room.value.lastMessage && room.value.lastMessage.seen) {
    if (room.value.lastMessage.sender.username === userInfo.value.username) {
      return true
    }
    return room.value.lastMessage.seen.includes(userInfo.value.username)
  }
  return false
})

const handleJoinRoom = () => {
  emit('on-click', room.value)
  if (room.value && room.value.lastMessage) {
    room.value.lastMessage = {
      ...room.value.lastMessage,
      seen: [userInfo.value.username]
    }
  }
}

const handleLeaveGroup = () => {
  emit('on-leave', room.value);
}

const handleDeleteRoom = () => {
  emit('on-delete', room.value);
}

const handleChangeBackground = (data) => {
  emit('on-change-background', data);
}

const handleChangeName = (newName) => {
  room.value.name = newName;
}

onBeforeUnmount(() => {
  socket.off('typing')
})
</script>

<style scoped lang="scss">
.room-item {
  &:hover {
    background: var(--color-white-01);
  }
  &.room-item-active {
    background: var(--color-white-01);
  }
  .room-item-seen {
    color: #A1A1A1;
    font-weight: 400;
  }
}
</style>
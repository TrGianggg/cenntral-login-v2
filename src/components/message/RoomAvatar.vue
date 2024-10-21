<template>
  <div v-if="room.type === 'group'"
       class="avatar-group-wrapper"
       :class="{ 'avatar-group-large': isLarge }">
    <div class="avatar-1">
      <AvatarUser :size="30" :src="getGroupAvatars(room).avatar1"/>
    </div>
    <div class="avatar-2">
      <AvatarUser :size="30" :src="getGroupAvatars(room).avatar2"/>
    </div>
  </div>
  <AvatarUser v-else
              :size="avatarSize"
              :src="getRoomAvatar(room)"/>
</template>
<script setup>
import AvatarUser from "@/components/shared/AvatarUser.vue";
import {ref, toRefs, watch} from "vue";
const props = defineProps({
  room: {
    type: Object,
    required: true
  },
  isLarge: {
    type: Boolean,
    default: false
  }
})
const { isLarge } = toRefs(props)
const avatarSize = ref(40)

watch(isLarge, () => {
  if (isLarge.value) {
    avatarSize.value = 48
  }
}, { immediate: true })

const getRoomAvatar = (room) => {
  if (room.toUser) {
    return room.toUser.profileImage
  }
  return ''
}

const getGroupAvatars = (room) => {
  if (room.roomMaster && room.members) {
    return {
      avatar1: room.roomMaster.profileImage,
      avatar2: room.members[0] ? room.members[0].profileImage : ''
    }
  }
  return {
    avatar1: '',
    avatar2: ''
  }
}
</script>

<style lang="scss">
.avatar-group-wrapper {
  position: relative;
  width: 40px;
  min-width: 40px;
  height: 48px;
  &.avatar-group-large {
    width: 48px;
    min-width: 48px;
  }
  .avatar-1 {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9;
    border-radius: 50%;
  }
  .avatar-2 {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 8;
  }
}
</style>
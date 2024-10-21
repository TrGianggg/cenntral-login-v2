<template>
  <div class="flex gap-3">
    <AvatarUser :size="40" :src="member.profileImage"/>
    <div class="flex-1 min-w-0 flex justify-between items-center">
      <div>
        <div class="font-semibold text-[14px]">
          {{ getFullNameUser(member) }}
        </div>
        <div class="text-[12px]">@{{member.username}}</div>
      </div>
      <a-popover
          trigger="click"
          v-model:visible="isOpenPopup"
          placement="bottomRight"
          overlayClassName="cs-popup"
      >
        <template #content>
          <div class="flex flex-col py-2">
            <div
                @click="viewProfile"
                class="select-item"
            >
              <IconUser/>
              <span>Xem trang cá nhân</span>
            </div>
            <div
                v-if="isRoomMaster"
                class="select-item"
                @click="changeMaster"
            >
              <IconRoomMaster/>
              <span>Chỉ định làm trưởng nhóm</span>
            </div>
            <div
                v-if="isRoomMaster"
                class="select-item"
                @click="removeMember"
            >
              <IconUserDelete/>
              <span>Xoá thành viên</span>
            </div>
          </div>
        </template>
        <HoverBox :size="24">
          <IconMore :size="14"/>
        </HoverBox>
      </a-popover>
    </div>
  </div>
</template>
<script setup>
import {getFullNameUser} from "@/helper/ultil";
import IconMore from "@/components/shared/icons/IconMore.vue";
import AvatarUser from "@/components/shared/AvatarUser.vue";
import HoverBox from "@/components/shared/HoverBox.vue";
import IconUser from "@/components/shared/icons/IconUser.vue";
import IconRoomMaster from "@/components/shared/icons/IconRoomMaster.vue";
import IconUserDelete from "@/components/shared/icons/IconUserDelete.vue";
import {computed, ref, toRefs} from "vue";
import {userStore} from "@/stores/userStore";
import {changeMasterRoomApi, removeRoomMemberApi} from "@/api/message";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

const emit = defineEmits(['on-change-master', 'on-remove'])
const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  room: {
    type: Object,
    required: true
  }
})

const { member, room } = toRefs(props);
const userInfo = computed(() => {
  return userStore().userInfo
})

const isRoomMaster = computed(() => {
  if (userInfo.value && member.value && member.value.username === userInfo.value.username) {
    return false
  }
  if ( userInfo.value && room.value && room.value.roomMaster) {
    return userInfo.value.username === room.value.roomMaster.username;
  }
  return false
})

const isOpenPopup = ref(false);

const removeMember = () => {
  isOpenPopup.value = false;
  removeRoomMemberApi({
    slug: room.value.slug,
    usernames: [member.value.username]
  })
  emit('on-remove', member.value);
}

const router = useRouter();
const viewProfile = () => {
  isOpenPopup.value = false;
  router.push({
    name: 'ProfileUser',
    params: {
      username: member.value.username
    }
  })
}

const changeMaster = () => {
  isOpenPopup.value = false;
  changeMasterRoomApi({
    slug: room.value.slug,
    username: member.value.username
  }).then(() => {
    message.success('Chỉ định trưởng nhóm mới thành công');
    room.value.roomMaster = member.value;
    emit('on-change-master', member.value)
  })
}

</script>
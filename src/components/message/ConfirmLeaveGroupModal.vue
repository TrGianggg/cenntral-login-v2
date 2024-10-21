<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <span>Rời khỏi nhóm chat?</span>
      </div>
    </template>
    <div>
      <div class="px-6 py-5">
        Bạn sẽ không nhận được tin nhắn từ cuộc trò chuyện này nữa.
      </div>
      <div class="flex justify-end py-4 px-6 border-t-thin gap-4">
        <a-button size="middle"
                  type="primary"
                  :loading="loading"
                  @click="leaveGroup">
          Rời nhóm
        </a-button>
        <a-button size="middle"
                  type="only-border"
                  style="padding: 0 40px !important;"
                  @click="close">
          Huỷ
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {computed, ref} from "vue";
import IconEdit from '@/components/shared/icons/IconEdit.vue'
import {removeRoomMemberApi, updateRoomApi} from "@/api/message";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-leave'])

const isOpenModal = ref(false)
const userInfo = computed(() => {
  return userStore().userInfo
})

const roomDetail = ref(null)
const open = (room) => {
  isOpenModal.value = true;
  roomDetail.value = room;
}

const close = () => {
  isOpenModal.value = false;
}

const clearData = () => {
  afterCursor.value = '';
  loading.value = false;
}

const afterCursor = ref('');
const loading = ref(false);

const leaveGroup = () => {
  loading.value = true;
  const data = {
    slug: roomDetail.value.slug,
    usernames: [userInfo.value.username]
  };
  emit('on-leave');
  close();
  removeRoomMemberApi(data)
}

defineExpose({
  open
})
</script>

<style lang="scss">
.user-item {
  &:hover {
    background: var(--bg-select-hover);
  }
}
.list-friend {
  max-height: 350px;
  overflow: auto;
}
</style>
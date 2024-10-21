<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <span>Xoá cuộc hội thoại?</span>
      </div>
    </template>
    <div>
      <div class="px-6 py-5">
        <slot></slot>
      </div>
      <div class="flex justify-end py-4 px-6 border-t-thin gap-4">
        <a-button size="middle"
                  type="primary"
                  @click="deleteRoom">
          Xoá
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
import {removeRoomApi} from "@/api/message";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-ok'])

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

const deleteRoom = () => {
  console.log('roomDetail: ', roomDetail)
  const data = {
    slug: roomDetail.value.slug,
  };
  emit('on-ok');
  console.log('1231231')
  removeRoomApi(data)
  close();
}

defineExpose({
  open
})
</script>

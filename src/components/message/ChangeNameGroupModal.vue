<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <IconEdit/>
        <span>Đổi tên nhóm chat</span>
      </div>
    </template>
    <div>
      <div class="px-6 py-5">
        <div class="border rounded px-4 py-2 group-name-wrapper">
          <label for="group-name"
                 class="flex justify-between pb-2 text-no-data">
            <span>Tên đoạn chat</span>
            <span>{{ roomName.length }}/100</span>
          </label>
          <a-textarea v-model:value="roomName"
                      placeholder="Tên đoạn chat"
                      :autofocus="true"
                      id="group-name"
                      :maxlength="100"/>
        </div>
      </div>
      <div class="flex justify-end py-4 px-6 border-t-thin gap-4">
        <a-button size="middle"
                  :disabled="isDisableSubmitBtn"
                  type="primary"
                  :loading="loading"
                  @click="handleChangeNameGroup">
          Lưu
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
import {updateRoomApi} from "@/api/message";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-update'])

const isOpenModal = ref(false)
const roomName = ref('')
const userInfo = computed(() => {
  return userStore().userInfo
})

const roomDetail = ref(null)
const open = (room) => {
  isOpenModal.value = true;
  roomDetail.value = room;
  roomName.value = room.name;
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

const isDisableSubmitBtn = computed(() => {
  return !roomName.value
})

const handleChangeNameGroup = () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('name', roomName.value);
  formData.append('slug', roomDetail.value.slug);
  updateRoomApi(formData).then(() => {
    loading.value = false;
    emit('on-update', roomName.value);
    close();
  }, () => {
    loading.value = false;
  })
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
.group-name-wrapper {
  textarea.ant-input {
    border: 0 !important;
    padding: 0;
    resize: none;
  }
}
</style>
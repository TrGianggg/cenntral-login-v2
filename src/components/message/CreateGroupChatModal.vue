<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           centered
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <IconGroup/>
        <span>Tin nhắn mới</span>
      </div>
    </template>
    <CreateGroupForm ref="createGroupForm"
                     @on-create="handleCreateGroup"/>
  </a-modal>
</template>

<script setup>
import {nextTick, ref} from "vue";
import IconGroup from '@/components/shared/icons/IconGroup.vue'
import CreateGroupForm from "@/components/message/CreateGroupForm.vue";

const emit = defineEmits(['on-create'])

const isOpenModal = ref(false)
const createGroupForm = ref(null);

const open = () => {
  isOpenModal.value = true;
  nextTick(() => {
    if (createGroupForm.value) {
      createGroupForm.value.init();
    }
  })
}

const close = () => {
  isOpenModal.value = false;
}


const clearData = () => {
  createGroupForm.value.clearData();
}

const handleCreateGroup = (data) => {
  emit('on-create', data);
  close();
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
<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <IconChangeBackground/>
        <span>Đổi hình nền</span>
      </div>
    </template>
    <div class="px-6 py-4">
      <div class="flex flex-wrap gap-4 mb-4">
        <div v-for="(image, index) in listBackgrounds"
             :key="index"
             class="cursor-pointer w-24 h-28 rounded-lg overflow-hidden bg-item"
             :class="[
                 { 'bg-neutral-800': !image.url },
                 { 'active-bg': selectedImage && selectedImage.url === image.url }
             ]"
             @click="handleSelectBackground(image)">
          <img v-if="image.url" :src="image.url" alt="" class="w-full h-full">
          <div v-else
               class="w-full h-full flex items-center justify-center">
            Mặc định
          </div>
        </div>
      </div>
      <div class="flex pt-4 px-6 border-t-thin justify-end">
        <a-button size="middle"
                  type="primary"
                  @click="uploadBackground">
          Đổi hình nền
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {computed, ref} from "vue";
import IconChangeBackground from '@/components/shared/icons/IconChangeBackground.vue'
import {updateRoomApi} from "@/api/message";
import {useMessageStore} from "@/stores/messageStore";

const emit = defineEmits(['on-upload'])

const messageStore = useMessageStore();

const listBackgrounds = computed(() => {
  return [
    {
      url: '',
      status: "background",
    },
    ...messageStore.backgrounds
  ]
})
const isOpenModal = ref(false)
const selectedRoom = ref(null);
const open = (room) => {
  isOpenModal.value = true;
  selectedRoom.value = room;
  selectedImage.value = {
    url: room.background || ''
  }
}

const close = () => {
  isOpenModal.value = false;
}

const clearData = () => {
}

const selectedImage = ref(null);
const handleSelectBackground = (image) => {
  selectedImage.value = image
}

const uploadBackground = () => {
  const formData = new FormData();
  formData.append('slug', selectedRoom.value.slug)
  formData.append('background', selectedImage.value.url)
  updateRoomApi(formData)
  emit('on-upload', selectedImage.value.url);
  close()
}

defineExpose({
  open
})
</script>

<style lang="scss">
.bg-item {
  border: 3px solid transparent;
}
.active-bg {
  border: 3px solid var(--bg-primary-color);
}
</style>

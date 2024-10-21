<template>
  <!-- <a-modal
    v-model:visible="visible"
    :footer="false"
    wrap-class-name="cs-modal"
  >
    <CreateFeedForm
      id-file="file-modal"
      :imageFileProp="imageFileProp"
      :isModal="true"
      @on-create="handleCreatedPost"
    />
  </a-modal> -->
</template>

<script setup>
import { inject, defineProps, ref } from 'vue'
import CreateFeedForm from '@/components/feed/CreateFeedForm.vue'
const emitter = inject('emitter')

const visible = ref(false)
const open = () => {
  visible.value = true
}

const prop = defineProps({
  imageFileProp: {
    type: Array,
    default: []
  }
})
const close = () => {
  visible.value = false
}

const handleCreatedPost = (newPostCreated) => {
  emitter.emit('ON_POST_CREATE', newPostCreated)
  close()
}

defineExpose({
  open
})
</script>

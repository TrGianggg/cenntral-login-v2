<template>
  <a-modal
      wrapClassName="cs-modal"
      :footer="null"
      :width="650"
      v-model:visible="isOpenModal"
      :destroy-on-close="true"
  >
    <CreateFeedForm :post-detail="postDetail"
                    :id-file="postDetail.slug"
                    @on-update="handleUpdatePost"/>
  </a-modal>
</template>
<script setup>
import {inject, ref} from "vue";
import CreateFeedForm from '@/components/feed/CreateFeedForm.vue';
const emitter = inject('emitter');

const isOpenModal = ref(false)

const postDetail = ref(null)
const open = (postData) => {
  isOpenModal.value = true;
  postDetail.value = postData
}
const handleUpdatePost = (postData) => {
  isOpenModal.value = false;
  emitter.emit('ON_POST_UPDATE', postData);
}
defineExpose({
  open
})
</script>
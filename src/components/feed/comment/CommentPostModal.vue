<template>
  <a-modal v-model:visible="visible"
           :footer="false"
           width="650"
           centered
           :destroy-on-close="true"
           :after-close="handleModalClosed"
           wrap-class-name="cs-modal comment-modal">
    <PostCard v-if="postDetail"
              :is-show-comment="true"
              :post="postDetail"
              @on-comment="handleCommentCreated"/>
  </a-modal>
</template>

<script setup>
import {ref, watch} from "vue";
import PostCard from '@/components/feed/PostCard.vue'
import {getPostApi} from "@/api/post";
const emit = defineEmits(['on-comment', 'on-close'])

const visible = ref(false)
const postDetail = ref(null)
const open = (post) => {
  visible.value = true
  postDetail.value = post
  fetchPostDetail(post.post)
}
const close = () => {
  visible.value = false
}

const handleModalClosed = () => {
  emit('on-close')
}


watch(visible, () => {
  const root = document.getElementsByTagName('html')[0]
  const body = document.getElementsByTagName('body')[0]
  if (visible.value) {
    root.style.overflow = 'hidden'
    // body.style.overflow = 'hidden'
  } else {
    root.style.overflow = 'auto'
    body.style.overflow = 'auto'
  }
}, { immediate: true })

const fetchPostDetail = (post) => {
  if (!post) return;
  getPostApi({
    slug: post.slug
  }).then(resp => {
    postDetail.value = {
      post: resp,
      isLike: resp.isLike
    }
  }, () => {
  })
}

const handleCommentCreated = (comment) => {
  emit('on-comment', comment)
  if (postDetail.value.post) {
    postDetail.value.post.commentsCount += 1;
  }
}

defineExpose({
  open
});
</script>

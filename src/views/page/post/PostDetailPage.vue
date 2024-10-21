<template>
  <div class="w-full lg:pt-5 post-detail-wrapper">
    <PostLoader v-if="loading"/>
    <PostCard v-if="postData && !loading"
              :post="postData"
              :is-show-comment="true"
              @on-delete="handleDeletePost"/>
    <div v-if="!postData && !loading"
         class="text-white font-bold text-center mt-10">
      Không tìm thấy bài viết
    </div>
  </div>
</template>

<script setup>
import PostCard from '@/components/feed/PostCard.vue';
import {inject, onMounted, ref, watch} from "vue";
import PostLoader from "@/components/feed/PostLoader.vue";
import {useRoute, useRouter} from "vue-router";
import {getPostApi} from "@/api/post";
import {scrollToTop} from "@/helper";
const postData = ref(null)
const route = useRoute();
const loading = ref(false);
const fetchPostDetail = () => {
  loading.value = true;
  getPostApi({
    slug: route.params.slug
  }).then(resp => {
    loading.value = false;
    postData.value = {
      post: resp
    }
  }, () => {
    loading.value = false;
  })
}

watch(route, () => {
  fetchPostDetail();
}, { immediate: true })

const emitter = inject('emitter');
emitter.on('ON_POST_UPDATE', (data) => {
  postData.value = data;
});

const router = useRouter()
const handleDeletePost = () => {
  router.push({
    name: 'feed'
  })
}
onMounted(() => {
  scrollToTop()
})
</script>

<style lang="scss">
.post-detail-wrapper {
  .post-card {
    border-bottom: 0;
    .post-card-container {
      padding: 0 !important;
    }
    .comment-form-modal {
      padding: 1rem 0;
    }
  }
}
</style>
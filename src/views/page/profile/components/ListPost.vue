<template>
  <div class="flex flex-col feed-wrapper max-w-[650px] md:mx-0 mx-4 md:rounded-xl"
       :class="{ 'gap-4': postList.length }">
    <div v-if="isMe"
         class="mt-8 pb-3 border-b border-solid border-neutral-800 cursor-pointer md:px-4">
      <CreateFeedForm @on-create="handlePostCreated"/>
    </div>
    <div class="md:px-4 px-0"
         :class="{'mt-4' : !isMe && postList.length > 0}">
      <div v-if="loading && postList.length === 0"
           class="md:px-4 px-0 flex mt-4 flex-col gap-6">
        <PostLoader/>
        <PostLoader/>
      </div>
      <PostCard v-for="(item, index) in postList"
                :key="item.post.slug"
                :post="item"
                @on-share="handlePostShared"
                @on-delete="handleDeletePost(index)"/>
      <div v-if="loading && postList.length > 0"
           class="md:px-4 px-0 mt-4 flex flex-col gap-6">
        <PostLoader/>
        <PostLoader/>
      </div>
      <div v-if="!loading && postList.length === 0"
           class="px-4 my-4 flex justify-center text-white font-bold">
        <span>Không có bài viết</span>
      </div>
    </div>
    <InfiniteLoading v-if="postList && postList.length"
                     class="invisible"
                     @infinite="loadMorePost"/>
  </div>
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import PostCard from '@/components/feed/PostCard.vue'
import PostLoader from '@/components/feed/PostLoader.vue'
import {ref, onMounted, inject, watch} from "vue";
import {getPostApi, myNewsFeedApi, userNewsFeedApi} from "@/api/post";
import CreateFeedForm from "@/components/feed/CreateFeedForm.vue";
import {useRoute} from "vue-router";

const route = useRoute()
const { isMe } = defineProps({
  isMe: {
    type: Boolean,
    default: true
  }
})

const postList = ref([])
const loading = ref(false)
const afterCursor = ref('');

const emitter = inject('emitter');
emitter.on('ON_POST_UPDATE', (postData) => {
  postList.value = postList.value.map(o => {
    return o.post.slug === postData.slug ? postData : o
  });
});

const handleDeletePost = (index) => {
  postList.value.splice(index, 1)
}

const handlePostCreated = (newPost) => {
  postList.value.unshift(newPost);
}

const handlePostShared = (slug) => {
  getPostApi({
    slug
  }).then(postData => {
    postList.value.unshift({
      post: postData
    })
  })
}

const fetchPost = () => {
  loading.value = true;
  if (isMe) {
    myNewsFeedApi({
      after: afterCursor.value,
    }).then(resp => {
      handleGetPost(resp);
    }, () => {
      loading.value = false;
    })
  } else {
    userNewsFeedApi({
      after: afterCursor.value,
      username: route.params.username
    }).then(resp => {
      handleGetPost(resp);
    }, () => {
      loading.value = false;
    })
  }
};

watch(route , (from, to) => {
  afterCursor.value = '';
  postList.value = [];
  fetchPost();
}, { immediate: true })

const handleGetPost = (resp) => {
  loading.value = false;
  afterCursor.value = resp.data.cursor.afterCursor;
  const results = resp.data.data.map(o => {
    return {
      id: o.id,
      post: { ...o }
    }
  });
  postList.value = [...postList.value, ...results];
}

const loadMorePost = ($state) => {
  if (loading.value || !afterCursor.value) return;
  fetchPost();
}
</script>
<style lang="scss" scoped>
@import '@/design/variable.scss';

.feed-wrapper {
  width: 100%;
  border-left: 1px solid $neutral-800;
  border-right: 1px solid $neutral-800;
}
.light-theme {
  .feed-wrapper {
    margin-top: 0.5rem;
    border-top: 1px solid $neutral-800;
    border-bottom: 1px solid $neutral-800;
    //border-radius: 8px;
  }
}
@media (max-width: 768px) {
  .feed-wrapper {
    border-left: 0;
    border-right: 0;
  }
}
</style>

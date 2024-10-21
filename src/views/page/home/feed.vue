<template>
  <div class="flex flex-col gap-4 feed-wrapper">
    <!-- <div class="mt-8 pb-3 border-b border-solid border-neutral-800 cursor-pointer">
      <CreateFeedForm @on-create="handlePostCreated" />
    </div> -->
    <TomixuCard />
    <div class="md:px-0 px-0">
      <div
        v-if="loading && postList.length === 0"
        class="md:px-4 px-0 flex flex-col gap-6"
      >
        <PostLoader />
        <PostLoader />
      </div>
      <PostCard
        v-for="(item, index) in postList"
        :key="item.post ? item.post.slug : null"
        :post="item"
        @on-delete="handleDeletePost(index)"
        @on-share="handlePostShared"
      />
      <div
        v-if="postList.length === 0 && !loading"
        class="text-white text-center font-bold mt-4"
      >
        Không có bài viết
      </div>
      <div
        v-if="loading && postList.length > 0"
        class="md:px-4 px-0 mt-4 flex flex-col gap-6"
      >
        <PostLoader />
        <PostLoader />
      </div>
    </div>
    <InfiniteLoading
      v-if="postList && postList.length"
      class="invisible"
      @infinite="loadMorePost"
    />
  </div>
</template>

<script setup>
import InfiniteLoading from 'v3-infinite-loading'
import 'v3-infinite-loading/lib/style.css'
import PostCard from '@/components/feed/PostCard.vue'
import CreateFeedForm from '@/components/feed/CreateFeedForm.vue'
import PostLoader from '@/components/feed/PostLoader.vue'
import TomixuCard from '@/components/feed/TomixuCard.vue'
import { ref, onMounted, inject } from 'vue'
import { getPostApi, newsFeedApi } from '@/api/post'
import { scrollToTop } from '@/helper'

import { getToken, getType, removeType } from '@/helper/http/cookie'

const postList = ref([])
const loading = ref(false)
const afterCursor = ref('')

const token = getToken()
const type = getType()
onMounted(() => {
  if (type && type === 'first-time') {
    window.location.href = `${import.meta.env.VITE_BASE_SOCIAL_URL}dashboard?token=${token}`
    removeType()
  }
  fetchPost()
  setTimeout(() => {
    scrollToTop()
  }, 200)
})

const emitter = inject('emitter')

emitter.on('ON_RESET_FEED', () => {
  postList.value = []
  afterCursor.value = ''
  fetchPost()
  scrollToTop()
})

emitter.on('ON_POST_CREATE', (value) => {
  postList.value.unshift(value)
})

emitter.on('ON_POST_UPDATE', (postData) => {
  postList.value = postList.value.map((o) => {
    if (o.post) {
      return o.post.slug === postData.slug ? postData : o
    }
    return o
  })
})

const fetchPost = () => {
  loading.value = true
  newsFeedApi({
    after: afterCursor.value
  }).then(
    (resp) => {
      loading.value = false
      afterCursor.value = resp.data.cursor.afterCursor
      const results = resp.data.data.map((o) => {
        return {
          ...o,
          post: {
            ...o.post,
            isLike: o.isLike
          }
        }
      })
      postList.value = [...postList.value, ...results]
    },
    () => {
      loading.value = false
    }
  )
}

const handlePostShared = (slug) => {
  getPostApi({
    slug
  }).then((postData) => {
    postList.value.unshift({
      post: postData
    })
  })
}

const handlePostCreated = (newPost) => {
  postList.value.unshift(newPost)
}

const handleDeletePost = (index) => {
  postList.value.splice(index, 1)
}

const loadMorePost = ($state) => {
  if (loading.value || !afterCursor.value) return
  fetchPost()
}
</script>
<style lang="scss" scoped>
@import '@/design/variable.scss';

.feed-wrapper {
  width: 100%;
}
@media (max-width: 768px) {
  .feed-wrapper {
    border-left: 0;
    border-right: 0;
  }
}
</style>

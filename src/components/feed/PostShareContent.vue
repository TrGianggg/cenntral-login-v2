<template>
  <div v-if="post && post.post"
       class="post-card px-4 border rounded">
    <div class="flex gap-5">
      <router-link :to="{
                        name: 'ProfileUser',
                        params: {
                          username: postUser.username
                        }
                      }" class="md:block hidden">
        <AvatarUser :src="postUser.profileImage"
                    class="md:block hidden"
                    :size="40"/>
      </router-link>
      <div class="post-card-container md:w-full flex-1 min-w-0">
        <PostHeader :post-detail="postDetail"
                    :post-user="postUser"
                    :isShowActions="false"
                    @on-delete="handleDeletePost"/>
        <div class="post-card-content">
          <div v-if="isShowContent"
               class="card-body mb-3 mt-1">
            <div v-if="isShowFull"
                 v-html="sanitizeHtml(postDetail.content)"></div>
            <div v-else
                 v-html="sanitizeHtml(ellipsisText(postDetail.content, MAX_LENGTH_CONTENT))"></div>
          </div>
          <div v-if="postDetail.images && postDetail.images.length"
               class="md:h-[400px] h-[250px]">
            <PostGridImages :items="getImages(postDetail.images)" />
          </div>
          <ContentLockPost v-if="postDetail && postDetail.lockViewShare"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/design/variable.scss';
.post-card {
  padding: 17px;
  border-bottom: 1px solid $neutral-800;
  .post-card-header {
    color: $neutral-600;
    font-size: 14px;
    margin-bottom: 12px;
  }
  .card-body {
    color: var(--content-post-color);
  }
}
</style>
<script setup>
import PostHeader from '@/components/feed/PostHeader.vue';
import PostGridImages from '@/components/feed/PostGridImages.vue';
import {ellipsisText } from "@/helper/ultil";
import sanitizeHtml from 'sanitize-html';
import {computed, ref, toRefs, watch} from "vue";
import AvatarUser from "@/components/shared/AvatarUser.vue";
import IconPrivate from "@/components/shared/icons/IconPrivate.vue";
import ContentLockPost from "@/components/feed/ContentLockPost.vue";

const emit = defineEmits(['on-delete'])
const postDetail = ref({});
const postUser = ref({});
const MAX_LENGTH_CONTENT = 300;
const props = defineProps({
  post: {
    type: Object,
    default() {
      return null
    }
  },
  isShowActions: {
    type: Boolean,
    default: true
  },
})
const { post } = toRefs(props)
watch(post, (data) => {
  if (data && data.post) {
    postDetail.value = data.post;
    postUser.value = data.post.user;
  }
}, { immediate: true })

const isShowFull = ref(false);
const isShowReadMore = computed(() => {
  return postDetail.value.content.length > MAX_LENGTH_CONTENT && !isShowFull.value;
});

const handleShowFullContent = () => {
  isShowFull.value = true;
}

const isShowContent = computed(() => {
  return postDetail.value.content
      || (postDetail.value.content !== '<p></p>' && postDetail.value.content !== '<p><br></p> ')
})

const handleDeletePost = () => {
  emit('on-delete')
}

const getImages = (postImages = []) => {
  return postImages.map(o => o.url)
}
</script>
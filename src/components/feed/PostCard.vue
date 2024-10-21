<template>
  <div
    v-if="post && post.post"
    :class="[isShowActions ? 'mb-4' : '!border-b-0', isShowComment ? 'post-card-modal' : '']"
    class="post-card"
  >
    <div class="flex gap-5 post-card-container cs-scroll-bar">
      <router-link
        :to="{
          name: 'ProfileUser',
          params: {
            username: postUser.username
          }
        }"
        :class="`md:block hidden ${isShowComment ? '!hidden' : ''}`"
      >
        <AvatarUser
          :src="postUser.profileImage"
          class="md:block hidden"
          :size="40"
        />
      </router-link>
      <div class="post-card-container md:w-full flex-1 min-w-0">
        <PostHeader
          :post-detail="postDetail"
          :post-user="postUser"
          :is-show-avatar="isShowComment"
          :isShowActions="isShowActions"
          @on-delete="handleDeletePost"
        />
        <div
          class="post-card-content"
          :class="{ 'pt-2': isShowComment }"
        >
          <div
            v-if="isShowContent"
            class="card-body mb-3 mt-1"
          >
            <div
              v-if="isShowFull"
              v-html="sanitizeHtml(postDetail.content)"
            ></div>
            <div
              v-else
              v-html="sanitizeHtml(ellipsisText(postDetail.content, MAX_LENGTH_CONTENT))"
            ></div>
            <span
              v-if="isShowReadMore"
              @click="handleShowFullContent"
              class="text-primary-color-only hover:underline cursor-pointer"
            >
              Xem thêm
            </span>
          </div>
          <div
            v-if="postDetail.images && postDetail.images.length"
            class="md:h-[400px] h-[250px]"
          >
            <PostGridImages :items="getImages(postDetail.images)" />
          </div>
          <div
            v-if="postDetail.lockViewShare"
            class="border p-4 rounded-xl my-4 flex gap-3"
          >
            <IconPrivate :width="24" />
            <div class="flex-1 min-w-0">
              <div class="font-semibold">Nội dung này không hiển thị</div>
              <div class="pt-1">
                Lỗi này thường do chủ sở hữu chỉ chia sẻ nội dung với một nhóm nhỏ hoặc đã xoá nội
                dung
              </div>
            </div>
          </div>
          <div
            v-if="postDetail.postShare"
            class="border px-4 rounded-xl my-4"
          >
            <PostCard
              :post="{
                id: postDetail.postShare.id,
                post: postDetail.postShare
              }"
              :isShowActions="false"
            />
          </div>
          <PostCardStatistics
            v-if="isShowActions"
            :post="postDetail"
          />
          <PostCardActions
            v-if="isShowActions"
            ref="cardActionsRef"
            :post="postDetail"
            :isLike="post.post.isLike"
            :isAutoShowComment="isShowComment"
            @on-like="handleOnLiked"
            @on-comment="handleCommentCreated"
            @on-share="handleSharePost"
            @on-comment-modal-close="handleModalClose"
            @on-dislike="handleOnDisLiked"
          />
        </div>
      </div>
    </div>
    <div
      v-if="isShowComment"
      class="pt-4 px-4 border-t comment-form-modal"
    >
      <CommentForm
        v-model="contentComment"
        :post="post.post"
        ref="commentForm"
        @on-comment="onCommentCreated"
        @on-create-error="handleCommentError"
        @on-create-success="handleCommentSuccess"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/design/variable.scss';
.post-card {
  padding: 17px 0 21px 0;
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
.post-card-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-bottom: 0;
  .post-card-container {
    flex: 1;
    min-height: 1px;
    overflow: auto;
    > div {
      padding: 0 0.5rem;
    }
  }
}
@media (max-width: 768px) {
  .post-card {
    padding: 17px 0 10px 0;
  }
  .post-card-modal {
    .post-card-container {
      padding: 0;
    }
    .comment-form-modal {
      padding: 16px 12px 0 12px;
    }
  }
}
</style>
<script setup>
import PostCardActions from '@/components/feed/PostCardActions.vue'
import PostCardStatistics from '@/components/feed/PostCardStatistics.vue'
import PostHeader from '@/components/feed/PostHeader.vue'
import PostGridImages from '@/components/feed/PostGridImages.vue'
import { ellipsisText } from '@/helper/ultil'
import sanitizeHtml from 'sanitize-html'
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import AvatarUser from '@/components/shared/AvatarUser.vue'
import PostCard from '@/components/feed/PostCard.vue'
import IconPrivate from '@/components/shared/icons/IconPrivate.vue'
import CommentForm from '@/components/feed/comment/CommentForm.vue'
import { getPostApi } from '@/api/post'

const emit = defineEmits(['on-delete', 'on-share', 'on-comment'])
const postDetail = ref({})
const postUser = ref({})
const MAX_LENGTH_CONTENT = 500
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
  isShowComment: {
    type: Boolean,
    default: false
  }
})
const { post, isShowComment } = toRefs(props)
watch(
  post,
  (data) => {
    if (data && data.post) {
      console.log('data', data)
      postDetail.value = data.post
      postUser.value = data.post.user
    }
  },
  { immediate: true }
)

const contentComment = ref('')
const commentForm = ref(null)

if (isShowComment.value) {
  nextTick(() => {
    if (commentForm.value) {
      commentForm.value.focusEditor()
    }
  })
}

const handleOnLiked = () => {
  postDetail.value = {
    ...postDetail.value,
    isLike: true,
    likesCount: Number(postDetail.value.likesCount) + 1
  }
}

const handleModalClose = () => {
  getPostApi({
    slug: postDetail.value.slug
  }).then((resp) => {
    postDetail.value = {
      ...resp,
      isLike: resp.isLike
    }
  })
}

const cardActionsRef = ref(null)
const handleCommentCreated = () => {
  postDetail.value = {
    ...postDetail.value,
    commentsCount: Number(postDetail.value.commentsCount) + 1
  }
}

const handleCommentError = (commentId) => {
  if (cardActionsRef.value) {
    cardActionsRef.value.onCreatedCommentError(commentId)
  }
}
const handleCommentSuccess = (comment) => {
  if (cardActionsRef.value) {
    cardActionsRef.value.onCreatedCommentSuccess(comment)
  }
  emit('on-comment', comment)
}

const onCommentCreated = (comment) => {
  if (cardActionsRef.value) {
    cardActionsRef.value.onCreatedComment(comment)
  }
}

const handleSharePost = (slug) => {
  postDetail.value = {
    ...postDetail.value,
    sharesCount: Number(postDetail.value.sharesCount) + 1
  }
  emit('on-share', slug)
}

const isShowFull = ref(false)
const isShowReadMore = computed(() => {
  return postDetail.value.content.length > MAX_LENGTH_CONTENT && !isShowFull.value
})

const handleShowFullContent = () => {
  isShowFull.value = true
}

const isShowContent = computed(() => {
  return (
    postDetail.value.content ||
    (postDetail.value.content !== '<p></p>' && postDetail.value.content !== '<p><br></p> ')
  )
})

const handleOnDisLiked = () => {
  postDetail.value = {
    ...postDetail.value,
    isLike: false,
    likesCount: Number(postDetail.value.likesCount) - 1
  }
}

const handleDeletePost = () => {
  emit('on-delete')
}

const getImages = (postImages = []) => {
  return postImages.map((o) => o.url)
}
</script>

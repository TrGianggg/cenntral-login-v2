<template>
  <div class="card-actions grid"
       :class="[
           { 'border-b': isShowComment },
           post.privacy === 'only_me' ? 'grid-cols-2' : 'grid-cols-3',
       ]" >
    <div class="card-action-item"
         :class="{'liked is_animating': post.isLike}"
         @click="likePost">
      <IconLike/>
      <span>{{ post.isLike ? 'Bỏ thích' : 'Thích' }}</span>
    </div>
    <div class="card-action-item"
         @click="handleComment">
      <IconComment/>
      <span>Bình luận</span>
    </div>
    <a-popover trigger="click"
               overlayClassName="share-popup"
               v-model:visible="isOpenSharePopup"
               placement="bottomRight">
      <template #content>
        <div class="share-item"
             @click="sharePost">
          Chia sẻ ngay (công khai)
        </div>
        <div class="share-item"
             @click="openShareModal">
          Chia sẻ lên bảng tin
        </div>
      </template>
      <div v-if="post.privacy !== 'only_me'"
           class="card-action-item">
        <IconShare/>
        <span>Chia sẻ</span>
      </div>
    </a-popover>
  </div>
  <CommentList v-if="isShowComment"
               :post="post"
               ref="commentListRef"
               :isAutoShowComment="isAutoShowComment"
               @on-comment="handleCommentCreated"/>
  <CommentPostModal ref="commentModal"
                    @on-close="handleCommentModalClose"
                    @on-comment="handleCommentCreatedByModal"/>
  <SharePostModal ref="shareModal"
                  @on-share="handleShared"/>
</template>
<script setup>
import IconComment from "@/components/shared/icons/IconComment.vue";
import IconLike from "@/components/shared/icons/IconLike.vue";
import IconShare from "@/components/shared/icons/IconShare.vue";
import {dislikePostApi, getPostApi, likePostApi, sharePostApi} from "@/api/post";
import CommentList from '@/components/feed/comment/CommentList.vue'
import SharePostModal from '@/components/feed/SharePostModal.vue'
import CommentPostModal from '@/components/feed/comment/CommentPostModal.vue'
import {ref, watch} from "vue";
import { message } from 'ant-design-vue';
const emits = defineEmits(['on-like', 'on-dislike', 'on-comment', 'on-share', 'on-comment-modal-close'])
const { post, isLike, isAutoShowComment } = defineProps({
  post: {
    type: Object,
    default() {
      return null
    }
  },
  isLike: {
    type: Boolean,
    default: false
  },
  isAutoShowComment: {
    type: Boolean,
    default: false // is auto show comment when load
  }
})

const isOpenSharePopup = ref(false);

const isShowComment = ref(false);
const isLikeClone = ref(isLike);

if (isAutoShowComment) {
  isShowComment.value = true
}
const commentModal = ref(null)
const handleComment = () => {
  isShowComment.value = true;
  if (!isAutoShowComment) {
    commentModal.value.open({
      post: post
    })
  }
}

const handleCommentCreated = () => {
  emits('on-comment')
}

const likeStatus = ref(false);
const loadingStatus = ref(false);

watch(isLikeClone, () => {
  likeStatus.value = isLikeClone.value
}, { immediate: true })

const likePost = () => {
  if (loadingStatus.value) return;
  loadingStatus.value = true;
  if (likeStatus.value) {
    emits('on-dislike')
    likeStatus.value = false
    dislikePostApi({
      slug: post.slug
    }).finally(() => loadingStatus.value = false)
  } else {
    emits('on-like')
    likeStatus.value = true
    likePostApi({
      slug: post.slug
    }).finally(() => loadingStatus.value = false)
  }
}

const sharePost = () => {
  isOpenSharePopup.value = false;
  const slug = post.postShare ? post.postShare.slug : post.slug
  sharePostApi({
    slug
  }).then((postShared) => {
    message.info('Chia sẻ bài viết thành công')
    emits('on-share', postShared.slug)
  }, (error) => {
    if (error && error.message && error.statusCode !== 403) {
      message.error(error.message)
    }
  })
}

const handleShared = (slug) => {
  emits('on-share', slug)
}

const shareModal = ref();
const openShareModal = () => {
  isOpenSharePopup.value = false;
  shareModal.value.open(post);
}

const commentListRef = ref(null);

const handleCommentModalClose = () => {
  if (commentListRef.value) {
    commentListRef.value.refreshComment()
  }
  emits('on-comment-modal-close')
}

const handleCommentCreatedByModal = (comment) => {
  handleCommentCreated()
  if (commentListRef.value) {
    commentListRef.value.addComment(comment)
  }
}

const onCreatedComment = (comment) => {
  if (commentListRef.value) {
    commentListRef.value.handleCommentCreated(comment)
  }
}
const onCreatedCommentSuccess = (comment) => {
  if (commentListRef.value) {
    commentListRef.value.handleCommentSuccess(comment)
  }
}

const onCreatedCommentError = (commentId) => {
  if (commentListRef.value) {
    commentListRef.value.handleCommentError(commentId)
  }
}
defineExpose({
  onCreatedComment,
  onCreatedCommentSuccess,
  onCreatedCommentError
});

</script>

<style scoped lang="scss">
@import '@/design/variable.scss';
.card-actions {
  height: 36px;
  border-top: 1px solid $neutral-800;
  svg {
    stroke: currentColor;
    fill: transparent;
  }
  .liked {
    color: #e61339;
    svg {
      fill: currentColor;
      stroke: currentColor;
    }
  }
  .card-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    min-height: 35px;
  }
}
@media (min-width: 1024px) {
  .card-action-item {
    &:hover {
      color: var(--color-white);
      background: var(--color-white-02);
      svg {
        stroke: var(--color-white);
      }
    }
  }
}
.share-item {
  padding: 7px 10px;
  cursor: pointer;
  transition: .25s;
  width: 100%;
  &:hover {
    background: var(--color-white-01);
  }
}
@media (max-width: 370px) {
  .card-actions {
    font-size: 13px;
    .card-action-item {
      gap: 8px;
    }
  }
}
</style>
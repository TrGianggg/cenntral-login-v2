<template>
  <div :id="id">
    <div :class="isShowEditForm ? 'block' : 'hidden'">
      <CommentForm :post="post"
                   :comment="comment"
                   v-model="editContent"
                   @on-comment="handleReplyCreated"
                   @on-create-error="handleReplyError"
                   @on-create-success="handleReplySuccess"
                   @on-edit="handleCommentEdited"
                   :is-update="true"
                   ref="commentForm"
                   placeholder="Viết bình luận..."/>
      <span @click="isShowEditForm = false"
            class="text-primary-color hover:underline cursor-pointer pl-10">
        Huỷ
      </span>
    </div>
    <div v-show="!isShowEditForm"
         class="comment-item">
      <router-link :to="{
              name: 'ProfileUser',
              params: {
                username: comment.user.username
              }
            }">
        <AvatarUser :size="32"
                    :src="comment.user.profileImage"/>
      </router-link>
      <div class="flex-1 min-w-0">
        <div class="flex gap-2 items-center comment-content-wrapper">
          <div class="flex flex-col comment-content w-max"
               :class="{ 'comment-content-highlight': isActiveComment }">
            <div class="flex items-center gap-2 mb-1">
              <router-link :to="{
              name: 'ProfileUser',
              params: {
                username: comment.user.username
              }
            }" class="text-white font-bold flex-1 min-w-0 hover:underline hover:text-white">
                {{ getFullNameUser(comment.user) }}
              </router-link>
              <span class="flex items-end gap-2 text-neutral-200">
              <span> @{{ comment.user.username }} </span>
            </span>
            </div>
            <div v-html="sanitizeHtml(comment.content)" style="word-break: break-word"></div>
          </div>
          <a-popover v-if="isShowOptionsComment"
                     trigger="click"
                     v-model:visible="isOpenPopup"
                     overlayClassName="cs-popup">
            <template #content>
              <div class="py-2">
                <div class="select-item"
                     @click="editComment">
                  Chỉnh sửa
                </div>
                <div class="select-item"
                     @click="deleteComment">Xoá</div>
              </div>
            </template>
            <HoverBox :size="24" class="rotate-90 more-comment-icon">
              <MoreOutlined />
            </HoverBox>
          </a-popover>
        </div>
        <div v-if="comment.images && comment.images.length">
          <div v-for="(image, index) in comment.images"
               :key="index"
               class="max-w-[210px] h-52 overflow-hidden">
            <img :src="image.url"
                 @click="previewImage(image.url)"
                 class="w-full h-full object-cover rounded-2xl"
                 alt="">
          </div>
        </div>
        <div v-if="comment.loading"
             class="text-body-5 mt-1.5 flex gap-3 items-center">
          <span>Đang tải...</span>
        </div>
        <div v-else class="text-body-5 mt-1.5">
          <span v-if="comment.error"
                class="text-red-400 cursor-pointer"
                @click="reTryComment">
            Lỗi! <span class="underline">Thử lại</span>
          </span>
          <div v-else class="flex gap-3 items-center min-h-[16px]">
            <span class="font-semibold hover:underline cursor-pointer"
                  :class="{ 'text-primary-color-only': liked }"
                  @click="likeOrDislikeComment">
              Thích
            </span>
            <span class="font-semibold hover:underline cursor-pointer"
                  @click="showReplyForm(true)">
              Phản hồi
            </span>
            <span :title="formatFullTime(comment.createdAt)">
              {{ timePostAgo(comment.createdAt) }}
            </span>
            <span v-if="likesCount"
                  class="like-reply-icon flex items-center gap-1">
              <IconLike/>
              <span>{{ formatNumberToK(likesCount) }}</span>
            </span>
            <span v-if="comment.isEdited">
              Đã chỉnh sửa
            </span>
          </div>
        </div>
        <div v-if="comment.countChild && !isShowRepliesForm"
             class="text-body-4">
          <span class="font-bold hover:underline cursor-pointer"
                @click="showReplyForm(false)">
            {{ comment.countChild }} phản hồi
          </span>
        </div>
        <div v-if="loadingReplies"
             class="p-4">
          <CommentLoader/>
        </div>
        <div v-if="afterCursor && !loadingReplies"
             @click="fetchReplies"
             class="text-primary-color-only cursor-pointer hover:underline py-2">
          Xem thêm
        </div>
        <div class="mt-2">
          <ListReplyComment :comment="comment"
                            :replies="replies"
                            :post="post"
                            @on-delete="handleDeleteReply"
                            :isShowComment="false"
                            @on-reply="handleReply"
                            @on-re-reply="handleReReply"
                            @on-edit="handleReplyEdited"/>
        </div>
        <div v-if="isShowRepliesForm"
             class="mt-2">
          <CommentForm :post="post"
                       :comment="comment"
                       v-model="replyContent"
                       @on-comment="handleReplyCreated"
                       @on-create-error="handleReplyError"
                       @on-create-success="handleReplySuccess"
                       ref="commentForm"
                       placeholder="Viết phản hồi..."/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AvatarUser from "@/components/shared/AvatarUser.vue";
import { MoreOutlined } from '@ant-design/icons-vue';
import {formatFullTime, formatNumberToK, getFullNameUser, timePostAgo, urlsToFiles} from "@/helper/ultil";
import sanitizeHtml from 'sanitize-html';
import CommentForm from "@/components/feed/comment/CommentForm.vue";
import ListReplyComment from "@/components/feed/comment/ListReplyComment.vue";
import {computed, nextTick, onMounted, ref} from "vue";
import {createCommentApi, dislikeCommentApi, getCommentApi, likeCommentApi, removeCommentApi} from "@/api/post";
import IconLike from "@/components/shared/icons/IconLike.vue";
import {userStore} from "@/stores/userStore";
import {useImageStore} from "@/stores/image";
import HoverBox from "@/components/shared/HoverBox.vue";
import CommentLoader from "@/components/shared/CommentLoader.vue";
import {useRoute} from "vue-router";
const emit = defineEmits(['on-create-reply', 'on-delete', 'on-re-comment']);
const {comment, post, isReply} = defineProps({
  comment: {
    type: Object,
    default() {
      return null
    }
  },
  post: {
    type: Object,
  },
  id: {
    type: [String, Number],
  },
  isReply: {
    type: Boolean,
    default: false
  }
})
const imageStore = useImageStore()
const previewImage = (imageUrl) => {
  imageStore.openModal(imageUrl)
}

const userInfo = computed(() => {
  return userStore().userInfo
})
const isOpenPopup = ref(false);

const isShowOptionsComment = computed(() => {
  return userInfo.value && userInfo.value.slug === comment.user.slug
      && !comment.loading
      && !comment.error
})

const route = useRoute();
const isActiveComment = computed(() => {
  if (route.query.comment) {
    if (route.query.reply) {
      return route.query.reply === comment.slug
    }
    return route.query.comment === comment.slug
  }
  return false
})

const reTryComment = () => {
  emit('on-re-comment', comment)
}

const editComment = () => {
  isShowEditForm.value = true;
  isOpenPopup.value = false;
}

const isShowRepliesForm = ref(false);

const isShowEditForm = ref(false);
const editContent = ref('')

const replyContent = ref('');
const replies = ref([])
const afterCursor = ref('')
const loadingReplies = ref(false)
const fetchReplies = () => {
  loadingReplies.value = true;
  getCommentApi({
    slug: post.slug,
    slugParent: comment.slug,
    after: afterCursor.value
  }).then(resp => {
    loadingReplies.value = false;
    afterCursor.value = resp.data.cursor.afterCursor
    replies.value = [...resp.data.data.reverse(), ...replies.value];
  }, () => {
    loadingReplies.value = false;
  })
}

const handleReplyEdited = (comment) => {
  replies.value = replies.value.map(o => {
    return o.slug === comment.slug ? {
      ...comment,
      isEdited: true
    } : o
  })
}

const handleReplyCreated = (comment) => {
  replies.value.push({
    ...comment,
    likesCount: 0
  })
  nextTick(() => {
    const el = document.getElementById(comment.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const handleCommentEdited = (editedComment) => {
  isShowEditForm.value = false;
  emit('on-edit', editedComment);
}

const commentForm = ref(null)
const showReplyForm = (focusEditor = false) => {
  if (isReply) {
    emit('on-reply')
    return
  }
  isShowRepliesForm.value = true;
  if (comment.countChild && !replies.value.length) {
    fetchReplies()
  }
  nextTick().then(() => {
    if (focusEditor) {
      commentForm.value.focusEditor();
    }
  })
}
onMounted(() => {
  if (route.query.comment && route.query.reply && route.query.comment === comment.slug) {
    showReplyForm()
  }
})

const handleReReply = async (commentData) => {
  replies.value = replies.value.map(o => {
    return o.id === commentData.id ? {
      ...o,
      loading: true,
      error: false,
    } : o
  })
  const formData = new FormData();
  formData.append('content', commentData.content)
  formData.append('slugPost', post.slug)
  const urls = commentData.images.map(o => o.url);
  const files = await urlsToFiles(urls);
  const file = files[0]
  formData.append('slugParent', comment.slug);
  if (file) {
    formData.append('files', file);
  }
  createCommentApi(formData).then((resp) => {
    replies.value = replies.value.map(o => {
      return o.id === commentData.id ? {
        ...o,
        ...resp,
        loading: false,
        error: false,
      } : o
    })
  }, () => {
    replies.value = replies.value.map(o => {
      return o.id === commentData.id ? {
        ...o,
        loading: false,
        error: true,
      } : o
    })
  })
}

const handleReply = () => {
  nextTick().then(() => {
    commentForm.value.focusEditor();
  })
}

const liked = ref(comment.isLike);
const likesCount = ref(comment.likesCount);
const likeOrDislikeComment = () => {
  const data = {
    slugPost: post.slug,
    slugComment: comment.slug
  }
  if (liked.value) {
    liked.value = false;
    likesCount.value = likesCount.value - 1;
    dislikeCommentApi(data)
  } else {
    liked.value = true;
    likesCount.value = likesCount.value + 1;
    likeCommentApi(data)
  }
}

const handleReplyError = (commentId) => {
  replies.value = replies.value.map(o => {
    return o.id === commentId ? {
      ...o,
      loading: false,
      error: true,
    } : o
  })
}
const handleReplySuccess = (comment) => {
  emit('on-create-reply');
  replies.value = replies.value.map((o, index) => {
    return index + 1 === replies.value.length ? {
      ...o,
      ...comment,
      loading: false,
      error: false,
    } : o
  })
}

const handleDeleteReply = (comment) => {
  replies.value = replies.value.filter(o => o.slug !== comment.slug)
}

const deleteComment = () => {
  emit('on-delete', comment)
  removeCommentApi({
    slug: comment.slug
  })
}

</script>

<style scoped lang="scss">
@import "@/design/variable";
.comment-item {
  display: flex;
  gap: 8px;

  .comment-content {
    background: var(--color-white-01);
    padding: 0.35rem 0.75rem;
    border-radius: 16px;
    &.comment-content-highlight {
      background: var(--gold-150);
      * {
        color: initial;
      }
    }
  }
}
.comment-content-wrapper {
  .more-comment-icon {
    cursor: pointer;
    visibility: hidden;
  }
  &:hover {
    .more-comment-icon {
      visibility: visible;
    }
  }
}
@media (max-width: 1200px) {
  .comment-content-wrapper {
    .more-comment-icon {
      visibility: visible;
    }
  }
}
</style>
<style lang="scss">
@import "@/design/variable";
.comment-item {
  .like-reply-icon {
    svg {
      fill: red;
    }
  }
}
</style>
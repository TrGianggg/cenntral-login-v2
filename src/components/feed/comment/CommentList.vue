<template>
  <div class="card-comment-list pt-4 pr-4 mb-4">
    <div v-if="loadingComment"
         class="p-4">
      <CommentLoader/>
    </div>
    <div v-if="afterCursor && !loadingComment"
         class="hover:underline text-view-more cursor-pointer pb-3 px-4"
         @click="fetchComments">
      Xem thêm
    </div>
    <div class="flex flex-col gap-2">
      <CommentItem v-for="item in commentList"
                   :key="item.key || item.slug"
                   :post="post"
                   :comment="item"
                   :id="item.id || item.slug"
                   @on-delete="handleDeleteComment"
                   @on-re-comment="handleReComment"
                   @on-create-reply="handleReplyCreated"
                   @on-edit="handleCommentEdited"/>
    </div>
  </div>
  <CommentForm v-if="!isAutoShowComment"
               v-model="content"
               :post="post"
               @on-comment="handleCommentCreated"
               @on-create-error="handleCommentError"
               @on-create-success="handleCommentSuccess"/>
</template>
<script setup>
import CommentItem from "@/components/feed/CommentItem.vue";
import CommentForm from "@/components/feed/comment/CommentForm.vue";
import CommentLoader from '@/components/shared/CommentLoader.vue'
import {nextTick, ref} from "vue";
import {createCommentApi, getCommentApi} from "@/api/post";
import dayjs from "dayjs";
import {urlsToFiles} from "@/helper/ultil";
import {useRoute} from "vue-router";

const { post, isAutoShowComment } = defineProps({
  post: {
    type: Object,
    default() {
      return null
    }
  },
  isAutoShowComment: {
    type: Boolean,
    default: false // is auto show comment when load
  }
})
const route = useRoute();
const emit = defineEmits(['on-comment']);
const loadingComment = ref(false);
const commentList = ref([]);
const content = ref('');
const afterCursor = ref('');
const isFirstTime = ref(true)

const fetchComments = () => {
  if (loadingComment.value) return;
  loadingComment.value = true;
  const limit = isAutoShowComment ? 7 : 10
  const query = {
    slug: post.slug,
    limit
  }
  if (afterCursor.value) {
    query.after = afterCursor.value
  }
  getCommentApi(query).then(resp => {
    loadingComment.value = false;
    if (resp.data.data && resp.data.data.length) {
      commentList.value = [...resp.data.data.reverse(), ...commentList.value]
    }
    afterCursor.value = resp.data.cursor.afterCursor;
    nextTick(() => {
      if (route.query.comment) {
        const commentEl = document.getElementById(route.query.comment);
        if (commentEl && isFirstTime.value) {
          isFirstTime.value = false;
          commentEl.scrollIntoView({ block: 'end'})
        }
      }
    })
  }, () => {
    loadingComment.value = false;
  })
}
fetchComments();

const refreshComment = () => {
  afterCursor.value = ''
  // commentList.value = []
  const query = {
    slug: post.slug,
  }
  if (afterCursor.value) {
    query.after = afterCursor.value
  }
  getCommentApi(query).then(resp => {
    if (resp.data.data && resp.data.data.length) {
      const now = +dayjs()
      commentList.value = [...resp.data.data.reverse()].map(o => {
        return {
          ...o,
          key: `${now}-${o.slug}`,
        }
      })
    }
    afterCursor.value = resp.data.cursor.afterCursor;
  })
}

const handleReplyCreated = () => {
  emit('on-comment')
}

const handleCommentCreated = (comment) => {
  commentList.value.push({
    ...comment,
    likesCount: 0
  });
  emit('on-comment')
  nextTick(() => {
    const el = document.getElementById(comment.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const addComment = (comment) => {
  commentList.value.push({
    ...comment,
    likesCount: 0
  });
}

const handleCommentSuccess = (comment) => {
  commentList.value = commentList.value.map((o, index) => {
    return index + 1 === commentList.value.length ? {
      ...o,
      ...comment,
      loading: false,
      error: false,
    } : o
  })
}
const handleCommentError = (commentId) => {
  commentList.value = commentList.value.map(o => {
    return o.id === commentId ? {
      ...o,
      loading: false,
      error: true,
    } : o
  })
}

const handleReComment = async (comment) => {
  commentList.value = commentList.value.map(o => {
    return o.id === comment.id ? {
      ...o,
      loading: true,
      error: false,
    } : o
  })
  const formData = new FormData();
  formData.append('content', comment.content)
  formData.append('slugPost', post.slug)
  const urls = comment.images.map(o => o.url);
  const files = await urlsToFiles(urls);
  const file = files[0]
  if (file) {
    formData.append('files', file);
  }
  createCommentApi(formData).then((resp) => {
    commentList.value = commentList.value.map(o => {
      return o.id === comment.id ? {
        ...o,
        ...resp,
        loading: false,
        error: false,
      } : o
    })
  }, () => {
    commentList.value = commentList.value.map(o => {
      return o.id === comment.id ? {
        ...o,
        loading: false,
        error: true,
      } : o
    })
  })
}

const handleCommentEdited = (comment) => {
  commentList.value = commentList.value.map(o => {
    return o.slug === comment.slug ? {
      ...comment,
      isEdited: true
    } : o
  })
}

const handleDeleteComment = (comment) => {
  commentList.value = commentList.value.filter(o => o.slug !== comment.slug)
}

defineExpose({
  handleCommentCreated,
  handleCommentSuccess,
  handleCommentError,
  addComment,
  refreshComment
})
</script>

<style lang="scss" scoped>
.card-comment-list {
  //max-height: 500px;
  //overflow: auto;
}
</style>
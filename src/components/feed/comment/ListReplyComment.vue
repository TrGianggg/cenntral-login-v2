<template>
  <div class="flex flex-col gap-2 overflow-auto">
    <div v-for="item in replies"
         :key="item.slug">
      <CommentItem :comment="item"
                   :post="post"
                   @on-delete="handleDeleteComment(item)"
                   :isShowComment="false"
                   :is-reply="true"
                   :id="item.id || item.slug"
                   @on-re-comment="handleReReply"
                   @on-reply="handleReply"
                   @on-edit="handleCommentEdited"/>
    </div>
  </div>
</template>
<script setup>
import CommentItem from "@/components/feed/CommentItem.vue";
defineProps({
  comment: {
    type: Object,
    default() {
      return null
    }
  },
  replies: {
    type: Array,
    default() {
      return []
    }
  },
  post: {
    type: Object,
  },
  isShowComment: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['on-delete', 'on-edit', 'on-reply', 'on-re-reply'])
const handleDeleteComment = (data) => {
  emit('on-delete', data)
}

const handleCommentEdited = (comment) => {
  emit('on-edit', comment)
}

const handleReReply = (comment) => {
  emit('on-re-reply', comment)
}

const handleReply = () => {
  emit('on-reply')
}
</script>
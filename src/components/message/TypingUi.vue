<template>
  <div v-if="typingUsers && typingUsers.length"
       class="flex gap-2 items-center text-primary-color-only">
    <TypingAnimation/>
    <span v-if="roomType === 'group'"
          class="text-xs">
      {{ typingNames }} đang nhập
    </span>
  </div>
</template>
<script setup>
import TypingAnimation from "@/components/message/TypingAnimation.vue";
import {computed, toRefs} from "vue";
const props = defineProps({
  roomType: {
    type: String,
    default: 'chat'
  },
  typingUsers: {
    type: Array,
    default() {
      return []
    }
  }
})
const { typingUsers } = toRefs(props);
const typingNames = computed(() => {
  return typingUsers.value.map(o => o.lastName).join(', ')
})
</script>
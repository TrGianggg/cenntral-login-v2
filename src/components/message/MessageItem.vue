<template>
  <div class="flex message-item justify-start"
       :id="`message-${message.id}`"
       :class="{ 'my-message justify-end': isMyMessage(message) }">
    <div v-if="message.status === 'notification'"
         class="w-full flex justify-center text-[14px] text-neutral-500">
      <div v-html="message.content"
           class="text-center"
           style="word-break: break-word"></div>
    </div>
    <div v-else>
      <div v-if="isMyMessage(message)"
           class="flex gap-2">
        <div class="flex flex-col gap-1 items-end relative">
          <div v-if="message.isShowName"
               class="text-[12px] text-secondary-white">
            {{ getFullNameUser(message.sender) }}
          </div>
          <div v-if="isMyLastMessage && !message.loading && !message.images.length"
               class="text-secondary-white absolute ssm1:left-12 left-1 bottom-2">
            <IconMessageSeen v-if="isMessageSeen"/>
            <IconCheck v-else/>
          </div>
          <div v-if="message.content"
               class="message-content ssm1:ml-20 ml-8">
            <div v-html="message.content"
                 class="break-words"></div>
            <div class="md:text-[12px] text-[11px] text-secondary text-right pt-1">
              {{ formatMessageTime(message.createdAt) }}
            </div>
          </div>
          <div class="flex justify-end">
            <ListImageInMessage v-if="message.images && message.images.length"
                                :class="isMyMessage ? 'justify-end' : 'justify-start'"
                                :images="message.images"/>
          </div>
          <div v-if="message.loading"
               class="text-xs text-right">
            Đang gửi...
          </div>
          <div v-if="message.error"
               class="text-xs text-right text-red-500 cursor-pointer underline">
            Lỗi!
          </div>
        </div>
        <div :class="{ 'pt-4': message.isShowName }">
          <AvatarUser :size="40"
                      :size-mobile="32"
                      :class="{ 'invisible': !message.isShowAvatar}"
                      :src="message.sender.profileImage"/>
        </div>
      </div>
      <div v-else class="flex gap-2 justify-start">
        <div :class="{ 'pt-4': message.isShowName }">
          <AvatarUser :size="40"
                      :size-mobile="32"
                      :class="{ 'invisible': !message.isShowAvatar}"
                      :src="message.sender.profileImage"/>
        </div>
        <div class="flex flex-col gap-1">
          <div v-if="message.isShowName"
               class="text-[12px] text-secondary-white">
            {{ getFullNameUser(message.sender) }}
          </div>
          <div v-if="message.content"
               class="message-content ssm1:mr-20 mr-8">
            <div v-html="message.content" class="break-words"></div>
            <div class="md:text-[12px] text-[10px] text-secondary text-right pt-1">
              {{ formatMessageTime(message.createdAt) }}
            </div>
          </div>

          <ListImageInMessage v-if="message.images && message.images.length"
                              :images="message.images"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import AvatarUser from "@/components/shared/AvatarUser.vue";
import IconMessageSeen from "@/components/shared/icons/IconMessageSeen.vue";
import IconCheck from "@/components/shared/icons/IconCheck.vue";
import ListImageInMessage from '@/components/message/ListImageInMessage.vue'
import {computed, toRefs} from "vue";
import {userStore} from "@/stores/userStore";
import {formatMessageTime, getFullNameUser} from "@/helper/ultil";
const props = defineProps({
  message: {
    type: Object
  },
  lastMessage: {
    type: Object,
    default() {
      return null
    }
  }
})
const { lastMessage, message } = toRefs(props)
const userInfo = computed(() => {
  return userStore().userInfo
})
const isMyMessage = (item) => {
  return item.sender.username === userInfo.value.username
}

const isMyLastMessage = computed(() => {
  if (lastMessage.value) {
    return lastMessage.value.sender.username === userInfo.value.username
        && lastMessage.value.id === message.value.id
  }
  return false
})

const isMessageSeen = computed(() => {
  return message.value.seen && message.value.seen.length && message.value.seen.length > 1
})
</script>

<style lang="scss">
.message-item {
  display: flex;
  .message-content {
    background: #E7E7E8;
    padding: 12px 16px;
    border-radius: 0 24px 24px 24px;
    width: fit-content;
  }
  &.my-message {
    .message-content {
      background: #FFEFBD;
      border-radius: 24px 0 24px 24px;
    }
  }
}
.dark-theme {
  .message-item {
    .message-content {
      background: #fff;
      color: #0F1419;
    }
    &.my-message {
      .message-content {
        background: #ffefc0;
        color: #0A163D;
      }
    }
  }
}
@media (max-width: 768px) {
  .message-content {
    font-size: 14px;
    padding: 12px 24px;
  }
}
</style>
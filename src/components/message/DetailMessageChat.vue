<template>
  <div v-if="selectedRoom"
       class="w-full h-full flex flex-col">
    <div class="chat-header lg:h-[123px] h-auto flex justify-between items-end mb-2 px-4 gap-2">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="cursor-pointer lg:hidden block"
             @click="closeChat">
          <IconArrowLeft />
        </div>
        <RoomAvatar :room="roomDetail" :is-large="true"/>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-[20px] line-clamp-2" style="word-break: break-word">
            {{ roomDetail.type === 'group' ? roomDetail.name :  getFullNameUser(selectedRoom.toUser) }}
          </div>
          <TypingUi :typing-users="typingUsers"
                    :room-type="roomDetail.type"/>
        </div>
      </div>
      <PopupOptionsRoom :room="selectedRoom"
                        @on-change-name="handleChangeNameGroup"
                        @on-leave="leaveGroup"
                        @on-remove="removeGroup"
                        @on-change-background="handleChangeBgChat"
                        @on-add-members="handleMembersAdded"/>
    </div>
    <div class="border-t flex flex-col flex-1 min-h-0 overflow-auto">
      <div id="scroll-msg"
           :style="roomDetail.background ? `background-image: url('${roomDetail.background}')` : ''"
           class="p-4 flex-1 min-h-0 overflow-scroll flex flex-col gap-2 content-chat-wrapper">
        <InfiniteLoading v-if="messages && messages.length"
                         class="invisible"
                         :top="true"
                         :distance="100"
                         @infinite="loadMoreMessage"/>
        <div style="max-width: 250px; width: 100%">
          <ListLoader v-if="loading"/>
        </div>
        <MessageItem v-for="item in messages"
                     :key="item.id"
                     :lastMessage="lastMessage"
                     :message="item" />
        <div id="msg-bottom"></div>
      </div>
      <div class="message-form min-h-[90px] max-h-[450px] border-t-thin flex items-center">
        <CreateMessageEditor @on-create="handleMessageCreated"
                             :room="selectedRoom"
                             @on-blur="handleBlurEditor"
                             @on-focus="handleFocusEditor"
                             @on-create-error="handleMessageCreateError"
                             @on-create-success="handleMessageCreateSuccess"/>
      </div>
    </div>
    <ChangeNameGroupModal ref="changeNameGroupModal"
                          @on-update="handleChangeNameGroup"/>
  </div>
</template>
<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch} from "vue";
import {getMessageApi, seenMessagesApi} from "@/api/message";
import CreateMessageEditor from "@/components/message/CreateMessageEditor.vue";
import MessageItem from "@/components/message/MessageItem.vue";
import {userStore} from "@/stores/userStore";
import IconArrowLeft from '@/components/shared/icons/IconArrowLeft.vue';
import dayjs from "dayjs";
import {getFullNameUser} from "@/helper/ultil";
import ChangeNameGroupModal from "@/components/message/ChangeNameGroupModal.vue";
import RoomAvatar from "@/components/message/RoomAvatar.vue";
import PopupOptionsRoom from '@/components/message/PopupOptionsRoom.vue';
import TypingUi from '@/components/message/TypingUi.vue';
import {useSocketStore} from "@/stores/socketStore";
import InfiniteLoading from "v3-infinite-loading";
import {useMessageStore} from "@/stores/messageStore";
import {ListLoader} from 'vue-content-loader'

const emit = defineEmits(['on-message', 'on-change-name', 'on-leave', 'on-change-background', 'on-close', 'on-remove'])
const props = defineProps({
  selectedRoom: {
    type: Object,
    default() {
      return null
    }
  }
})

const { selectedRoom } = toRefs(props)
const userInfo = computed(() => {
  return userStore().userInfo
})
const socketStore = useSocketStore()
const socket = computed(() => socketStore.socket).value
const roomDetail = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    const el = document.getElementById('msg-bottom');
    if (el) {
      el.scrollIntoView()
    }
  })
}

const scrollToElement = (id) => {
  nextTick(() => {
    const el = document.getElementById(`message-${id}`);
    if (el) {
      el.scrollIntoView()
    }
  })
}

const messages = ref([])
const loading = ref(false)
const afterCursor = ref('')
const fetchMessages = () => {
  loading.value = true;
  getMessageApi({
    slug: selectedRoom.value.slug,
    limit: 20,
    after: afterCursor.value
  }).then(resp => {
    console.log('fetchMessages: ', resp);
    loading.value = false;
    afterCursor.value = resp.cursor.afterCursor
    const results = setMetaMessage(resp.data)
    messages.value = [...results, ...messages.value];
    if (resp.data && resp.data.length) {
      scrollToElement(resp.data[resp.data.length - 1].id)
    }
    handleSeenMessages(resp.data)
  }, () => {
    loading.value = false;
  })
}

const setMetaMessage = (results = []) => {
  return results.map((item, index, array) => {
    const isFirstItem = index === 0;
    const prevItem = isFirstItem ? null : array[index - 1];
    const nextItem = array[index + 1];
    let shouldUpdate = true;
    if (prevItem && prevItem.status !== 'notification') {
      if (item.sender.username === prevItem.sender.username) {
        shouldUpdate = false
      }
    }
    if (!prevItem && nextItem && nextItem.status !== 'notification') {
      if (item.sender.username === nextItem.sender.username) {
        shouldUpdate = false
      }
    }
    return {
      ...item,
      isShowAvatar: shouldUpdate,
      isShowName: shouldUpdate,
    };
  })
}

const closeChat = () => {
  emit('on-close')
}

const messageStore = useMessageStore()
const currentMessageCount = computed(() => messageStore.countData);
const handleSeenMessages = (messages = []) => {
  const listMessageNotSeen = messages.filter(o => {
    return !o.seen.includes(userInfo.value.username)
  })
  const listId = listMessageNotSeen.map(o => o.id);
  if (listId.length) {
    seenMessagesApi({
      ids: listId,
      slugRoom: roomDetail.value.slug
    }).then(() => {
      const totalMessageSeen = listId.length
      const currentCount = currentMessageCount.value;
      let countData = {
        countNewAll: currentCount.countNewAll - totalMessageSeen,
      };
      if (roomDetail.value.type === 'group') {
        countData = {
          ...countData,
          countNewGroup: currentCount.countNewGroup - totalMessageSeen
        }
      }
      if (roomDetail.value.type === 'chat') {
        countData = {
          ...countData,
          countNewChat: currentCount.countNewChat - totalMessageSeen
        }
      }
      messageStore.setCountData(countData)
    })
  }
}

const lastMessage = computed(() => {
  if (messages.value && messages.value.length) {
    return messages.value[messages.value.length - 1]
  }
  return null
})

watch(selectedRoom, () => {
  roomDetail.value = { ...selectedRoom.value };
  afterCursor.value = ''
  messages.value = [];
  fetchMessages()
}, { immediate: true, deep: true })

const loadMoreMessage = () => {
  if (loading.value || !afterCursor.value) return;
  fetchMessages(true)
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 300)
  })
})

const handleChangeBgChat = (imageUrl) => {
  roomDetail.value.background = imageUrl;
  scrollToBottom();
  emit('on-change-background', imageUrl)
}

const handleFocusEditor = () => {
  socket.emit('typing', {
    room: selectedRoom.value.slug,
    sender: userInfo.value.username,
    type: 'typing',
    data: {
      user: userInfo.value
    }
  })
}

const handleBlurEditor = () => {
  socket.emit('typing', {
    room: selectedRoom.value.slug,
    sender: userInfo.value.username,
    type: 'non_typing',
    data: {
      user: userInfo.value
    }
  })
}

const handleMessageCreated = (message) => {
  const lastMessage = messages.value[messages.value.length - 1]
  const isShowMeta = lastMessage ? lastMessage.sender.username !== message.sender.username : true;
  messages.value.push({
    ...message,
    isShowAvatar: isShowMeta,
    isShowName: isShowMeta,
  });
  scrollToBottom();
}

const handleChangeNameGroup = (newName) => {
  roomDetail.value.name = newName;
  emit('on-change-name', roomDetail.value, newName)
}

const handleMessageCreateSuccess = (message) => {
  messages.value = messages.value.map(o => {
    return o.id === message.id ? {
      ...o,
      id: message.realId,
      loading: false
    } : o
  })
  emit('on-message', message)
}

const handleMessageCreateError = (messageId) => {
  messages.value = messages.value.map(o => {
    return o.id === messageId ? {
      ...o,
      loading: false,
      error: true
    } : o
  })
}

watch(selectedRoom, (value, oldValue) => {
  if (oldValue) {
    socket.emit('leaveRoom', {
      room: oldValue.slug
    })
  }
  socket.emit('joinRoom', {
    room: selectedRoom.value.slug
  })
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}, { immediate: true, deep: true })

socket.on('message', (data) => {
  console.log('data mess: ', data);
  if (data.messageId) {
    seenMessagesApi({
      ids: [+data.messageId],
      slugRoom: roomDetail.value.slug
    })
  }
  if (data.isDelete && data.status === 'notification') {
    messageStore.refreshCount()
    return removeGroup()
  }
  if (data.removeUser && data.removeUser.length) {
    if (data.removeUser.includes(userInfo.value.username)) {
      messageStore.refreshCount()
      return removeGroup();
    }
  }
  if (data.sender) {
    const lastMessage = messages.value[messages.value.length - 1]
    const isShowMeta = lastMessage ? lastMessage.sender.username !== data.sender.username : true;
    const messageData = {
      id: +data.messageId,
      content: data.message,
      images: data.images,
      status: data.status,
      createdAt: +dayjs(),
      updatedAt: +dayjs(),
      sender: data.sender,
      seen: [userInfo.value.username],
      isShowAvatar: isShowMeta,
      isShowName: isShowMeta,
    }
    messages.value.push(messageData)
    scrollToBottom();
    emit('on-message', messageData)
    if (data.images && data.images.length && data.status === 'notification') {
      roomDetail.value.background = data.images[0]
    }
    if (data.groupName) {
      handleChangeNameGroup(data.groupName)
    }
  }
})
const typingUsers = ref([]);
socket.on('typing', (data) => {
  if (data.slugRoom === roomDetail.value.slug) {
    if (!data.data.user) return;
    if (data.type === 'typing') {
      typingUsers.value.push(data.data.user)
    }
    if (data.type === 'non_typing') {
      typingUsers.value = typingUsers.value.filter(o => o.username !== data.data.user.username)
    }
  }
})

socket.on('seen', (data) => {
  if (data.slugRoom === selectedRoom.value.slug) {
    messages.value = messages.value.map(o => {
      return data.ids.includes(o.id) ? {
        ...o,
        seen: [data.sender.username, userInfo.value.username]
      } : o
    })
  }
})

const handleMembersAdded = () => {
  scrollToBottom();
}

const leaveGroup = () => {
  emit('on-leave', selectedRoom.value)
}

const removeGroup = () => {
  emit('on-remove', selectedRoom.value)
}

onBeforeUnmount(() => {
  socket.off('message')
  socket.emit('leaveRoom', {
    room: roomDetail.value.slug
  })
  messageStore.refreshCount()
  handleBlurEditor()
})
</script>

<style scoped lang="scss">
.content-chat-wrapper {
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
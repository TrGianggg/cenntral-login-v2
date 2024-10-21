<template>
  <div class="w-full flex lg:flex-row flex-col flex-1 min-h-0 relative overflow-hidden">
    <div class="list-rooms-wrapper shadow-light">
      <div class="lg:h-[123px] h-[45px] flex justify-between lg:items-end items-center px-4">
        <div class=" lg:text-[32px] text-[20px] font-bold leading-none">
          Tin nhắn
        </div>
        <div class="text-neutral-500 cursor-pointer"
             @click="openCreateGroupChatModal">
          <IconNewMessage :size="20"/>
        </div>
      </div>
      <div class="message-actions">
        <div class="p-4">
          <a-input placeholder="Tìm kiếm cuộc hội thoại"
                   v-model:value="search"
                   @press-enter="handleSearchRoom">
            <template #prefix>
              <IconSearch :size="16"/>
            </template>
          </a-input>
        </div>
        <MessageTabs @on-change="handleTabChange"/>
      </div>
      <div class="list-rooms-list flex-1 min-h-0 overflow-auto">
        <div v-if="loading && !rooms.length"
             class="flex flex-col gap-2 mt-4">
          <BaseLoader height="60"/>
          <BaseLoader height="60"/>
          <BaseLoader height="60"/>
        </div>
        <RoomItem v-for="item in rooms"
                  :key="item.slug"
                  :room="item"
                  :selected-room="selectedRoom"
                  @on-leave="handleLeaveGroup"
                  @on-delete="handleDeleteGroup"
                  @on-change-background="handleUpdateBackgroundRoom($event, item)"
                  @on-click="handleJoinRoom" />
        <div v-if="!loading && !rooms.length"
             class="flex flex-col gap-2 mt-4 font-semibold text-center text-no-data">
          Không có dữ liệu
        </div>

        <div v-if="loading && rooms.length"
             class="flex flex-col gap-2 mt-4">
          <BaseLoader height="60"/>
          <BaseLoader height="60"/>
          <BaseLoader height="60"/>
        </div>
        <InfiniteLoading v-if="rooms && rooms.length"
                         class="invisible"
                         @infinite="loadMoreRoom"/>
      </div>
    </div>
    <div class="room-detail-wrapper flex-1 min-w-0"
         :class="{ 'room-detail-wrapper--open': selectedRoom }">
      <DetailMessageChat v-if="selectedRoom"
                         :selectedRoom="selectedRoom"
                         @on-message="handleChangeLastMessage"
                         @on-change-name="handleChangeGroupName"
                         @on-leave="handleLeaveGroup"
                         @on-remove="handleDeleteGroup"
                         @on-close="handleCloseChat"
                         @on-change-background="handleUpdateBackgroundRoom($event, selectedRoom)"/>
      <div v-else class="w-full h-full flex justify-center items-center">
        <div v-if="!loadingRoom"
             class="font-semibold bg-neutral-850-2 px-4 py-2 rounded-xl">
          Chọn một cuộc trò chuyện để bắt đầu nhắn tin
        </div>
      </div>
    </div>
    <CreateGroupChatModal ref="createGroupChatModal"
                          @on-create="handleGroupCreated"/>
  </div>
</template>
<script setup>
import DetailMessageChat from '@/components/message/DetailMessageChat.vue';
import IconNewMessage from '@/components/shared/icons/IconNewMessage.vue';
import IconSearch from '@/components/shared/icons/IconSearch.vue';
import MessageTabs from '@/components/message/MessageTabs.vue';
import RoomItem from "@/components/message/RoomItem.vue";
import {getRoomDetailApi, getRoomsApi} from "@/api/message";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import BaseLoader from "@/components/shared/BaseLoader.vue";
import CreateGroupChatModal from "@/components/message/CreateGroupChatModal.vue";
import {useSocketStore} from "@/stores/socketStore";
import {useMessageStore} from "@/stores/messageStore";
import dayjs from "dayjs";
import InfiniteLoading from "v3-infinite-loading";
import {useRoute, useRouter} from "vue-router";
import {userStore} from "@/stores/userStore";

const route = useRoute();
const messageStore = useMessageStore();
messageStore.getBackgrounds()

const socketStore = useSocketStore()
const socket = computed(() => socketStore.socket).value

const store = userStore()
const userInfo = computed(() => {
  return store.userInfo
})
const selectedTab = ref('');
socket.on('newMessage', (data) => {
  console.log('newMessage: ', data);
  if (data.isDelete && data.status === 'notification') {
    messageStore.refreshCount()
    return handleDeleteGroup({
      slug: data.slugRoom
    });
  }
  if (data.removeUser && data.removeUser.length) {
    messageStore.refreshCount()
    if (data.removeUser.includes(userInfo.value.username)) {
      return handleDeleteGroup({
        slug: data.slugRoom
      });
    }
  }
  const roomToGetMessage = rooms.value.find(o => o.slug === data.slugRoom);
  // nếu room đang có ở giao diện thì sư lại last message
  if (roomToGetMessage) {
    const lastMessage = {
      id: +data.messageId,
      content: data.message,
      images: data.images,
      status: "new",
      createdAt: +dayjs(),
      updatedAt: +dayjs(),
      sender: data.sender,
      seen: [],
    }
    rooms.value = rooms.value.map(o => {
      return o.slug === data.slugRoom ? {
        ...o,
        lastMessage,
        name: data.groupName ? data.groupName : o.name
      } : o
    }).sort((a, b) => b.lastMessage.updatedAt - a.lastMessage.updatedAt);
  } else {
    const query = {
      limit: 15,
    };
    if (selectedTab.value) {
      query.type = selectedTab.value;
    }
    if (search.value) {
      query.search = search.value
    }
    getRoomsApi(query).then(resp => {
      rooms.value = resp.data.data
      afterCursor.value = resp.data.cursor.afterCursor
    })
  }
})

onMounted(() => {
  setTimeout(() => {
    socket.emit('firebase', {
      type: 'leave'
    })
  }, 1000)
  if (route.query && route.query.room) {
    fetchRoomDetail(route.query.room);
  }
})

const loadingRoom = ref(false);
const fetchRoomDetail = (slug) => {
  loadingRoom.value = true;
  getRoomDetailApi({
    slug
  }).then(resp => {
    loadingRoom.value = false;
    selectedRoom.value = resp.data;
  }, () => {
    loadingRoom.value = false;
  })
}

const rooms = ref([])
const afterCursor = ref('')
const loading = ref(false);
const search = ref('')
const fetchListRoom = (type = '') => {
  loading.value = true;
  const query = {
    after: afterCursor.value,
    limit: 15
  };
  if (type) {
    query.type = type;
  }
  if (search.value) {
    query.search = search.value
  }
  getRoomsApi(query).then(resp => {
    loading.value = false;
    rooms.value = [...rooms.value, ...resp.data.data]
    afterCursor.value = resp.data.cursor.afterCursor
  }, () => {
    loading.value = false;
  })
}
fetchListRoom();

const loadMoreRoom = () => {
  if (loading.value || !afterCursor.value) return;
  fetchListRoom()
}

const handleSearchRoom = () => {
  afterCursor.value = '';
  rooms.value = [];
  fetchListRoom()
}

const handleGroupCreated = (room) => {
  if (room.type === 'group') {
    rooms.value.unshift(room);
  } else {
    const exitedRoomIndex = rooms.value.findIndex(o => o.slug === room.slug);
    if (exitedRoomIndex >= 0) {
      const roomMoved = rooms.value.splice(exitedRoomIndex, 1);
      rooms.value.unshift(roomMoved[0]);
    } else {
      rooms.value.unshift(room);
    }
  }
  handleJoinRoom(room);
}

const handleTabChange = (tab) => {
  rooms.value = [];
  afterCursor.value = '';
  selectedTab.value = tab.value;
  fetchListRoom(tab.value);
}

const selectedRoom = ref(null);
const router = useRouter();
const handleJoinRoom = (room) => {
  selectedRoom.value = room;
  router.push({
    query: {}
  })
}

const handleCloseChat = () => {
  selectedRoom.value = null;
}

const createGroupChatModal = ref(null);
const openCreateGroupChatModal = () => {
  createGroupChatModal.value.open();
}

const handleChangeGroupName = (room, newName) => {
  rooms.value = rooms.value.map(o => {
    return room.slug === o.slug ? {
      ...o,
      name: newName
    } : o
  })
}

const handleChangeLastMessage = (messageData) => {
  rooms.value = rooms.value.map(o => {
    return selectedRoom.value.slug === o.slug ? {
      ...o,
      lastMessage: messageData
    } : o
  }).sort((a, b) => {
    if (b.lastMessage && a.lastMessage) {
      return b.lastMessage.updatedAt - a.lastMessage.updatedAt
    }
    return 1
  });
}

const handleLeaveGroup = (room) => {
  if (selectedRoom.value && room.slug === selectedRoom.value.slug) {
    selectedRoom.value = null;
  }
  rooms.value = rooms.value.filter(o => o.slug !== room.slug)
}

const handleDeleteGroup = (room) => {
  if (selectedRoom.value && room.slug === selectedRoom.value.slug) {
    selectedRoom.value = null;
  }
  rooms.value = rooms.value.filter(o => o.slug !== room.slug)
}

const handleUpdateBackgroundRoom = (imageUrl, room) => {
  rooms.value = rooms.value.map(o => {
    return room.slug === o.slug ? {
      ...o,
      background: imageUrl
    } : o
  })
}

onBeforeUnmount(() => {
  socket.emit('firebase', {
    type: 'join'
  })
  socket.off('newMessage')
})
</script>

<style lang="scss">
.message-actions {
  .ant-input-prefix {
    margin-right: 12px
  }
}
.dark-theme {
  .message-actions {
    .ant-input-prefix {
      color: white;
    }
  }
}
.list-rooms-wrapper {
  width: 345px;
  display: flex;
  flex-direction: column;

  .ant-input-affix-wrapper {
    border-radius: 999px !important;
    padding: 0 16px !important;

    .ant-input {
      font-size: 16px;
    }
  }
}
@media (max-width: 1024px) {
  .list-rooms-wrapper {
    width: 100%;
    flex: 1;
    min-height: 1px;
  }
  .room-detail-wrapper {
    position: absolute;
    z-index: 999;
    //left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: calc(var(--vw, 1vw) * 100);
    //top: 0;
    //bottom: 0;
    //pointer-events: none;
    transform: translateX(100%);
    transition: .3s;
    background: var(--neutral-900);
    &--open {
      //pointer-events: auto;
      transform: translateX(0);
    }
  }
}
</style>

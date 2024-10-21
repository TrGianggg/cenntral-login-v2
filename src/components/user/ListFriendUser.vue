<template>
  <div class="py-4 lg:px-0">
    <div v-if="loading && friendList.length === 0"
         class="grid sm:grid-cols-2 grid-cols-1 gap-4">
      <BaseLoader height="80"/>
      <BaseLoader height="80"/>
    </div>
    <div class="friend-list-container grid sm:grid-cols-2 grid-cols-1 gap-4">
      <FriendCard v-for="(item, index) in friendList"
                  :key="index"
                  :friend="item">
      </FriendCard>
      <div v-if="!loading && friendList.length === 0"
           class="text-white">
        <span>Không có bạn bè</span>
      </div>
    </div>
    <div v-if="afterCursor && !loading"
         class="py-4 text-center text-primary-color hover:underline cursor-pointer"
         @click="fetchListFriend">
      Xem thêm
    </div>
    <div v-if="loading && friendList.length > 0"
         class="grid sm:grid-cols-2 grid-cols-1 gap-4">
      <BaseLoader height="80"/>
      <BaseLoader height="80"/>
    </div>
  </div>
</template>
<script setup>
import {ref, watch} from "vue";
import {addFriendApi, getMyFriendsApi, getUserFriendsApi} from "@/api/friend";
import BaseLoader from "@/components/shared/BaseLoader.vue";
import FriendCard from '@/components/user/FriendCard.vue'
import {useRoute} from "vue-router";
import {useUserProfile} from "@/components/hooks/useUserProfile";
const { isMe } = useUserProfile()
const route = useRoute();
const friendList = ref([]);
const loading = ref(false);
const afterCursor = ref('')
const fetchListFriend = (search = '') => {
  loading.value = true;
  const query = {
    status: 'accept',
    limit: 30,
    after: afterCursor.value
  }
  if (search) {
    query.search = search
  }
  const API = isMe.value ? getMyFriendsApi(query) : getUserFriendsApi({
    ...query,
    username: route.params.username
  })
  API.then(resp => {
    afterCursor.value = resp.cursor.afterCursor;
    loading.value = false;
    const results = resp.data.map(o => {
      return {
        ...o,
        user1: {
          ...o.user1,
          statusFriend: isMe.value ? 'accept' : o.user1.statusFriend || 'accept'
        }
      }
    });
    friendList.value = [...friendList.value, ...results]
  }, () => {
    loading.value = false;
  })
}

watch(route , (from, to) => {
  fetchListFriend();
}, { immediate: true })

const searchFriend = (searchValue = '') => {
  friendList.value = []
  fetchListFriend(searchValue)
}
defineExpose({
  searchFriend
})
</script>

<style lang="scss">
.friend-card {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 1rem;
}
</style>
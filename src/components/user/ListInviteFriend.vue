<template>
  <div class="py-4 px-4 lg:px-0">
    <div v-if="loading && inviteList.length === 0"
         class="flex gap-3">
      <BaseLoader height="80"/>
      <BaseLoader height="80"/>
    </div>
    <div class="invite-list gap-3">
      <div v-for="(item, index) in inviteList"
           :key="index"
           class="invite-card border rounded-2xl overflow-hidden">
        <img :src="item.user1.profileImage || '/default-avatar.png'"
             class="w-full h-48 object-cover"
             alt="">
        <div class="flex flex-col gap-3 p-3">
          <div class="text-white font-semibold hover:underline hover:text-white cursor-pointer"
               @click="goUserProfilePage(item)">
            {{ getFullNameUser(item.user1) }}
          </div>
          <div v-if="item.reject"
               class="flex flex-col gap-3">
            <a-button size="small"
                      class="invisible"
                      disabled>
              <span>-</span>
            </a-button>
            <a-button v-if="item.reject"
                      size="small"
                      disabled>
              <span>Đã xoá yêu cầu</span>
            </a-button>
          </div>
          <div v-else
               class="flex flex-col gap-3 w-full">
            <a-button v-if="item.isFriend"
                      size="small">
              <div class="flex gap-2 items-center justify-center">
                <CheckOutlined />
                <span>Bạn bè</span>
              </div>
            </a-button>
            <a-button v-else
                      type="primary"
                      size="small"
                      @click="acceptFriend(item)">
              Xác nhận
            </a-button>
            <a-button v-if="!item.isFriend"
                      size="small"
                      type="only-border"
                      @click="rejectFriend(item)">
              Xoá
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="afterCursor && !loading"
         class="py-4 text-center text-primary-color hover:underline cursor-pointer"
         @click="fetchListInvite">
      Xem thêm
    </div>
    <div v-if="loading && inviteList.length > 0"
         class="flex gap-3">
      <BaseLoader height="80"/>
      <BaseLoader height="80"/>
    </div>
    <div v-if="!loading && inviteList.length === 0"
         class="text-white">
      <span>Không có lời mời</span>
    </div>
  </div>
</template>
<script setup>
import {getFullNameUser} from "@/helper/ultil";
import {CheckOutlined} from "@ant-design/icons-vue";
import {ref} from "vue";
import {acceptFriendsApi, getFriendsApi, rejectFriendsApi} from "@/api/friend";
import BaseLoader from '@/components/shared/BaseLoader.vue';

const inviteList = ref([]);
const loading = ref(false);
const afterCursor = ref('')
const fetchListInvite = (search = '') => {
  loading.value = true;
  getFriendsApi({
    status: 'pending',
    after: afterCursor.value,
    limit: 30,
    search
  }).then(resp => {
    afterCursor.value = resp.cursor.afterCursor;
    loading.value = false;
    const results = resp.data.map(o => {
      return {
        ...o,
        isFriend: false,
        reject: false,
      }
    });
    loading.value = false;
    inviteList.value = [...inviteList.value, ...results]
  }, () => {
    loading.value = false;
  })
}
fetchListInvite();
const acceptFriend = (item) => {
  item.isFriend = true;
  acceptFriendsApi({
    slug: item.user1.slug
  }).then(() => {})
}

const rejectFriend = (item) => {
  item.reject = true;
  rejectFriendsApi({
    slug: item.user1.slug
  }).then(() => {})
}

const goUserProfilePage = (item) => {
  window.open(`/${item.user1.username}`)
}

const searchInvite = (searchValue = '') => {
  inviteList.value = [];
  fetchListInvite(searchValue);
}
defineExpose({
  searchInvite
})
</script>

<style lang="scss">
.invite-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.invite-card {
  display: flex;
  flex-direction: column;
  //max-width: 200px;
  width: 100%;
}
@media (max-width: 768px) {
  .invite-list {
    display: grid;
    grid-template-columns: 1fr;
    .invite-card {
      max-width: 100%;
    }
  }
}
</style>
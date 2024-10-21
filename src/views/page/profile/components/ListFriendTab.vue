<template>
  <div class="max-w-1244 bg-neutral-850 rounded-xl p-4 shadow-light border-light md:mx-0 mx-4 mb-4">
    <div class="justify-between items-center md:flex hidden">
      <span class="font-bold">Bạn bè</span>
      <a-input v-model:value="searchValue"
               placeholder="Tìm kiếm"
               style="max-width: 200px"
               @press-enter="handleSearch"
               class="cs-input-search">
        <template #prefix>
          <div class="text-white flex items-center">
            <SearchOutlined />
          </div>
        </template>
      </a-input>
    </div>
    <div class="flex gap-4 font-bold md:my-2 mb-4">
      <div v-for="item in tabs"
           :key="item.value"
           :class="{ 'text-gold-150-1 cs-tab-item-active': item.value === currentTab }"
           class="cursor-pointer cs-tab-item leading-none"
           @click="changeTab(item.value)">
        {{ item.label }}
      </div>
    </div>
    <div class="md:hidden block">
      <a-input v-model:value="searchValue"
               placeholder="Tìm kiếm"
               @press-enter="handleSearch"
               class="cs-input-search">
        <template #prefix>
          <div class="text-white flex items-center">
            <SearchOutlined />
          </div>
        </template>
      </a-input>
    </div>
    <ListInviteFriend v-if="currentTab === 'invite'"
                      ref="inviteList"/>
    <ListFriendUser v-if="currentTab === 'friend'"
                    ref="friendList"/>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import ListInviteFriend from '@/components/user/ListInviteFriend.vue';
import ListFriendUser from '@/components/user/ListFriendUser.vue';
import { SearchOutlined } from '@ant-design/icons-vue'
import {useUserProfile} from "@/components/hooks/useUserProfile";
const { isMe } = useUserProfile()
const tabs = computed(() => {
  const tabList = [
    { value: 'friend', label: 'Tất cả bạn bè' },
    { value: 'invite', label: 'Lời mời kết bạn' },
  ]
  if (isMe.value) {
    return tabList
  }
  return tabList.filter(o => o.value !== 'invite')
})
const currentTab = ref('friend')
const changeTab = (tab) => {
  currentTab.value = tab
}

const searchValue = ref('');
const friendList = ref(null)
const inviteList = ref(null)
const handleSearch = () => {
  if (friendList.value) {
    friendList.value.searchFriend(searchValue.value)
  }
  if (inviteList.value) {
    inviteList.value.searchInvite(searchValue.value)
  }
}

</script>

<style lang="scss">
@import "@/design/variable";
.cs-tab-item {
  position: relative;
  height: 36px;
  &.cs-tab-item-active {
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--gold-150-1);
    }
  }
}
@media (max-width: 768px) {
  .cs-tab-item {
    background: var(--bg-input);
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-radius: 999px;
    font-weight: 500;
    &:before {
      display: none;
    }
  }
  .light-theme {
    .cs-tab-item {
      &.cs-tab-item-active {
        background: var(--gold-100);
      }
    }
  }
}
</style>
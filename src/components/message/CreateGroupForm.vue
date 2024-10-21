<template>
  <div>
    <div class="py-5 px-6"
         :class="{'border-b-thin': isBorder}">
      <a-input v-model:value="searchValue"
               placeholder="Tìm kiếm mọi người"
               @press-enter="handleSearchFriend"
               class="cs-input-search cs-input-search-white">
        <template #prefix>
          <IconSearch :size="16"/>
        </template>
      </a-input>
      <div v-if="selectedUsers && selectedUsers.length"
           class="flex gap-2 items-center flex-wrap pt-3">
        <div v-for="(user, index) in selectedUsers"
             :key="user.slug"
             class="flex items-center gap-2 border rounded-full px-2 py-1">
          <AvatarUser :size="24" :src="user.profileImage"/>
          <span class="font-semibold">
            {{ getFullNameUser(user) }}
          </span>
          <div class="text-neutral-200 hover:text-white cursor-pointer"
               @click="handleRemoveSelectedUser(index)">
            <IconClose :size="14"/>
          </div>
        </div>
      </div>
    </div>
    <div class="list-friend flex flex-col gap-2 py-5">
      <div v-if="loading"
           class="flex flex-col gap-2 px-6">
        <BaseLoader height="48"/>
        <BaseLoader height="48"/>
        <BaseLoader height="48"/>
        <BaseLoader height="48"/>
      </div>
      <div v-if="!loading && !friendList.length"
           class="text-no-data text-center font-semibold">
        Không có dữ liệu
      </div>
      <div v-if="!loading"
           class="flex flex-col gap-2">
        <div v-if="isShowLabelList && friendList.length"
             class="font-bold px-6 pb-1">Gợi ý</div>
        <div v-for="(item, index) in friendList"
             :key="index"
             class="user-item flex gap-2.5 items-center py-1 px-6 cursor-pointer"
             @click="handleSelectUser(item)">
          <AvatarUser :size="40"
                      :src="item.user1.profileImage"/>
          <div class="flex justify-between items-center gap-4 flex-1 min-w-0">
            <div class="flex flex-col">
              <div class="font-semibold text-[14px]">
                {{ getFullNameUser(item.user1) }}
              </div>
              <div class="text-[12px]">@{{ item.user1.username }}</div>
            </div>
            <a-checkbox :checked="isCheckedUser(item)" disabled/>
          </div>
        </div>
      </div>
    </div>
    <div class="flex py-4 px-6 "
         :class="[
             isAddMember ? 'justify-center' : 'justify-end',
             {'border-t-thin': isBorder}
         ]">
      <a-button size="middle"
                :disabled="isDisableSubmitBtn"
                type="primary"
                :loading="loadingCreate"
                @click="handleCreateGroup">
        {{ isAddMember ? 'Thêm thành viên' : createBtnLabel }}
      </a-button>
    </div>
  </div>
</template>
<script setup>
import {computed, ref, toRefs} from "vue";
import IconSearch from "@/components/shared/icons/IconSearch.vue";
import IconClose from "@/components/shared/icons/IconClose.vue";
import {getMyFriendsApi} from "@/api/friend";
import AvatarUser from "@/components/shared/AvatarUser.vue";
import {getFullNameUser} from "@/helper/ultil";
import BaseLoader from "@/components/shared/BaseLoader.vue";
import {addRoomMemberApi, createRoomApi, getRoomMemberRecommendApi} from "@/api/message";
import {userStore} from "@/stores/userStore";

const emit = defineEmits(['on-create'])
const props = defineProps({
  isAddMember: {
    type: Boolean,
    default: false
  },
  room: {
    type: Object,
    default() {
      return {}
    }
  },
  isBorder: {
    type: Boolean,
    default: true
  },
  isShowLabelList: {
    type: Boolean,
    default: false
  }
})
const { isAddMember, room } = toRefs(props)
const searchValue = ref('')
const userInfo = computed(() => {
  return userStore().userInfo
})

const afterCursor = ref('');
const friendList = ref([]);
const loading = ref(false);
const fetchListFriend = (search = '') => {
  loading.value = true;
  if (isAddMember.value) {
    return fetchRecommendFriend(search)
  }
  const query = {
    status: 'accept',
  }
  if (search) {
    query.search = search
  }
  getMyFriendsApi(query).then(resp => {
    loading.value = false;
    friendList.value = resp.data
  }, () => {
    loading.value = false;
  })
}

const fetchRecommendFriend = (search) => {
  loading.value = true;
  const query = {
    slug: room.value.slug
  }
  if (search) {
    query.search = search
  }
  getRoomMemberRecommendApi(query).then(resp => {
    console.log('resp.data: ', resp.data);
    loading.value = false;
    friendList.value = resp.data.data
  }, () => {
    loading.value = false;
  })
}

const handleSearchFriend = () => {
  fetchListFriend(searchValue.value)
}

const selectedUsers = ref([]);
const handleSelectUser = (data) => {
  const existUser = selectedUsers.value.find(o => o.username === data.user1.username);
  if (existUser) {
    selectedUsers.value = selectedUsers.value.filter(o => o.username !== data.user1.username);
  } else {
    selectedUsers.value.push(data.user1)
  }
}

const isCheckedUser = (user) => {
  const existUser = selectedUsers.value.find(o => o.username === user.user1.username);
  return !!existUser;
}

const isCreateGroup = computed(() => {
  return selectedUsers.value.length > 1
})
const createBtnLabel = computed(() => {
  return isCreateGroup.value ? 'Tạo nhóm' : 'Tạo tin nhắn'
})

const isDisableSubmitBtn = computed(() => {
  return selectedUsers && selectedUsers.value.length < 1;
})

const generateGroupName = () => {
  const users = [...selectedUsers.value]
  const first2Users = users.splice(0, 2);
  let name = '';
  first2Users.forEach(u => {
    if (u.lastName) {
      name += `, ${u.lastName}`
    }
  })
  return `${userInfo.value.lastName}${name}`
}

const loadingCreate = ref(false)
const handleCreateGroup = () => {
  loadingCreate.value = true;
  if (isAddMember.value) {
    return addMembersToGroup()
  }
  const groupName = isCreateGroup.value ? generateGroupName() : getFullNameUser(selectedUsers.value[0]);
  const type = isCreateGroup.value ? 'group' : 'chat'
  const data = {
    username: selectedUsers.value.map(o => o.username),
    name: groupName,
    type : type
  };
  createRoomApi(data).then(roomData => {
    loadingCreate.value = false;
    console.log('createRoomApi: ', roomData);
    emit('on-create', {
      ...roomData,
      roomMaster: userInfo.value,
      toUser: selectedUsers.value[0]
    });
  }, () => {
    loadingCreate.value = false;
  })
}

const addMembersToGroup = () => {
  addRoomMemberApi({
    slug: room.value.slug,
    usernames: selectedUsers.value.map(o => o.username)
  }).then(() => {
    emit('on-create', selectedUsers.value);
  })
}

const handleRemoveSelectedUser = (index) => {
  selectedUsers.value.splice(index, 1)
}

const init = () => {
  fetchListFriend()
}

const clearData = () => {
  afterCursor.value = '';
  friendList.value = [];
  searchValue.value = '';
  loading.value = false;
  selectedUsers.value = [];
}

defineExpose({
  init,
  clearData
})

</script>

<style lang="scss">
.user-item {
  &:hover {
    background: var(--bg-select-hover);
  }
}
.list-friend {
  max-height: 350px;
  overflow: auto;
}
</style>
<template>
  <a-modal wrapClassName="cs-modal no-padding-modal"
           :footer="null"
           :width="500"
           centered
           :after-close="clearData"
           v-model:visible="isOpenModal">
    <template #title>
      <div class="flex items-center gap-2">
        <IconGroupOutline/>
        <span class="leading-none">Thành viên</span>
      </div>
    </template>
    <div>
      <div v-if="isRoomMaster"
           class="flex flex-row justify-between select-none w-full lg:mx-0 px-6">
        <div
            v-for="tab in listTab"
            :key="tab.value"
            :class="[
              'px-3 md:px-4 cursor-pointer py-4 border-b-2 border-solid relative flex-1 flex justify-center',
              activeTab === tab.value
                ? 'border-white text-white'
                : 'border-transparent'
            ]"
            @click="handleSelectTab(tab)"
        >
          <div class="text-[14px] flex items-center gap-2">
            <span :class="{'font-bold': activeTab === tab.value}">
              {{ tab.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'ALL'">
      <div class="px-6 py-5 flex flex-col gap-4 max-h-[400px] overflow-auto">
        <div v-if="loading && members.length === 0"
             class="flex flex-col gap-4">
          <BaseLoader height="40"/>
          <BaseLoader height="40"/>
          <BaseLoader height="40"/>
        </div>
        <MemberItem v-for="member in members"
                    :key="member.username"
                    :room="roomDetail"
                    :member="member"
                    @on-change-master="handleChangeMaster"
                    @on-remove="handleRemoveMember"/>
        <div v-if="loading && members.length > 0"
             class="flex flex-col gap-4">
          <BaseLoader height="40"/>
          <BaseLoader height="40"/>
          <BaseLoader height="40"/>
        </div>
        <InfiniteLoading v-if="members && members.length"
                         class="invisible"
                         @infinite="loadMoreMember"/>
      </div>
    </div>
    <CreateGroupForm v-if="activeTab === 'addMember'"
                     ref="addMemberForm"
                     :room="roomDetail"
                     :isAddMember="true"
                     :is-border="false"
                     :isShowLabelList="true"
                     @on-create="handleAddMember"/>
  </a-modal>
</template>

<script setup>
import {computed, nextTick, ref} from "vue";
import IconGroupOutline from '@/components/shared/icons/IconGroupOutline.vue'
import {getRoomMemberApi, removeRoomMemberApi} from "@/api/message";
import {userStore} from "@/stores/userStore";
import MemberItem from "@/components/message/member/MemberItem.vue";
import CreateGroupForm from "@/components/message/CreateGroupForm.vue";
import BaseLoader from "@/components/shared/BaseLoader.vue";
import InfiniteLoading from "v3-infinite-loading";

const emit = defineEmits(['on-leave', 'on-add-members', 'on-change-master'])

const isOpenModal = ref(false)
const userInfo = computed(() => {
  return userStore().userInfo
})

const addMemberForm = ref(null)
const activeTab = ref('ALL')
const countData = ref({})
const listTab = computed(() => {
  return [
    {
      value: 'ALL',
      label: 'Tất cả'
    },
    {
      value: 'addMember',
      label: 'Thêm thành viên'
    },
  ]
})

const isRoomMaster = computed(() => {
  if ( userInfo.value && roomDetail.value && roomDetail.value.roomMaster) {
    return userInfo.value.username === roomDetail.value.roomMaster.username;
  }
  return false
})

const handleSelectTab = (tab) => {
  activeTab.value = tab.value;
  if (tab.value === 'addMember') {
    nextTick(() => {
      addMemberForm.value.init();
    })
  } else {
    // nextTick(() => {
    //   addMemberForm.value.init();
    // })
  }
}

const members = ref([]);
const roomDetail = ref(null)
const open = (room) => {
  isOpenModal.value = true;
  roomDetail.value = room;
  fetchMembers();
}

const afterCursor = ref('');
const loading = ref(false);
const fetchMembers = () => {
  loading.value = true;
  const query = {
    slug: roomDetail.value.slug,
    limit: 15,
    after: afterCursor.value
  }
  getRoomMemberApi(query).then(resp => {
    loading.value = false;
    afterCursor.value = resp.data.cursor.afterCursor;
    members.value = [...members.value, ...resp.data.data];
  }, () => {
    loading.value = false;
  })
}

const loadMoreMember = () => {
  if (loading.value || !afterCursor.value) return;
  fetchMembers()
}

const clearData = () => {
  afterCursor.value = '';
  members.value = [];
  activeTab.value = 'ALL';
}

const close = () => {
  isOpenModal.value = false;
}
const handleRemoveMember = (memberRemoved) => {
  members.value = members.value.filter(o => o.username !== memberRemoved.username)
}

const handleChangeMaster = (newMaster) => {
  emit('on-change-master', newMaster);
}

const handleAddMember = (members) => {
  emit('on-add-members', members);
  close()
}

defineExpose({
  open
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
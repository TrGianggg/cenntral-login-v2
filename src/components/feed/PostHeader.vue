<template>
  <div class="w-full">
    <div class="post-card-header w-full flex gap-5">
      <router-link
        :to="{
          name: 'ProfileUser',
          params: {
            username: getUserUrl()
          }
        }"
        class="md:hidden block"
        :class="{ '!block 123': isShowAvatar }"
      >
        <AvatarUser
          :src="postUser.profileImage"
          :size="40"
        />
      </router-link>
      <div class="flex gap-2 items-center flex-1 min-w-0 justify-between">
        <div class="flex md:flex-row flex-col md:gap-2 md:w-max w-full md:items-center">
          <router-link
            :to="{
              name: 'ProfileUser',
              params: {
                username: getUserUrl()
              }
            }"
            class="text-white font-bold min-w-0 hover:text-white hover:underline"
          >
            {{ getFullNameUser(postUser) }}
          </router-link>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="flex gap-2 text-neutral-200">
              <span> @{{ postUser.username }} </span>
              <span>·</span>
              <router-link
                :to="{
                  name: 'PostDetail',
                  params: {
                    slug: postDetail.slug
                  }
                }"
                class="text-neutral-200 hover:text-neutral-200 hover:underline"
              >
                <span :title="formatFullTime(postDetail.createdAt)">
                  {{ timePostAgo(postDetail.createdAt) }}
                </span>
              </router-link>
            </span>
            <div class="text-neutral-200">
              <IconFriendsOnly
                v-if="postDetail.privacy === 'friends_only'"
                :width="16"
              />
              <IconPublic
                v-if="postDetail.privacy === 'public'"
                :width="16"
              />
              <IconPrivate
                v-if="postDetail.privacy === 'only_me'"
                :width="16"
              />
            </div>
            <div
              v-if="postDetail.isEdited"
              class="text-xs"
            >
              Đã chỉnh sửa
            </div>
          </div>
        </div>
        <a-popover
          v-if="isMe && isShowActions"
          trigger="click"
          v-model:visible="isOpenPopup"
          placement="topRight"
          overlayClassName="cs-popup"
        >
          <template #content>
            <div class="py-2">
              <div
                class="select-item flex gap-2 items-center min-w-[200px]"
                @click="openUpdatePostModal"
              >
                <IconEdit />
                <span>Chỉnh sửa</span>
              </div>
              <div
                class="select-item flex gap-2 items-center min-w-[200px]"
                @click="openConfirmDeleteModal"
              >
                <IconDelete />
                <span>Xoá bài viết</span>
              </div>
            </div>
          </template>
          <HoverBox
            class="more-post-icon rotate-90"
            @click="isOpenPopup = true"
            :size="24"
          >
            <MoreOutlined />
          </HoverBox>
        </a-popover>
      </div>
      <UpdatePostModal ref="updatePostModal" />
      <a-modal
        wrapClassName="cs-modal delete-post-modal"
        :footer="null"
        :width="400"
        v-model:visible="isOpenDeleteModal"
      >
        <div class="text-white text-center">
          Bài viết này sẽ bị xoá vĩnh viễn sau khi bạn xác nhận?
        </div>
        <div class="mt-4 flex justify-center gap-4">
          <a-button
            size="small"
            type="only-border"
            style="width: 130px"
            @click="isOpenDeleteModal = false"
          >
            Huỷ
          </a-button>
          <a-button
            type="primary"
            size="small"
            style="width: 130px; padding: 0 24px !important;"
            @click="deletePost"
          >
            Xác nhận
          </a-button>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script setup>
import { formatFullTime, getFullNameUser, timePostAgo } from '@/helper/ultil'
import IconFriendsOnly from '@/components/shared/icons/IconFriendsOnly.vue'
import IconPublic from '@/components/shared/icons/IconPublic.vue'
import IconPrivate from '@/components/shared/icons/IconPrivate.vue'
import AvatarUser from '@/components/shared/AvatarUser.vue'
import UpdatePostModal from '@/components/feed/UpdatePostModal.vue'
import { computed, ref, toRefs } from 'vue'
import { userStore } from '@/stores/userStore'
import { MoreOutlined } from '@ant-design/icons-vue'
import { removePostApi } from '@/api/post'
import IconEdit from '@/components/shared/icons/IconEdit.vue'
import IconDelete from '@/components/shared/icons/IconDelete.vue'
import HoverBox from '@/components/shared/HoverBox.vue'

const props = defineProps({
  postUser: {
    type: Object
  },
  postDetail: {
    type: Object
  },
  isShowActions: {
    type: Boolean,
    default: true
  },
  isShowAvatar: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['emit'])
const { postUser, postDetail } = toRefs(props)

const updatePostModal = ref(null)

const getUserUrl = () => {
  if (postUser.value && postUser.value.username) {
    return postUser.value.username
  }
  return '-'
}
const userInfo = computed(() => {
  return userStore().userInfo
})
const isMe = computed(() => {
  return userInfo.value && userInfo.value.email === postUser.value.email
})
const isOpenPopup = ref(false)
const openUpdatePostModal = () => {
  isOpenPopup.value = false
  updatePostModal.value.open(postDetail.value)
}

const isOpenDeleteModal = ref(false)
const openConfirmDeleteModal = () => {
  isOpenPopup.value = false
  isOpenDeleteModal.value = true
}

const loadingDelete = ref(false)
const deletePost = () => {
  loadingDelete.value = true
  removePostApi({
    slug: postDetail.value.slug
  }).then(
    () => {
      isOpenDeleteModal.value = false
      loadingDelete.value = false
      emit('on-delete')
    },
    () => {
      loadingDelete.value = false
    }
  )
}
</script>

<style lang="scss">
@import '@/design/variable';
.more-post-icon {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: $neutral-600;
  }
}
</style>

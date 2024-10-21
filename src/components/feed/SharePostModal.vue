<template>
  <a-modal
      wrapClassName="cs-modal"
      :footer="null"
      :width="650"
      centered
      v-model:visible="isOpenModal"
      :destroy-on-close="true"
  >
    <div class="flex items-start gap-5 create-post-form">
      <AvatarUser
          v-if="userInfo"
          :src="userInfo.profileImage"
          :size="44"
      />
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <a-select ref="select"
            v-model:value="privacy"
            style="width: 120px"
        >
          <a-select-option
              v-for="item in privacyList"
              :value="item.value"
              :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <CreatePostEditor v-model="postContent" />
      </div>
    </div>
    <div class="px-4 py-1 border rounded-xl">
      <PostCard :post="{ post: postToShare }" :is-show-actions="false"/>
    </div>
    <a-button block
              type="primary"
              class="mt-4"
              :loading="loading"
              @click="sharePost">
      Chia sẻ
    </a-button>
  </a-modal>
</template>
<script setup>
import {computed, ref} from "vue";
import PostCard from '@/components/feed/PostCard.vue';
import CreatePostEditor from "@/components/feed/CreatePostEditor.vue";
import AvatarUser from "@/components/shared/AvatarUser.vue";
import {userStore} from "@/stores/userStore";
import {PRIVACY_LIST} from "@/helper/const";
import {sharePostApi} from "@/api/post";
import {message} from "ant-design-vue";
const emit = defineEmits(['on-share'])
const store = userStore()
const userInfo = computed(() => store.userInfo)
const isOpenModal = ref(false)

const privacy = ref('public')
const postContent = ref('')
const privacyList = PRIVACY_LIST;

const postDetail = ref(null)
const open = (postData) => {
  isOpenModal.value = true;
  postDetail.value = postData
}

const postToShare = computed(() => {
  if (postDetail.value) {
    return postDetail.value.postShare ? postDetail.value.postShare : postDetail.value;
  }
  return {}
})

const loading = ref(false);
const sharePost = () => {
  loading.value = true;
  const slug = postDetail.value.postShare ? postDetail.value.postShare.slug : postDetail.value.slug;
  const data = {
    slug,
    privacy: privacy.value,
  }
  if (postContent.value) {
    data.content = postContent.value
  }
  sharePostApi(data).then((postShared) => {
    loading.value = false;
    message.info('Chia sẻ bài viết thành công')
    emit('on-share', postShared.slug)
    isOpenModal.value = false;
  }, (error) => {
    loading.value = false;
    if (error && error.message && error.statusCode !== 403) {
      message.error(error.message)
    }
  })
}
defineExpose({
  open
})
</script>
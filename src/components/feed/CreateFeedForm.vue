<template>
  <div
    class="create-post-form"
    @click="isShowPrivacy = true"
  >
    <div class="flex items-start gap-5">
      <AvatarUser
        v-if="userInfo"
        :src="userInfo.profileImage"
        :size="44"
      />
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <a-select
          v-if="isShowPrivacy"
          ref="select"
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
    <PostShareContent
      v-if="postDetail && postDetail.postShare"
      :post="{ post: postDetail.postShare }"
    />
    <ContentLockPost
      v-if="postDetail && postDetail.lockViewShare"
      class="my-0"
    />
    <div
      class="flex justify-between pt-4 gap-5"
      :class="{ 'border-t mt-4': isModal }"
    >
      <AvatarUser
        :size="44"
        class="invisible md:block"
      />
      <div class="flex flex-col flex-1 min-w-0">
        <div
          v-if="images && images.length"
          class="h-[320px] mb-3"
        >
          <PostGridImages
            :items="images"
            :is-open-modal="false"
            is-remove-image
            @on-remove="handleRemoveImage"
          />
        </div>
        <div class="flex items-center justify-between flex-1 min-w-0">
          <label
            v-if="(postDetail && !postDetail.postShare && !postDetail.lockViewShare) || !postDetail"
            :for="idFile"
            class="cursor-pointer text-primary-color"
          >
            <IconChoseImage />
          </label>
          <label v-else></label>
          <input
            type="file"
            :id="idFile"
            class="input-file"
            multiple
            @change="handleFilesChange"
            :accept="getAcceptFileExt()"
          />
          <a-button
            type="primary"
            size="small"
            shape="round"
            :loading="loading"
            :disabled="isDisabledSubmitBtn"
            @click="isUpdate ? updatePost() : createPost()"
          >
            {{ isUpdate ? 'Chỉnh sửa' : $t('common.post') }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostGridImages from '@/components/feed/PostGridImages.vue'
import ContentLockPost from '@/components/feed/ContentLockPost.vue'
import { createPostApi, getDetailPostApi, updatePostApi } from '@/api/post'
import { message } from 'ant-design-vue'
import { getAcceptFileExt, getFileExtension } from '@/helper/ultil'
import AvatarUser from '@/components/shared/AvatarUser.vue'
import PostShareContent from '@/components/feed/PostShareContent.vue'
import { userStore } from '@/stores/userStore'
import { computed } from 'vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import CreatePostEditor from '@/components/feed/CreatePostEditor.vue'
import dayjs from 'dayjs'
import { PRIVACY_LIST, SUPPORTED_EXTENSIONS } from '@/helper/const'
import IconPrivate from '@/components/shared/icons/IconPrivate.vue'
import IconChoseImage from '@/components/shared/icons/IconChoseImage.vue'
export default {
  setup() {
    const store = userStore()
    const userInfo = computed(() => store.userInfo)
    return {
      userInfo
    }
  },

  props: {
    idFile: {
      type: String,
      default: 'file'
    },
    isModal: {
      type: Boolean,
      default: false
    },
    postDetail: {
      type: Object,
      default() {
        return null
      }
    },
    imageFileProp: {
      type: Array,
      default: []
    }
  },

  components: {
    ContentLockPost,
    IconPrivate,
    PostGridImages,
    AvatarUser,
    CreatePostEditor,
    PostShareContent,
    IconChoseImage
  },

  created() {
    if (this.postDetail) {
      this.isShowPrivacy = true
      this.privacy = this.postDetail.privacy
      this.postContent = this.postDetail.content
      const imageUrls = this.postDetail.images.map((o) => o.url)
      this.urlsToFiles(imageUrls).then((files) => {
        this.files = files
      })
    }
  },

  watch: {
    imageFileProp: {
      immediate: true,
      handler(val) {
        this.files = [...this.files, ...val]
      }
    }
  },
  data() {
    return {
      postContent: '',
      isShowPrivacy: false,
      privacy: 'public',
      privacyList: PRIVACY_LIST,
      files: [],
      loading: false
    }
  },

  computed: {
    isDisabledSubmitBtn() {
      if (this.postDetail && this.postDetail.postShare) {
        return false
      }
      return (this.postContent === '' || this.postContent === '<p></p>') && !this.files.length
    },

    isUpdate() {
      return this.postDetail
    },

    images() {
      const urls = []
      this.files.forEach((file) => {
        const url = URL.createObjectURL(file)
        urls.push(url)
      })
      return urls
    }
  },

  methods: {
    getAcceptFileExt,
    createPost() {
      this.loading = true
      const formData = new FormData()
      formData.append('content', this.postContent)
      formData.append('privacy', this.privacy)
      this.files.forEach((file) => {
        formData.append('files', file)
      })
      createPostApi(formData).then(
        (resp) => {
          this.getDetailPost(resp)
          message.success('Bạn đã đăng bài viết thành công!')
        },
        (error) => {
          this.loading = false
          if (error && error.message && error.statusCode !== 403) {
            message.error(error.message)
          }
        }
      )
    },

    urlsToFiles(urls) {
      const promises = urls.map((url) => {
        return fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            const filename = url.substring(url.lastIndexOf('/') + 1)
            return new File([blob], filename, { type: 'image/jpeg' })
          })
      })

      return Promise.all(promises)
    },

    updatePost() {
      this.loading = true
      const formData = new FormData()
      formData.append('content', this.postContent)
      formData.append('privacy', this.privacy)
      formData.append('slug', this.postDetail.slug)
      this.files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('removeImage', '1')
      // if (this.files.length === 0) {
      //   formData.append('removeImage', '1')
      // }
      updatePostApi(formData).then(
        () => {
          this.getDetailPost({
            ...this.postDetail
          })
        },
        (error) => {
          this.loading = false
          if (error && error.message && error.statusCode !== 403) {
            message.error(error.message)
          }
        }
      )
    },

    getDetailPost(data) {
      getDetailPostApi(data.slug).then(
        (resp) => {
          this.loading = false
          if (this.isUpdate) {
            this.$emit('on-update', {
              ...resp,
              id: +dayjs(),
              post: { ...resp }
            })
          } else {
            this.$emit('on-create', {
              ...resp,
              id: +dayjs(),
              post: { ...resp }
            })
          }
          this.clearAllData()
        },
        () => {
          this.loading = false
        }
      )
    },

    clearAllData() {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.postContent = ''
    },

    handleRemoveImage(index) {
      if (this.loading) return
      this.files = this.files.filter((o, i) => i !== index)
    },

    handleFilesChange(event) {
      const files = []
      const fileList = [...this.files, ...Array.from(event.target.files)]
      const MAX_FILES_TO_CREATE = 5
      const MAX_FILE_SIZE_IN_MB = 5
      if (fileList.length > MAX_FILES_TO_CREATE) {
        return message.info(`Không được tạo quá ${MAX_FILES_TO_CREATE} ảnh`)
      }
      const allowExtensions = SUPPORTED_EXTENSIONS
      let isErrorFileSize = false
      let isErrorFileExtension = false
      fileList.forEach((file) => {
        const fileSize = file.size / 1024 / 1024
        const fileExtension = getFileExtension(file.name)
        if (!allowExtensions.includes(fileExtension)) {
          isErrorFileExtension = true
        }
        if (fileSize < MAX_FILE_SIZE_IN_MB) {
          files.push(file)
        } else {
          isErrorFileSize = true
        }
      })
      if (isErrorFileSize) {
        return message.info(`Ảnh không được có dung lượng quá ${MAX_FILE_SIZE_IN_MB}MB`)
      }
      if (isErrorFileExtension) {
        return message.info(`Ảnh không đúng định dạng`)
      }
      this.files = files
    },

    beforeUpload() {
      return false
    }
  }
}
</script>

<style lang="scss">
@import '@/design/variable';
.create-post-form {
  .ant-select-selector {
    height: 28px !important;
    border-radius: 32px !important;
  }
  .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
    .ant-select-selector {
    box-shadow: 0 0 0 2px rgba(203, 180, 114, 0.2);
  }
  .ant-select-arrow {
    color: var(--color-white);
  }
  .input-file {
    display: none;
  }
  textarea {
    min-height: 32px;
    max-height: 350px;
    background: transparent;
    flex: 1;
    outline: none;
    resize: none;
    font-size: 20px;
    &::placeholder {
      color: #71767b;
      opacity: 1;
    }

    &::-ms-input-placeholder {
      color: #71767b;
    }
  }
}
</style>

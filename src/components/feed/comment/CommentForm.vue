<template>
  <div class="flex flex-col gap-2">
    <div
      class="flex gap-2"
      :class="{ 'editor-focused': isFocus }"
    >
      <AvatarUser
        :size="32"
        :src="userInfo.profileImage"
      />
      <div class="flex-1 min-w-0 editor-container">
        <editor-content :editor="editor" />
        <div class="comment-toolbars-container">
          <div class="comment-toolbars">
            <label
              :for="idFile"
              class="cursor-pointer text-primary-color"
            >
              <IconChoseImage />
            </label>
            <input
              type="file"
              :id="idFile"
              class="hidden"
              @change="handleFileChange"
              :accept="getAcceptFileExt()"
            />
            <SendOutlined
              class="cursor-pointer text-[20px]"
              :class="[
                { 'cursor-not-allowed': isDisableSubmit },
                isDisableSubmit ? 'disabled-comment-btn' : '!text-primary-color-only'
              ]"
              @click="commentPost"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="file"
      class="images-list flex gap-2 mt-3"
    >
      <AvatarUser
        :size="32"
        class="invisible"
      />
      <div class="flex justify-between flex-1 min-w-0">
        <img
          :src="previewImageUrl"
          class="bg-white"
          :class="isUpdate ? 'max-w-[210px] w-full h-52' : 'w-20'"
          alt=""
        />
        <div
          class="w-6 h-6 hover-box text-body-5"
          @click="clearFile"
        >
          <CloseOutlined />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import { SendOutlined, CloseOutlined } from '@ant-design/icons-vue'
import AvatarUser from '@/components/shared/AvatarUser.vue'
import { createCommentApi, uploadCommentApi } from '@/api/post'
import { userStore } from '@/stores/userStore'
import {
  generateRandomString,
  getAcceptFileExt,
  getFileExtension,
  urlsToFiles
} from '@/helper/ultil'
import { LIMIT_CONTENT_COMMENT, SUPPORTED_EXTENSIONS } from '@/helper/const'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { CharacterCount } from '@tiptap/extension-character-count'
import IconChoseImage from '@/components/shared/icons/IconChoseImage.vue'
import HoverBox from '@/components/shared/HoverBox.vue'

export default {
  components: {
    HoverBox,
    IconChoseImage,
    EditorContent,
    SendOutlined,
    AvatarUser,
    CloseOutlined
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    post: {
      type: Object
    },
    comment: {
      type: Object,
      default() {
        return null
      }
    },
    placeholder: {
      type: String,
      default: 'Viết bình luận…'
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    'update:modelValue',
    'on-edit',
    'on-comment',
    'on-create-success',
    'on-create-error',
    'on-edit-success'
  ],

  data() {
    return {
      editor: null,
      loading: false,
      previewImageUrl: '',
      file: null,
      isFocus: false
    }
  },

  computed: {
    isDisableSubmit() {
      return (
        (this.modelValue === '' || this.modelValue === '<p></p>') && !this.file && !this.loading
      )
    },

    userInfo() {
      const store = userStore()
      return store.userInfo
    },

    idFile() {
      return `comment-${generateRandomString(5)}-${this.post.slug}${
        this.comment && this.comment.slug ? this.comment.slug : ''
      }`
    }
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: this.placeholder
        }),
        Link,
        CharacterCount.configure({
          limit: LIMIT_CONTENT_COMMENT
        })
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },
      onFocus: () => {
        this.isFocus = true
      },
      onBlur: () => {
        if (this.isDisableSubmit) {
          // this.isFocus = false;
        }
      }
    })
    if (this.isUpdate) {
      this.$emit('update:modelValue', this.comment.content)
      if (this.comment && this.comment.images.length) {
        const urls = this.comment.images.map((o) => o.url)
        this.previewImageUrl = urls[0]
        urlsToFiles(urls).then((files) => {
          this.file = files[0]
        })
      }
    }
  },

  methods: {
    getAcceptFileExt,
    updateComment() {
      this.loading = true
      const formData = new FormData()
      formData.append('content', this.modelValue)
      formData.append('slug', this.comment.slug)
      if (this.file) {
        formData.append('files', this.file)
        formData.append('removeImage', '1')
      } else {
        if (this.comment.images.length) {
          formData.append('removeImage', '1')
        }
      }
      const commentData = {
        user: {
          ...this.userInfo
        },
        ...this.comment,
        content: this.modelValue,
        images: this.file ? [{ url: this.previewImageUrl }] : [],
        loading: true,
        error: false
      }
      this.$emit('on-edit', commentData)
      uploadCommentApi(formData).then(
        () => {
          this.loading = false
          this.$emit('on-edit', {
            ...commentData,
            loading: false
          })
        },
        () => {
          this.loading = false
        }
      )
    },
    commentPost() {
      if (this.isDisableSubmit || this.loading) return
      if (this.isUpdate) {
        return this.updateComment()
      }
      this.loading = true
      const formData = new FormData()
      formData.append('content', this.modelValue)
      formData.append('slugPost', this.post.slug)
      if (this.file) {
        formData.append('files', this.file)
      }
      // it means this is a reply comment
      if (this.comment) {
        formData.append('slugParent', this.comment.slug)
      }
      const commentId = +dayjs()
      const commentData = {
        user: {
          ...this.userInfo
        },
        id: commentId,
        content: this.modelValue,
        status: 'normal',
        createdAt: +dayjs(),
        updatedAt: +dayjs(),
        images: this.file ? [{ url: this.previewImageUrl }] : [],
        loading: true,
        error: false
      }
      this.$emit('on-comment', commentData)
      this.$emit('update:modelValue', '')
      const images = this.file ? [{ url: this.previewImageUrl }] : []
      this.clearFile()
      createCommentApi(formData).then(
        (resp) => {
          this.loading = false
          this.$emit('on-create-success', {
            ...resp,
            user: {
              ...this.userInfo
            },
            images,
          })
        },
        () => {
          this.loading = false
          this.$emit('on-create-error', commentId)
        }
      )
    },

    clearFile() {
      this.file = null
      this.previewImageUrl = ''
    },

    focusEditor() {
      this.editor.commands.focus()
    },

    handleFileChange(event) {
      const file = event.target.files[0]
      const MAX_FILE_SIZE_IN_MB = 5
      const fileSize = file.size / 1024 / 1024
      const fileExtension = getFileExtension(file.name)
      const allowExtensions = SUPPORTED_EXTENSIONS
      if (fileSize > MAX_FILE_SIZE_IN_MB) {
        return message.info(`Ảnh không được có dung lượng quá ${MAX_FILE_SIZE_IN_MB}MB`)
      }
      if (!allowExtensions.includes(fileExtension)) {
        return message.info(`Ảnh không đúng định dạng`)
      }
      this.file = file
      this.previewImageUrl = URL.createObjectURL(file)
      event.target.value = null
    }
  },

  beforeUnmount() {
    this.editor.destroy()
  }
}
</script>

<style lang="scss">
.comment-toolbars-container {
  height: 0;
  transition: 0.3s;
  overflow: hidden;
}
.light-theme {
  .disabled-comment-btn {
    color: #a5a5a5;
  }
}
.dark-theme {
  .disabled-comment-btn {
    color: #616161;
  }
}
.editor-focused {
  .comment-toolbars-container {
    height: 44px;
  }
}
.editor-container {
  border-radius: 16px;
  background: var(--color-white-01);
}
.tiptap {
  padding: 10px 16px;
  border-radius: 16px;
  max-height: 100px;
  overflow: auto;
}
.comment-toolbars {
  padding: 8px 16px 12px 16px;
  display: flex;
  justify-content: space-between;
}
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #71767b;
  pointer-events: none;
  height: 0;
}
</style>

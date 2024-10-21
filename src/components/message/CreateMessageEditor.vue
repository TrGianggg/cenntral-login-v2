<template>
  <div class="flex flex-col gap-4 flex-1 create-message-form p-4">
    <div v-if="previewImages && previewImages.length"
         class="flex gap-4">
      <div v-for="(file, index) in files"
           :key="index"
           class="relative">
        <img :src="getFileUrl(file)"
             alt=""
             class="w-12 h-14 rounded-lg object-cover">
        <div class="close-icon"
             @click="handleRemoveImage(index)">
          <IconClose :size="14"/>
        </div>
      </div>
    </div>
    <div class="flex gap-4 items-center w-full text-neutral-200">
      <div class="flex gap-3">
        <label
            for="create-message-form"
            class="cursor-pointer"
        >
          <IconImage :size="32"/>
        </label>
        <input
            type="file"
            id="create-message-form"
            class="input-file hidden"
            multiple
            @change="handleFilesChange"
            :accept="getAcceptFileExt()"
        />
        <EmojiPopup @on-select="handleSelectEmoji"/>
      </div>
      <editor-content :editor="editor"
                      style="width: 100%" />
      <div class="sent-btn cursor-pointer"
           :class="{'sent-btn--disabled': isDisableSubmit}"
           @click="handleSubmit">
        <IconSend :size="20"/>
      </div>
    </div>
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import {Editor, EditorContent} from '@tiptap/vue-3'
import {Placeholder} from "@tiptap/extension-placeholder";
import {Link} from "@tiptap/extension-link";
import {CharacterCount} from "@tiptap/extension-character-count";
import {userStore} from '@/stores/userStore'
import {LIMIT_CONTENT_POST, SUPPORTED_EXTENSIONS} from "@/helper/const";
import IconImage from "@/components/shared/icons/IconImage.vue";
import IconSend from "@/components/shared/icons/IconSend.vue";
import IconClose from "@/components/shared/icons/IconClose.vue";
import IconEmoji from "@/components/shared/icons/IconEmoji.vue";
import HoverBox from "@/components/shared/HoverBox.vue";
import dayjs from "dayjs";
import {createMessageApi} from "@/api/message";
import {mapState} from 'pinia'
import {useSocketStore} from '@/stores/socketStore'
import IconChoseImage from "@/components/shared/icons/IconChoseImage.vue";
import {getAcceptFileExt, getFileExtension} from "@/helper/ultil";
import {message} from "ant-design-vue";
import EmojiPopup from "@/components/message/EmojiPopup.vue";

export default {
  components: {
    IconChoseImage,
    HoverBox,
    EditorContent,
    IconImage,
    IconSend,
    IconClose,
    IconEmoji,
    EmojiPopup
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    room: {
      type: Object
    }
  },

  emits: ['update:modelValue', 'on-create', 'on-create-success', 'on-create-error', 'on-blur', 'on-focus'],

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Gửi tin nhắn',
        }),
        Link,
        CharacterCount.configure({
          limit: LIMIT_CONTENT_POST
        }),
      ],
      editorProps: {
        handleKeyDown: (view, event) => {
          if (event.key === 'Enter') {
            if (window.innerWidth > 1024) {
              this.handleSubmit()
              return true;
            }
            return false
          }
          return false;
        },
      },
      content: this.contentMessage,
      onUpdate: () => {
        this.contentMessage = this.editor.getHTML()
        this.$emit('update:modelValue', this.editor.getHTML())
      },
      onBlur: () => {
        this.$emit('on-blur');
      },
      onFocus: () => {
        this.$emit('on-focus');
      }
    })
  },

  data() {
    return {
      editor: null,
      loading: false,
      contentMessage: '',
      files: []
    }
  },

  computed: {
    ...mapState(useSocketStore, ['socket']),
    isDisableSubmit() {
      if (this.files.length) {
        return false
      }
      return this.contentMessage === '' || this.contentMessage === '<p></p>'
    },

    userInfo() {
      const store = userStore();
      return store.userInfo
    },

    previewImages() {
      const urls = []
      this.files.forEach((file) => {
        const url = URL.createObjectURL(file)
        urls.push(url)
      })
      return urls
    }
  },

  watch: {
    contentMessage(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame || this.loading) {
        return
      }
      this.editor.commands.setContent(value, false)
    },
  },

  methods: {
    getAcceptFileExt,

    getFileUrl(file) {
      return URL.createObjectURL(file)
    },

    handleSelectEmoji(emoji) {
      this.editor.commands.insertContent(emoji);
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
      event.target.value = null
      if (fileList.length > MAX_FILES_TO_CREATE) {
        return message.info(`Không được gửi quá ${MAX_FILES_TO_CREATE} ảnh`)
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

    handleSubmit() {
      if (this.isDisableSubmit) return;
      const messageId = +dayjs();
      let images = [];
      if (this.files && this.files.length) {
        images = this.previewImages
      }
      const messageData = {
        id: messageId,
        content: this.contentMessage,
        images,
        status: "new",
        createdAt: +dayjs(),
        updatedAt: +dayjs(),
        sender: {
          ...this.userInfo
        },
        seen: [],
        loading: true
      }
      this.$emit('on-create', messageData)
      const formData = new FormData();
      formData.append('slugRoom', this.room.slug);
      formData.append('message', this.contentMessage);
      if (this.files && this.files.length) {
        this.files.forEach(file => {
          formData.append('files', file);
        })
      }
      createMessageApi(formData).then((resp) => {
        console.log('resp: ', resp);
        this.$emit('on-create-success', {
          ...messageData,
          loading: false,
          realId: +resp.id,
        })
      }, () => {
        this.$emit('on-create-error', messageId)
      })
      this.files = [];
      this.contentMessage = '';
      this.editor.commands.blur()
    }
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
.light-theme {
  .create-message-form {
    .tiptap {
      color: var(--neutral-300);
      p.is-editor-empty:first-child::before {
        color: var(--text-secondary);
      }
    }
  }
}
.dark-theme {
  .create-message-form {
    .tiptap {
      background: transparent;
      border: 1px solid;
      color: var(--neutral-200);
    }
  }
}
.create-message-form {
  .tiptap {
    background: #E7E7E8;
    border-radius: 36px;
    padding: 12px 45px 12px 36px;
    max-height: 350px;
    color: initial;
    word-break: break-word;
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: var(--post-placeholder-color);
      pointer-events: none;
      height: 0;
    }
  }
  .sent-btn {
    width: 40px;
    min-width: 40px;
    height: 40px;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
    position: absolute;
    right: 23px;
    &:hover {
      background: var(--bg-box-hover);
    }
    &--disabled {
      cursor: no-drop;
      color: var(--text-no-data);
      &:hover {
        background: transparent;
      }
    }
  }
  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background: var(--bg-box);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transform: translate(50%, -50%);
    cursor: pointer;
    &:hover {
      background: var(--bg-box-hover);
    }
  }
  @media (max-width: 1024px) {
    .tiptap {
      border-radius: 36px;
      padding: 12px 45px 12px 15px;
    }
    .sent-btn {
      right: 18px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>

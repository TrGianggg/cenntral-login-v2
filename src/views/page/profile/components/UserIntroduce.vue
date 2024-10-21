<template>
  <div class="w-full introduce-wrapper bg-neutral-850 p-4 rounded-xl md:mx-0 mx-4 mb-4 shadow-light">
    <div class="text-white font-bold">Giới thiệu bản thân</div>
    <div class="rounded my-4">
      <div
        v-show="editable"
        class="border min-h-[125px] rounded"
      >
        <editor-content :editor="editor" />
      </div>
      <div
        v-show="!editable"
        class="flex justify-between gap-4"
      >
        <div
          class="flex-1 min-w-0 introduce-content"
          v-html="isNoContent ? '-' : contentIntroduce"
          style="word-break: break-word"
        ></div>
        <HoverBox v-if="isMe"
                  @click="openEditForm">
          <IconEdit />
        </HoverBox>
      </div>
    </div>
    <div
      v-if="editable"
      class="flex justify-end mt-4 gap-3"
    >
      <a-button
        :loading="loading"
        type="primary"
        @click="editIntroduce"
      >
        Lưu
      </a-button>
      <a-button
        type="only-border"
        style="padding: 0 40px !important;"
        @click="handleCancelEdit"
      >
        Huỷ
      </a-button>
    </div>
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Link } from '@tiptap/extension-link'
import IconEdit from '@/components/shared/icons/IconEdit.vue'
import { userStore } from '@/stores/userStore'
import { updateIntroduceApi } from '@/api/user'
import HoverBox from '@/components/shared/HoverBox.vue'
import {useUserProfile} from "@/components/hooks/useUserProfile";

export default {
  components: {
    HoverBox,
    EditorContent,
    IconEdit
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  emits: ['update:modelValue'],

  setup() {
    const { isMe } = useUserProfile()
    return {
      isMe
    };
  },

  data() {
    return {
      editor: null,
      loading: false,
      contentIntroduce: '',
      beforeContentChange: '',
      isFocus: false,
      editable: false,
      isShowActionButton: true
    }
  },


  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) {
        return
      }
      this.editor.commands.setContent(value, false)
    },
    userInfo: {
      handler() {
        this.contentIntroduce = this.userInfo.introduce
        if (this.editor) {
          this.editor.commands.setContent(this.contentIntroduce, false)
        }
      },
      immediate: true
    }
  },

  computed: {
    isNoContent() {
      return !this.contentIntroduce || this.contentIntroduce === '<p></p>'
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Giới thiệu bản thân'
        }),
        Link
      ],
      content: this.contentIntroduce,
      onUpdate: () => {
        this.contentIntroduce = this.editor.getHTML()
        this.$emit('update:modelValue', this.editor.getHTML())
      },
      onFocus: () => {
        this.isFocus = true
      },
      onBlur: () => {
        // this.isFocus = false;
      }
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },

  methods: {
    openEditForm() {
      this.beforeContentChange = this.contentIntroduce;
      this.editable = true
      this.$nextTick(() => {
        this.editor.commands.focus('end')
      })
    },

    handleCancelEdit() {
      this.contentIntroduce = this.beforeContentChange;
      this.editable = false
      this.editor.commands.setContent(this.beforeContentChange)
    },

    editIntroduce() {
      this.loading = true
      updateIntroduceApi({
        introduce: this.contentIntroduce
      }).then(
        () => {
          this.loading = false
          this.editable = false
          const store = userStore()
          store.setUserInfo({
            ...this.userInfo,
            introduce: this.contentIntroduce
          })
        },
        () => {
          this.loading = false
        }
      )
    }
  }
}
</script>

<style lang="scss">
.introduce-wrapper {
  .tiptap {
    max-height: 1000px;
    p {
      line-height: 1.5;
    }
  }
  .introduce-content {
    * {
      line-height: 1.5;
    }
  }
}
</style>

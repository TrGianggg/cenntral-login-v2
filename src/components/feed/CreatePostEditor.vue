<template>
  <div class="flex gap-2 post-form flex-1">
    <editor-content :editor="editor" style="width: 100%" />
  </div>
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import {Placeholder} from "@tiptap/extension-placeholder";
import {Link} from "@tiptap/extension-link";
import {CharacterCount} from "@tiptap/extension-character-count";
import { userStore } from '@/stores/userStore'
import {LIMIT_CONTENT_POST} from "@/helper/const";

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    post: {
      type: Object
    }
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
      loading: false
    }
  },

  computed: {
    isDisableSubmit() {
      return this.modelValue === '' || this.modelValue === '<p></p>'
    },

    userInfo() {
      const store = userStore();
      return store.userInfo
    }
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame || this.loading) {
        return
      }
      this.editor.commands.setContent(value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Bạn đang nghĩ gì?',
        }),
        Link,
        CharacterCount.configure({
          limit: LIMIT_CONTENT_POST
        })
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit('update:modelValue', this.editor.getHTML())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
.post-form {
  .tiptap {
    background: transparent;
    padding: 8px 16px 8px 0;
    max-height: 300px;
    overflow: auto;
    font-size: 18px;
    border-radius: 0;
  }
  .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--post-placeholder-color);
    pointer-events: none;
    height: 0;
  }
}
</style>

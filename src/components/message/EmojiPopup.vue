<template>
  <a-popover v-model="isOpenPopup"
             trigger="click"
             placement="topRight"
             overlayClassName="cs-popup">
    <template #content>

      <div>
        <EmojiList>
          <template #emoji-picker="{ emojis }">
            <div class="w-60 h-52 p-1 overflow-auto">
              <div v-for="(emojiGroup, category) in emojis"
                   :key="category">
                <div class="flex flex-wrap">
                    <span
                        v-for="(emoji, emojiName) in emojiGroup"
                        :key="emojiName"
                        :title="emojiName"
                        @click="onSelectEmoji(emoji)"
                        class="cursor-pointer text-lg"
                    >{{ emoji }}</span>
                </div>
              </div>
            </div>
          </template>
        </EmojiList>
      </div>
    </template>
    <div class="cursor-pointer">
      <IconEmoji :size="32"/>
    </div>
  </a-popover>
</template>
<script setup>
import EmojiList from '@/components/message/emoji/EmojiList.vue';
import IconEmoji from "@/components/shared/icons/IconEmoji.vue";
import {ref} from "vue";

const emit = defineEmits(['on-select'])
const isOpenPopup = ref(false)

const onSelectEmoji = (emoji) => {
  emit('on-select', emoji);
}
</script>
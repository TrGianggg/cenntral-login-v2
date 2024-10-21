<template>
  <div class="ai-sidebar__menu flex flex-col gap-3 select-none mt-12">
    <div
      v-for="item in listMenuAi"
      :key="item.label"
    >
      <div
        :class="[
          'cursor-pointer py-2 px-3 rounded-lg hover:bg-primary-01 transition-300',
          currentRoute.includes(item.link) ? 'bg-primary-01' : ''
        ]"
        @click="handleClickMenu(item.link)"
      >
        <div
          :class="[
            'flex flex-row items-center gap-4',
            currentRoute === item.link ? 'text-gold-150 font-bold' : 'text-white font-bold'
          ]"
        >
          <img
            :src="item.icon"
            :alt="item.label"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineEmits, ref } from 'vue'
import IconChat from '@/assets/icons/ai-chat/ai-chat_.svg'
import IconArt from '@/assets/icons/ai-art/ai-art_.svg'
import IconAvatar from '@/assets/icons/ai-art/icon-ai-avatar.svg'
import router from '@/router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['closeMenu'])
const currentRoute = computed(() => {
  return router.currentRoute.value.path
})

const listMenuAi = ref([
  {
    label: t('chat.menu.gpt'),
    link: '/tom-chat',
    icon: IconChat
  },
  {
    label: t('ai-art.menu.avatar'),
    link: '/tom-avatar',
    icon: IconAvatar
  },
  {
    label: t('ai-art.menu.art'),
    link: '/tom-art',
    icon: IconArt,
    children: []
  }
])

const handleClickMenu = (link) => {
  router.push({
    path: link
  })
  emit('closeMenu')
}
</script>

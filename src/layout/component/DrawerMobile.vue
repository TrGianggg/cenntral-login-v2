<template>
  <div
    class="drawer-overlay"
    :class="[isExpandMenu ? 'block' : 'hidden']"
    @click="appStore.setExpandMenu(false)"
  ></div>
  <div
    :class="[
      'drawer-mobile w-screen transition-500 fixed max-h-[60vh] bottom-0 bg-[#030B26] z-[1000] px-4 py-6 rounded-tl-3xl rounded-tr-3xl',
      isExpandMenu ? '' : 'translate-y-[100%]'
    ]"
  >
    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex flex-row items-center justify-between">
        <AppLogo></AppLogo>
        <CloseOutlined
          class="text-xl"
          @click="appStore.setExpandMenu(false)"
        ></CloseOutlined>
      </div>
      <a-button
        type="primary-shadow"
        class="w-full"
      >
        {{ $t('common.register_member') }}
      </a-button>
      <div
        class="border-t border-solid border-white-04 pt-6 pr-4 h-full max-h-[40vh] overflow-y-scroll"
      >
        <div class="menu-mobile">
          <div
            v-for="menu in listMenuItem"
            :key="menu.name"
            :class="[
              'px-3 py-3 rounded-xl',
              currentRoute === menu.name ? 'menu-mobile-active' : ''
            ]"
            @click="handleClickMenu(menu)"
          >
            <span class="text-body-2 !font-bold">{{ $t(`${menu.title}`) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/appStore'
import { computed } from 'vue'
import LIST_ROUTES from '@/router/index.js'
import AppLogo from '@/components/app/AppLogo.vue'
import router from '@/router'
import { CloseOutlined } from '@ant-design/icons-vue'

const appStore = useAppStore()
const isExpandMenu = computed(() => {
  return appStore.isExpandMenu
})

const listMenuItem = computed(() => {
  return LIST_ROUTES.options.routes
    .filter((item) => !item.hideMenu)
    .sort((item1, item2) => item1.order - item2.order)
})

const currentRoute = computed(() => {
  return router.currentRoute.value.name
})

const handleClickMenu = (route) => {
  appStore.setExpandMenu(false)
  router.push({
    name: route.name
  })
}
</script>
<style lang="scss">
.drawer-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  cursor: pointer;
  animation: keyFrameOverlay 0.5s;
}

.drawer-mobile {
  background: linear-gradient(0deg, #17234a, #17234a),
    linear-gradient(180deg, #ffffff 0%, #c2a44e 100%);
}

@keyframes keyFrameOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.menu-mobile-active {
  background: rgba(255, 255, 255, 0.05);
  background-blend-mode: lighten;
}
</style>

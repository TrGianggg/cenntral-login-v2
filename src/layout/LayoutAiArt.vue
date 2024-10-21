<template>
  <div
    class="header-mobile py-2 fixed xl:hidden top-0 w-full z-[100] flex flex-row items-center !px-4"
  >
    <AppLogo></AppLogo>
    <IconHamburger @click="() => (openDrawer = true)" />
  </div>
  <div
    class="layout-ai__sidebar hidden fixed w-[220px] z-[1000] flex flex-col justify-between top-0 left-0 h-screen py-8 bg-neutral-850 xl:flex px-3 border border-r gap-8"
  >
    <div class="flex flex-col">
      <div class="px-3 select-none">
        <AppLogo></AppLogo>
      </div>
      <MenuLayoutAi></MenuLayoutAi>
    </div>
    <a-button
      type="primary"
      class="w-full"
      @click="directHome"
      >Trở về trang chủ</a-button
    >
  </div>
  <div class="w-full xl:pl-[220px] flex justify-center">
    <router-view></router-view>
  </div>
  <a-drawer
    class="drawer-menu-ai-art"
    placement="right"
    width="80%"
    :closable="false"
    v-model:visible="openDrawer"
  >
    <div class="flex flex-col justify-between h-full">
      <div>
        <div class="px-6 select-none">
          <AppLogo></AppLogo>
        </div>
        <MenuLayoutAi @closeMenu="closeMenu"></MenuLayoutAi>
      </div>
      <a-button
        class="w-full"
        type="primary"
        @click="directHome"
        >Trở về trang chủ</a-button
      >
    </div>
    <template #title>
      <img
        class="w-6"
        src="@/assets/icons/ai-art/close-icon-tag.svg"
        alt="close-icon-tag"
        @click="() => (openDrawer = false)"
      />
    </template>
  </a-drawer>
</template>
<script setup>
import { ref } from 'vue'
import AppLogo from '@/components/app/AppLogo.vue'
import MenuLayoutAi from '@/layout/component/MenuLayoutAi.vue'
import IconHamburger from '@/components/shared/icons/IconHamburger.vue'
import { Layout } from 'ant-design-vue'
import router from '@/router'
const Content = Layout.Content
const openDrawer = ref(false)
const closeMenu = () => {
  openDrawer.value = false
}

const directHome = () => {
  router.push({
    name: 'feed'
  })
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.drawer-menu-ai-art {
  .ant-drawer-content-wrapper {
    max-width: 250px;
  }
  .ant-drawer-content,
  .ant-drawer-header {
    background: white;
  }
}

.dark-theme {
  .drawer-menu-ai-art {
    .ant-drawer-content,
    .ant-drawer-header {
      background: $neutral-800;
    }
  }
}
</style>

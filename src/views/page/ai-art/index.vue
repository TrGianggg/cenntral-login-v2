<template>
  <div class="xl:pr-[330px] w-full h-screen">
    <AiArt @changeOpenChooseOption="changeOpenChooseOption"></AiArt>
  </div>
  <div class="container-sidebar-option">
    <div class="w-full h-full overflow-auto overflow-x-scroll">
      <SideChooseOption></SideChooseOption>
    </div>
  </div>
  <div class="flex xl:hidden">
    <a-drawer
      class="drawer-choose-ai-art"
      placement="right"
      width="80%"
      :closable="false"
      v-model:visible="openDrawer"
    >
      <div class="w-full h-full overflow-auto overflow-x-scroll">
        <SideChooseOption></SideChooseOption>
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
  </div>
</template>
<script>
import { userStore } from '@/stores/userStore'
import { computed, ref, onMounted } from 'vue'
import { masterDataStore } from '@/stores/masterDataStore'
import SideChooseOption from '@/views/page/ai-art/component/ai-art-premium/SideChooseOption.vue'
import AiArt from './AiArtContent.vue'

export default {
  name: 'LayoutContent',

  components: {
    SideChooseOption,
    AiArt
  },
  setup() {
    onMounted(async () => {
      await masterDataStore().getMasterData()
    })
    const userInfo = computed(() => {
      return userStore().userInfo
    })

    const openDrawer = ref(false)
    const changeOpenChooseOption = (value) => {
      openDrawer.value = value
    }
    return {
      userInfo,
      openDrawer,
      changeOpenChooseOption
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.drawer-choose-ai-art {
  .ant-drawer-content,
  .ant-drawer-header {
    .ant-drawer-body {
      padding-right: 0;
    }
  }
}

.dark-theme {
  .ant-drawer-content,
  .ant-drawer-header {
    background: $neutral-800;
  }
}

.container-sidebar-option {
  background: var(--bg-sidebar-option);
  border-left: unset;
  @apply fixed hidden xl:flex w-[330px] top-0 right-0 h-screen pl-6 pb-4  z-[1000];
}
</style>

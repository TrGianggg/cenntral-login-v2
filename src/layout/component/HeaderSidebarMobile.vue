<template>
  <div class="header-mobile lg:hidden flex sticky top-0 z-40 p-4">
    <AppLogo />
    <IconHamburger @click="showDrawer" />
  </div>
  <div
    class="cs-drawer-bg"
    :class="{ 'cs-drawer-bg-opened': open }"
  >
    <div
      class="h-full flex flex-col overflow-auto relative"
      @click="open = false"
    >
      <div
        class="overflow-auto cs-drawer flex-1 min-h-0"
        :class="{ 'cs-drawer-opened': open }"
      >
        <div
          class="px-6 text-xl close-drawer"
          @click.stop="open = false"
        >
          <CloseOutlined />
        </div>
        <div @click.stop="() => {}">
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { CloseOutlined } from '@ant-design/icons-vue'
import AppLogo from '@/components/app/AppLogo.vue'
import IconHamburger from '@/components/shared/icons/IconHamburger.vue'
import { onBeforeUnmount, ref, watch } from 'vue'
import Sidebar from '@/layout/component/Sidebar.vue'
import { useRoute } from 'vue-router'
const open = ref(false)

const route = useRoute()

watch(route, () => {
  open.value = false
})

watch(
  open,
  () => {
    const body = document.getElementsByTagName('body')[0]
    if (open.value) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = 'auto'
    }
  },
  { immediate: true }
)
const showDrawer = () => {
  open.value = true
}

onBeforeUnmount(() => {
  const body = document.getElementsByTagName('body')[0]
  body.style.overflow = 'auto'
})
</script>

<style lang="scss">
@import '@/design/variable';
.header-mobile {
  justify-content: space-between;
  align-items: center;
  background: $neutral-900;
}
.custom-class {
  .ant-drawer-header {
    background: #0f0f0f;
    //background: #fff;
    .ant-drawer-close {
      color: var(--color-white);
    }
  }
  .ant-drawer-body {
    background: #0f0f0f;
    padding: 0;
    width: 300px;
    .sidebar-wrapper {
      height: 100%;
      .sidebar-content {
        width: 100%;
      }
      .sidebar-footer {
        width: 100%;
      }
    }
  }
}
.cs-drawer-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  z-index: -1;
  transition: 0.3s;
  pointer-events: none;
}
.cs-drawer-bg-opened {
  opacity: 1;
  z-index: 999;
  //
  pointer-events: auto;
}
.cs-drawer {
  position: absolute;
  width: 310px;
  background: #0f0f0f;
  right: 0;
  top: 0;
  bottom: 0;
  transform: translateX(100%);
  transition: 0.3s;
  z-index: 1000;
  .sidebar-wrapper {
    height: 100%;
    margin-left: 1rem;
  }
}
.cs-drawer-opened {
  transform: translateX(0);
}
.light-theme {
  .cs-drawer {
    background: #fff;
  }
}
</style>

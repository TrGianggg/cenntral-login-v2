<template>
  <a
    :href="renderLinkLogo.link"
    :target="renderLinkLogo.target"
    class="w-fit"
    @click="handleClickLogo"
  >
    <img
      :style="`max-width: ${maxWidth}`"
      :src="Logo"
      alt="logo-main"
      class="logo-dark"
    />
    <img
      :style="`max-width: ${maxWidth}`"
      :src="LogoLight"
      alt="logo-main"
      class="logo-light"
    />
  </a>
</template>
<script>
import Logo from '@/assets/blue-logo.jpg'
import LogoLight from '@/assets/blue-logo.jpg'
import router, { ROOT_ROUTE } from '@/router'
import { useAppStore } from '@/stores/appStore'
import { computed, inject } from 'vue'
import { TYPE_LAYOUT } from '@/helper/layout-contant'
import { AUTH_ROUTE } from '@/router'
export default {
  name: 'AppLogo',
  props: {
    maxWidth: {
      type: String,
      default: '132px'
    },
    fullLogo: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const appStore = useAppStore()
    const checkTypeLayout = computed(() => {
      return appStore.layout === TYPE_LAYOUT.DEFAULT
    })
    const renderLinkLogo = computed(() => {
      if (AUTH_ROUTE.includes(router.currentRoute.value.name)) {
        return {
          link: 'https://tomiru.com/',
          target: '_blank'
        }
      } else {
        return {
          link: '/',
          target: '_self'
        }
      }
    })

    const emitter = inject('emitter')
    const handleClickLogo = () => {
      emitter.emit('ON_RESET_FEED')
    }
    return { Logo, LogoLight, renderLinkLogo, ROOT_ROUTE, checkTypeLayout, handleClickLogo }
  }
}
</script>

<style lang="scss">
.light-theme {
  .logo-dark {
    display: none;
  }
}
.dark-theme {
  .logo-light {
    display: none;
  }
}
</style>

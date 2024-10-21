<template>
  <div
    id="header-main"
    class="wrap-header transition-500"
    :class="[checkScroll ? '' : 'wrap-header-blur']"
  >
    <div class="header-body padding-side-global justify-between">
      <div class="header-body__logo">
        <AppLogo></AppLogo>
      </div>
      <div class="header-body__menu hidden md:flex">
        <div class="header-body__menu-item">
          <template
            v-for="item in listMenuItem"
            :key="item.order + 'menu-left'"
          >
            <MenuItem
              :check-type-layout="checkTypeLayout"
              :menu-item="item"
            ></MenuItem>
          </template>
        </div>
      </div>
      <div class="header-body__btn">
        <a-button
          type="primary-shadow"
          class="!hidden md:!block"
        >
          {{ $t('common.register_member') }}
        </a-button>
        <div class="md:hidden">
          <MenuFoldOutlined
            v-if="!isExpandMenu"
            class="text-2xl"
            @click="handleExpandMenu"
          />
          <MenuUnfoldOutlined
            v-else
            class="text-2xl"
            @click="handleExpandMenu"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import AppLogo from '@/components/app/AppLogo.vue'
import LIST_ROUTES from '@/router'
import MenuItem from './MenuItem.vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/stores/appStore'

export default {
  name: 'LayoutHeader',
  components: {
    MenuItem,
    AppLogo,
    MenuFoldOutlined,
    MenuUnfoldOutlined
  },
  props: {
    checkTypeLayout: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const appStore = useAppStore()
    const checkScroll = ref(true)
    const prevScrollpos = ref(document.body.scrollTop)
    const listMenuItem = computed(() => {
      return LIST_ROUTES.options.routes
        .filter((item) => !item.hideMenu)
        .sort((item1, item2) => item1.order - item2.order)
    })

    const isExpandMenu = computed(() => {
      return appStore.isExpandMenu
    })

    const handleScrollHidden = () => {
      checkScroll.value = document.body.scrollTop === 0
      if (window.innerWidth > 1024) {
        let currentScrollPos = document.body.scrollTop
        if (prevScrollpos.value > currentScrollPos) {
          document.getElementById('header-main').style.top = '0'
        } else {
          document.getElementById('header-main').style.top = `-${
            document.getElementById('header-main').offsetHeight
          }px`
        }
        prevScrollpos.value = currentScrollPos
      }
    }

    const handleExpandMenu = () => {
      appStore.setExpandMenu(!isExpandMenu.value)
    }
    onMounted(() => {
      document.body.addEventListener('scroll', handleScrollHidden)
    })

    onUnmounted(() => {
      document.body.removeEventListener('scroll', handleScrollHidden)
    })

    return {
      checkScroll,
      isExpandMenu,
      listMenuItem,
      handleExpandMenu
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable';

.wrap-header {
  display: flex;
  z-index: 100;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: $height-header;
  position: fixed;
  width: 100%;

  .header-body {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 1205px;

    .header-body__menu {
      width: 100%;
      gap: 29px;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .header-body__menu-item {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}

.wrap-header-blur {
  @media screen and (max-width: 1024px) {
    background: rgba(10, 22, 61, 1);
  }
  @media screen and (min-width: 1025px) {
    background: rgba(255, 255, 255, 0);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5.6px);
    -webkit-backdrop-filter: blur(5.6px);
  }
}
</style>

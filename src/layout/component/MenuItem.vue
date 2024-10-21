<template>
  <div
    class="menu__item"
    @click="handleClickMenu(menuItem)"
  >
    <span :class="[checkActiveMenu ? 'menu__item_active' : 'text-primary-color', 'font-black']">{{
      $t(`${menuItem?.title}`)
    }}</span>
  </div>
</template>
<script>
import router from '@/router'
import { computed } from 'vue'

export default {
  name: 'MenuItem',
  props: {
    menuItem: {
      type: Object,
      default: () => {}
    },
    checkTypeLayout: {
      type: Boolean,
      default: true
    }
  },
  setup(prop) {
    const handleClickMenu = (menu) => {
      router.push({
        name: menu.name
      })
    }
    const checkActiveMenu = computed(() => {
      return router.currentRoute.value.fullPath.includes(prop.menuItem.name)
    })
    return {
      handleClickMenu,
      checkActiveMenu
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';

.menu__item {
  cursor: pointer;
  padding: 8px 30.5px;

  :hover {
    color: $gold-0;
  }
}

.menu__item_active {
  color: $gold-0;
  border-bottom: 2px solid $gold-0;
}
</style>

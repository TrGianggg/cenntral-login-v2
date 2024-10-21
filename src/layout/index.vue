<template>
  <div class="wrap-layout-default">
    <CompHeader :check-type-layout="checkTypeLayout"></CompHeader>
    <PageContent :check-type-layout="checkTypeLayout"></PageContent>
    <PageFooter></PageFooter>
    <DrawerMobile></DrawerMobile>
  </div>
</template>
<script>
import Header from './component/Header.vue'
import Content from './component/Content.vue'
import Footer from './component/Footer.vue'
import { computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import { TYPE_LAYOUT } from '@/helper/layout-contant'
import { scrollToTop } from '@/helper'
import router from '@/router'
import DrawerMobile from '@/layout/component/DrawerMobile.vue'

export default {
  name: 'LayoutDefault',
  components: {
    CompHeader: Header,
    PageContent: Content,
    PageFooter: Footer,
    DrawerMobile
  },
  setup() {
    const appStore = useAppStore()
    const checkTypeLayout = computed(() => {
      return appStore.layout === TYPE_LAYOUT.DEFAULT
    })

    const checkCurrentRoute = computed(() => {
      return router.currentRoute.value
    })

    watch(
      () => checkCurrentRoute.value,
      () => {
        scrollToTop()
      }
    )

    onMounted(() => {
      scrollToTop()
    })
    return {
      checkTypeLayout
    }
  }
}
</script>

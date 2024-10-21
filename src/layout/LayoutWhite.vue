<template>
  <PageContent class="wrap-layout-white-content">
    <div
      class="w-full flex justify-center py-6 !bg-neutral-900 padding-side-global z-[1000] fixed top-0"
    >
      <div class="w-full max-w-[1200px] flex flex-row justify-between">
        <AppLogo></AppLogo>
        <!--        <AppLocale></AppLocale>-->
        <!--        <div class="w-[100px]"></div>-->
      </div>
    </div>
    <div class="padding-side-global pt-[88px]">
      <transition name="slide-fade">
        <RouterView></RouterView>
      </transition>
    </div>
  </PageContent>
  <ModalSupport></ModalSupport>
</template>
<script>
import { Layout } from 'ant-design-vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { scrollToTop } from '@/helper'
import { onMounted } from 'vue'
import AppLocale from '@/components/app/AppLocale.vue'
import ModalSupport from '@/components/support/ModalSupport.vue'
export default {
  name: 'LayoutContent',
  components: {
    ModalSupport,
    AppLocale,
    PageContent: Layout.Content,
    AppLogo
  },
  setup() {
    onMounted(() => {
      scrollToTop()
    })
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';

.wrap-layout-white-content {
  width: 100vw;
  min-height: 100vh;
}
</style>
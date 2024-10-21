<template>
  <div id="recaptcha-container"></div>
  <PageContent class="wrap-layout-menu">
    <div class="bg-neutral-900 fixed w-full top-0 z-[1000]">
      <HeaderSidebarMobile />
    </div>
    <div
      class="layout-header border-b fixed top-0 flex flex-row items-center justify-between z-[900] bg-neutral-900 w-full padding-side-global"
    >
      <div class="h-full flex items-center">
        <AppLogo />
      </div>
      <div class="w-full max-w-[1240px] pl-2">
        <Breadcrumb></Breadcrumb>
      </div>
      <div class="w-fit">
        <!--        <AppLocale></AppLocale>-->
      </div>
    </div>
    <div class="layout-content lg:pb-0 lg:pt-[59px] pt-[72px] w-full">
      <router-view />
    </div>
  </PageContent>
  <ModalSupport></ModalSupport>
</template>
<script>
import { Layout } from 'ant-design-vue'
import AppLogo from '@/components/app/AppLogo.vue'
import { onMounted } from 'vue'
import { userStore } from '@/stores/userStore'
import Breadcrumb from '@/components/app/Breadcrumb.vue'
import AppLocale from '@/components/app/AppLocale.vue'
import HeaderSidebarMobile from '@/layout/component/HeaderSidebarMobile.vue'
import { masterDataStore } from '@/stores/masterDataStore'
import { useSocket } from '@/hooks/useSocket'
import ModalSupport from '@/components/support/ModalSupport.vue'
import { useFirebase } from '@/hooks/useFirebase'

export default {
  name: 'LayoutNoSidebarContent',

  components: {
    ModalSupport,
    HeaderSidebarMobile,
    AppLogo,
    PageContent: Layout.Content,
    Breadcrumb,
    AppLocale
  },
  setup() {
    useSocket()
    // useFirebase()

    onMounted(async () => {
      await userStore().getUserInfo()
      await masterDataStore().getMasterData()
    })
  }
}
</script>
<style lang="scss">
@import '@/design/variable.scss';

.wrap-layout-menu {
  .layout-header {
    height: 60px;
  }
  .layout-content {
    display: flex;
    justify-content: center;
    min-width: 1px;
  }
}
@media (max-width: 1024px) {
  .wrap-layout-menu {
    .layout-header {
      display: none;
    }
  }
}
</style>

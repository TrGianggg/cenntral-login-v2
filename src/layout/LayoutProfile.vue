<template>
  <PageContent class="wrap-layout-white-content flex justify-center">
    <HeaderSidebarMobile/>
    <RouterView></RouterView>
  </PageContent>
</template>
<script>
import { Layout } from 'ant-design-vue'
import { userStore } from '@/stores/userStore'
import { onMounted } from 'vue'
import HeaderSidebarMobile from "@/layout/component/HeaderSidebarMobile.vue";
import { masterDataStore } from '@/stores/masterDataStore'

export default {
  name: 'LayoutContent',
  components: {
    HeaderSidebarMobile,
    PageContent: Layout.Content
  },
  setup() {
    onMounted(async () => {
      await userStore().getUserInfo()
      await masterDataStore().getMasterData()
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

<template>
  <div
    :class="[
      'w-full flex justify-center',
      checkTypeLayout ? 'padding-layout-content-top' : '',
      'wrap-layout-content'
    ]"
  >
    <RouterView>
      <template #default="{ Component, route }">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </template>
    </RouterView>
  </div>
</template>
<script>
import { Layout } from 'ant-design-vue'
export default {
  name: 'LayoutContent',
  components: {
    PageContent: Layout.Content
  },
  props: {
    checkTypeLayout: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="scss">
@import '@/design/variable';

.wrap-layout-content {
  width: 100%;
  padding-bottom: 48px;
  min-height: calc(100vh - 478px);
}

.padding-layout-content-top {
  padding-top: 0;
  min-height: calc(100vh - $height-header);
}
</style>

<template>
  <div
    v-if="dataBreadcrumb.length"
    class="comp-breadcrumb flex flex-row items-center gap-3"
  >
    <div
      v-for="(item, index) in dataBreadcrumb"
      :key="item.link"
      class="flex flex-row items-center gap-3"
    >
      <a
        v-if="index < dataBreadcrumb.length - 1"
        :class="[
          'text-body-3 !font-normal text-breadcrumb hover:underline hover:!text-gold-150 underline-offset-4'
        ]"
        @click="handleDirectRoute(item.link)"
        >{{ item.label }}</a
      >
      <span
        v-else
        :class="['text-body-3 !font-normal text-breadcrumb']"
        >{{ item.label }}</span
      >
      <RightOutlined
        v-if="index < dataBreadcrumb.length - 1"
        class="!text-[#474747]"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import router from '@/router'
import { useAppStore } from '@/stores/appStore'
const props = defineProps({
  color: {
    type: String,
    default: '!text-[#474747]'
  }
})

const dataBreadcrumb = computed(() => {
  return useAppStore().dataBreadCrumb
})
const handleDirectRoute = (path) => {
  router.push({
    path: path
  })
}
</script>
<style lang="scss">
@import '@/design/base.scss';
.text-breadcrumb {
  color: var(--text-breadcrumb) !important;
}
</style>

<template>
  <div :style="{
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
  }" class="overflow-hidden">
    <ContentLoader :primaryColor="isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'"
                   :secondaryColor="isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'"/>
  </div>
</template>
<script setup>
import {ContentLoader} from "vue-content-loader";
import {useThemeStore} from "@/stores/themeStore";
import {computed} from "vue";
defineProps({
  width: {
    type: [Number, String],
    default: 0
  },
  height: {
    type: [Number, String],
    default: 0
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)
</script>
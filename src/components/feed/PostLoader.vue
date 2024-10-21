<template>
  <ContentLoader :primaryColor="isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'"
                 :height="height"
                 :width="width"
                 :secondaryColor="isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'"/>
</template>
<script setup>
import {ContentLoader} from "vue-content-loader";
import {useThemeStore} from "@/stores/themeStore";
import {computed} from "vue";
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '500'
  }
})
</script>
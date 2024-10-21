<template>
  <ListLoader :primaryColor="isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'"
              :width="width"
              :secondaryColor="isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'"/>
</template>
<script setup>
import {ListLoader} from "vue-content-loader";
import {useThemeStore} from "@/stores/themeStore";
import {computed} from "vue";

defineProps({
  width: {
    type: String,
    default: '250'
  }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)
</script>
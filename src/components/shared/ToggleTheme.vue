<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex gap-2 items-center">
      <IconSleepMode/>
      <span>Chế độ tối</span>
    </div>
    <a-switch v-model:checked="checked"
              @change="handleThemeChange" />
  </div>
</template>

<script setup>
import IconSleepMode from '@/components/shared/icons/IconSleepMode.vue';
import {useTheme} from "@/hooks/useTheme";
import {computed, onMounted, ref, watch} from "vue";
import {useThemeStore} from "@/stores/themeStore";

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDarkStore)

const checked = ref(false)
watch(isDark, () => {
  checked.value = isDark.value
}, { immediate: true })
const { toggleTheme, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

const handleThemeChange = () => {
  toggleTheme()
}
</script>

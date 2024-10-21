<template>
  <div :style="{
    minWidth: `${generateSize}px`
  }">
    <a-avatar
        :src="src || '/default-avatar.png'"
        :size="generateSize"
        class="cursor-pointer bg-neutral-200 border"
    />
  </div>
</template>

<script setup>
import {computed, toRefs} from "vue";

const props = defineProps({
  size: {
    type: Number,
    default: 36
  },
  sizeMobile: {
    type: Number,
    default: 0
  },
  src: {
    type: String,
    default: '/default-avatar.png'
  }
})
const { size, sizeMobile } = toRefs(props)

const generateSize = computed(() => {
  if (window.innerWidth < 768 && sizeMobile.value) {
    return sizeMobile.value
  }
  return size.value
})
</script>
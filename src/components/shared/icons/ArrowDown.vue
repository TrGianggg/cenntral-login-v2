<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size"
       :height="size"
       viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M12 19L18 13M12 19L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: Number,
    default: 24
  }
})
</script>
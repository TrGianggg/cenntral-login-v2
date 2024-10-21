<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 20 21" fill="none">
    <circle cx="10" cy="8" r="2.5" stroke="currentColor" stroke-width="1.1"/>
    <circle cx="10.0001" cy="10.4993" r="8.33333" stroke="currentColor" stroke-width="1.1"/>
    <path d="M14.9743 17.1667C14.8417 14.7571 14.1039 13 9.99996 13C5.89601 13 5.15826 14.7571 5.02563 17.1667" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
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
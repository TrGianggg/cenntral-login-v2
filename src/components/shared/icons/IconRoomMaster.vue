<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M19 17.5C19 19.9853 19 22 11 22C3 22 3 19.9853 3 17.5C3 15.0147 6.58172 13 11 13C15.4183 13 19 15.0147 19 17.5Z" stroke="currentColor" stroke-width="1.5"/>
    <path d="M17 10.3C17.5207 10.7686 17.8126 11.0314 18.3333 11.5L21 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
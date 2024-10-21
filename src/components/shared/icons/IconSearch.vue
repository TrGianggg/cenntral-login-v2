<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 16 16" fill="none">
    <g clip-path="url(#clip0_3098_12556)">
      <circle cx="7.66665" cy="7.66732" r="6.33333" stroke="currentColor" stroke-width="1.5"/>
      <path d="M12.3333 12.334L14.6666 14.6673" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <defs>
      <clipPath id="clip0_3098_12556">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
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
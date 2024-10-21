<template>
  <p
    class="!text-start"
    v-html="content"
  ></p>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})
</script>

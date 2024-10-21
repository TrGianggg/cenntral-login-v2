<template>
  <div class="layout-massage-page">
    <Sidebar></Sidebar>
  </div>
</template>
<script setup>
import { defineComponent } from 'vue'
import Sidebar from '@/layout/component/Sidebar.vue'

defineComponent({
  name: 'LayoutMessage'
})
</script>

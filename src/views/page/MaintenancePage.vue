<template>
  <div>
    Bảo trì
  </div>
</template>

<script setup>
import router from "@/router";

const VITE_BASE_IS_MAINTENANCE = import.meta.env.VITE_BASE_IS_MAINTENANCE;
if (VITE_BASE_IS_MAINTENANCE !== '1') {
  router.push({ name: 'feed' })
}
</script>
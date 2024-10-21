<template></template>
<script setup>
import { computed, onMounted } from 'vue'
import router from '@/router'
const currentRoute = computed(() => {
  return router.currentRoute.value.name
})
onMounted(() => {})
const redirectFn = (url) => {
  window.location.href = `${import.meta.env.VITE_BASE_SOCIAL_URL}${url}`
}

if (currentRoute.value === 'discover') {
  window.location.href = `${import.meta.env.VITE_BASE_SOCIAL_URL}`
} else if (currentRoute.value === 'search') {
  redirectFn('search/seach')
} else if (currentRoute.value === 'people') {
  redirectFn('people')
} else if (currentRoute.value === 'group') {
  redirectFn('spaces')
} else if (currentRoute.value === 'work') {
  redirectFn('tasks/global')
} else if (currentRoute.value === 'products-docs') {
  redirectFn('spaces')
} else if (currentRoute.value === 'message') {
  redirectFn('mail/mail/index')
}
</script>
<style lang="scss">
@import '@/design/variable.scss';
.container {
  width: 168px;
  text-align: center;
}

.progress2 {
  padding: 2px;
  border-radius: 30px;
  background: #6c6a64;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px rgba(255, 255, 255, 0.08);
}
.progress-bar2 {
  height: 8px;
  border-radius: 30px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05));
  transition: 0.4s linear;
  transition-property: width, background-color;
}

.progress-moved .progress-bar2 {
  width: 85%;
  background-color: #f6c451;
  animation: progressAnimation 4s;
}
.image-coming-soon {
  right: 0;
  width: 0;
  animation: textAnimation 2s;
}

@keyframes textAnimation {
  0% {
    width: 100%;
  }
  100% {
    width: 0;
  }
}

@keyframes progressAnimation {
  0% {
    width: 0;
    background-color: $gold-150;
  }
  100% {
    width: 85%;
    background-color: #f6c451;
  }
}
</style>

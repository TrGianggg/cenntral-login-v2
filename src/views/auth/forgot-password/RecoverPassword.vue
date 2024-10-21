<template>
  <div class="page-recover w-full flex">
    <div class="w-full max-w-[400px] mx-auto mt-20">
      <h1 class="text-heading-2 text-gradient">{{ $t('recover.title') }}</h1>
      <transition name="slide-fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script setup>
</script>
